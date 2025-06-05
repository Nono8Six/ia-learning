"use client";

import React, { useEffect } from "react";
import { ModulesList } from "@/components/program/modules-list";
import { ProgramTimeline } from "@/components/program/program-timeline";
import { InstructorsSection } from "@/components/program/instructors-section";
import { ProgramCta } from "@/components/program/program-cta";
import { ProgramFaq } from "@/components/program/program-faq";
import { SyllabusCta } from "@/components/program/syllabus-cta";
import { CertificationSection } from "@/components/program/certification-section";
import { useAuth } from "@/contexts/AuthContext";

export default function ProgrammePage() {
  const { user } = useAuth();
  
  useEffect(() => {
    // S'assurer que toutes les sections sont visibles immédiatement
    document.querySelectorAll('.section-animated').forEach(section => {
      section.classList.add('animate-section-in');
    });
  }, []);
  
  return (
    <main className="pt-32 pb-16">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-16 section-animated animate-section-in">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {user ? "Votre parcours" : "Programme de formation"} <span className="text-chart-1">IA Fondations</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {user 
              ? "Suivez votre progression et accédez à tous vos modules de formation."
              : "Un parcours complet pour maîtriser l'intelligence artificielle et l'appliquer concrètement à votre métier."}
          </p>
        </div>
      </section>
      
      {/* Programme sections */}
      <ProgramTimeline />
      <ModulesList />
      <SyllabusCta />
      <CertificationSection />
      <InstructorsSection />
      <ProgramFaq />
      {/* N'afficher le CTA que si l'utilisateur n'est pas connecté */}
      {!user && <ProgramCta />}
    </main>
  );
}
