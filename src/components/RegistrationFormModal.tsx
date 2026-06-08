"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, Loader2, AlertCircle, Plus, Trash2, MapPin, ArrowRight } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGeoLocation } from "@/hooks/useGeoLocation";

interface RegistrationFormModalProps {
  cityName: string;
  fairId: string;
  industries?: string[];
  onClose: () => void;
}

// Schema definition
export const credenciamentoSchema = z.object({
  ingresso: z.enum(["lojista", "representante-comercial"]),
  name: z.string().min(1, "Nome é obrigatório"),
  company: z.string().min(1, "Empresa é obrigatória"),
  email: z.string().email("Email inválido"),
  cnpj: z.string().optional().or(z.literal("")),
  phone: z.string().min(1, "Telefone é obrigatório").min(14, "Telefone incompleto"),
  
  // Endereço Completo
  zipCode: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
  state: z.string().min(2, "Estado é obrigatório"), // UF
  city: z.string().min(1, "Cidade é obrigatória"),
  street: z.string().min(1, "Rua/Av é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  complement: z.string().optional(),

  howDidYouKnow: z.string().min(1, "Selecione uma opção"),
  sectors: z.array(z.string()).optional(),
  
  // Guests
  guests: z.array(z.object({
    name: z.string().min(1, "Nome do convidado é obrigatório")
  })).optional()
}).superRefine((data, ctx) => {
  // CNPJ mandatory validation
  if (!data.cnpj || data.cnpj.length < 18) {
     ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "CNPJ é obrigatório",
      path: ["cnpj"],
    });
  }
});

export type CredenciamentoFormData = z.infer<typeof credenciamentoSchema>;

export default function RegistrationFormModal({ cityName, fairId, industries = [], onClose }: RegistrationFormModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitSuccessCount, setSubmitSuccessCount] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [locationWarningConfirmed, setLocationWarningConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Normalization helper to handle accents (Belém vs belem)
  const normalizeCity = (city: string) => 
    city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Calculate Location Warning Logic
  const { city: detectedCity } = useGeoLocation();
  const currentFormCity = normalizeCity(cityName);
  const isLocationMismatch = !!(detectedCity && normalizeCity(detectedCity) !== currentFormCity);
  
  // 1 = Visitor Type, 2 = Personal, 3 = Address, 4 = Details/Guests
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<CredenciamentoFormData>({
    resolver: zodResolver(credenciamentoSchema),
    defaultValues: {
        sectors: [],
        cnpj: "", 
        guests: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "guests"
  });

  const visitorType = watch("ingresso");

  // Navigation Logic
  const nextStep = async () => {
    let isValid = false;

    if (currentStep === 1) {
       isValid = await trigger("ingresso");
    } 
    else if (currentStep === 2) {
       isValid = await trigger(["name", "company", "email", "phone", "cnpj"]);
    }
    else if (currentStep === 3) {
       isValid = await trigger(["zipCode", "street", "number", "neighborhood", "city", "state"]);
    }

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (data: CredenciamentoFormData) => {
    setSubmitError(null);
    setSubmitSuccessCount(0);
    
    // Prepare base payload
    const basePayload = {
        name: data.name.toLowerCase(),
        company: data.company.toLowerCase(),
        email: data.email.toLowerCase(),
        phone: data.phone.replace(/\D/g, ""),
        zipCode: data.zipCode.replace(/\D/g, ""),
        street: data.street.toLowerCase(),
        number: data.number.toLowerCase(),
        complement: data.complement?.toLowerCase(),
        neighborhood: data.neighborhood.toLowerCase(),
        city: data.city.toLowerCase(),
        state: data.state.toLowerCase(),
        sectors: data.sectors?.map(s => s.toLowerCase()),
        howDidYouKnow: data.howDidYouKnow.toLowerCase(),
        category: "visitante",
        fair_visitor: fairId,
        // Backend currently requires a 14-character CNPJ for all categories
        cnpj: data.cnpj ? data.cnpj.replace(/\D/g, "") : "00000000000000"
    };

    const peopleToRegister = [
        { ...basePayload }, // Main user
        ...(data.guests?.map(g => ({ ...basePayload, name: g.name.toLowerCase() })) || []) // Guests
    ];

    try {
        // Sequential submission to avoid rate limits or race conditions, and track progress
        let successCount = 0;
        for (const person of peopleToRegister) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/visitors`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(person),
            });
            
            if (!response.ok) {
                console.error("Failed to register", person.name);
                throw new Error(`Erro ao cadastrar ${person.name}`);
            }
            successCount++;
        }
        
        setSubmitSuccessCount(successCount);
        setIsSuccess(true);

    } catch (error) {
      console.error("Erro no credenciamento:", error);
      setSubmitError("Ocorreu um erro ao processar o credenciamento. Verifique os dados e tente novamente.");
    }
  };

  const [isLoadingCep, setIsLoadingCep] = useState(false);

  // Masks and Address Lookup
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    
    // (11) 99999-9999
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    
    setValue("phone", value);
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 14) value = value.slice(0, 14);

      value = value.replace(/^(\d{2})(\d)/, "$1.$2");
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
      value = value.replace(/(\d{4})(\d)/, "$1-$2");

      setValue("cnpj", value);
  }

  const handleZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 8) value = value.slice(0, 8);
      if (value.length > 5) value = `${value.slice(0, 5)}-${value.slice(5)}`;
      setValue("zipCode", value);

      if (value.length === 9) {
          setIsLoadingCep(true);
          try {
              const res = await fetch(`https://viacep.com.br/ws/${value.replace("-", "")}/json/`);
              const data = await res.json();
              if (!data.erro) {
                  setValue("street", data.logradouro);
                  setValue("neighborhood", data.bairro);
                  setValue("city", data.localidade);
                  setValue("state", data.uf);
                  
                  // Trigger validation to clear errors if any
                  trigger(["street", "neighborhood", "city", "state"]);
              }
          } catch (err) {
              console.error("Error fetching CEP", err);
          } finally {
             setIsLoadingCep(false);
          }
      }
  }


  if (isSuccess) {
    return (
      <div className="text-center py-12 px-6">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">Credenciamento Realizado!</h3>
        <p className="text-gray-400 mb-8">
          Sua pré-inscrição para a <strong>Expo MultiMix {cityName}</strong> foi recebida com sucesso.
          <br/>Cadastramos <strong>{submitSuccessCount}</strong> visitante(s).
          <br/>Em breve entraremos em contato com mais informações.
        </p>
        <button
          onClick={onClose}
          className="bg-brand-cyan text-white px-8 py-3 rounded-full font-bold hover:bg-brand-cyan/90 transition-all"
        >
          FECHAR
        </button>
      </div>
    );
  }

  // Preparação do link dinâmico do WhatsApp para fallback em caso de erros
  const nameVal = watch("name") || "";
  const companyVal = watch("company") || "";
  const cityText = cityName ? ` para a feira de ${cityName}` : "";
  
  // Constrói uma mensagem contextualizada com os dados preenchidos pelo usuário para facilitar o atendimento
  const waMessage = `Olá! Tentei realizar meu credenciamento${cityText} pelo site da Expo MultiMix, mas ocorreu um erro ao processar o envio.${nameVal ? ` Meu nome é ${nameVal}` : ""}${companyVal ? ` e a minha empresa é a ${companyVal}` : ""}. Gostaria de ajuda para finalizar a minha inscrição!`;
  const waLink = `https://wa.me/5591981306900?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
             <div>
                <p className="text-brand-cyan font-bold tracking-widest text-xs uppercase mb-1">
                {cityName} 2026
                </p>
                <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
                GARANTA SUA VAGA
                </h3>
             </div>
             {/* Simple Step Indicator */}
             <div className="bg-white/5 rounded-full px-3 py-1 text-xs font-mono text-gray-400 border border-white/10">
                {currentStep} / {totalSteps}
             </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-6">
            <motion.div 
                className="h-full bg-brand-cyan"
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            />
        </div>
      </div>

      <form 
        onSubmit={handleSubmit(onSubmit)} 
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
            e.preventDefault();
            if (currentStep < 4) {
              nextStep();
            } else if (termsAccepted && !(isLocationMismatch && !locationWarningConfirmed)) {
              handleSubmit(onSubmit)();
            }
          }
        }}
        className="space-y-6 relative overflow-hidden min-h-[400px] p-1"
      >
        <AnimatePresence mode="wait">
        
        {/* STEP 1: VISITOR TYPE */}
        {currentStep === 1 && (
            <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
            >
                 <p className="text-gray-300 text-sm mb-4">Para começar, qual o seu perfil de visitante?</p>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setValue("ingresso", "lojista")}
                        className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all ${
                            visitorType === "lojista" 
                            ? "bg-brand-cyan text-brand-blue border-brand-cyan font-bold shadow-[0_0_20px_rgba(0,255,255,0.2)]" 
                            : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                        }`}
                    >
                        <div className={`w-3 h-3 rounded-full border-2 ${visitorType === "lojista" ? "border-brand-blue bg-brand-blue" : "border-gray-500"}`} />
                        <span>Sou Lojista</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setValue("ingresso", "representante-comercial")}
                        className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all ${
                            visitorType === "representante-comercial" 
                            ? "bg-brand-cyan text-brand-blue border-brand-cyan font-bold shadow-[0_0_20px_rgba(0,255,255,0.2)]" 
                            : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                        }`}
                    >
                         <div className={`w-3 h-3 rounded-full border-2 ${visitorType === "representante-comercial" ? "border-brand-blue bg-brand-blue" : "border-gray-500"}`} />
                        <span className="text-center">Representante Comercial</span>
                    </button>
                </div>
                
                <input type="hidden" {...register("ingresso")} />
                {errors.ingresso && <span className="text-red-400 text-xs block text-center mt-2 animate-pulse">{errors.ingresso.message}</span>}

                 {visitorType && (
                    <div className="bg-brand-cyan/10 border border-brand-cyan/20 p-3 rounded-lg text-center mt-4">
                         <p className="text-[10px] text-brand-cyan font-bold uppercase tracking-wider">
                            * CNPJ Obrigatório para credenciamento
                         </p>
                    </div>
                 )}
            </motion.div>
        )}

        {/* STEP 2: PERSONAL INFO */}
        {currentStep === 2 && (
            <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
            >
                 <h4 className="text-lg font-bold text-white mb-4">Seus Dados</h4>
                 
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Nome Completo</label>
                    <input {...register("name")} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-cyan transition-colors" placeholder="Nome completo" autoFocus />
                    {errors.name && <span className="text-red-400 text-xs">{errors.name.message}</span>}
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Empresa / Loja</label>
                    <input {...register("company")} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-cyan transition-colors" placeholder="Nome da empresa" />
                    {errors.company && <span className="text-red-400 text-xs">{errors.company.message}</span>}
                </div>

                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Email Corporativo</label>
                    <input {...register("email")} type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-cyan transition-colors" placeholder="seu@email.com" />
                    {errors.email && <span className="text-red-400 text-xs">{errors.email.message}</span>}
                 </div>

                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">WhatsApp</label>
                        <input {...register("phone")} onChange={handlePhoneChange} type="tel" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-cyan transition-colors" placeholder="(00) 00000-0000" />
                        {errors.phone && <span className="text-red-400 text-xs">{errors.phone.message}</span>}
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">CNPJ</label>
                        <input {...register("cnpj")} onChange={handleCnpjChange} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-cyan transition-colors" placeholder="00.000.000/0000-00" />
                        {errors.cnpj && <span className="text-red-400 text-xs">{errors.cnpj.message}</span>}
                    </div>
                 </div>
            </motion.div>
        )}

        {/* STEP 3: ADDRESS */}
        {currentStep === 3 && (
            <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
            >
                <h4 className="text-lg font-bold text-white mb-4">Endereço da Empresa</h4>

                 <div className="grid grid-cols-[120px_1fr] gap-4">
                     <div className="space-y-1 relative">
                        <label className="text-xs font-bold text-gray-500 uppercase">CEP</label>
                        <div className="relative">
                            <input 
                                {...register("zipCode")} 
                                onChange={handleZipChange} 
                                type="text" 
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-cyan transition-colors" 
                                placeholder="00000-000" 
                                autoFocus 
                            />
                            {isLoadingCep && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-cyan">
                                    <Loader2 className="animate-spin w-4 h-4" />
                                </div>
                            )}
                        </div>
                        {errors.zipCode && <span className="text-red-400 text-xs">{errors.zipCode.message}</span>}
                     </div>
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Rua</label>
                        <input {...register("street")} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-cyan transition-colors" />
                        {errors.street && <span className="text-red-400 text-xs">{errors.street.message}</span>}
                     </div>
                </div>

                <div className="grid grid-cols-[100px_1fr] gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Número</label>
                        <input {...register("number")} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-cyan transition-colors" />
                        {errors.number && <span className="text-red-400 text-xs">{errors.number.message}</span>}
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Bairro</label>
                        <input {...register("neighborhood")} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-cyan transition-colors" />
                        {errors.neighborhood && <span className="text-red-400 text-xs">{errors.neighborhood.message}</span>}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Complemento</label>
                        <input {...register("complement")} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-cyan transition-colors" />
                    </div>
                     <div className="grid grid-cols-[1fr_80px] gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Cidade</label>
                            <input {...register("city")} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-cyan transition-colors" />
                            {errors.city && <span className="text-red-400 text-xs">{errors.city.message}</span>}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">UF</label>
                            <input {...register("state")} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-cyan transition-colors" maxLength={2} />
                            {errors.state && <span className="text-red-400 text-xs">{errors.state.message}</span>}
                        </div>
                     </div>
                </div>
            </motion.div>
        )}

        {/* STEP 4: INTERESTS & GUESTS */}
        {currentStep === 4 && (
            <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
            >
                 
                 {/* Interests */}
                 <div className="space-y-2">
                    <h4 className="text-lg font-bold text-white">Seus Interesses</h4>
                    <label className="text-xs font-bold text-gray-500 uppercase">Quais setores você tem interesse?</label>
                    <div className="grid grid-cols-2 gap-2 mt-2 bg-white/5 p-4 rounded-xl border border-white/10">
                        {industries.map((industry) => (
                            <label key={industry} className="flex items-center gap-2 cursor-pointer text-sm text-gray-300 hover:text-white">
                                <input 
                                    type="checkbox" 
                                    value={industry} 
                                    {...register("sectors")} 
                                    className="w-4 h-4 rounded-sm border-white/30 bg-transparent text-brand-cyan focus:ring-brand-cyan"
                                />
                                {industry}
                            </label>
                        ))}
                    </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Como nos conheceu?</label>
                    <select
                      {...register("howDidYouKnow")}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-cyan transition-colors [&>option]:bg-gray-900"
                    >
                        <option value="">Selecione...</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Google">Google</option>
                        <option value="Indicação">Indicação</option>
                        <option value="Email Marketing">Email Marketing</option>
                        <option value="Outros">Outros</option>
                    </select>
                    {errors.howDidYouKnow && <span className="text-red-400 text-xs">{errors.howDidYouKnow.message}</span>}
                 </div>

                 {/* Guests */}
                 <div className="space-y-4 pt-4 border-t border-white/10">
                     <div className="flex items-center justify-between">
                         <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Convidados Adicionais</h4>
                            <p className="text-[10px] text-gray-500">Colegas de trabalho que virão com você</p>
                         </div>
                         <button 
                            type="button" 
                            onClick={() => append({ name: "" })}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 text-brand-cyan text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2 transition-all"
                         >
                            <Plus size={14} /> ADICIONAR
                         </button>
                     </div>
                     
                     {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2 items-center animate-fade-in">
                            <input
                                {...register(`guests.${index}.name` as const)}
                                type="text"
                                placeholder={`Nome do Convidado ${index + 1}`}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-cyan transition-colors"
                            />
                            <button 
                                type="button" 
                                onClick={() => remove(index)}
                                title="Remover convidado"
                                aria-label="Remover convidado"
                                className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                     ))}
                </div>

                 {/* LGPD Terms */}
                 <div className="pt-6 border-t border-white/10">
                     <div className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
                         termsAccepted 
                         ? "bg-brand-cyan/5 border-brand-cyan/30" 
                         : "bg-white/5 border-white/10 hover:bg-white/10"
                     }`}>
                         <input 
                             type="checkbox" 
                             id="terms-accept"
                             checked={termsAccepted}
                             onChange={(e) => setTermsAccepted(e.target.checked)}
                             className="mt-0.5 w-4 h-4 rounded border-white/30 bg-transparent text-brand-cyan focus:ring-brand-cyan cursor-pointer transition-all"
                         />
                          <label htmlFor="terms-accept" className="text-xs text-gray-400 cursor-pointer select-none leading-relaxed">
                              Li e concordo com os{" "}
                              <button 
                                type="button" 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsTermsModalOpen(true); }} 
                                className="text-white font-semibold underline hover:text-brand-cyan transition-colors inline"
                              >
                                Termos de Uso
                              </button>{" "}
                              e com a{" "}
                              <button 
                                type="button" 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsTermsModalOpen(true); }} 
                                className="text-white font-semibold underline hover:text-brand-cyan transition-colors inline"
                              >
                                Política de Privacidade
                              </button>, autorizando a <span className="text-white font-semibold">Expo MultiMix</span> ao tratamento dos dados acima conforme a LGPD.
                          </label>
                     </div>
                 </div>
            </motion.div>
        )}
        </AnimatePresence>

        {submitError && (
             <div className="space-y-3 animate-fade-in">
                 {/* Alerta Técnico */}
                 <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl text-xs md:text-sm flex items-start gap-3">
                     <AlertCircle className="shrink-0 mt-0.5 text-red-400" size={18} />
                     <div>
                         <p className="font-bold text-white mb-1">Oops! Encontramos um problema.</p>
                         <p className="text-gray-300 leading-relaxed">
                             {submitError} Não se preocupe, seus dados não serão perdidos. 
                             Você pode finalizar a inscrição diretamente com nossa equipe através do WhatsApp abaixo.
                         </p>
                     </div>
                 </div>
                 
                 {/* Botão Redirecionador para WhatsApp */}
                 <a 
                     href={waLink}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-sm md:text-base rounded-xl transition-all shadow-[0_4px_15px_rgba(37,211,102,0.2)] hover:shadow-[0_4px_25px_rgba(37,211,102,0.3)] active:scale-[0.99]"
                 >
                     <svg 
                       viewBox="0 0 24 24" 
                       width="22" 
                       height="22" 
                       fill="currentColor"
                       className="shrink-0"
                     >
                       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
                     </svg>
                     FINALIZAR PELO WHATSAPP
                 </a>
             </div>
        )}

        {/* Geo Location Warning */}
        {/* Geo Location Warning */}
        {isLocationMismatch && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-200 p-3 rounded-lg text-xs animate-fade-in mt-2">
                <div className="flex items-start gap-3">
                    <MapPin className="shrink-0 mt-0.5" size={16} />
                    <div>
                        <p className="font-bold uppercase mb-1">Atenção à Localidade</p>
                        <p>
                            Identificamos que você está em <strong className="text-white capitalize">{detectedCity}</strong>, 
                            mas está se credenciando para a feira de <strong className="text-white uppercase">{cityName}</strong>.
                        </p>
                    </div>
                </div>
                
                {/* Confirmation Checkbox */}
                <div className="mt-3 pl-7 flex items-center gap-2">
                    <input 
                        type="checkbox" 
                        id="location-confirm"
                        checked={locationWarningConfirmed} 
                        onChange={(e) => setLocationWarningConfirmed(e.target.checked)}
                        className="w-4 h-4 rounded border-amber-500/50 bg-amber-900/20 text-brand-orange focus:ring-amber-500/50 cursor-pointer"
                    />
                    <label htmlFor="location-confirm" className="text-amber-100/70 hover:text-amber-100 cursor-pointer select-none">
                        Estou ciente e quero continuar a inscrição para <span className="font-bold uppercase">{cityName}</span>
                    </label>
                </div>
            </div>
        )}

        {/* FOOTER ACTIONS */}
        <div className="pt-4 flex gap-3">
             {currentStep > 1 && (
               <button
                 type="button"
                 onClick={prevStep}
                 className="px-6 py-3 rounded-lg border border-white/10 text-gray-400 hover:bg-white/5 font-bold transition-all"
               >
                 VOLTAR
               </button>
             )}

             {currentStep < 4 ? (
               <button
                 type="button"
                 onClick={nextStep}
                 disabled={isLocationMismatch && !locationWarningConfirmed}
                 className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all 
                    ${isLocationMismatch && !locationWarningConfirmed 
                        ? "bg-gray-600 cursor-not-allowed opacity-50" 
                        : "bg-brand-pink hover:bg-brand-pink/90 text-white shadow-lg hover:shadow-brand-pink/20"
                    }`}
               >
                 CONTINUAR <ArrowRight size={18} />
               </button>
             ) : (
                <button
                 type="submit"
                 disabled={isSubmitting || !termsAccepted || (isLocationMismatch && !locationWarningConfirmed)}
                 className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all
                   ${isSubmitting || !termsAccepted || (isLocationMismatch && !locationWarningConfirmed)
                     ? "bg-brand-cyan/30 cursor-not-allowed text-white/30 opacity-70" 
                     : "bg-brand-cyan hover:bg-brand-cyan/90 text-brand-blue shadow-lg hover:shadow-brand-cyan/20"
                   }`}
               >
                 {isSubmitting ? (
                   <>
                     <Loader2 className="animate-spin" /> ENVIANDO...
                   </>
                 ) : (
                   <>
                     FINALIZAR INSCRIÇÃO <CheckCircle size={18} />
                   </>
                 )}
               </button>
             )}
        </div>
      </form>


      {/* Submodal de Termos / Privacidade renderizado no Body via Portal */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isTermsModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-300 flex items-center justify-center p-4 md:p-8 bg-brand-blue/95 backdrop-blur-md"
              onClick={() => setIsTermsModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md max-h-[80vh] glass-dark border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                  <h4 className="text-lg font-bold text-white uppercase tracking-wider">Termos e Privacidade</h4>
                  <button
                    type="button"
                    onClick={() => setIsTermsModalOpen(false)}
                    title="Fechar termos"
                    aria-label="Fechar termos"
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5 text-[13px] text-gray-300 leading-relaxed custom-scrollbar">
                  <div>
                    <h5 className="font-extrabold text-white uppercase text-xs tracking-wider mb-2">1. DO OBJETO E ACEITE DOS TERMOS</h5>
                    <p>
                      Estes Termos e Condições de Uso e Política de Privacidade regulam o processo de credenciamento, acesso e tratamento de dados pessoais para a participação nas feiras corporativas sob a marca <strong>Expo MultiMix</strong>. Ao prosseguir com o credenciamento, o Titular dos dados declara ciência e aceitação plena e inequívoca das disposições contidas neste instrumento.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-extrabold text-white uppercase text-xs tracking-wider mb-2">2. DA BASE LEGAL E FINALIDADE DO TRATAMENTO</h5>
                    <p>
                      O tratamento dos dados pessoais coletados encontra amparo legal na Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD), fundamentando-se no <strong>Consentimento do Titular (Art. 7º, I)</strong>, na <strong>Execução de Contrato ou Procedimentos Preliminares (Art. 7º, V)</strong> para viabilizar o acesso ao certame, e no <strong>Legítimo Interesse (Art. 7º, IX)</strong> da Organização para o desenvolvimento e aprimoramento do evento.
                    </p>
                    <p className="mt-2">
                      Os dados coletados destinam-se a: (i) emissão de credenciais corporativas; (ii) controle estatístico, demográfico e de segurança; (iii) comunicações técnico-operacionais sobre o evento; e (iv) envio de marketing direto e novidades sobre futuras edições.
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="font-extrabold text-brand-cyan uppercase text-xs tracking-wider mb-2">3. DO COMPARTILHAMENTO DE DADOS (CLÁUSULA DE BLINDAGEM B2B)</h5>
                    <p>
                      Considerando que a Expo MultiMix é um ecossistema estritamente corporativo (B2B) focado em fomento mercantil e networking, o Titular confere **autorização expressa, irrevogável e destacada** para que seus dados cadastrais informados (incluindo nome, cargo, empresa, e-mail e telefone) sejam compartilhados diretamente com os <strong>Expositores, Apoiadores Oficiais e Patrocinadores do Evento</strong>.
                    </p>
                    <p className="mt-2 font-medium text-gray-200 bg-white/5 p-3 rounded-lg border border-white/5">
                      <strong>Isenção de Responsabilidade Solidária:</strong> Ao receberem os referidos dados, os parceiros comerciais passam a figurar na condição autônoma de <strong>Controladores Independentes</strong>. A Organização do evento isenta-se de qualquer responsabilidade civil, solidária ou subsidiária, por quaisquer comunicações, abordagens ou tratamentos subsequentes perpetrados individualmente por tais terceiros.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-extrabold text-white uppercase text-xs tracking-wider mb-2">4. DA CESSÃO DE DIREITOS DE IMAGEM E SOM</h5>
                    <p>
                      O Titular declara-se ciente de que o evento é coberto pela imprensa e por equipes de filmagem institucional. Ao ingressar nas dependências da feira, o Titular **cede gratuitamente e em caráter definitivo à Organização** os direitos de uso de sua imagem e voz, capturadas no recinto, para fins de divulgação em mídias sociais, portais da internet, peças publicitárias e televisão, renunciando a qualquer compensação financeira.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-extrabold text-white uppercase text-xs tracking-wider mb-2">5. DA LIMITAÇÃO DE RESPONSABILIDADE POR NEGÓCIOS</h5>
                    <p>
                      A Organização atua tão somente como viabilizadora do espaço físico e promotora do certame, não interferindo e não se responsabilizando por quaisquer negociações comerciais, transações, pagamentos, vícios redibitórios, quebra de expectativas ou inadimplemento contratual decorrentes da relação jurídica formada diretamente entre Visitantes e Expositores.
                    </p>
                  </div>

                  <div>
                    <h5 className="font-extrabold text-white uppercase text-xs tracking-wider mb-2">6. DOS DIREITOS DO TITULAR</h5>
                    <p>
                      Nos termos do Art. 18 da LGPD, é assegurado ao Titular, a qualquer tempo e mediante requisição através dos canais oficiais da Organização, a confirmação do tratamento, correção de dados incompletos ou inexatos, anonimização ou a revogação do consentimento no que tange ao envio de comunicações futuras de marketing.
                    </p>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="p-4 bg-white/5 border-t border-white/10 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsTermsModalOpen(false)}
                    className="px-6 py-2.5 bg-brand-cyan text-brand-blue font-bold rounded-xl hover:bg-brand-cyan/90 transition-all text-sm"
                  >
                    ENTENDI
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}


