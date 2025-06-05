"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle2,
  XCircle,
  RefreshCw,
  FileCog,
  Shield,
  Terminal,
  Loader2,
  ArrowRight,
  CheckCheck,
  Database,
  AlertTriangle
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAdmin } from "@/contexts/AdminContext";
import { AppError, logError } from "@/error";

export function ConnectionTroubleshooter() {
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [results, setResults] = useState<Record<string, any> | null>(null);
  const [supabaseUrl, setSupabaseUrl] = useState(process.env.NEXT_PUBLIC_SUPABASE_URL || '');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const { loadCourses, loadUsers, loadCoupons } = useAdmin();

  const runConnectionTests = async () => {
    setIsRunningTest(true);
    setResults(null);
    
    const testResults = {
      online: false,
      dns: false,
      firewall: false,
      cors: false,
      auth: false,
      database: false,
      tables: false,
      rls: false,
      details: {} as Record<string, any>
    };
    
    try {
      // Test 1: Online check
      testResults.online = navigator.onLine;
      
      if (!testResults.online) {
        throw new Error("Votre appareil est hors ligne. Vérifiez votre connexion Internet.");
      }
      
      // Test 2: DNS resolution (basic fetch to the domain)
      try {
        const domainUrl = new URL(supabaseUrl).origin;
        const dnsCheck = await fetch(`${domainUrl}/robots.txt`, { 
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache'
        });
        testResults.dns = true;
        } catch (error: any) {
        testResults.details.dns = error;
        console.warn('DNS resolution test failed:', error);
      }
      
      // Test 3: Basic Supabase API access
      try {
        const apiCheck = await fetch(`${supabaseUrl}/rest/v1/`, { 
          method: 'HEAD',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || supabaseKey,
            'Content-Type': 'application/json'
          }
        });
        
        testResults.cors = apiCheck.ok;
        testResults.details.apiStatus = apiCheck.status;
        } catch (error: any) {
        testResults.details.api = error;
        console.warn('API access test failed:', error);
      }
      
      // Test 4: Auth service check
      try {
        const { data: authData, error: authError } = await supabase.auth.getSession();
        testResults.auth = !authError;
        testResults.details.authData = authError ? authError : { success: true };
        } catch (error: any) {
        testResults.details.auth = error;
        console.warn('Auth service test failed:', error);
      }
      
      // Test 5: Database query check
      try {
        const { data: dbData, error: dbError } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        testResults.database = !dbError;
        testResults.details.databaseData = dbError ? dbError : { success: true };
        
        // Check if specific tables exist
        if (!dbError) {
          const tables = ['profiles', 'courses', 'modules', 'coupons', 'user_roles'];
          const tableResults: Record<string, boolean> = {};
          
          for (const table of tables) {
            try {
              const { data, error } = await supabase.from(table).select('count', { count: 'exact', head: true });
              tableResults[table] = !error;
            } catch (tableError) {
              tableResults[table] = false;
            }
          }
          
          testResults.tables = Object.values(tableResults).some(result => result === true);
          testResults.details.tables = tableResults;
        }
        } catch (error: any) {
        testResults.details.database = error;
        console.warn('Database query test failed:', error);
      }
      
      // Test 6: RLS policy check (try to access data that should be protected)
      try {
        // Try to access all profiles which should fail if RLS is working
        const { data: rlsData, error: rlsError } = await supabase.from('profiles').select('*');
        
        // If the user is admin, this might succeed, so check the session
        const { data: { session } } = await supabase.auth.getSession();
        
        // If we have a session and got data, RLS might be working correctly
        if (session && rlsData && rlsData.length > 0) {
          testResults.rls = true;
        } 
        // If we have no session but got data, RLS is not working
        else if (!session && rlsData && rlsData.length > 0) {
          testResults.rls = false;
        } 
        // If we got an error, RLS is probably working
        else if (rlsError) {
          testResults.rls = true;
        }
        
        testResults.details.rls = { error: rlsError, hasData: rlsData && rlsData.length > 0 };
      } catch (error: any) {
        testResults.details.rls = error;
        console.warn('RLS policy test failed:', error);
      }
      
    } catch (error: any) {
      const appError = error instanceof AppError ? error : new AppError(error.message || 'Tests échoués');
      logError(appError);
      testResults.details.main = appError;
    } finally {
      setResults(testResults);
      setIsRunningTest(false);
    }
  };

  const reloadAllData = async () => {
    setIsRunningTest(true);
    
    try {
      await Promise.all([
        loadCourses(),
        loadUsers(),
        loadCoupons()
      ]);
      
      setResults(prev => ({
        ...prev,
        reloadSuccess: true
      }));
    } catch (error: any) {
      const appError = error instanceof AppError ? error : new AppError(error.message || 'Erreur inconnue');
      logError(appError);
      setResults(prev => ({
        ...prev,
        reloadSuccess: false,
        reloadError: appError
      }));
    } finally {
      setIsRunningTest(false);
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Terminal className="h-5 w-5 text-primary mr-2" />
          Assistant de dépannage de connexion
        </CardTitle>
        <CardDescription>
          Diagnostiquez et résolvez les problèmes de connexion à Supabase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="default" className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/30">
          <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-700 dark:text-blue-400">À propos de l'outil de dépannage</AlertTitle>
          <AlertDescription className="text-blue-600 dark:text-blue-300">
            Cet outil effectue une série de tests pour identifier précisément pourquoi la connexion à Supabase échoue.
            Suivez les instructions pour résoudre les problèmes identifiés.
          </AlertDescription>
        </Alert>
        
        <div className="p-4 border border-border/50 rounded-md bg-muted/20">
          <h3 className="font-medium mb-3">1. Vérification de la configuration Supabase</h3>
          
          <div className="space-y-4 mb-4">
            <div>
              <Label htmlFor="supabase-url">URL Supabase</Label>
              <div className="flex mt-1">
                <Input 
                  id="supabase-url" 
                  value={supabaseUrl} 
                  onChange={(e) => setSupabaseUrl(e.target.value)} 
                  placeholder="https://votre-projet.supabase.co"
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  className="ml-2"
                  onClick={() => setShowKeyInput(!showKeyInput)}
                >
                  {showKeyInput ? "Cacher la clé" : "Modifier la clé"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Vous pouvez trouver cette URL dans les paramètres de votre projet Supabase
              </p>
            </div>
            
            {showKeyInput && (
              <div>
                <Label htmlFor="supabase-key">Clé anon Supabase</Label>
                <Input 
                  id="supabase-key" 
                  value={supabaseKey} 
                  onChange={(e) => setSupabaseKey(e.target.value)} 
                  placeholder="eyJ0eXAiOiJKV1QiLC..."
                  type="password"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  La clé anonyme (anon public) se trouve dans Project Settings &gt; API
                </p>
              </div>
            )}
          </div>
          
          <Button 
            onClick={runConnectionTests} 
            disabled={isRunningTest}
            className="w-full"
          >
            {isRunningTest ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exécution des tests...
              </>
            ) : (
              <>
                <Terminal className="mr-2 h-4 w-4" />
                Lancer les tests de connexion
              </>
            )}
          </Button>
        </div>
        
        {results && (
          <div className="space-y-4">
            <h3 className="font-medium">Résultats des tests</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              <div className={`p-3 border rounded-md flex items-center ${results.online ? 'border-green-200 bg-green-50 dark:bg-green-900/10' : 'border-red-200 bg-red-50 dark:bg-red-900/10'}`}>
                {results.online ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600 mr-2" />
                )}
                <span className={results.online ? 'text-green-700' : 'text-red-700'}>Connexion Internet</span>
              </div>
              
              <div className={`p-3 border rounded-md flex items-center ${results.dns ? 'border-green-200 bg-green-50 dark:bg-green-900/10' : 'border-red-200 bg-red-50 dark:bg-red-900/10'}`}>
                {results.dns ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600 mr-2" />
                )}
                <span className={results.dns ? 'text-green-700' : 'text-red-700'}>Résolution DNS</span>
              </div>
              
              <div className={`p-3 border rounded-md flex items-center ${results.cors ? 'border-green-200 bg-green-50 dark:bg-green-900/10' : 'border-amber-200 bg-amber-50 dark:bg-amber-900/10'}`}>
                {results.cors ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 text-amber-600 mr-2" />
                )}
                <span className={results.cors ? 'text-green-700' : 'text-amber-700'}>Accès API</span>
              </div>
              
              <div className={`p-3 border rounded-md flex items-center ${results.auth ? 'border-green-200 bg-green-50 dark:bg-green-900/10' : 'border-amber-200 bg-amber-50 dark:bg-amber-900/10'}`}>
                {results.auth ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 text-amber-600 mr-2" />
                )}
                <span className={results.auth ? 'text-green-700' : 'text-amber-700'}>Authentification</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className={`p-3 border rounded-md flex items-center ${results.database ? 'border-green-200 bg-green-50 dark:bg-green-900/10' : 'border-red-200 bg-red-50 dark:bg-red-900/10'}`}>
                {results.database ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600 mr-2" />
                )}
                <span className={results.database ? 'text-green-700' : 'text-red-700'}>Connexion Base de Données</span>
              </div>
              
              <div className={`p-3 border rounded-md flex items-center ${results.tables ? 'border-green-200 bg-green-50 dark:bg-green-900/10' : 'border-amber-200 bg-amber-50 dark:bg-amber-900/10'}`}>
                {results.tables ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 text-amber-600 mr-2" />
                )}
                <span className={results.tables ? 'text-green-700' : 'text-amber-700'}>Tables requises</span>
              </div>
            </div>
            
            {/* Diagnostic et recommandations */}
            <div className="mt-6">
              <h3 className="font-medium mb-3">Diagnostic</h3>
              
              {!results.online && (
                <Alert variant="destructive" className="mb-3">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Problème de connexion Internet</AlertTitle>
                  <AlertDescription>
                    Votre appareil n'est pas connecté à Internet. Vérifiez votre connexion réseau.
                  </AlertDescription>
                </Alert>
              )}
              
              {results.online && !results.dns && (
                <Alert variant="destructive" className="mb-3">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Problème de résolution DNS</AlertTitle>
                  <AlertDescription>
                    Impossible d'accéder au domaine Supabase. Vérifiez l'URL du projet ou votre réseau.
                  </AlertDescription>
                </Alert>
              )}
              
              {results.dns && !results.cors && (
                <Alert variant="warning" className="mb-3">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Problème d'accès à l'API Supabase</AlertTitle>
                  <AlertDescription>
                    Le domaine est accessible, mais l'API Supabase renvoie une erreur. Vérifiez que l'URL du projet est correcte.
                  </AlertDescription>
                </Alert>
              )}
              
              {results.cors && !results.auth && (
                <Alert variant="warning" className="mb-3">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Problème d'authentification</AlertTitle>
                  <AlertDescription>
                    L'API est accessible, mais il y a un problème avec l'authentification. Vérifiez votre clé API anonyme.
                  </AlertDescription>
                </Alert>
              )}
              
              {results.auth && !results.database && (
                <Alert variant="destructive" className="mb-3">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Problème de base de données</AlertTitle>
                  <AlertDescription>
                    L'authentification fonctionne, mais impossible de se connecter à la base de données. Le service PostgreSQL pourrait être indisponible.
                  </AlertDescription>
                </Alert>
              )}
              
              {results.database && !results.tables && (
                <Alert variant="warning" className="mb-3">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Schéma de base de données incomplet</AlertTitle>
                  <AlertDescription>
                    Connexion à la base de données réussie, mais certaines tables requises sont manquantes. Exécutez les migrations nécessaires.
                  </AlertDescription>
                </Alert>
              )}
              
              {results.online && results.dns && results.cors && results.auth && results.database && results.tables && (
                <Alert className="bg-green-50 border-green-200 mb-3 dark:bg-green-900/20 dark:border-green-900/30">
                  <CheckCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle className="text-green-700 dark:text-green-400">Tous les tests ont réussi!</AlertTitle>
                  <AlertDescription className="text-green-600 dark:text-green-300">
                    La connexion à Supabase fonctionne correctement. Si vous rencontrez encore des problèmes, essayez de recharger les données.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Actions recommandées */}
              <div className="space-y-3 mt-6">
                <h4 className="text-sm font-medium">Actions recommandées:</h4>
                
                {!results.online && (
                  <div className="ml-2 flex">
                    <ArrowRight className="h-4 w-4 mr-2 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Vérifiez votre connexion Internet et réessayez</span>
                  </div>
                )}
                
                {results.online && !results.dns && (
                  <div className="ml-2 flex">
                    <ArrowRight className="h-4 w-4 mr-2 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Vérifiez que l'URL Supabase est correcte: {supabaseUrl}</span>
                  </div>
                )}
                
                {results.dns && !results.cors && (
                  <div className="ml-2 flex">
                    <ArrowRight className="h-4 w-4 mr-2 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Assurez-vous que votre projet Supabase est actif et accessible</span>
                  </div>
                )}
                
                {(results.cors && !results.auth) || (results.auth && !results.database) && (
                  <div className="ml-2 flex">
                    <ArrowRight className="h-4 w-4 mr-2 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Vérifiez votre clé API anonyme dans le fichier <code>.env.local</code></span>
                  </div>
                )}
                
                {results.database && !results.tables && (
                  <div className="ml-2 flex">
                    <ArrowRight className="h-4 w-4 mr-2 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">Exécutez les migrations SQL pour créer les tables requises</span>
                  </div>
                )}
                
                {results.online && (
                  <>
                    <div className="ml-2 flex">
                      <ArrowRight className="h-4 w-4 mr-2 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Essayez d'actualiser la page complètement (Ctrl+F5 ou Cmd+Shift+R)</span>
                    </div>
                    
                    <div className="ml-2 flex">
                      <ArrowRight className="h-4 w-4 mr-2 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">Vérifiez la console du navigateur pour des erreurs plus détaillées</span>
                    </div>
                  </>
                )}
                
                {results.online && results.dns && results.cors && results.auth && results.database && results.tables && (
                  <Button onClick={reloadAllData} disabled={isRunningTest} className="mt-2 w-full">
                    {isRunningTest ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Rechargement...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Recharger toutes les données
                      </>
                    )}
                  </Button>
                )}
              </div>
              
              {/* Configuration file suggestions */}
              {(!results.auth || !results.database) && (
                <div className="mt-6 p-4 border rounded-md bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/30">
                  <div className="flex">
                    <FileCog className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-700 dark:text-blue-300">Configuration recommandée</h4>
                      <p className="text-sm text-blue-600 dark:text-blue-300 mt-1 mb-3">
                        Créez un fichier <code>.env.local</code> à la racine du projet avec le contenu suivant:
                      </p>
                      
                      <pre className="p-3 bg-blue-100 rounded-md overflow-x-auto text-xs text-blue-800 dark:bg-blue-800/40 dark:text-blue-200">
                        NEXT_PUBLIC_SUPABASE_URL={supabaseUrl || 'https://votre-projet.supabase.co'}<br/>
                        NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anonyme
                      </pre>
                      
                      <p className="text-sm text-blue-600 dark:text-blue-300 mt-2">
                        Vous pouvez trouver ces valeurs dans les paramètres de votre projet Supabase sous "Project Settings" &gt; "API".
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Security notice */}
              {(showKeyInput && supabaseKey) && (
                <div className="mt-4 p-4 border rounded-md bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/30">
                  <div className="flex">
                    <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2 shrink-0" />
                    <div>
                      <h4 className="font-medium text-amber-700 dark:text-amber-300">Rappel de sécurité</h4>
                      <p className="text-sm text-amber-600 dark:text-amber-300 mt-1">
                        N'utilisez jamais votre clé <strong>service_role</strong> dans une application front-end. 
                        Utilisez uniquement la clé <strong>anon</strong> (public) et configurez correctement les politiques RLS.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Technical Details (collapsible) */}
            <details className="mt-4">
              <summary className="cursor-pointer font-medium text-sm">
                Détails techniques avancés
              </summary>
              <div className="mt-2 p-3 bg-muted/40 rounded-md text-xs font-mono overflow-x-auto">
                <pre>{JSON.stringify(results.details, null, 2)}</pre>
              </div>
            </details>
          </div>
        )}
      </CardContent>
    </Card>
  );
}