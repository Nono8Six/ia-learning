"use client";

import Image from "next/image";
import { CheckCircle, Award, Linkedin } from "lucide-react";

export function CertificationSection() {
  const benefits = [
    "Certification reconnue par l'industrie",
    "Augmentez votre valeur sur le marché du travail",
    "Affichez vos compétences IA sur LinkedIn",
    "Démontrez votre expertise auprès de vos clients",
    "Intégrez un réseau de professionnels formés à l'IA"
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Obtenez votre certification en IA
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              À l'issue de la formation, recevez une certification attestant de vos compétences 
              en intelligence artificielle et prompt engineering. Un atout précieux pour votre carrière.
            </p>
            
            <ul className="space-y-3 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-chart-1 mr-3 shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Award className="h-5 w-5" />
              <span>Plus de 1000 professionnels déjà certifiés</span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="relative max-w-sm">
              {/* Certificate mockup */}
              <div className="bg-card border-4 border-chart-1/20 rounded-lg p-8 shadow-lg rotate-2 transform transition-transform hover:rotate-0 duration-300">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center">
                    <Award className="h-8 w-8 text-chart-1 mr-2" />
                    <span className="font-bold text-xl">IA Fondations</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Certifié·e le</div>
                    <div className="font-medium">15 Juin 2025</div>
                  </div>
                </div>
                
                <h3 className="text-center text-2xl font-bold mb-2">Certificat d'Excellence</h3>
                <p className="text-center text-muted-foreground mb-6">en Intelligence Artificielle et Prompt Engineering</p>
                
                <div className="text-center mb-8">
                  <div className="font-bold text-xl mb-1">Marie Dupont</div>
                  <div className="text-sm text-muted-foreground">a complété avec succès la formation</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">ID: IA-CERT-2025-1234</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Linkedin className="h-4 w-4 mr-1" />
                    <span>Vérifiable</span>
                  </div>
                </div>
              </div>
              
              {/* Shadow element */}
              <div className="absolute inset-0 -z-10 bg-muted rounded-lg transform translate-x-3 translate-y-3"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}