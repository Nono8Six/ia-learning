"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Code, LightbulbIcon, Brain } from "lucide-react";

export function ProgramTimeline() {
  // Remove the IntersectionObserver code that was causing issues
  // Keep simple useEffect for any initialization if needed
  useEffect(() => {
    // Simple initialization if needed
  }, []);

  const timelineSteps = [
    {
      icon: LightbulbIcon,
      title: "Fondamentaux de l'IA",
      description: "Comprendre les concepts clés et les types d'IA",
      duration: "2 semaines",
    },
    {
      icon: Brain,
      title: "Prompt Engineering",
      description: "Maîtriser l'art de communiquer efficacement avec les IA",
      duration: "3 semaines",
    },
    {
      icon: Code,
      title: "Outils & Automatisation",
      description: "Intégrer l'IA dans votre flux de travail quotidien",
      duration: "2 semaines",
    },
    {
      icon: BookOpen,
      title: "Projet final",
      description: "Appliquer vos connaissances sur un cas concret dans votre métier",
      duration: "1 semaine",
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Votre parcours d'apprentissage
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Une formation progressive et pratique en 4 phases pour maîtriser l'IA,
            quel que soit votre niveau de départ.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-muted-foreground/20 hidden md:block"></div>
            
            {/* Timeline steps */}
            <div className="space-y-12">
              {timelineSteps.map((step, index) => {
                const Icon = step.icon;
                const isEven = index % 2 === 0;
                
                return (
                  <div key={index} className="relative">
                    {/* Dots on timeline (only on desktop) */}
                    <div 
                      className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-4 border-background bg-chart-1 hidden md:block`}
                      style={{ top: "2rem" }}
                    ></div>
                    
                    <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}>
                      {/* Phase number */}
                      <div className="flex md:w-1/2 justify-center md:justify-end md:pr-8">
                        <div className={`flex items-center ${isEven ? 'md:justify-end' : 'md:justify-start md:order-last'}`}>
                          <Card className={`border-chart-1 w-full md:max-w-xs ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                            <CardContent className="p-6">
                              <div className="flex items-center mb-2 gap-2">
                                <div className="bg-chart-1/10 p-2 rounded-full">
                                  <Icon className="h-5 w-5 text-chart-1" />
                                </div>
                                <span className="font-bold text-lg">{`Phase ${index + 1}`}</span>
                              </div>
                              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                              <p className="text-muted-foreground mb-3">{step.description}</p>
                              <div className="flex items-center text-sm font-medium text-muted-foreground">
                                <span>{step.duration}</span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                      
                      {/* Mobile divider */}
                      <div className="md:hidden h-12 w-1 bg-muted-foreground/20"></div>
                      
                      {/* Empty space for alignment */}
                      <div className="hidden md:block md:w-1/2"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}