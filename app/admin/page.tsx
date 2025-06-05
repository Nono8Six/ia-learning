"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserManagement } from "@/components/admin/user-management";
import { CourseManagement } from "@/components/admin/course-management";
import { CouponManagement } from "@/components/admin/coupon-management";
import { RGPDManagement } from "@/components/admin/rgpd-management";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminTab } from "@/lib/types/admin-types";
import { useAdmin } from "@/contexts/AdminContext";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const { isAdmin, isLoading, error, offlineMode } = useAdmin();
  const router = useRouter();
  const [retryCount, setRetryCount] = useState(0);

  // Rediriger si l'utilisateur n'est pas un administrateur
  useEffect(() => {
    if (!isLoading && !isAdmin && !error) {
      router.push('/dashboard');
    }
  }, [isAdmin, isLoading, router, error]);

  // Afficher un chargement pendant la vérification des droits d'admin
  if (isLoading) {
    return (
      <div className="pt-32 pb-16 flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <CardTitle className="mb-2">Vérification des accès</CardTitle>
            <CardDescription>
              Nous vérifions vos droits d'administration...
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si une erreur de connexion s'est produite
  if (error) {
    return (
      <div className="pt-32 pb-16 flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Problème de connexion</CardTitle>
            <CardDescription>
              Impossible de vérifier vos droits d'administration
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error.message}
              </AlertDescription>
            </Alert>
            <div className="flex flex-col space-y-3">
              <Button 
                onClick={() => setRetryCount(prev => prev + 1)}
                className="w-full flex items-center justify-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => router.push('/dashboard')}
              >
                Retour au tableau de bord
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si l'utilisateur n'est pas administrateur
  if (!isAdmin) {
    return (
      <div className="pt-32 pb-16 flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {offlineMode
                  ? "L'interface d'administration est indisponible hors ligne."
                  : "Vous n'avez pas les droits d'accès à cette page."}
              </AlertDescription>
            </Alert>
            <Button className="w-full" onClick={() => router.push('/dashboard')}>
              Retour au tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <main className="pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Administration</h1>
        </div>
        
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={(value) => setActiveTab(value as AdminTab)} className="space-y-8">
          <TabsList className="grid grid-cols-5 w-full max-w-3xl">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="courses">Cours</TabsTrigger>
            <TabsTrigger value="coupons">Coupons</TabsTrigger>
            <TabsTrigger value="rgpd">RGPD</TabsTrigger>
          </TabsList>
          
          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-0">
            <AdminDashboard />
          </TabsContent>
          
          {/* Users Tab */}
          <TabsContent value="users" className="mt-0">
            <UserManagement />
          </TabsContent>
          
          {/* Courses Tab */}
          <TabsContent value="courses" className="mt-0">
            <CourseManagement />
          </TabsContent>
          
          {/* Coupons Tab */}
          <TabsContent value="coupons" className="mt-0">
            <CouponManagement />
          </TabsContent>
          
          {/* RGPD Tab */}
          <TabsContent value="rgpd" className="mt-0">
            <RGPDManagement />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}