"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, Clock, FileText, Target } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function ModulesList() {
  const [activeTab, setActiveTab] = useState("all");
  const [isMounted, setIsMounted] = useState(false);
  
  // Set isMounted to true when component mounts on client
  useEffect(() => {
    setIsMounted(true);
    
    // Add animation classes immediately after component mount
    document.querySelectorAll('.section-animated').forEach(section => {
      section.classList.add('animate-section-in');
    });
  }, []);
  
  const modules = [
    {
      phase: "Phase 1: Fondamentaux de l'IA",
      items: [
        {
          title: "Introduction à l'Intelligence Artificielle",
          objectives: ["Comprendre les différents types d'IA", "Historique et évolution de l'IA", "Notions de Machine Learning et Deep Learning"],
          deliverables: ["Quiz de compréhension", "Carte mentale des types d'IA"],
          duration: "2 heures"
        },
        {
          title: "Les grands modèles de langage (LLM)",
          objectives: ["Comprendre le fonctionnement des LLM", "Découvrir les principaux modèles (GPT, Claude, Gemini)", "Comprendre les notions de tokens et température"],
          deliverables: ["Tableau comparatif des modèles", "Premier prompt simple"],
          duration: "3 heures"
        },
        {
          title: "Éthique et limites de l'IA",
          objectives: ["Identifier les biais algorithmiques", "Comprendre les questions de vie privée", "Appréhender la propriété intellectuelle"],
          deliverables: ["Analyse de cas éthiques", "Charte personnelle d'utilisation de l'IA"],
          duration: "2 heures"
        },
      ]
    },
    {
      phase: "Phase 2: Prompt Engineering",
      items: [
        {
          title: "Principes fondamentaux du prompt engineering",
          objectives: ["Maîtriser la structure d'un prompt efficace", "Techniques de clarification des instructions", "Compréhension des contextes"],
          deliverables: ["Bibliothèque de prompts de base", "Exercice d'optimisation de prompt"],
          duration: "3 heures"
        },
        {
          title: "Techniques avancées de prompt",
          objectives: ["Chain of thought (chaîne de pensée)", "Few-shot learning", "Raisonnement par étapes"],
          deliverables: ["Cas pratique métier avec prompts avancés", "Auto-évaluation de prompt"],
          duration: "4 heures"
        },
        {
          title: "Prompts spécialisés par métier",
          objectives: ["Adaptation des prompts à votre secteur", "Vocabulaire spécifique et contraintes métier", "Optimisation pour votre contexte professionnel"],
          deliverables: ["Guide de prompts pour votre profession", "Mini-projet d'automatisation"],
          duration: "4 heures"
        },
      ]
    },
    {
      phase: "Phase 3: Outils & Automatisation",
      items: [
        {
          title: "Outils IA pour la productivité quotidienne",
          objectives: ["Découverte des assistants IA généralistes", "Intégrations avec votre suite bureautique", "Extensions et plugins IA"],
          deliverables: ["Configuration de votre environnement IA", "Démonstration d'utilisation"],
          duration: "3 heures"
        },
        {
          title: "IA spécialisée par domaine",
          objectives: ["Outils IA pour le marketing et la communication", "Solutions pour la finance et RH", "Applications créatives et design"],
          deliverables: ["Matrice d'outils pour votre métier", "Preuve de concept d'automatisation"],
          duration: "3 heures"
        },
        {
          title: "Création de workflows IA",
          objectives: ["Chaîner plusieurs outils IA", "Automatiser des tâches répétitives", "Mesurer le gain de productivité"],
          deliverables: ["Workflow complet documenté", "Présentation des résultats"],
          duration: "3 heures"
        },
      ]
    },
    {
      phase: "Phase 4: Projet Final",
      items: [
        {
          title: "Conception de votre projet",
          objectives: ["Identifier une problématique métier", "Sélectionner les outils adaptés", "Définir les métriques de succès"],
          deliverables: ["Document de conception", "Planning de mise en œuvre"],
          duration: "2 heures"
        },
        {
          title: "Implémentation et tests",
          objectives: ["Créer votre solution IA", "Tester avec des utilisateurs réels", "Itérer et améliorer"],
          deliverables: ["Solution IA fonctionnelle", "Rapport de tests"],
          duration: "3 heures"
        },
        {
          title: "Présentation et certification",
          objectives: ["Préparer votre démonstration", "Documenter votre projet", "Évaluation par les formateurs"],
          deliverables: ["Présentation finale", "Dossier complet", "Certification"],
          duration: "2 heures"
        },
      ]
    }
  ];

  const renderModuleContent = (modulesList) => {
    return modulesList.map((module, moduleIndex) => (
      <div key={moduleIndex} className="mb-12 section-animated animate-section-in">
        <h3 className="text-2xl font-bold mb-6">{module.phase}</h3>
        
        <Accordion type="single" collapsible className="w-full border rounded-lg overflow-hidden">
          {module.items.map((item, itemIndex) => (
            <AccordionItem 
              key={itemIndex} 
              value={`module-${moduleIndex}-${itemIndex}`}
              className="border-b last:border-b-0"
            >
              <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 transition-colors">
                <span className="text-left font-medium">{item.title}</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center mb-2 text-primary">
                      <Target className="h-5 w-5 mr-2" />
                      <h4 className="font-medium">Objectifs</h4>
                    </div>
                    <ul className="space-y-1">
                      {item.objectives.map((objective, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-4 w-4 text-chart-1 mr-2 mt-1 shrink-0" />
                          <span className="text-sm">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2 text-primary">
                      <FileText className="h-5 w-5 mr-2" />
                      <h4 className="font-medium">Livrables</h4>
                    </div>
                    <ul className="space-y-1">
                      {item.deliverables.map((deliverable, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-4 w-4 text-chart-1 mr-2 mt-1 shrink-0" />
                          <span className="text-sm">{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2 text-primary">
                      <Clock className="h-5 w-5 mr-2" />
                      <h4 className="font-medium">Durée</h4>
                    </div>
                    <p className="text-sm ml-6">{item.duration}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    ));
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Programme détaillé
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explorez le contenu complet de notre formation, structuré en modules progressifs
            pour un apprentissage optimal.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-10">
          {isMounted ? (
            <Tabs defaultValue="all\" value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <div className="flex justify-center mb-6">
                <TabsList className="bg-muted/70 p-1">
                  <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm">Toutes les phases</TabsTrigger>
                  <TabsTrigger value="phase1" className="rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm">Phase 1</TabsTrigger>
                  <TabsTrigger value="phase2" className="rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm">Phase 2</TabsTrigger>
                  <TabsTrigger value="phase3" className="rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm">Phase 3</TabsTrigger>
                  <TabsTrigger value="phase4" className="rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm">Phase 4</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="space-y-10">
                {renderModuleContent(modules)}
              </TabsContent>
              
              <TabsContent value="phase1" className="space-y-10">
                {renderModuleContent([modules[0]])}
              </TabsContent>
              
              <TabsContent value="phase2" className="space-y-10">
                {renderModuleContent([modules[1]])}
              </TabsContent>
              
              <TabsContent value="phase3" className="space-y-10">
                {renderModuleContent([modules[2]])}
              </TabsContent>
              
              <TabsContent value="phase4" className="space-y-10">
                {renderModuleContent([modules[3]])}
              </TabsContent>
            </Tabs>
          ) : (
            // Render a simple loading state or placeholder while client-side hydration is happening
            <div className="py-4 text-center text-muted-foreground">
              Chargement du programme...
            </div>
          )}
        </div>
      </div>
    </section>
  );
}