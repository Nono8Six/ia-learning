"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function CallToAction() {
  const { user } = useAuth();
  
  const benefits = [
    "Formation complète en Intelligence Artificielle",
    "Cas d'usage adaptés à votre métier",
    "Certification professionnelle",
    "Accès illimité pendant 12 mois",
    "Support personnalisé",
    "Communauté d'apprenants"
  ];

  // Si l'utilisateur est connecté, ne pas afficher cette section
  if (user) {
    return null;
  }

  return (
    <section
      className="section-animated py-16 md:py-24 bg-gradient-to-br from-background to-muted/50"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left Column: Image with gradient overlay */}
            <div className="relative h-64 md:h-auto bg-[url('https://images.pexels.com/photos/3760810/pexels-photo-3760810.jpeg?auto=compress&cs=tinysrgb&w=800')] bg-cover bg-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-chart-1/40 mix-blend-multiply"></div>
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="text-center">
                  <h3 className="text-white text-2xl font-bold shadow-sm">Places limitées</h3>
                  <p className="text-white/90 mt-2 text-lg shadow-sm">
                    Prochaine session: Septembre 2025
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right Column: CTA content */}
            <div className="p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Prêt à transformer votre carrière ?
              </h2>
              
              <p className="text-muted-foreground mb-6">
                Rejoignez notre formation et acquérez des compétences en IA qui 
                vous rendront indispensable dans votre secteur.
              </p>
              
              <ul className="space-y-2 mb-8">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-chart-1 mr-2 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <Button size="lg" asChild className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 transition-all duration-500 rounded-full">
                <Link href="/programme#inscription" className="px-5 py-2.5 flex items-center justify-center">
                  Je réserve ma place
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <p className="text-sm text-muted-foreground text-center mt-4">
                Paiement sécurisé • Satisfait ou remboursé sous 14 jours
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}