"use client";

import { Phone, ExternalLink } from "lucide-react";

export default function WhatsAppModalContent() {
  const contacts = [
    {
      name: "Ana Paula",
      role: "Comercial",
      phone: "(91) 98130-6900",
      link: "https://wa.me/5591981306900?text=Olá,%20tenho%20interesse%20em%20ser%20um%20expositor%20na%20Expo%20MultiMix.",
    },
    {
      name: "Marcos Felippe",
      role: "Desenvolvimento",
      phone: "(91) 99119-5755",
      link: "https://wa.me/5591991195755?text=Olá,%20tenho%20interesse%20em%20ser%20um%20expositor%20na%20Expo%20MultiMix.",
    },
    {
      name: "Ana Raquel",
      role: "Design & Social Media",
      phone: "(91) 98283-6424",
      link: "https://wa.me/5591982836424?text=Olá,%20tenho%20interesse%20em%20ser%20um%20expositor%20na%20Expo%20MultiMix.",
    },
    {
      name: "Gabriel",
      role: "Comercial",
      phone: "(91) 98267-3273",
      link: "https://wa.me/5591982673273?text=Olá,%20tenho%20interesse%20em%20ser%20um%20expositor%20na%20Expo%20MultiMix.",
    },
  ];

  return (
    <div className="space-y-3 pb-4">
      <p className="text-gray-400 mb-6 text-sm">
        Fale diretamente com nossa equipe comercial via WhatsApp para garantir seu stand.
      </p>

      {contacts.map((contact) => (
        <a
          key={contact.phone}
          href={contact.link}
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
