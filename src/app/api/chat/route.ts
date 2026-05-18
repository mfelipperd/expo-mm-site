import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-flash-latest";

import { SYSTEM_PROMPT } from "./context";

export async function POST(request: Request) {
  const apiKey = GEMINI_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { messages, attendantName, currentCity } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    const systemInstructionText = (attendantName 
      ? `Seu nome é ${attendantName}. ${SYSTEM_PROMPT}`
      : SYSTEM_PROMPT) + (currentCity ? `\nO usuário está navegando na página da feira de ${currentCity.toUpperCase()}.` : "");

    const FAIR_IDS: Record<string, string | undefined> = {
      belem: process.env.NEXT_PUBLIC_FAIR_ID_BELEM,
      manaus: process.env.NEXT_PUBLIC_FAIR_ID_MANAUS,
    };

    const tools = [
      {
        functionDeclarations: [
          {
            name: "register_visitor",
            description: "Realiza o credenciamento (cadastro) de um visitante na feira.",
            parameters: {
              type: "OBJECT",
              properties: {
                name: { type: "STRING", description: "Nome completo" },
                company: { type: "STRING", description: "Empresa" },
                email: { type: "STRING", description: "Email" },
                phone: { type: "STRING", description: "WhatsApp" },
                cnpj: { type: "STRING", description: "CNPJ" },
                zipCode: { type: "STRING", description: "CEP" },
                street: { type: "STRING" },
                number: { type: "STRING" },
                neighborhood: { type: "STRING" },
                city: { type: "STRING" },
                state: { type: "STRING" },
                complement: { type: "STRING", description: "Complemento do endereço" },
                sectors: { type: "ARRAY", items: { type: "STRING" }, description: "Setores de interesse (ex: Brinquedos, Papelaria)" },
                howDidYouKnow: { type: "STRING", description: "Como conheceu a feira" },
                ingresso: { type: "STRING", enum: ["lojista", "representante-comercial"] },
                fairId: { type: "STRING", description: "Opcional, UUID da feira" }
              },
              required: ["name", "company", "email", "phone", "zipCode", "street", "number", "neighborhood", "city", "state", "howDidYouKnow", "ingresso"]
            }
          },
          {
            name: "lookup_zip_code",
            description: "Busca informações de endereço a partir de um CEP (Código de Endereçamento Postal) brasileiro usando a API ViaCEP.",
            parameters: {
              type: "OBJECT",
              properties: {
                zipCode: { type: "STRING", description: "O CEP para busca (ex: 66095460)" }
              },
              required: ["zipCode"]
            }
          }
        ]
      }
    ];

    // Prepare contents for Gemini API
    let processedMessages = [...messages];
    while (processedMessages.length > 0 && processedMessages[0].role === "assistant") {
      processedMessages.shift();
    }

    let contents = processedMessages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    if (contents.length === 0) {
      return NextResponse.json({ content: "Como posso ajudar?" });
    }

    async function callGemini(contentsArray: any[]) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: contentsArray,
            systemInstruction: { parts: [{ text: systemInstructionText }] },
            tools,
            generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
          }),
        }
      );
      return res.json();
    }

    let data = await callGemini(contents);

    // Check for tool calls
    if (data.candidates?.[0]?.content?.parts?.[0]?.functionCall) {
      const functionCall = data.candidates[0].content.parts[0].functionCall;
      
      if (functionCall.name === "register_visitor") {
        const args = functionCall.args;
        
        // Resolve Fair ID: Tool arg > URL Context > Default Belem
        const cityKey = (args.city || currentCity)?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const mappedFairId = args.fairId || (cityKey && FAIR_IDS[cityKey]) || FAIR_IDS.belem || "89d8a3ce-36b0-4fe9-b338-ca46fc5855e3";

        // Prepare payload for FRONTEND to call
        const payload = {
          name: args.name.toLowerCase(),
          company: args.company.toLowerCase(),
          email: args.email.toLowerCase(),
          phone: args.phone.replace(/\D/g, ""),
          zipCode: args.zipCode.replace(/\D/g, ""),
          street: args.street.toLowerCase(),
          number: args.number.toLowerCase(),
          neighborhood: args.neighborhood.toLowerCase(),
          city: args.city.toLowerCase(),
          state: args.state.toLowerCase(),
          complement: (args.complement || "").toLowerCase(),
          sectors: (args.sectors || []).map((s: string) => s.toLowerCase()),
          howDidYouKnow: (args.howDidYouKnow || "chat-ia").toLowerCase(),
          category: "visitante",
          fair_visitor: mappedFairId, 
          cnpj: args.cnpj ? args.cnpj.replace(/\D/g, "") : "00000000000000"
        };

        // Return a special response that includes the payload for the frontend
        // We still let Gemini finish the text response if possible, 
        // but it's easier to just return the payload now for the frontend to handle.
        // Let's finish the conversation turn first.
        
        contents.push(data.candidates[0].content);
        (contents as any).push({
          role: "function",
          parts: [{ functionResponse: { name: "register_visitor", response: { success: "pending_confirmation" } } }]
        });

        // Add specific instruction for the confirmation trigger
        const finalData = await callGemini([...contents, { 
          role: "user", 
          parts: [{ text: "Gere a mensagem final pedindo para o usuário clicar no botão para confirmar o cadastro. Use obrigatoriamente a tag [CONFIRM_REGISTRATION:Confirmar Cadastro] ao final da mensagem." }] 
        }]);
        
        const text = finalData.candidates?.[0]?.content?.parts?.[0]?.text || "Tudo certo! Clique no botão abaixo para revisar e confirmar seu cadastro:\n\n[CONFIRM_REGISTRATION:Confirmar Cadastro]";
        
        return NextResponse.json({ 
          content: text,
          registrationPayload: payload 
        });
      }

      if (functionCall.name === "lookup_zip_code") {
        const { zipCode } = functionCall.args;
        const cleanZip = zipCode.replace(/\D/g, "");
        
        try {
          const res = await fetch(`https://viacep.com.br/ws/${cleanZip}/json/`);
          const zipData = await res.json();
          
          contents.push(data.candidates[0].content);
          (contents as any).push({
            role: "function",
            parts: [{ functionResponse: { name: "lookup_zip_code", response: zipData } }]
          });
          
          const finalData = await callGemini(contents);
          return NextResponse.json({ 
            content: finalData.candidates?.[0]?.content?.parts?.[0]?.text 
          });
        } catch (err) {
          return NextResponse.json({ content: "Não consegui consultar esse CEP agora, mas pode me informar o endereço completo?" });
        }
      }
    }

    if (data.error) {
      console.error("Gemini API Error:", data.error.message);
      return NextResponse.json(
        { error: data.error.message || "Error from Gemini API" },
        { status: 500 }
      );
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, não consegui processar sua mensagem.";

    return NextResponse.json({ content: text });
  } catch (error: any) {
    console.error("Chat API Error:", error.message);
    return NextResponse.json(
      { error: "Ocorreu um erro ao processar sua solicitação." },
      { status: 500 }
    );
  }
}
