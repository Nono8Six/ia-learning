"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { CouponData } from "@/lib/types/admin-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Search, 
  PlusCircle, 
  MoreVertical, 
  Edit, 
  Trash, 
  Copy, 
  Tag,
  Calendar,
  Percent,
  Hash,
  Users
} from "lucide-react";

// Schéma de validation pour le formulaire de code promo
const couponFormSchema = z.object({
  code: z.string().min(3, "Le code doit contenir au moins 3 caractères"),
  discount_percent: z.number().min(1, "La réduction doit être d'au moins 1%").max(100, "La réduction ne peut pas dépasser 100%"),
  max_uses: z.number().nullable().optional(),
  valid_from: z.string(),
  valid_until: z.string().optional(),
});

type CouponFormValues = z.infer<typeof couponFormSchema>;

export function CouponManagement() {
  const { coupons, createCoupon, updateCoupon, deleteCoupon, loadCoupons, isLoading } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCoupons, setFilteredCoupons] = useState<CouponData[]>([]);
  const [isNewCouponDialogOpen, setIsNewCouponDialogOpen] = useState(false);
  const [isEditCouponDialogOpen, setIsEditCouponDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponData | null>(null);
  const [isDeleteCouponDialogOpen, setIsDeleteCouponDialogOpen] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
      discount_percent: 10,
      max_uses: null,
      valid_from: today,
      valid_until: "",
    },
  });
  
  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);
  
  // Filtrer les codes promo en fonction du terme de recherche
  useEffect(() => {
    if (!coupons) return;
    
    const filtered = coupons.filter(coupon => 
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredCoupons(filtered);
  }, [coupons, searchTerm]);
  
  // Générer un code aléatoire
  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
  
  // Gérer l'ouverture du dialogue d'ajout de code promo
  const handleOpenNewCouponDialog = () => {
    form.reset({
      code: generateRandomCode(),
      discount_percent: 10,
      max_uses: null,
      valid_from: today,
      valid_until: "",
    });
    setIsNewCouponDialogOpen(true);
  };
  
  // Gérer l'ouverture du dialogue d'édition de code promo
  const handleOpenEditCouponDialog = (coupon: CouponData) => {
    setSelectedCoupon(coupon);
    form.reset({
      code: coupon.code,
      discount_percent: coupon.discount_percent,
      max_uses: coupon.max_uses,
      valid_from: new Date(coupon.valid_from).toISOString().split('T')[0],
      valid_until: coupon.valid_until ? new Date(coupon.valid_until).toISOString().split('T')[0] : "",
    });
    setIsEditCouponDialogOpen(true);
  };
  
  // Gérer la soumission du formulaire
  const onSubmit = async (data: CouponFormValues) => {
    // Convertir les dates au format ISO
    const formattedData = {
      ...data,
      valid_from: new Date(data.valid_from).toISOString(),
      valid_until: data.valid_until ? new Date(data.valid_until).toISOString() : null,
    };
    
    if (isEditCouponDialogOpen && selectedCoupon) {
      await updateCoupon(selectedCoupon.id, formattedData);
      setIsEditCouponDialogOpen(false);
    } else {
      await createCoupon(formattedData);
      setIsNewCouponDialogOpen(false);
    }
  };
  
  // Gérer la suppression d'un code promo
  const handleDeleteCoupon = async () => {
    if (!selectedCoupon) return;
    
    await deleteCoupon(selectedCoupon.id);
    setIsDeleteCouponDialogOpen(false);
  };
  
  // Vérifier si un code promo est actif
  const isCouponActive = (coupon: CouponData): boolean => {
    const now = new Date();
    const validFrom = new Date(coupon.valid_from);
    const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;
    
    return validFrom <= now && (!validUntil || validUntil >= now);
  };
  
  // Formatage de la date
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Illimité";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Copier le code dans le presse-papier
  const copyCodeToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    
    // Afficher un toast
    // toast({
    //   title: "Code copié",
    //   description: "Le code a été copié dans le presse-papier.",
    // });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des codes promo</h2>
        <Button onClick={handleOpenNewCouponDialog}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Créer un code promo
        </Button>
      </div>
      
      <div className="flex mb-4 gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher un code promo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9" 
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-3">Chargement des codes promo...</span>
        </div>
      ) : (
        <Card className="border-border/50">
          <CardContent className="p-0">
            {filteredCoupons.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Tag className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun code promo trouvé</h3>
                <p className="text-muted-foreground mb-6">
                  Aucun code promo ne correspond à votre recherche ou aucun code n'a été créé.
                </p>
                <Button onClick={handleOpenNewCouponDialog}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Créer un nouveau code promo
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Réduction</TableHead>
                    <TableHead>Utilisations</TableHead>
                    <TableHead>Validité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCoupons.map((coupon) => (
                    <TableRow key={coupon.id} className="hover:bg-muted/40">
                      <TableCell>
                        <div className="flex items-center">
                          <span className="font-mono font-medium mr-2">{coupon.code}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-muted-foreground"
                            onClick={() => copyCodeToClipboard(coupon.code)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Percent className="h-4 w-4 text-primary mr-1.5" />
                          <span>{coupon.discount_percent}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-primary mr-1.5" />
                          <span>
                            {coupon.current_uses}/{coupon.max_uses || "∞"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-primary mr-1.5" />
                          <span>
                            {formatDate(coupon.valid_from)} - {formatDate(coupon.valid_until)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={isCouponActive(coupon) ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}>
                          {isCouponActive(coupon) ? "Actif" : "Expiré"}
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
                            <DropdownMenuItem onClick={() => handleOpenEditCouponDialog(coupon)} className="cursor-pointer">
                              <Edit className="h-4 w-4 mr-2" />
                              <span>Modifier</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyCodeToClipboard(coupon.code)} className="cursor-pointer">
                              <Copy className="h-4 w-4 mr-2" />
                              <span>Copier le code</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedCoupon(coupon);
                                setIsDeleteCouponDialogOpen(true);
                              }}
                              className="cursor-pointer text-destructive"
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              <span>Supprimer</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Dialogue d'ajout de code promo */}
      <Dialog open={isNewCouponDialogOpen} onOpenChange={setIsNewCouponDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Créer un nouveau code promo</DialogTitle>
            <DialogDescription>
              Remplissez le formulaire ci-dessous pour créer un nouveau code promo.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code promo</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="Ex: SUMMER25" {...field} className="font-mono" />
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={() => form.setValue('code', generateRandomCode())}
                      >
                        <Hash className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription>
                      Le code que les utilisateurs saisiront pour bénéficier de la réduction.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="discount_percent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pourcentage de réduction</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input 
                          type="number" 
                          min="1" 
                          max="100" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                        <span className="ml-2">%</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="max_uses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre maximum d'utilisations</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        placeholder="Laissez vide pour illimité"
                        value={field.value === null ? "" : field.value}
                        onChange={(e) => field.onChange(e.target.value === "" ? null : parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Laissez vide pour un nombre d'utilisations illimité
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="valid_from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valide à partir du</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="valid_until"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valide jusqu'au</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          placeholder="Laissez vide pour sans limite"
                          value={field.value || ""} 
                          onChange={(e) => field.onChange(e.target.value)} 
                        />
                      </FormControl>
                      <FormDescription>
                        Laissez vide pour une validité sans limite
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsNewCouponDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Créer le code promo</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Dialogue d'édition de code promo */}
      <Dialog open={isEditCouponDialogOpen} onOpenChange={setIsEditCouponDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le code promo</DialogTitle>
            <DialogDescription>
              Modifiez les informations du code promo ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code promo</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="Ex: SUMMER25" {...field} className="font-mono" />
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={() => form.setValue('code', generateRandomCode())}
                      >
                        <Hash className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormDescription>
                      Le code que les utilisateurs saisiront pour bénéficier de la réduction.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="discount_percent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pourcentage de réduction</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input 
                          type="number" 
                          min="1" 
                          max="100" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                        <span className="ml-2">%</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="max_uses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre maximum d'utilisations</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        placeholder="Laissez vide pour illimité"
                        value={field.value === null ? "" : field.value}
                        onChange={(e) => field.onChange(e.target.value === "" ? null : parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Laissez vide pour un nombre d'utilisations illimité
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="valid_from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valide à partir du</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="valid_until"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valide jusqu'au</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          placeholder="Laissez vide pour sans limite"
                          value={field.value || ""} 
                          onChange={(e) => field.onChange(e.target.value)} 
                        />
                      </FormControl>
                      <FormDescription>
                        Laissez vide pour une validité sans limite
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {selectedCoupon && (
                <div className="bg-muted/30 p-3 rounded-md text-sm">
                  <p className="font-medium mb-1">Informations supplémentaires:</p>
                  <p className="text-muted-foreground">
                    Utilisations actuelles: <span className="font-medium">{selectedCoupon.current_uses}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Créé le: <span className="font-medium">{formatDate(selectedCoupon.created_at)}</span>
                  </p>
                </div>
              )}
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditCouponDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Enregistrer les modifications</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={isDeleteCouponDialogOpen} onOpenChange={setIsDeleteCouponDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce code promo ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Si des utilisateurs utilisent actuellement ce code,
              ils ne pourront plus l'utiliser.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCoupon} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}