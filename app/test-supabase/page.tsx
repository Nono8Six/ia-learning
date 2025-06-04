"use client";

import { useEffect, useState } from "react";
import { testSupabaseConnection, connectionStatus, SupabaseErrorType, checkConnection } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Shield,
  WifiOff,
  Database,
  Server,
  Zap,
  Lock
} from "lucide-react";
import Link from "next/link";
import { ConnectionTroubleshooter } from "@/components/admin/connection-troubleshooter";
import { AdminDiagnostic } from "@/components/admin/admin-diagnostic";

export default function TestSupabasePage() {
  const [connectionResult, setConnectionResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  
  useEffect(() => {
    async function testConnection() {
      setIsLoading(true);
      
      try {
        // Check basic internet connectivity first
        if (!navigator.onLine) {
          throw new Error("Vous êtes hors ligne. Veuillez vérifier votre connexion Internet.");
        }
        
        // Run comprehensive connection test
        const result = await testSupabaseConnection();
        setConnectionResult(result);
      } catch (error: any) {
        console.error("Supabase connection error:", error);
        setConnectionResult({
          success: false,
          message: error.message || "Erreur de connexion à Supabase",
          error,
          diagnostics: {
            connectionStatus
          }
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    testConnection();
  }, [retryCount]);
  
  const handleRetry = () => {
    setIsLoading(true);
    setConnectionResult(null);
    setRetryCount(prev => prev + 1);
  };

  // Helper to get the correct icon for the connection error
  const getErrorIcon = () => {
    if (!connectionResult || !connectionResult.error) {
      return <AlertTriangle className="h-5 w-5" />;
    }
    
    const errorType = connectionStatus.lastError?.type;
    
    switch(errorType) {
      case SupabaseErrorType.NETWORK_ERROR:
        return <WifiOff className="h-5 w-5" />;
      case SupabaseErrorType.AUTH_ERROR:
        return <Lock className="h-5 w-5" />;
      case SupabaseErrorType.SERVER_ERROR:
        return <Server className="h-5 w-5" />;
      case SupabaseErrorType.DATABASE_ERROR:
        return <Database className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center py-12">
      <div className="w-full max-w-4xl space-y-8">
        <Card className="w-full shadow-lg border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Database className="h-6 w-6 mr-2 text-primary" />
              Diagnostic de connexion Supabase
            </CardTitle>
            <CardDescription>
              Outil avancé pour tester et dépanner votre connexion à Supabase
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Afficher le composant de diagnostic complet */}
            <AdminDiagnostic />
            
            {/* Afficher le dépanneur avancé */}
            <ConnectionTroubleshooter />
            
            {isLoading ? (
              <div className="flex items-center justify-center p-6">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="ml-4">Analyse complète de la connexion en cours...</p>
              </div>
            ) : connectionResult && connectionResult.success ? (
              <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/30">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-700 dark:text-green-400">Connexion réussie</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-400">
                  La connexion à Supabase fonctionne correctement ! Vous pouvez maintenant utiliser toutes les fonctionnalités de l'application.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <Alert variant="destructive">
                  {getErrorIcon()}
                  <AlertTitle>Erreur de connexion</AlertTitle>
                  <AlertDescription>
                    {connectionResult?.message || "Impossible de se connecter à Supabase. Vérifiez vos identifiants et votre connexion."}
                  </AlertDescription>
                </Alert>
                
                <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/30">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <AlertTitle className="text-amber-700 dark:text-amber-400">Utilisation en mode hors ligne</AlertTitle>
                  <AlertDescription className="text-amber-700 dark:text-amber-300">
                    L'application utilisera des données fictives pour vous permettre de tester les fonctionnalités.
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Toutes les données et modifications seront temporaires</li>
                      <li>Les fonctionnalités administratives seront limitées</li>
                      <li>Utilisez les outils de diagnostic ci-dessus pour résoudre le problème</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </>
            )}
            
            <div className="flex justify-center space-x-4">
              <Button onClick={handleRetry} className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tester à nouveau
              </Button>
              
              <Button variant="outline" asChild>
                <Link href="/dashboard" className="flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Continuer en mode {connectionResult?.success ? "connecté" : "hors ligne"}
                </Link>
              </Button>
            </div>
            
            {/* Informations de configuration */}
            <div className="pt-4 border-t border-border/30">
              <h3 className="text-lg font-medium mb-3">Vérifiez votre configuration</h3>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Pour une connexion correcte à Supabase, assurez-vous que :</p>
                
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Vous avez créé un fichier <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> à la racine du projet</li>
                  <li>Le fichier contient les variables <code className="bg-muted px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code> et <code className="bg-muted px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
                  <li>Vous avez exécuté les migrations SQL nécessaires dans votre projet Supabase</li>
                  <li>Votre navigateur n'a pas de problèmes de CORS ou de blocage de requêtes</li>
                </ol>
                
                <p className="mt-2">
                  <Shield className="inline-block h-4 w-4 mr-1 text-amber-500" />
                  <span className="text-amber-600 dark:text-amber-400">Important :</span> N'utilisez jamais la clé <code className="bg-muted px-1 py-0.5 rounded">service_role</code> dans le navigateur, uniquement la clé <code className="bg-muted px-1 py-0.5 rounded">anon</code>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-card p-6 rounded-lg border border-border/50">
          <h2 className="text-lg font-medium mb-4">Pages d'authentification disponibles :</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button asChild variant="outline">
              <Link href="/auth/signin">Connexion</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/auth/signup">Inscription</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/auth/forgot-password">Mot de passe oublié</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}