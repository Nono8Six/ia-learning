"use client";

import { useEffect } from "react";
import { HeroSection } from "@/components/sections/hero-section";
import { ClientLogos } from "@/components/sections/client-logos";
import { StatisticsSection } from "@/components/sections/statistics-section";
import { CallToAction } from "@/components/sections/call-to-action";
import { AiUseCases } from "@/components/sections/ai-use-cases";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FaqSection } from "@/components/sections/faq-section";
// Import le composant modifié
import { SimpleStats } from "@/components/data-visualization/simple-stats";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Si l'utilisateur est connecté, rediriger vers le dashboard
    if (user) {
      router.push('/dashboard');
    }
    
    // Animation setup for all sections
    const sections = document.querySelectorAll('.section-animated');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-section-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
      observer.observe(section);
    });
    
    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, [user, router]);
  
  // Si l'utilisateur est connecté, on affiche un message de redirection
  // au lieu de retourner null
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg">Redirection vers le tableau de bord...</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <HeroSection />
      <ClientLogos />
      {/* Remplacer le composant complexe par une version simplifiée */}
      <SimpleStats />
      <AiUseCases />
      <StatisticsSection />
      <TestimonialsSection />
      <FaqSection />
      <CallToAction />
    </>
  );
}