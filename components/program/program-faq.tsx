"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ProgramFaq() {
  const faqs = [
    {
      question: "Combien coûte la formation complète ?",
      answer: "La formation complète est proposée à 997€ HT. Ce tarif inclut l'accès à tous les modules, les sessions en direct, le support personnalisé et la certification. Des facilités de paiement en 3 ou 6 fois sont disponibles. Nous proposons également des tarifs préférentiels pour les étudiants et les demandeurs d'emploi."
    },
    {
      question: "Comment se déroulent les cours en ligne ?",
      answer: "Notre formation combine des vidéos à la demande, des sessions en direct hebdomadaires, des exercices pratiques et un forum de discussion. Vous pouvez suivre les modules à votre rythme et participer aux sessions en direct pour poser vos questions et interagir avec les formateurs et autres participants."
    },
    {
      question: "Que se passe-t-il si je ne peux pas assister à une session en direct ?",
      answer: "Toutes les sessions en direct sont enregistrées et mises à disposition dans votre espace membre. Vous pouvez les visionner à tout moment et poser vos questions sur le forum. Nos formateurs répondent aux questions sous 24h ouvrées."
    },
    {
      question: "Comment puis-je être sûr(e) que cette formation me convient ?",
      answer: "Nous offrons une garantie satisfait ou remboursé de 14 jours. Si après avoir suivi les deux premiers modules, vous estimez que la formation ne correspond pas à vos attentes, nous vous remboursons intégralement. De plus, nous proposons une session de découverte gratuite pour vous permettre de vous familiariser avec notre approche pédagogique."
    },
    {
      question: "Les compétences acquises sont-elles reconnues par les entreprises ?",
      answer: "Absolument. Notre certification est reconnue par de nombreuses entreprises et organisations. De plus, le programme a été conçu en collaboration avec des professionnels de divers secteurs pour garantir l'acquisition de compétences directement applicables en entreprise. Plus de 80% de nos anciens étudiants rapportent une évolution professionnelle positive dans les 6 mois suivant la formation."
    }
  ];

  return (
    <section
      className="py-16 md:py-24"
      id="faq"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Questions fréquentes sur le programme
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tout ce que vous devez savoir sur notre formation en IA.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium px-4 py-4 hover:bg-muted/40">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2">
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}