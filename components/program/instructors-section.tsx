"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Twitter, Globe } from "lucide-react";
import Link from "next/link";

type InstructorProps = {
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
  links: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
};

function InstructorCard({ name, title, bio, imageUrl, links }: InstructorProps) {
  return (
    <Card className="border-border/50 overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-[3/4] relative">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-1">{name}</h3>
          <p className="text-muted-foreground mb-4">{title}</p>
          <p className="text-sm mb-4">{bio}</p>
          
          <div className="flex space-x-3">
            {links.linkedin && (
              <Link href={links.linkedin} className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                <Linkedin className="h-4 w-4" />
              </Link>
            )}
            {links.twitter && (
              <Link href={links.twitter} className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                <Twitter className="h-4 w-4" />
              </Link>
            )}
            {links.website && (
              <Link href={links.website} className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                <Globe className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function InstructorsSection() {
  const instructors = [
    {
      name: "Dr. Sophie Martin",
      title: "Experte en IA & Directrice Pédagogique",
      bio: "Docteure en Intelligence Artificielle avec 15 ans d'expérience dans l'industrie et l'enseignement. Spécialiste en ML et NLP appliqués au monde professionnel.",
      imageUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600",
      links: {
        linkedin: "#",
        twitter: "#",
        website: "#"
      }
    },
    {
      name: "Alexandre Durand",
      title: "Expert en Prompt Engineering",
      bio: "Pionnier du prompt engineering avec plus de 500 projets IA à son actif. Formateur reconnu et auteur du livre 'L'Art du Prompt' traduit en 12 langues.",
      imageUrl: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600",
      links: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "Clara Benoit",
      title: "Spécialiste IA pour les Métiers Créatifs",
      bio: "Ancienne directrice créative reconvertie dans l'IA. Experte en intégration de l'IA dans les flux de travail créatifs et la génération de contenu.",
      imageUrl: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=600",
      links: {
        linkedin: "#",
        website: "#"
      }
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Vos formateurs experts
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Bénéficiez de l'expertise de professionnels reconnus dans le domaine de l'intelligence artificielle.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {instructors.map((instructor, index) => (
            <InstructorCard
              key={index}
              name={instructor.name}
              title={instructor.title}
              bio={instructor.bio}
              imageUrl={instructor.imageUrl}
              links={instructor.links}
            />
          ))}
        </div>
      </div>
    </section>
  );
}