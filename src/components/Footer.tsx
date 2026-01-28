"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

interface FooterProps {
  onWhatsAppClick: () => void;
}

export default function Footer({ onWhatsAppClick }: FooterProps) {
  return (
    <footer className="bg-black text-gray-400 py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="relative h-12 w-40 block mb-6 px-1">
            <Image
              src="/assets/logo EMM_Prancheta 1.png"
              alt="Expo MultiMix Logo"
              fill
              className="object-contain"
            />
          </Link>
          <p className="text-sm leading-relaxed max-w-sm">
            A Oficina d'Ideias Comunicação possui vasta experiência em feiras e eventos empresariais, contando com profissionais capacitados.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Mergulhe na EMM</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/#sobre" className="hover:text-brand-cyan transition-colors">Visite Manaus</Link></li>
            <li><Link href="/#sobre" className="hover:text-brand-cyan transition-colors">Visite Belém</Link></li>
            <li><Link href="/quero-expor" className="hover:text-brand-cyan transition-colors">Quero Expor</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Contato</h4>
          <ul className="space-y-4 text-sm">
            <li>
              <button 
                onClick={onWhatsAppClick}
                className="flex items-center gap-3 hover:text-brand-cyan transition-colors text-left w-full group"
              >
                <div className="p-2 bg-white/5 rounded-lg text-brand-cyan group-hover:bg-brand-cyan group-hover:text-white transition-all">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Fale Conosco</p>
                  <p className="font-semibold text-white">Ver contatos WhatsApp</p>
                </div>
              </button>
            </li>
            <li className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-lg text-brand-pink">
                <Mail size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Email</p>
                <p className="font-semibold text-white">expomultimix@gmail.com</p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-lg text-brand-orange">
                <MapPin size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Escritório</p>
                <p className="font-semibold text-white">Belém - PA | Manaus - AM</p>
              </div>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Siga-nos</h4>
          <div className="flex gap-4">
            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-cyan hover:text-white transition-all">
              <Instagram size={20} />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-cyan hover:text-white transition-all">
              <Facebook size={20} />
            </Link>
          </div>
          <p className="mt-8 text-xs text-gray-500">
            *CNPJ é obrigatório para entrada.<br />
            *Proibida a entrada de menores de 14 anos.
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 text-center text-xs text-gray-600">
        <p>© {new Date().getFullYear()} Expo MultiMix. Todos os direitos reservados. Desenvolvido com Antigravity.</p>
      </div>
    </footer>
  );
}
