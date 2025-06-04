"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, DivideIcon as LucideIcon, FileText, PieChart, Users, Presentation, MegaphoneIcon, Boxes, Scale } from "lucide-react";
import Link from "next/link";

type UseCaseProps = {
  icon: typeof LucideIcon;
  title: string;
  description: string;
  index: number;
};

function UseCase({ icon: Icon, title, description, index }: UseCaseProps) {
  return (
    <Card
      className={`section-animated stagger-item-${index + 1}`}
    >
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="mb-4">
            <div className="p-2 w-fit rounded-full bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground flex-grow mb-4">{description}</p>
          
          <Button variant="link" className="px-0 justify-start w-fit" asChild>
            <Link href="/programme">
              En savoir plus <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function AiUseCases() {
  const useCases = [
    {
      icon: FileText,
      title: "Finance & Comptabilité",
      description: "Automatisez l'analyse de données financières et la préparation de rapports pour économiser des heures de travail manuel.",
    },
    {
      icon: Users,
      title: "Ressources Humaines",
      description: "Optimisez le recrutement et la gestion des talents avec des outils IA qui trient les CV et personnalisent la formation.",
    },
    {
      icon: PieChart,
      title: "Marketing & Communication",
      description: "Créez du contenu persuasif à grande échelle et analysez les tendances du marché pour des campagnes plus performantes.",
    },
    {
      icon: Scale,
      title: "Juridique & Conformité",
      description: "Accélérez l'analyse de contrats et la recherche juridique tout en assurant une veille réglementaire constante.",
    },
    {
      icon: Presentation,
      title: "Vente & Service Client",
      description: "Personnalisez l'expérience client et automatisez les tâches répétitives pour vous concentrer sur la relation humaine.",
    },
    {
      icon: Boxes,
      title: "Production & Logistique",
      description: "Optimisez vos chaînes d'approvisionnement et anticipez les problèmes grâce à l'analyse prédictive.",
    },
  ];

  return (
    <section 
      className="section-animated py-16 md:py-24"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            L'IA au service de votre métier
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez comment l'intelligence artificielle peut transformer votre façon de travailler, 
            quel que soit votre secteur d'activité.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <UseCase
              key={index}
              icon={useCase.icon}
              title={useCase.title}
              description={useCase.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}