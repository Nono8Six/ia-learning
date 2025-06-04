"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle, 
  Clock, 
  Calendar, 
  Users, 
  Award, 
  MessageSquare,
  FileText,
  ArrowRight
} from "lucide-react";

export function ProgramCta() {
  const features = [
    {
      icon: Clock,
      title: "8 semaines de formation",
      description: "Programme complet avec accès pendant 12 mois"
    },
    {
      icon: Calendar,
      title: "Sessions en direct",
      description: "Webinaires hebdomadaires et sessions de questions"
    },
    {
      icon: Users,
      title: "Communauté d'entraide",
      description: "Accès à un réseau de professionnels formés à l'IA"
    },
    {
      icon: Award,
      title: "Certification reconnue",
      description: "Valorisez vos compétences sur le marché du travail"
    },
    {
      icon: MessageSquare,
      title: "Support personnalisé",
      description: "Assistance par e-mail et chat pendant toute la formation"
    },
    {
      icon: FileText,
      title: "Ressources exclusives",
      description: "Templates, guides et bibliothèques de prompts"
    },
  ];

  return (
    <section
      className="py-16 md:py-24 bg-muted/30 section-animated animate-section-in"
      id="inscription"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à transformer votre carrière ?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Rejoignez notre prochaine session et maîtrisez l'IA pour devenir indispensable 
            dans votre secteur d'activité.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex flex-col p-4 rounded-lg border border-border/50 bg-card/50">
                  <div className="p-2 w-fit rounded-full bg-primary/10 mb-4">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-base font-medium mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
          
          {/* Pricing card */}
          <Card className="shadow-lg border-border/80">
            <CardContent className="p-8">
              <div className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-2xl font-bold">Formation complète</h3>
                    <p className="text-muted-foreground">Tout ce dont vous avez besoin pour maîtriser l'IA</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">997€</div>
                    <div className="text-sm text-muted-foreground">HT</div>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground mb-6">
                  Paiement en 3 ou 6 fois sans frais disponible
                </div>
                
                <Button className="w-full mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 transition-all duration-500 rounded-full relative overflow-hidden group" size="lg" asChild>
                  <Link href="#" className="px-5 py-2.5 flex items-center justify-center">
                    <span>Je réserve ma place</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transform scale-x-0 group-hover:scale-x-100 transition-all duration-500 rounded-full"></div>
                  </Link>
                </Button>
                
                <div className="text-center text-sm text-muted-foreground">
                  <p>Places limitées pour la session de Septembre 2025</p>
                </div>
                
                <div className="border-t border-border/50 my-6 pt-6">
                  <h4 className="font-medium mb-4">Ce qui est inclus :</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-chart-1 mr-3 shrink-0" />
                      <span>Accès complet au programme pendant 12 mois</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-chart-1 mr-3 shrink-0" />
                      <span>8 sessions hebdomadaires en direct</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-chart-1 mr-3 shrink-0" />
                      <span>Exercices pratiques et projets appliqués</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-chart-1 mr-3 shrink-0" />
                      <span>Certification IA Fondations</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-chart-1 mr-3 shrink-0" />
                      <span>Accès à la communauté privée d'apprenants</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-chart-1 mr-3 shrink-0" />
                      <span>Support personnalisé pendant toute la formation</span>
                    </li>
                  </ul>
                </div>
                
                <div className="text-center text-sm mt-6">
                  <p className="text-muted-foreground">Satisfait ou remboursé pendant 14 jours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}