"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { AdminUser, UserRole } from "@/lib/types/admin-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash,
  Mail,
  UserPlus,
  Download,
  CheckCircle,
  XCircle,
  Calendar,
  User as UserIcon,
  UserCog,
  Shield
} from "lucide-react";

export function UserManagement() {
  const { users, loadUsers, updateUserRole, isLoading } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<UserRole>('student');

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Filtrer les utilisateurs en fonction du terme de recherche
  useEffect(() => {
    if (!users) return;
    
    const filtered = users.filter(user => 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  // Formatage de la date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Obtenir les initiales du nom
  const getInitials = (name: string | undefined): string => {
    if (!name) return "?";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Gérer l'ouverture de la boîte de dialogue d'édition
  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setNewRole(user.role || 'student');
    setIsEditDialogOpen(true);
  };

  // Mettre à jour le rôle de l'utilisateur
  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    
    await updateUserRole(selectedUser.id, newRole);
    setIsEditDialogOpen(false);
  };

  // Obtenir la couleur du badge en fonction du rôle
  const getRoleBadgeColor = (role: string): string => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'instructor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'student':
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter un utilisateur
        </Button>
      </div>
      
      <div className="flex mb-4 gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher un utilisateur..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-9" 
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>
      
      <Card className="border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Inscription</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                      <span className="ml-3">Chargement des utilisateurs...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={user.avatar_url || ""} alt={user.full_name || ""} />
                          <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.full_name || "Sans nom"}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getRoleBadgeColor(user.role)}`}>
                        {user.role === 'admin' && 'Administrateur'}
                        {user.role === 'instructor' && 'Formateur'}
                        {user.role === 'student' && 'Étudiant'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Progress value={user.progress || 0} className="h-2 w-32 mr-2" />
                        <span className="text-sm">{user.progress || 0}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {user.completed_modules || 0}/{user.total_modules || 0} modules
                      </p>
                    </TableCell>
                    <TableCell>
                      {formatDate(user.created_at)}
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
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" />
                            <span>Voir le profil</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditUser(user)} className="cursor-pointer">
                            <UserCog className="h-4 w-4 mr-2" />
                            <span>Modifier le rôle</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Mail className="h-4 w-4 mr-2" />
                            <span>Envoyer un email</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-destructive">
                            <Trash className="h-4 w-4 mr-2" />
                            <span>Supprimer</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Boîte de dialogue d'édition du rôle */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le rôle utilisateur</DialogTitle>
            <DialogDescription>
              Changez le rôle de l'utilisateur pour modifier ses permissions sur la plateforme.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={selectedUser.avatar_url || ""} alt={selectedUser.full_name || ""} />
                  <AvatarFallback>{getInitials(selectedUser.full_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedUser.full_name || "Sans nom"}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Rôle actuel:</p>
                <Badge className={`${getRoleBadgeColor(selectedUser.role)}`}>
                  {selectedUser.role === 'admin' && 'Administrateur'}
                  {selectedUser.role === 'instructor' && 'Formateur'}
                  {selectedUser.role === 'student' && 'Étudiant'}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Nouveau rôle:</label>
                <Select value={newRole} onValueChange={(value: UserRole) => setNewRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-red-600" />
                        <span>Administrateur</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="instructor">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-2 text-blue-600" />
                        <span>Formateur</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="student">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-2 text-green-600" />
                        <span>Étudiant</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleUpdateRole}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}