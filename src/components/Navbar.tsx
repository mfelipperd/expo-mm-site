"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

interface NavbarProps {
  onVisitClick: () => void;
  onExposeClick: () => void;
  onContactClick: () => void;
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar({ onVisitClick, onExposeClick, onContactClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Para Lojistas", href: "/#sobre" },
    { name: "Quero Expor", href: "/quero-expor" },
    { name: "Contato", href: "#", onClick: onContactClick },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-6 py-4",
        isScrolled ? "glass-dark py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="relative h-12 w-40">
          <Image
            src="/assets/logo EMM_Prancheta 1.png"
            alt="Expo MultiMix Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            link.onClick ? (
              <button
                key={link.name}
                onClick={link.onClick}
                className="text-sm font-medium hover:text-brand-cyan transition-colors"
              >
                {link.name}
              </button>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium hover:text-brand-cyan transition-colors"
              >
                {link.name}
              </Link>
            )
          ))}
          <button
            onClick={onVisitClick}
            className="text-white px-6 py-2 rounded-full text-sm font-bold border border-white/20 hover:bg-white/10 transition-all transform hover:scale-105"
          >
            QUERO VISITAR
          </button>
          <button
            onClick={onExposeClick}
            className="bg-brand-orange hover:bg-opacity-90 text-white px-6 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            RESERVE SEU STAND
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-brand-blue border-t border-white/10 p-6 flex flex-col space-y-6 animate-in slide-in-from-top duration-300 shadow-2xl">
          {navLinks.map((link) => (
            link.onClick ? (
              <button
                key={link.name}
                onClick={() => { link.onClick!(); setIsMobileMenuOpen(false); }}
                className="text-lg font-medium text-left"
              >
                {link.name}
              </button>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            )
          ))}
          <button
            onClick={onVisitClick}
            className="border border-white/20 text-white px-6 py-3 rounded-full text-center font-bold"
          >
            QUERO VISITAR
          </button>
          <button
            onClick={onExposeClick}
            className="bg-brand-orange text-white px-6 py-3 rounded-full text-center font-bold"
          >
            RESERVE SEU STAND
          </button>
        </div>
      )}
    </nav>
  );
}
