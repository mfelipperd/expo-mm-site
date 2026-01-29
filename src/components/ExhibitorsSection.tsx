"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface ExhibitorsSectionProps {
  city?: "manaus" | "belem";
}

export default function ExhibitorsSection({ city }: ExhibitorsSectionProps) {
  const [exhibitors, setExhibitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "exhibitors"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter by city if provided
      const filtered = city 
        ? docs.filter((ex: any) => ex.cities?.includes(city))
        : docs;

      setExhibitors(filtered);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [city]);

  if (loading) return null;
  if (exhibitors.length === 0) return null;

  return (
    <section className="py-24 bg-brand-blue relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-brand-cyan font-bold tracking-[0.2em] uppercase text-sm mb-4"
          >
            Presenças Confirmadas
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white"
          >
            INDÚSTRIAS QUE ESTARÃO <br />
            <span className="text-brand-orange">EXPONDO</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {exhibitors.map((exhibitor, i) => (
            <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExhibitorCard({ exhibitor, index }: { exhibitor: any, index: number }) {
  const isClickable = !!exhibitor.link;

  const CardContent = (
    <>
      <div className="aspect-square bg-white rounded-2xl flex items-center justify-center p-4 md:p-6 mb-4 relative group-hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-all duration-500">
         <img 
            src={exhibitor.logoUrl} 
            alt={exhibitor.name} 
            className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" 
         />
         {isClickable && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-cyan text-brand-blue p-1 rounded-full scale-75 group-hover:scale-100 duration-500">
               <ArrowUpRight size={14} />
            </div>
         )}
      </div>
      <h3 className="text-sm md:text-base font-bold text-center text-gray-400 group-hover:text-white transition-colors truncate px-2">
        {exhibitor.name}
      </h3>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: (index % 10) * 0.05 }}
      viewport={{ once: true }}
      className={`group ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {isClickable ? (
        <a href={exhibitor.link} target="_blank" rel="noopener noreferrer" className="block">
          {CardContent}
        </a>
      ) : (
        <div className="block">
          {CardContent}
        </div>
      )}
    </motion.div>
  );
}
