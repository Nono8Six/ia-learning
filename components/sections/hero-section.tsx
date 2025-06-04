"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Bot, Brain, Sparkles, Zap, Lightbulb, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function HeroSection() {
  const { user } = useAuth();
  
  useEffect(() => {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      // Add animation class immediately for hero section
      setTimeout(() => {
        heroSection.classList.add('animate-section-in');
      }, 100);
    }
  }, []);

  return (
    <section 
      className="hero-section section-animated relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-chart-1/10 rounded-full blur-3xl animate-pulse" 
             style={{animationDuration: '8s'}} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"
             style={{animationDuration: '12s', animationDelay: '2s'}} />
        <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-chart-1/5 rounded-full blur-2xl animate-pulse"
             style={{animationDuration: '7s', animationDelay: '1s'}} />
      </div>
      
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 mb-6 text-sm font-medium rounded-full bg-gradient-to-r from-indigo-500/30 to-purple-500/30 backdrop-blur-sm border border-indigo-300/20 text-primary animate-pulse">
            <Sparkles className="mr-1 h-3.5 w-3.5" />
            <span>{user ? "Bienvenue dans votre espace d'apprentissage" : "Inscriptions ouvertes pour la prochaine session"}</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 [text-wrap:balance] relative">
            {user ? "Votre parcours" : "Maîtrisez l'"}
            <span className="relative inline-block">
              <span className="text-chart-1">{user ? "d'excellence en IA" : "Intelligence Artificielle"}</span>
              <svg className="absolute -bottom-1 left-0 w-full h-2 text-chart-1/30" viewBox="0 0 300 12" preserveAspectRatio="none">
                <path d="M0,0 Q150,12 300,0" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
            <br />
            {user ? "commence maintenant" : "et devenez indispensable"}
            <div className="absolute -top-10 -right-10 w-20 h-20 text-chart-1/10 animate-spin-slow hidden md:block">
              <svg viewBox="0 0 100 100">
                <defs>
                  <path id="circle" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"/>
                </defs>
                <text>
                  <textPath xlinkHref="#circle">
                    intelligence artificielle • ia • prompt •
                  </textPath>
                </text>
              </svg>
            </div>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto [text-wrap:balance]">
            {user ? 
              "Suivez votre progression, complétez des défis et obtenez votre certification pour devenir un expert en IA." : 
              "Découvrez comment multiplier votre productivité par 5 à 50 grâce à l'IA, quelle que soit votre profession ou votre niveau technique actuel."
            }
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            {user ? (
              <>
                <Button asChild size="lg\" className="h-12 px-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 transition-all duration-500 shadow-lg hover:shadow-indigo-500/20 group rounded-full">
                  <Link href="/dashboard">
                    <span className="flex items-center">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      <span>Accéder à mon espace</span>
                    </span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transform scale-x-0 group-hover:scale-x-100 transition-all duration-500 rounded-full"></div>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 border-primary/20 hover:bg-primary/5 transition-all duration-300 rounded-full">
                  <Link href="/programme" className="group">
                    <span className="flex items-center">
                      <span className="mr-2">Explorer les modules</span>
                      <Zap className="h-4 w-4 opacity-70 group-hover:text-chart-1 group-hover:animate-pulse transition-colors duration-300" />
                    </span>
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="h-12 px-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 transition-all duration-500 shadow-lg hover:shadow-indigo-500/20 group rounded-full">
                  <Link href="/programme#inscription">
                    <span className="flex items-center">
                      <span className="mr-2">Je réserve ma place</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transform scale-x-0 group-hover:scale-x-100 transition-all duration-500 rounded-full"></div>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 border-primary/20 hover:bg-primary/5 transition-all duration-300 rounded-full">
                  <Link href="/programme" className="group">
                    <span className="flex items-center">
                      <span className="mr-2">Découvrir le parcours</span>
                      <Zap className="h-4 w-4 opacity-70 group-hover:text-chart-1 group-hover:animate-pulse transition-colors duration-300" />
                    </span>
                  </Link>
                </Button>
              </>
            )}
          </div>
          
          {/* Stats or Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl p-5 hover:border-chart-1/20 hover:shadow-lg hover:shadow-chart-1/5 transition-all duration-300">
              <div className="flex justify-center mb-3">
                <div className="p-2 rounded-full bg-primary/10 group-hover:bg-chart-1/10 transition-colors duration-300">
                  <Brain className="h-6 w-6 text-primary group-hover:text-chart-1 transition-colors duration-300" />
                </div>
              </div>
              <h3 className="font-semibold mb-1">Accessible à tous</h3>
              <p className="text-sm text-muted-foreground">
                Aucun prérequis technique, adapté à tous les niveaux
              </p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl p-5 hover:border-chart-1/20 hover:shadow-lg hover:shadow-chart-1/5 transition-all duration-300">
              <div className="flex justify-center mb-3">
                <div className="p-2 rounded-full bg-primary/10 group-hover:bg-chart-1/10 transition-colors duration-300">
                  <Bot className="h-6 w-6 text-primary group-hover:text-chart-1 transition-colors duration-300" />
                </div>
              </div>
              <h3 className="font-semibold mb-1">Pratique immédiate</h3>
              <p className="text-sm text-muted-foreground">
                Des cas d'usage adaptés à votre métier dès le premier jour
              </p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl p-5 hover:border-chart-1/20 hover:shadow-lg hover:shadow-chart-1/5 transition-all duration-300">
              <div className="flex justify-center mb-3">
                <div className="p-2 rounded-full bg-primary/10 group-hover:bg-chart-1/10 transition-colors duration-300">
                  <Lightbulb className="h-6 w-6 text-primary group-hover:text-chart-1 transition-colors duration-300" />
                </div>
              </div>
              <h3 className="font-semibold mb-1">Certification</h3>
              <p className="text-sm text-muted-foreground">
                Obtenez une certification professionnelle valorisante
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}