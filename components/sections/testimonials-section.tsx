"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

type TestimonialProps = {
  quote: string;
  name: string;
  title: string;
  company: string;
  rating: number;
  imageUrl: string;
  index: number;
};

function TestimonialCard({ quote, name, title, company, rating, imageUrl, index }: TestimonialProps) {
  return (
    <Card
      className={`section-animated stagger-item-${index + 1} border-border/50`}
    >
      <CardContent className="p-6">
        <div className="flex space-x-1 mb-4">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-chart-1 text-chart-1" />
          ))}
        </div>
        
        <blockquote className="mb-6 text-foreground">
          "{quote}"
        </blockquote>
        
        <div className="flex items-center">
          <div className="mr-4">
            <Image
              src={imageUrl}
              alt={name}
              width={50}
              height={50}
              className="rounded-full"
            />
          </div>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-muted-foreground">{title}, {company}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Cette formation a été un véritable déclic. J'ai pu mettre en place des automatisations IA qui m'ont fait gagner 15 heures par semaine sur mes tâches administratives.",
      name: "Marie Durand",
      title: "Directrice Marketing",
      company: "TechCorp",
      rating: 5,
      imageUrl: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      quote: "Malgré mon manque de connaissances techniques, j'ai pu intégrer l'IA dans mon quotidien professionnel dès la première semaine. Les résultats sont impressionnants.",
      name: "Thomas Lefebvre",
      title: "Avocat",
      company: "Cabinet Juridique International",
      rating: 5,
      imageUrl: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      quote: "À 58 ans, j'avais peur d'être dépassé par l'IA. Cette formation m'a donné confiance et des outils concrets pour rester compétitif sur le marché.",
      name: "Philippe Moreau",
      title: "Consultant Senior",
      company: "GlobalConsult",
      rating: 5,
      imageUrl: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
  ];
  
  return (
    <section
      className="section-animated py-16 md:py-24 bg-muted/30"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ils ont transformé leur carrière
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez comment nos participants ont révolutionné leur approche professionnelle 
            grâce à notre formation en intelligence artificielle.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              name={testimonial.name}
              title={testimonial.title}
              company={testimonial.company}
              rating={testimonial.rating}
              imageUrl={testimonial.imageUrl}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}