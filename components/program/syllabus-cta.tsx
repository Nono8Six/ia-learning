"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

export function SyllabusCta() {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground mb-4">
            Vous souhaitez consulter le programme complet à votre rythme ?
          </p>
          <Button variant="outline" size="lg" className="gap-2">
            <FileDown className="h-4 w-4" />
            Télécharger le syllabus PDF
          </Button>
        </div>
      </div>
    </section>
  );
}