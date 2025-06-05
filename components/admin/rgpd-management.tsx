"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import rgpdRequests from "@/data/rgpd-requests.json";
import { 
  Shield, 
  FileText, 
  Download, 
  Trash, 
  MoreVertical, 
  CheckCircle, 
  Clock, 
  XCircle, 
  RefreshCw,
  User,
  Lock,
  Edit,
  Eye
} from "lucide-react";

export function RGPDManagement() {
  const [activeTab, setActiveTab] = useState("requests");
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [responseText, setResponseText] = useState("");

  // Données des demandes RGPD importées

  // Formatage de la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtenir la couleur du badge en fonction du statut
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return {
          color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
          icon: <Clock className="h-3.5 w-3.5 mr-1" />,
          text: "En attente"
        };
      case 'processing':
        return {
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
          icon: <RefreshCw className="h-3.5 w-3.5 mr-1" />,
          text: "En traitement"
        };
      case 'completed':
        return {
          color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
          icon: <CheckCircle className="h-3.5 w-3.5 mr-1" />,
          text: "Complété"
        };
      case 'rejected':
        return {
          color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
          icon: <XCircle className="h-3.5 w-3.5 mr-1" />,
          text: "Rejeté"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
          icon: null,
          text: status
        };
    }
  };

  // Obtenir le libellé du type de demande
  const getRequestTypeLabel = (type: string) => {
    switch(type) {
      case 'access':
        return "Accès aux données";
      case 'deletion':
        return "Suppression de données";
      case 'rectification':
        return "Rectification de données";
      default:
        return type;
    }
  };

  // Générer la réponse automatique
  const generateAutomaticResponse = (request: any) => {
    const responses = {
      access: `Cher(e) ${request.user_name},\n\nNous avons bien reçu votre demande d'accès à vos données personnelles conformément à l'article 15 du RGPD.\n\nVous trouverez en pièce jointe l'ensemble des données personnelles que nous détenons vous concernant.\n\nN'hésitez pas à nous contacter si vous avez des questions.\n\nCordialement,\nL'équipe IA Fondations`,
      deletion: `Cher(e) ${request.user_name},\n\nNous avons bien reçu votre demande de suppression de vos données personnelles conformément à l'article 17 du RGPD.\n\nNous confirmons que toutes vos données personnelles ont été supprimées de nos systèmes.\n\nCordialement,\nL'équipe IA Fondations`,
      rectification: `Cher(e) ${request.user_name},\n\nNous avons bien reçu votre demande de rectification de vos données personnelles conformément à l'article 16 du RGPD.\n\nLes modifications demandées ont été effectuées dans notre système.\n\nCordialement,\nL'équipe IA Fondations`
    };

    return responses[request.request_type as keyof typeof responses] || "";
  };

  // Gérer l'ouverture du dialogue de réponse
  const handleOpenResponseDialog = (request: any) => {
    setSelectedRequest(request);
    setResponseText(generateAutomaticResponse(request));
    setIsResponseDialogOpen(true);
  };

  // Gérer l'ouverture du dialogue d'exportation
  const handleOpenExportDialog = (request: any) => {
    setSelectedRequest(request);
    setIsExportDialogOpen(true);
  };

  // Gérer l'ouverture du dialogue de suppression
  const handleOpenDeleteDialog = (request: any) => {
    setSelectedRequest(request);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion RGPD</h2>
        <Button variant="outline" className="flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Exporter les journaux RGPD
        </Button>
      </div>
      
      <Tabs defaultValue="requests" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="requests">Demandes</TabsTrigger>
          <TabsTrigger value="compliance">Conformité</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests" className="mt-0">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Demandes d'accès RGPD</CardTitle>
              <CardDescription>
                Gérez les demandes d'accès, de rectification et de suppression des données personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Type de demande</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rgpdRequests.map((request) => (
                    <TableRow key={request.id} className="hover:bg-muted/40">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{request.user_name}</span>
                          <span className="text-sm text-muted-foreground">{request.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRequestTypeLabel(request.request_type)}
                      </TableCell>
                      <TableCell>
                        {formatDate(request.created_at)}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusBadge(request.status).color} flex items-center w-fit`}>
                          {getStatusBadge(request.status).icon}
                          {getStatusBadge(request.status).text}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleOpenResponseDialog(request)}
                              className="cursor-pointer"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              <span>Répondre</span>
                            </DropdownMenuItem>
                            {request.request_type === 'access' && (
                              <DropdownMenuItem 
                                onClick={() => handleOpenExportDialog(request)}
                                className="cursor-pointer"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                <span>Exporter les données</span>
                              </DropdownMenuItem>
                            )}
                            {request.request_type === 'deletion' && (
                              <DropdownMenuItem 
                                onClick={() => handleOpenDeleteDialog(request)}
                                className="cursor-pointer text-destructive"
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                <span>Supprimer les données</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="h-4 w-4 mr-2" />
                              <span>Voir les détails</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compliance" className="mt-0">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Tableau de bord de conformité RGPD</CardTitle>
              <CardDescription>
                Évaluez et améliorez la conformité de votre plateforme au RGPD
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-chart-1 mr-2" />
                      <span className="font-medium">Score global de conformité</span>
                    </div>
                    <span className="font-bold">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                
                <div className="space-y-4 mt-6">
                  <h3 className="font-medium text-sm">Détails par catégorie</h3>
                  
                  <div className="grid gap-4">
                    {[
                      { name: "Consentement et transparence", score: 92, icon: <CheckCircle className="h-4 w-4 text-green-600" /> },
                      { name: "Droits des utilisateurs", score: 85, icon: <User className="h-4 w-4 text-blue-600" /> },
                      { name: "Conservation des données", score: 78, icon: <Clock className="h-4 w-4 text-amber-600" /> },
                      { name: "Sécurité et confidentialité", score: 95, icon: <Lock className="h-4 w-4 text-purple-600" /> },
                      { name: "Documentation et procédures", score: 82, icon: <FileText className="h-4 w-4 text-indigo-600" /> }
                    ].map((category, index) => (
                      <div key={index} className="bg-muted/30 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            {category.icon}
                            <span className="ml-2 font-medium">{category.name}</span>
                          </div>
                          <span className="font-bold text-sm">{category.score}%</span>
                        </div>
                        <Progress value={category.score} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 dark:bg-amber-900/20 dark:border-amber-900/30">
                  <div className="flex items-start">
                    <div className="bg-amber-100 dark:bg-amber-800/50 p-2 rounded-full mr-3">
                      <RefreshCw className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-800 dark:text-amber-400 mb-1">Actions recommandées</h4>
                      <ul className="text-sm space-y-1 text-amber-700 dark:text-amber-300">
                        <li>• Mettre à jour la politique de conservation des données</li>
                        <li>• Améliorer le processus de demande de suppression</li>
                        <li>• Compléter la documentation technique sur la sécurité</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center mt-2">
                  <Button>Générer un rapport complet</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialogue de réponse */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Répondre à la demande RGPD</DialogTitle>
            <DialogDescription>
              {selectedRequest && (
                <div className="mt-2">
                  <p><strong>Utilisateur:</strong> {selectedRequest.user_name}</p>
                  <p><strong>Type:</strong> {getRequestTypeLabel(selectedRequest.request_type)}</p>
                  <p><strong>Message:</strong> {selectedRequest.message}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Votre réponse..."
              className="min-h-[200px]"
            />
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
              Annuler
            </Button>
            <div className="space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Joindre des fichiers
              </Button>
              <Button>Envoyer la réponse</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialogue d'exportation */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Exporter les données de l'utilisateur</DialogTitle>
            <DialogDescription>
              Préparation de l'export des données pour {selectedRequest?.user_name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Données à inclure:</p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" id="profile_data" className="h-4 w-4 mr-2" checked />
                  <label htmlFor="profile_data" className="text-sm">Informations de profil</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="course_progress" className="h-4 w-4 mr-2" checked />
                  <label htmlFor="course_progress" className="text-sm">Progression des cours</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="course_notes" className="h-4 w-4 mr-2" checked />
                  <label htmlFor="course_notes" className="text-sm">Notes et commentaires</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="billing_info" className="h-4 w-4 mr-2" checked />
                  <label htmlFor="billing_info" className="text-sm">Informations de facturation</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="login_history" className="h-4 w-4 mr-2" checked />
                  <label htmlFor="login_history" className="text-sm">Historique de connexion</label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Format d'export:</p>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input type="radio" id="format_json" name="format" className="h-4 w-4 mr-2" checked />
                  <label htmlFor="format_json" className="text-sm">JSON</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" id="format_csv" name="format" className="h-4 w-4 mr-2" />
                  <label htmlFor="format_csv" className="text-sm">CSV</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" id="format_pdf" name="format" className="h-4 w-4 mr-2" />
                  <label htmlFor="format_pdf" className="text-sm">PDF</label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Annuler
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Générer et télécharger
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialogue de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression des données</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de supprimer définitivement toutes les données de {selectedRequest?.user_name}.
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-red-50 p-4 rounded-md border border-red-200 dark:bg-red-900/20 dark:border-red-900/30">
              <div className="flex items-start">
                <Trash className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800 dark:text-red-400">Attention</p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    La suppression des données comprend :
                  </p>
                  <ul className="text-sm list-disc list-inside space-y-1 mt-1 text-red-700 dark:text-red-300">
                    <li>Compte utilisateur et informations de profil</li>
                    <li>Historique de progression des cours</li>
                    <li>Commentaires et contributions</li>
                    <li>Données de facturation (conformément aux obligations légales)</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Confirmation:</p>
              <div className="flex items-center">
                <input type="checkbox" id="confirm_deletion" className="h-4 w-4 mr-2" />
                <label htmlFor="confirm_deletion" className="text-sm">
                  Je confirme avoir compris que cette action est irréversible
                </label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive">
              <Trash className="h-4 w-4 mr-2" />
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}