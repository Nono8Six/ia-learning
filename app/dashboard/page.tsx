"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  BarChart,
  Play,
  LockIcon,
  FileText,
  Download,
  Share2,
  CalendarDays,
  Zap,
  Flame,
  Trophy,
  Star,
  LayoutGrid,
  AlertTriangle
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const [progress, setProgress] = useState(35);
  const [xpPoints, setXpPoints] = useState(1250);
  const [level, setLevel] = useState(3);
  const [streak, setStreak] = useState(5);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const { user } = useAuth();
  
  // Mock data for modules
  const modules = [
    {
      id: 1,
      title: "Introduction à l'Intelligence Artificielle",
      description: "Comprendre les différents types d'IA",
      duration: "2h",
      completed: true,
      progress: 100,
      locked: false,
      xpReward: 300
    },
    {
      id: 2,
      title: "Les grands modèles de langage (LLM)",
      description: "Découvrir les principaux modèles (GPT, Claude, Gemini)",
      duration: "3h",
      completed: false,
      progress: 75,
      locked: false,
      xpReward: 400
    },
    {
      id: 3,
      title: "Éthique et limites de l'IA",
      description: "Identifier les biais algorithmiques",
      duration: "2h",
      completed: false,
      progress: 0,
      locked: false,
      xpReward: 350
    },
    {
      id: 4,
      title: "Principes fondamentaux du prompt engineering",
      description: "Maîtriser la structure d'un prompt efficace",
      duration: "3h",
      completed: false,
      progress: 0,
      locked: true,
      xpReward: 450
    }
  ];
  
  // Mock data for upcoming events
  const events = [
    {
      id: 1,
      title: "Webinaire: Prompt Engineering Avancé",
      date: "15 Sept 2025",
      time: "18:00 - 19:30",
      link: "#",
      xpReward: 150
    },
    {
      id: 2,
      title: "Session Q&R: Applications IA en Marketing",
      date: "22 Sept 2025",
      time: "12:30 - 13:30",
      link: "#",
      xpReward: 120
    }
  ];
  
  // Mock data for achievements
  const achievements = [
    {
      id: 1,
      title: "Premier pas",
      description: "Terminer votre premier module",
      icon: Star,
      completed: true,
      progress: 100,
    },
    {
      id: 2,
      title: "Perfectionniste",
      description: "Obtenir 100% à tous les quiz d'un module",
      icon: CheckCircle,
      completed: true,
      progress: 100,
    },
    {
      id: 3,
      title: "Curieux",
      description: "Explorer tous les contenus additionnels",
      icon: BookOpen,
      completed: false,
      progress: 60,
    },
    {
      id: 4,
      title: "Régulier",
      description: "Se connecter 7 jours de suite",
      icon: Flame,
      completed: false,
      progress: 70,
    },
  ];

  useEffect(() => {
    // Check if we can connect to Supabase
    const checkConnection = async () => {
      try {
        // This is just a simple check to see if we're online
        const online = navigator.onLine;
        if (!online) {
          setConnectionError(true);
          return;
        }
        
        // If we're online but still having Supabase issues, we'll catch that in the AdminContext
        // This is just a fallback in case the user is completely offline
        setConnectionError(false);
      } catch (error) {
        console.error("Connection check error:", error);
        setConnectionError(true);
      }
    };
    
    checkConnection();
    
    // Simulate level up animation after component mount
    const timer = setTimeout(() => {
      setShowLevelUp(true);
      setTimeout(() => {
        setShowLevelUp(false);
      }, 3000);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Simulate XP to next level calculation
  const nextLevelXp = 2000;
  const currentLevelXp = 1000;
  const xpToNextLevel = nextLevelXp - currentLevelXp;
  const currentXpProgress = ((xpPoints - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  // If there's a connection error, show a friendly message
  if (connectionError) {
    return (
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <Card className="border border-border/50 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                Problème de connexion
              </CardTitle>
              <CardDescription>
                Impossible de se connecter à notre serveur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="warning" className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/30">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertTitle className="text-amber-800 dark:text-amber-400">Connexion indisponible</AlertTitle>
                <AlertDescription className="text-amber-700 dark:text-amber-300">
                  Nous rencontrons actuellement des difficultés pour accéder à nos services. Cela peut être dû à:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Une maintenance temporaire de nos serveurs</li>
                    <li>Un problème de connexion Internet de votre côté</li>
                    <li>Un problème technique temporaire</li>
                  </ul>
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col space-y-2">
                <p className="text-muted-foreground">Que pouvez-vous faire ?</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Vérifiez votre connexion Internet</li>
                  <li>Actualisez la page</li>
                  <li>Réessayez dans quelques minutes</li>
                </ul>
              </div>
              
              <div className="flex justify-center pt-4">
                <Button onClick={() => window.location.reload()}>
                  Actualiser la page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-16">
      <div className="container mx-auto px-4">
        {/* Level up animation */}
        {showLevelUp && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
            <div className="bg-card p-8 rounded-lg shadow-2xl flex flex-col items-center transform animate-in zoom-in-95 duration-500">
              <div className="relative mb-4">
                <Trophy className="h-16 w-16 text-yellow-500" />
                <div className="absolute inset-0 rounded-full animate-ping bg-yellow-500/20"></div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Niveau 3 Atteint!</h2>
              <p className="text-muted-foreground mb-4">Félicitations! Vous avez débloqué de nouveaux contenus</p>
              <Button onClick={() => setShowLevelUp(false)}>Continuer</Button>
            </div>
          </div>
        )}
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Progress & Level Card */}
          <Card className="border border-border/50 overflow-hidden">
            <CardHeader className="pb-2 relative">
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-chart-1/10 rounded-full blur-xl"></div>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 text-chart-1 mr-2" />
                Votre progression
              </CardTitle>
              <CardDescription>Formation IA Fondations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">Niveau {level}</span>
                <span className="text-sm font-medium">Niveau {level+1}</span>
              </div>
              <div className="relative mb-6">
                <Progress value={currentXpProgress} className="h-3 rounded-full bg-muted/70" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[10px] font-semibold text-primary-foreground">
                  {xpPoints} / {nextLevelXp} XP
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-muted/50 border border-border/40">
                  <BookOpen className="h-5 w-5 text-chart-1 mb-2" />
                  <div className="text-sm font-semibold">4/12</div>
                  <div className="text-xs text-muted-foreground">Modules</div>
                </div>
                <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-muted/50 border border-border/40">
                  <CheckCircle className="h-5 w-5 text-chart-1 mb-2" />
                  <div className="text-sm font-semibold">8/24</div>
                  <div className="text-xs text-muted-foreground">Quiz</div>
                </div>
                <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-muted/50 border border-border/40">
                  <Flame className="h-5 w-5 text-chart-1 mb-2" />
                  <div className="text-sm font-semibold">{streak} jours</div>
                  <div className="text-xs text-muted-foreground">Série</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Certification & Achievements Card */}
          <Card className="border border-border/50 overflow-hidden">
            <CardHeader className="pb-2 relative">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-chart-1/10 rounded-full blur-xl"></div>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 text-chart-1 mr-2" />
                Certification & Succès
              </CardTitle>
              <CardDescription>Vos récompenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="relative">
                  <Award className="h-10 w-10 text-chart-1" />
                  <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {level}
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold">IA Fondations</h3>
                  <p className="text-sm text-muted-foreground">Progression: {progress}%</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-chart-1/20 flex items-center justify-center mr-3">
                    <Star className="h-4 w-4 text-chart-1" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Succès débloqués</p>
                      <p className="text-sm font-bold">2/12</p>
                    </div>
                    <Progress value={2/12*100} className="h-1.5 mt-1" />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-chart-1/20 flex items-center justify-center mr-3">
                    <Zap className="h-4 w-4 text-chart-1" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">XP totaux gagnés</p>
                      <p className="text-sm font-bold">{xpPoints} XP</p>
                    </div>
                    <Progress value={75} className="h-1.5 mt-1" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button variant="outline" className="w-full" disabled>
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Générer</span>
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  <Share2 className="h-4 w-4 mr-2" />
                  <span>Partager</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Upcoming Events Card */}
          <Card className="border border-border/50 overflow-hidden">
            <CardHeader className="pb-2 relative">
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-chart-1/10 rounded-full blur-xl"></div>
              <CardTitle className="flex items-center">
                <CalendarDays className="h-5 w-5 text-chart-1 mr-2" />
                Prochains événements
              </CardTitle>
              <CardDescription>Sessions en direct</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map(event => (
                  <div key={event.id} className="border border-border/50 rounded-md p-3 hover:bg-muted/50 transition-colors">
                    <h4 className="font-medium mb-1">{event.title}</h4>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <CalendarDays className="h-3.5 w-3.5 mr-1" />
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-xs flex items-center text-chart-1">
                        <Zap className="h-3.5 w-3.5 mr-1" />
                        <span>+{event.xpReward} XP</span>
                      </div>
                      <div className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Places limitées
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={event.link}>
                        Ajouter au calendrier
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Modules */}
        <div>
          <h2 className="text-2xl font-bold flex items-center mb-6">
            <LayoutGrid className="h-6 w-6 mr-2 text-chart-1" />
            Parcours d'apprentissage
          </h2>
          
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="bg-muted/70 p-1 mb-6">
              <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm">Tous</TabsTrigger>
              <TabsTrigger value="in-progress" className="rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm">En cours</TabsTrigger>
              <TabsTrigger value="completed" className="rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm">Complétés</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modules.map(module => (
                  <Card key={module.id} className={`border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-md ${module.locked ? "opacity-80" : ""}`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full ${module.completed ? "bg-chart-1/20" : "bg-primary/10"}`}>
                            {module.completed ? (
                              <CheckCircle className="h-5 w-5 text-chart-1" />
                            ) : module.locked ? (
                              <LockIcon className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <BookOpen className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div className="ml-3">
                            <h3 className="font-medium">{module.title}</h3>
                            <p className="text-sm text-muted-foreground">{module.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center text-sm mb-1">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                            <span className="text-muted-foreground">{module.duration}</span>
                          </div>
                          <div className="text-xs flex items-center text-chart-1">
                            <Zap className="h-3.5 w-3.5 mr-1" />
                            <span>+{module.xpReward} XP</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1 text-sm">
                          <span className="text-muted-foreground">Progression</span>
                          <span>{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-1.5" />
                      </div>
                      
                      <Button 
                        className="w-full group" 
                        variant={module.completed ? "outline" : "default"}
                        disabled={module.locked}
                      >
                        {module.completed ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2 text-chart-1 group-hover:animate-pulse" />
                            Revoir le module
                          </>
                        ) : module.progress > 0 ? (
                          <>
                            <Play className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                            Continuer
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                            Commencer
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="in-progress" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modules.filter(m => !m.completed && m.progress > 0 && !m.locked).map(module => (
                  <Card key={module.id} className="border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-primary/10">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div className="ml-3">
                            <h3 className="font-medium">{module.title}</h3>
                            <p className="text-sm text-muted-foreground">{module.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center text-sm mb-1">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                            <span className="text-muted-foreground">{module.duration}</span>
                          </div>
                          <div className="text-xs flex items-center text-chart-1">
                            <Zap className="h-3.5 w-3.5 mr-1" />
                            <span>+{module.xpReward} XP</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1 text-sm">
                          <span className="text-muted-foreground">Progression</span>
                          <span>{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-1.5" />
                      </div>
                      
                      <Button className="w-full group">
                        <Play className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                        Continuer
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modules.filter(m => m.completed).map(module => (
                  <Card key={module.id} className="border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-chart-1/20">
                            <CheckCircle className="h-5 w-5 text-chart-1" />
                          </div>
                          <div className="ml-3">
                            <h3 className="font-medium">{module.title}</h3>
                            <p className="text-sm text-muted-foreground">{module.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center text-sm mb-1">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                            <span className="text-muted-foreground">{module.duration}</span>
                          </div>
                          <div className="text-xs flex items-center text-chart-1">
                            <Zap className="h-3.5 w-3.5 mr-1" />
                            <span>+{module.xpReward} XP</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1 text-sm">
                          <span className="text-muted-foreground">Progression</span>
                          <span>100%</span>
                        </div>
                        <Progress value={100} className="h-1.5" />
                      </div>
                      
                      <Button variant="outline" className="w-full group">
                        <CheckCircle className="h-4 w-4 mr-2 text-chart-1 group-hover:animate-pulse" />
                        Revoir le module
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Achievements section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Trophy className="h-6 w-6 mr-2 text-chart-1" />
            Vos succès
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {achievements.map(achievement => {
              const Icon = achievement.icon;
              return (
                <div 
                  key={achievement.id} 
                  className={`border border-border/50 rounded-lg p-5 flex flex-col items-center text-center ${
                    achievement.completed ? "bg-chart-1/5" : "bg-card"
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    achievement.completed 
                      ? "bg-chart-1/20 border-2 border-chart-1" 
                      : "bg-muted/70 border-2 border-muted"
                  }`}>
                    <Icon className={`h-8 w-8 ${
                      achievement.completed ? "text-chart-1" : "text-muted-foreground"
                    }`} />
                  </div>
                  <h3 className="font-bold mb-1">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                  
                  {!achievement.completed && (
                    <div className="w-full">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progression</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-1.5" />
                    </div>
                  )}
                  
                  {achievement.completed && (
                    <span className="text-xs bg-chart-1/20 text-chart-1 px-3 py-1 rounded-full font-medium">
                      Débloqué
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}