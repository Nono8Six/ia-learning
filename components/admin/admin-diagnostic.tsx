"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Database, Server, Network } from 'lucide-react';

export function AdminDiagnostic() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{
    connection: boolean;
    authentication: boolean;
    database: boolean;
    rpcFunctions: {
      get_user_stats: boolean;
      get_course_stats: boolean;
      is_admin: boolean;
    };
    tables: {
      profiles: boolean;
      courses: boolean;
      modules: boolean;
      user_activities: boolean;
      ab_experiments: boolean;
      variants: boolean;
    };
  }>({
    connection: false,
    authentication: false,
    database: false,
    rpcFunctions: {
      get_user_stats: false,
      get_course_stats: false,
      is_admin: false
    },
    tables: {
      profiles: false,
      courses: false,
      modules: false,
      user_activities: false,
      ab_experiments: false,
      variants: false
    }
  });
  
  const [steps, setSteps] = useState<{
    id: string;
    description: string;
    status: 'waiting' | 'running' | 'success' | 'error';
    errorMessage?: string;
  }[]>([
    { id: 'connection', description: 'Vérification de la connexion à Supabase', status: 'waiting' },
    { id: 'authentication', description: 'Vérification de l\'authentification', status: 'waiting' },
    { id: 'database', description: 'Vérification de l\'accès à la base de données', status: 'waiting' },
    { id: 'tables', description: 'Vérification des tables requises', status: 'waiting' },
    { id: 'functions', description: 'Vérification des fonctions RPC', status: 'waiting' }
  ]);

  const runDiagnostic = async () => {
    setIsRunning(true);
    const newResults = { ...results };
    const newSteps = [...steps];
    
    // Reset steps
    newSteps.forEach(step => {
      step.status = 'waiting';
      delete step.errorMessage;
    });
    
    // Step 1: Test connection
    updateStepStatus('connection', 'running');
    try {
      const { data, error } = await supabase.from('_rpc').select('version()');
      if (error) throw error;
      newResults.connection = true;
      updateStepStatus('connection', 'success');
    } catch (error: any) {
      newResults.connection = false;
      updateStepStatus('connection', 'error', error.message || 'Erreur de connexion à Supabase');
    }
    
    // Step 2: Test authentication
    updateStepStatus('authentication', 'running');
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      newResults.authentication = true;
      updateStepStatus('authentication', 'success');
    } catch (error: any) {
      newResults.authentication = false;
      updateStepStatus('authentication', 'error', error.message || 'Erreur d\'authentification');
    }
    
    // Step 3: Test database access
    updateStepStatus('database', 'running');
    try {
      const { data, error } = await supabase.from('profiles').select('count()', { count: 'exact' });
      if (error) throw error;
      newResults.database = true;
      updateStepStatus('database', 'success');
    } catch (error: any) {
      newResults.database = false;
      updateStepStatus('database', 'error', error.message || 'Erreur d\'accès à la base de données');
    }
    
    // Step 4: Test required tables
    updateStepStatus('tables', 'running');
    let tableErrors = [];
    
    // Test each table
    for (const table of ['profiles', 'courses', 'modules', 'user_activities', 'ab_experiments', 'variants']) {
      try {
        const { error } = await supabase.from(table).select('count()', { count: 'exact' }).limit(0);
        newResults.tables[table as keyof typeof newResults.tables] = !error;
        if (error) tableErrors.push(`Table '${table}': ${error.message}`);
      } catch (error: any) {
        newResults.tables[table as keyof typeof newResults.tables] = false;
        tableErrors.push(`Table '${table}': ${error.message}`);
      }
    }
    
    if (tableErrors.length === 0) {
      updateStepStatus('tables', 'success');
    } else {
      updateStepStatus('tables', 'error', tableErrors.join('; '));
    }
    
    // Step 5: Test RPC functions
    updateStepStatus('functions', 'running');
    let functionErrors = [];
    
    // Test each function
    for (const func of ['get_user_stats', 'get_course_stats', 'is_admin']) {
      try {
        const { error } = await supabase.rpc(func);
        newResults.rpcFunctions[func as keyof typeof newResults.rpcFunctions] = !error;
        if (error) functionErrors.push(`Fonction '${func}': ${error.message}`);
      } catch (error: any) {
        newResults.rpcFunctions[func as keyof typeof newResults.rpcFunctions] = false;
        functionErrors.push(`Fonction '${func}': ${error.message}`);
      }
    }
    
    if (functionErrors.length === 0) {
      updateStepStatus('functions', 'success');
    } else {
      updateStepStatus('functions', 'error', functionErrors.join('; '));
    }
    
    setResults(newResults);
    setIsRunning(false);
  };
  
  const updateStepStatus = (id: string, status: 'waiting' | 'running' | 'success' | 'error', errorMessage?: string) => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === id 
          ? { ...step, status, errorMessage } 
          : step
      )
    );
  };
  
  useEffect(() => {
    // Run diagnostic on component mount
    runDiagnostic();
  }, []);

  return (
    <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          Diagnostic de connexion Supabase
        </CardTitle>
        <CardDescription>
          Cet outil vérifie la configuration de Supabase et identifie les problèmes potentiels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Étapes du diagnostic */}
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-start gap-3">
                {step.status === 'waiting' && <Badge variant="outline\" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">...</Badge>}
                {step.status === 'running' && <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />}
                {step.status === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                {step.status === 'error' && <XCircle className="h-5 w-5 text-red-600" />}
                
                <div className="space-y-1 flex-1">
                  <div className="font-medium">{step.description}</div>
                  {step.status === 'error' && (
                    <div className="text-sm text-red-600">{step.errorMessage}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          {/* Résumé et solution */}
          <div className="space-y-4">
            <h3 className="font-semibold">Résumé du diagnostic</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2 p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Connexion</span>
                </div>
                <Badge variant={results.connection ? "success" : "destructive"} className="self-start">
                  {results.connection ? 'Connecté' : 'Erreur'}
                </Badge>
              </div>
              
              <div className="flex flex-col gap-2 p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Base de données</span>
                </div>
                <Badge variant={results.database ? "success" : "destructive"} className="self-start">
                  {results.database ? 'Accessible' : 'Erreur'}
                </Badge>
              </div>
              
              <div className="flex flex-col gap-2 p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Fonctions RPC</span>
                </div>
                <Badge 
                  variant={
                    Object.values(results.rpcFunctions).every(v => v) 
                      ? "success" 
                      : Object.values(results.rpcFunctions).some(v => v) 
                        ? "warning" 
                        : "destructive"
                  } 
                  className="self-start"
                >
                  {Object.values(results.rpcFunctions).filter(v => v).length}/{Object.keys(results.rpcFunctions).length} disponibles
                </Badge>
              </div>
            </div>
            
            <Alert variant={
              Object.values(results.tables).some(v => !v) || 
              Object.values(results.rpcFunctions).some(v => !v) 
                ? "warning" 
                : "default"
            }>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="font-medium">
                {Object.values(results.tables).some(v => !v) || 
                 Object.values(results.rpcFunctions).some(v => !v) ? (
                  "Des tables ou fonctions sont manquantes dans la base de données. Veuillez exécuter les migrations SQL."
                ) : (
                  "Tout est correctement configuré."
                )}
              </AlertDescription>
            </Alert>
            
            {(Object.values(results.tables).some(v => !v) || 
              Object.values(results.rpcFunctions).some(v => !v)) && (
              <div className="text-sm space-y-2">
                <p>Ouvrez l'éditeur SQL de Supabase et exécutez le script de migration pour créer les tables et fonctions manquantes:</p>
                <p className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto whitespace-pre">
                  {/* Instructions pour exécuter le script de migration */}
                  {`1. Allez dans le SQL Editor de votre projet Supabase\n2. Créez une nouvelle requête\n3. Exécutez le script de migration "20250604050552_pink_jungle.sql"`}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={runDiagnostic} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Diagnostic en cours...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Relancer le diagnostic
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}