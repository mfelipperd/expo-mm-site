"use client";

import { Phone, ExternalLink } from "lucide-react";
import { useGeoLocation } from "@/hooks/useGeoLocation";

export default function WhatsAppModalContent() {
  const { city } = useGeoLocation();

  const getMessage = (role: string) => {
    const cityText = city === 'manaus' ? "em Manaus" : city === 'belem' ? "em Belém" : "";
    const cityContext = cityText ? `estou ${cityText} e` : "";
    
    if (role.includes("Comercial")) {
       if (city) return `Olá, ${cityContext} tenho interesse em saber mais sobre vendas e stands na Expo MultiMix.`;
       return "Olá, tenho interesse em saber mais sobre vendas e stands na Expo MultiMix.";
    }
    
    if (role.includes("Desenvolvimento")) {
        if (city) return `Olá, ${cityContext} gostaria de tratar sobre o site/sistema da Expo MultiMix.`;
        return "Olá, gostaria de tratar sobre assuntos de programação e sistema da Expo MultiMix.";
    }

    if (role.includes("Design")) {
        if (city) return `Olá, ${cityContext} gostaria de falar sobre artes e design da Expo MultiMix.`;
        return "Olá, gostaria de falar sobre design e artes da Expo MultiMix.";
    }

    return "Olá, tenho interesse na Expo MultiMix.";
  };

  const getLink = (phone: string, role: string) => {
      const cleanPhone = phone.replace(/\D/g, "");
      const message = getMessage(role);
      return `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const contacts = [
    {
      name: "Ana Paula",
      role: "Comercial",
      phone: "(91) 98130-6900",
    },
    {
      name: "Marcos Felippe",
      role: "Desenvolvimento",
      phone: "(91) 99119-5755",
    },
    {
      name: "Ana Raquel",
      role: "Design & Social Media",
      phone: "(91) 98283-6424",
    },
    {
      name: "Gabriel",
      role: "Comercial",
      phone: "(91) 98267-3273",
    },
  ];

  return (
    <div className="space-y-3 pb-4">
      <p className="text-gray-400 mb-6 text-sm">
        Fale diretamente com nossa equipe via WhatsApp.
        {city && <span className="block mt-1 text-brand-cyan text-xs">Localização identificada: {city === 'manaus' ? 'Manaus' : 'Belém'}</span>}
      </p>

      {contacts.map((contact) => (
        <a
          key={contact.phone}
          href={getLink(contact.phone, contact.role)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-brand-orange/30 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-brand-orange">
              <Phone size={20} />
            </div>
            <div>
              <h4 className="font-bold text-white">{contact.name}</h4>
              <p className="text-xs text-gray-500 uppercase tracking-tighter">{contact.role}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-mono text-gray-400 group-hover:text-brand-orange transition-colors">
              {contact.phone}
            </p>
            <span className="text-[10px] text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end gap-1">
              CONECTAR <ExternalLink size={10} />
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
