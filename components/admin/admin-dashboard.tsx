"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AdminDiagnostic } from "@/components/admin/admin-diagnostic";
import { 
  BarChart,
  User,
  Users,
  Book,
  CheckCircle,
  Settings,
  FileText,
  MoreVertical,
  TrendingUp,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UserStats {
  active_users?: number;
  total_users?: number;
  completed_courses?: number;
  average_completion_rate?: number;
}

interface CourseStats {
  published_courses?: number;
  total_courses?: number;
  total_modules?: number;
}

interface DashboardData {
  userStats: UserStats;
  courseStats: CourseStats;
  recentActivities: any[];
  activeExperiments: any[];
}

export function AdminDashboard() {
  const { dashboardData, loadDashboardData, isLoading, error } = useAdmin();
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData, retryCount]);

  // Formatage de la date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Afficher un temps relatif (il y a XX minutes/heures)
  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  };

  // Afficher l'outil de diagnostic avancé en cas d'erreur
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-3">Chargement du tableau de bord...</span>
      </div>
    );
  }

  // dashboardData is now guaranteed to be populated (real or mock) by AdminContext
  // if not loading.
  // The 'error' state from useAdmin can be used to display additional diagnostics
  // or persistent error messages, while still rendering the dashboard with (mock) data.

  const { 
    userStats = {
      active_users: 0,
      total_users: 0,
      completed_courses: 0,
      average_completion_rate: 0
    }, 
    courseStats = {
      published_courses: 0,
      total_courses: 0,
      total_modules: 0
    }, 
    recentActivities = [], 
    activeExperiments = [] 
  } = (dashboardData || {}) as DashboardData;

  return (
    <div className="space-y-8">
      {/* Display AdminDiagnostic and error card if there's an error */}
      {error && (
        <div className="space-y-6">
          <AdminDiagnostic />
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Erreur de chargement des données
              </CardTitle>
              <CardDescription>
                {error.message || "Impossible de charger toutes les données du tableau de bord."}
                {error.code === 'OFFLINE_DATA' || error.code === 'DATA_FETCH_ERROR'
                  ? " Les données affichées sont des exemples ou peuvent être incomplètes."
                  : " Veuillez vérifier votre connexion ou réessayer."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              { (error.code !== 'OFFLINE_DATA' && error.code !== 'DATA_FETCH_ERROR') && (
                 <Button
                  onClick={() => {
                    setRetryCount(prev => prev + 1); // This will trigger loadDashboardData via useEffect
                  }}
                  className="flex items-center"
                  variant="destructive"
                 >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                 </Button>
              )}
              { (error.code === 'OFFLINE_DATA' || error.code === 'DATA_FETCH_ERROR') && (
                <Alert variant="warning" className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/30">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertDescription className="text-amber-700 dark:text-amber-300">
                    Affichage de données de démonstration car le mode hors ligne est activé ou une erreur de récupération des données est survenue.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
        <Button size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Paramètres
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Statistiques utilisateurs */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-primary" />
              Utilisateurs actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userStats?.active_users ?? 'N/A'}</div>
            <p className="text-xs text-muted-foreground">
              {/* Placeholder for dynamic change, adapt as needed */}
              <span className="text-chart-1">↑ 12%</span> depuis le mois dernier
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              Total: {userStats?.total_users ?? 'N/A'} utilisateurs inscrits
            </div>
          </CardContent>
        </Card>
        
        {/* Modules terminés */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <Book className="h-4 w-4 mr-2 text-primary" />
              Modules terminés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userStats?.completed_courses ?? 'N/A'}</div>
            <p className="text-xs text-muted-foreground">
               {/* Placeholder for dynamic change */}
              <span className="text-chart-1">↑ 18%</span> depuis le mois dernier
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              Taux de complétion: {userStats?.average_completion_rate ?? 'N/A'}%
            </div>
          </CardContent>
        </Card>
        
        {/* Statistiques des cours */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <FileText className="h-4 w-4 mr-2 text-primary" />
              Cours publiés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{courseStats?.published_courses ?? 'N/A'}</div>
            <p className="text-xs text-muted-foreground">
               {/* Placeholder for dynamic change */}
              <span className="text-chart-1">↑ 4%</span> depuis le mois dernier
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              Total: {courseStats?.total_courses ?? 'N/A'} cours ({courseStats?.total_modules ?? 'N/A'} modules)
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activité récente */}
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Dernières actions des utilisateurs</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              {recentActivities?.length > 0 ? recentActivities.map(activity => (
                <div key={activity.id} className="flex items-center p-2 hover:bg-muted/50 rounded-md">
                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center mr-3">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium">{activity.user_name} {activity.action_details}</p>
                    <p className="text-xs text-muted-foreground">{getRelativeTime(activity.created_at)}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">Aucune activité récente à afficher.</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Tests A/B actifs */}
        <Card>
          <CardHeader className="space-y-0 pb-4">
            <CardTitle>Tests A/B actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeExperiments?.length > 0 ? activeExperiments.map(experiment => (
                <div key={experiment.id} className="border border-border/50 rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{experiment.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${experiment.status === 'active' ? 'bg-chart-1/20 text-chart-1' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                      {experiment.status === 'active' ? 'En cours' : (experiment.status || 'N/A')}
                    </span>
                  </div>
                  {/* <p className="text-sm text-muted-foreground mb-4">
                    Test comparatif entre différentes variantes.
                  </p> */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {experiment.variants?.map((variant: { name: string; conversion_rate: number }, index: number) => (
                      <div key={index}>
                        <p className="font-medium">{variant.name}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex-grow mr-2">
                            <Progress value={variant.conversion_rate * 10} className="h-2" />
                          </div>
                          <p className="text-muted-foreground whitespace-nowrap">{variant.conversion_rate.toFixed(1)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )) : (
                 <p className="text-sm text-muted-foreground">Aucun test A/B actif pour le moment.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Statistiques supplémentaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <Card className="border border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full mr-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Taux de conversion</p>
                  <p className="text-xl font-bold">5.8%</p>
                </div>
              </div>
              <div className="text-xs text-chart-1">+2.1%</div>
            </div>
            <div className="h-1 bg-muted-foreground/20 rounded-full overflow-hidden">
              <div className="h-1 bg-blue-600 dark:bg-blue-400 w-[58%] rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full mr-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Taux de complétion</p>
                  <p className="text-xl font-bold">42%</p>
                </div>
              </div>
              <div className="text-xs text-chart-1">+5.3%</div>
            </div>
            <div className="h-1 bg-muted-foreground/20 rounded-full overflow-hidden">
              <div className="h-1 bg-green-600 dark:bg-green-400 w-[42%] rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full mr-3">
                  <BarChart className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Revenu moyen</p>
                  <p className="text-xl font-bold">827€</p>
                </div>
              </div>
              <div className="text-xs text-chart-1">+12.7%</div>
            </div>
            <div className="h-1 bg-muted-foreground/20 rounded-full overflow-hidden">
              <div className="h-1 bg-amber-600 dark:bg-amber-400 w-[82%] rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-indigo-100 dark:bg-indigo-900/20 p-2 rounded-full mr-3">
                  <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Nouv. inscrits (30j)</p>
                  <p className="text-xl font-bold">58</p>
                </div>
              </div>
              <div className="text-xs text-chart-1">+8.4%</div>
            </div>
            <div className="h-1 bg-muted-foreground/20 rounded-full overflow-hidden">
              <div className="h-1 bg-indigo-600 dark:bg-indigo-400 w-[65%] rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Cours les plus populaires */}
      <Card className="border-border/50 mt-8">
        <CardHeader>
          <CardTitle>Cours les plus populaires</CardTitle>
          <CardDescription>Classement basé sur le nombre d'inscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
                <Book className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-medium">Introduction à l'IA</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">248 étudiants</span>
                  <span className="text-green-600 dark:text-green-400">92% taux de complétion</span>
                </div>
                <Progress value={92} className="h-1.5" />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-full">
                <Book className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-medium">Les grands modèles de langage</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">187 étudiants</span>
                  <span className="text-green-600 dark:text-green-400">78% taux de complétion</span>
                </div>
                <Progress value={78} className="h-1.5" />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-emerald-100 dark:bg-emerald-900/20 p-2 rounded-full">
                <Book className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-medium">Principes du prompt engineering</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">142 étudiants</span>
                  <span className="text-green-600 dark:text-green-400">81% taux de complétion</span>
                </div>
                <Progress value={81} className="h-1.5" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}