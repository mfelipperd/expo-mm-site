"use client";

import { useState } from "react";
import { X, CheckCircle, Loader2, AlertCircle, Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
  // CNPJ mandatory validation for Lojista
  if (data.ingresso === "lojista") {
    if (!data.cnpj || data.cnpj.length < 18) {
       ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CNPJ é obrigatório para Lojistas",
        path: ["cnpj"],
      });
    }
  }
});

export type CredenciamentoFormData = z.infer<typeof credenciamentoSchema>;

export default function RegistrationFormModal({ cityName, fairId, industries = [], onClose }: RegistrationFormModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitSuccessCount, setSubmitSuccessCount] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
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
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone,
        zipCode: data.zipCode.replace(/\D/g, ""),
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        sectors: data.sectors,
        howDidYouKnow: data.howDidYouKnow,
        category: "Visitante",
        fair_visitor: fairId,
        // Only include CNPJ if lojista
        cnpj: data.ingresso === 'lojista' && data.cnpj ? data.cnpj.replace(/\D/g, "") : undefined
    };

    const peopleToRegister = [
        { ...basePayload }, // Main user
        ...(data.guests?.map(g => ({ ...basePayload, name: g.name })) || []) // Guests
    ];

    try {
        // Sequential submission to avoid rate limits or race conditions, and track progress
        let successCount = 0;
        for (const person of peopleToRegister) {
            const response = await fetch("https://credenciamento-api-production.up.railway.app/visitors", {
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

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
             <div>
                <p className="text-brand-cyan font-bold tracking-widest text-xs uppercase mb-1">
                {cityName} 2025
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
            <div 
                className="h-full bg-brand-cyan transition-all duration-300 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative overflow-hidden min-h-[400px] p-1">
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

                 {visitorType === "lojista" && (
                    <div className="bg-brand-cyan/10 border border-brand-cyan/20 p-3 rounded-lg text-center mt-4">
                         <p className="text-[10px] text-brand-cyan font-bold uppercase tracking-wider">
                            * CNPJ Obrigatório para Lojistas
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
                    
                    {visitorType === 'lojista' && (
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">CNPJ</label>
                            <input {...register("cnpj")} onChange={handleCnpjChange} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-cyan transition-colors" placeholder="00.000.000/0000-00" />
                            {errors.cnpj && <span className="text-red-400 text-xs">{errors.cnpj.message}</span>}
                        </div>
                    )}
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
                                className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                     ))}
                </div>
            </motion.div>
        )}
        </AnimatePresence>

        {submitError && (
             <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-lg text-sm flex items-center gap-2 animate-fade-in">
                 <AlertCircle size={16} />
                 {submitError}
             </div>
        )}

        {/* FOOTER ACTIONS */}
        <div className="pt-4 flex gap-3">
             {currentStep > 1 && (
                <button
                    type="button"
                    onClick={prevStep}
                    disabled={isSubmitting}
                    className="flex-1 bg-white/5 text-gray-400 font-bold py-4 rounded-xl hover:bg-white/10 transition-all border border-white/10"
                >
                    VOLTAR
                </button>
             )}

             {currentStep < totalSteps ? (
                <button
                    type="button"
                    onClick={nextStep}
                    className="flex-[2] bg-brand-cyan text-brand-blue font-bold py-4 rounded-xl hover:bg-brand-cyan/90 transition-all shadow-lg shadow-brand-cyan/20"
                >
                    PRÓXIMO
                </button>
             ) : (
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] bg-linear-to-r from-brand-pink to-brand-orange text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-orange/20"
                >
                    {isSubmitting ? (
                    <>
                        <Loader2 className="animate-spin" /> Processando...
                    </>
                    ) : (
                    `FINALIZAR CADASTRO`
                    )}
                </button>
             )}
        </div>
      </form>
    </div>
  );
}


