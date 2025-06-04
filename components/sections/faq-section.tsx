"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FaqSection() {
  const faqs = [
    {
      question: "À qui s'adresse cette formation ?",
      answer: "Notre formation s'adresse à tous les professionnels souhaitant intégrer l'IA dans leur métier, quel que soit leur niveau technique. Que vous soyez débutant ou expérimenté, notre programme est conçu pour être accessible et pertinent pour diverses professions : marketing, finance, RH, juridique, créatif, etc."
    },
    {
      question: "Ai-je besoin de compétences techniques pour suivre la formation ?",
      answer: "Absolument aucun prérequis technique n'est nécessaire. Notre approche pédagogique est spécifiquement conçue pour rendre l'IA accessible à tous, même si vous n'avez jamais programmé. Nous vous accompagnons pas à pas avec des explications claires et des exercices pratiques adaptés à votre niveau."
    },
    {
      question: "Combien de temps dure la formation ?",
      answer: "La formation complète se déroule sur 8 semaines, avec environ 4-6 heures d'engagement hebdomadaire. Le programme est flexible et vous pouvez suivre les modules à votre rythme. Les contenus restent accessibles pendant 12 mois après votre inscription pour vous permettre de les revisiter."
    },
    {
      question: "Comment se déroulent les sessions de formation ?",
      answer: "La formation combine des vidéos explicatives, des ateliers pratiques en direct, des exercices appliqués à votre secteur d'activité, et un suivi personnalisé. Chaque module contient des quiz d'évaluation et des projets concrets pour mettre en pratique vos acquis immédiatement dans votre environnement professionnel."
    },
    {
      question: "La certification est-elle reconnue par les entreprises ?",
      answer: "Oui, notre certification est reconnue par de nombreuses entreprises et organisations professionnelles. Elle atteste de votre capacité à utiliser l'IA de manière efficace et éthique dans un contexte professionnel. Vous recevrez un certificat numérique que vous pourrez partager sur LinkedIn et ajouter à votre CV."
    },
  ];

  return (
    <section
      className="section-animated py-16 md:py-24"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Questions fréquentes
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Vous avez des questions sur notre formation ? Consultez nos réponses ci-dessous 
            ou contactez-nous directement.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-10 text-center">
            <p className="mb-4 text-muted-foreground">
              Vous ne trouvez pas la réponse à votre question ?
            </p>
            <Button asChild>
              <Link href="mailto:contact@ia-fondations.fr">
                Contactez-nous
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}