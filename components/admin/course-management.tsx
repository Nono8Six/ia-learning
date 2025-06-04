"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { CourseData, ModuleData } from "@/lib/types/admin-types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Filter,
  PlusCircle,
  MoreVertical,
  Eye,
  Edit,
  Trash,
  Users,
  Clock,
  Book,
  FileText,
  CheckCircle,
  XCircle,
  ChevronUp,
  ChevronDown,
  LayoutGrid,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Schéma de validation pour le formulaire de cours
const courseFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  phase: z.string().min(1, "La phase est requise"),
  duration: z.string().min(1, "La durée est requise"),
  status: z.enum(["published", "draft"]),
  order_index: z.number().int().positive(),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

// Schéma de validation pour le formulaire de module
const moduleFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  duration: z.string().optional(),
  order_index: z.number().int().positive(),
  content: z.string().optional(),
});

type ModuleFormValues = z.infer<typeof moduleFormSchema>;

export function CourseManagement() {
  const { courses, loadCourses, createCourse, updateCourse, deleteCourse, loadModules, modules, createModule, updateModule, deleteModule, isLoading } = useAdmin();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<CourseData[]>([]);
  const [isNewCourseDialogOpen, setIsNewCourseDialogOpen] = useState(false);
  const [isEditCourseDialogOpen, setIsEditCourseDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [courseModules, setCourseModules] = useState<ModuleData[]>([]);
  const [isNewModuleDialogOpen, setIsNewModuleDialogOpen] = useState(false);
  const [isEditModuleDialogOpen, setIsEditModuleDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ModuleData | null>(null);
  const [isDeleteCourseDialogOpen, setIsDeleteCourseDialogOpen] = useState(false);
  const [isDeleteModuleDialogOpen, setIsDeleteModuleDialogOpen] = useState(false);
  
  // Formulaire pour les cours
  const courseForm = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      phase: "",
      duration: "",
      status: "draft",
      order_index: 1,
    },
  });
  
  // Formulaire pour les modules
  const moduleForm = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleFormSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: "",
      order_index: 1,
      content: "",
    },
  });
  
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);
  
  // Filtrer les cours en fonction du terme de recherche
  useEffect(() => {
    if (!courses) return;
    
    const filtered = courses.filter(course => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredCourses(filtered);
  }, [courses, searchTerm]);
  
  // Charger les modules d'un cours
  const handleExpandCourse = async (courseId: string) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
      return;
    }
    
    setExpandedCourse(courseId);
    const modules = await loadModules(courseId);
    setCourseModules(modules);
  };
  
  // Gérer l'ouverture du dialogue d'ajout de cours
  const handleOpenNewCourseDialog = () => {
    courseForm.reset({
      title: "",
      description: "",
      phase: "",
      duration: "",
      status: "draft",
      order_index: courses.length + 1,
    });
    setIsNewCourseDialogOpen(true);
  };
  
  // Gérer l'ouverture du dialogue d'édition de cours
  const handleOpenEditCourseDialog = (course: CourseData) => {
    setSelectedCourse(course);
    courseForm.reset({
      title: course.title,
      description: course.description || "",
      phase: course.phase,
      duration: course.duration,
      status: course.status as "published" | "draft",
      order_index: course.order_index,
    });
    setIsEditCourseDialogOpen(true);
  };
  
  // Gérer l'ouverture du dialogue d'ajout de module
  const handleOpenNewModuleDialog = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    
    moduleForm.reset({
      title: "",
      description: "",
      duration: "",
      order_index: courseModules.length + 1,
      content: "",
    });
    
    setSelectedCourse(course);
    setIsNewModuleDialogOpen(true);
  };
  
  // Gérer l'ouverture du dialogue d'édition de module
  const handleOpenEditModuleDialog = (module: ModuleData) => {
    setSelectedModule(module);
    moduleForm.reset({
      title: module.title,
      description: module.description || "",
      duration: module.duration || "",
      order_index: module.order_index,
      content: module.content || "",
    });
    setIsEditModuleDialogOpen(true);
  };
  
  // Gérer la soumission du formulaire de cours
  const onSubmitCourse = async (data: CourseFormValues) => {
    if (isEditCourseDialogOpen && selectedCourse) {
      await updateCourse(selectedCourse.id, data);
      setIsEditCourseDialogOpen(false);
    } else {
      await createCourse(data);
      setIsNewCourseDialogOpen(false);
    }
  };
  
  // Gérer la soumission du formulaire de module
  const onSubmitModule = async (data: ModuleFormValues) => {
    if (isEditModuleDialogOpen && selectedModule) {
      await updateModule(selectedModule.id, data);
      setIsEditModuleDialogOpen(false);
    } else if (selectedCourse) {
      await createModule({
        ...data,
        course_id: selectedCourse.id,
      });
      setIsNewModuleDialogOpen(false);
      
      // Recharger les modules du cours
      const updatedModules = await loadModules(selectedCourse.id);
      setCourseModules(updatedModules);
    }
  };
  
  // Gérer la suppression d'un cours
  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;
    
    await deleteCourse(selectedCourse.id);
    setIsDeleteCourseDialogOpen(false);
  };
  
  // Gérer la suppression d'un module
  const handleDeleteModule = async () => {
    if (!selectedModule) return;
    
    await deleteModule(selectedModule.id);
    setIsDeleteModuleDialogOpen(false);
    
    // Recharger les modules du cours
    if (selectedCourse) {
      const updatedModules = await loadModules(selectedCourse.id);
      setCourseModules(updatedModules);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des cours</h2>
        <Button onClick={handleOpenNewCourseDialog}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Ajouter un cours
        </Button>
      </div>
      
      <div className="flex mb-4 gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher un cours..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9" 
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-3">Chargement des cours...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Book className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun cours trouvé</h3>
                <p className="text-muted-foreground mb-6">
                  Aucun cours ne correspond à votre recherche ou aucun cours n'a été créé.
                </p>
                <Button onClick={handleOpenNewCourseDialog}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Créer un nouveau cours
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredCourses.map((course) => (
              <Card key={course.id} className="border-border/50">
                <CardContent className="p-0">
                  <div className="p-6 flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-medium mr-3">{course.title}</h3>
                        <Badge className={course.status === 'published' ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"}>
                          {course.status === 'published' ? 'Publié' : 'Brouillon'}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{course.description || "Aucune description"}</p>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center text-sm">
                          <Book className="h-4 w-4 text-primary mr-1.5" />
                          <span>Phase: {course.phase}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 text-primary mr-1.5" />
                          <span>Durée: {course.duration}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 text-primary mr-1.5" />
                          <span>{course.students_count || 0} étudiants</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <FileText className="h-4 w-4 text-primary mr-1.5" />
                          <span>{course.modules_count || 0} modules</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-primary mr-1.5" />
                          <span>Taux de complétion: {course.completion_rate || 0}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleExpandCourse(course.id)}>
                        {expandedCourse === course.id ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-2" />
                            Masquer les modules
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-2" />
                            Voir les modules
                          </>
                        )}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleOpenEditCourseDialog(course)} className="cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" />
                            <span>Modifier le cours</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenNewModuleDialog(course.id)} className="cursor-pointer">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            <span>Ajouter un module</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCourse(course);
                              setIsDeleteCourseDialogOpen(true);
                            }}
                            className="cursor-pointer text-destructive"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            <span>Supprimer</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  {/* Modules du cours */}
                  {expandedCourse === course.id && (
                    <div className="border-t border-border p-0">
                      <div className="p-4 bg-muted/40 flex justify-between items-center">
                        <h4 className="font-medium">Modules du cours</h4>
                        <Button size="sm" onClick={() => handleOpenNewModuleDialog(course.id)}>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Ajouter un module
                        </Button>
                      </div>
                      
                      {courseModules.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                          <FileText className="h-8 w-8 mx-auto mb-2" />
                          <p>Aucun module n'a encore été créé pour ce cours.</p>
                          <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => handleOpenNewModuleDialog(course.id)}
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Créer le premier module
                          </Button>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>#</TableHead>
                              <TableHead>Titre</TableHead>
                              <TableHead>Durée</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {courseModules.map((module) => (
                              <TableRow key={module.id} className="hover:bg-muted/40">
                                <TableCell>{module.order_index}</TableCell>
                                <TableCell className="font-medium">{module.title}</TableCell>
                                <TableCell>{module.duration || "Non spécifié"}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleOpenEditModuleDialog(module)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-destructive"
                                      onClick={() => {
                                        setSelectedModule(module);
                                        setSelectedCourse(course);
                                        setIsDeleteModuleDialogOpen(true);
                                      }}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
      
      {/* Dialogue d'ajout de cours */}
      <Dialog open={isNewCourseDialogOpen} onOpenChange={setIsNewCourseDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau cours</DialogTitle>
            <DialogDescription>
              Remplissez le formulaire ci-dessous pour créer un nouveau cours.
            </DialogDescription>
          </DialogHeader>
          <Form {...courseForm}>
            <form onSubmit={courseForm.handleSubmit(onSubmitCourse)} className="space-y-4">
              <FormField
                control={courseForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre du cours</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Introduction à l'IA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={courseForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez le contenu du cours..."
                        className="min-h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={courseForm.control}
                  name="phase"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phase</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une phase" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Phase 1: Fondamentaux de l'IA">Phase 1: Fondamentaux</SelectItem>
                          <SelectItem value="Phase 2: Prompt Engineering">Phase 2: Prompt Engineering</SelectItem>
                          <SelectItem value="Phase 3: Outils & Automatisation">Phase 3: Outils</SelectItem>
                          <SelectItem value="Phase 4: Projet Final">Phase 4: Projet Final</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={courseForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durée</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 3h" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={courseForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="published">
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              <span>Publié</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="draft">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-amber-600" />
                              <span>Brouillon</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={courseForm.control}
                  name="order_index"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ordre d'affichage</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))} 
                        />
                      </FormControl>
                      <FormDescription>Position dans la liste</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsNewCourseDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Créer le cours</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Dialogue d'édition de cours */}
      <Dialog open={isEditCourseDialogOpen} onOpenChange={setIsEditCourseDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le cours</DialogTitle>
            <DialogDescription>
              Modifiez les informations du cours ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <Form {...courseForm}>
            <form onSubmit={courseForm.handleSubmit(onSubmitCourse)} className="space-y-4">
              <FormField
                control={courseForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre du cours</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Introduction à l'IA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={courseForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez le contenu du cours..."
                        className="min-h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={courseForm.control}
                  name="phase"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phase</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une phase" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Phase 1: Fondamentaux de l'IA">Phase 1: Fondamentaux</SelectItem>
                          <SelectItem value="Phase 2: Prompt Engineering">Phase 2: Prompt Engineering</SelectItem>
                          <SelectItem value="Phase 3: Outils & Automatisation">Phase 3: Outils</SelectItem>
                          <SelectItem value="Phase 4: Projet Final">Phase 4: Projet Final</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={courseForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durée</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 3h" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={courseForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="published">
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              <span>Publié</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="draft">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-amber-600" />
                              <span>Brouillon</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={courseForm.control}
                  name="order_index"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ordre d'affichage</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))} 
                        />
                      </FormControl>
                      <FormDescription>Position dans la liste</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditCourseDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Enregistrer les modifications</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Dialogue d'ajout de module */}
      <Dialog open={isNewModuleDialogOpen} onOpenChange={setIsNewModuleDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau module</DialogTitle>
            <DialogDescription>
              Remplissez le formulaire ci-dessous pour créer un nouveau module pour le cours "{selectedCourse?.title}".
            </DialogDescription>
          </DialogHeader>
          <Form {...moduleForm}>
            <form onSubmit={moduleForm.handleSubmit(onSubmitModule)} className="space-y-4">
              <FormField
                control={moduleForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre du module</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Introduction aux LLMs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={moduleForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez le contenu du module..."
                        className="min-h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={moduleForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durée</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 45 min" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={moduleForm.control}
                  name="order_index"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ordre d'affichage</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={moduleForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contenu du module</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Contenu du module (markdown supporté)..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Vous pouvez utiliser le format Markdown pour structurer le contenu.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsNewModuleDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Créer le module</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Dialogue d'édition de module */}
      <Dialog open={isEditModuleDialogOpen} onOpenChange={setIsEditModuleDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le module</DialogTitle>
            <DialogDescription>
              Modifiez les informations du module ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <Form {...moduleForm}>
            <form onSubmit={moduleForm.handleSubmit(onSubmitModule)} className="space-y-4">
              <FormField
                control={moduleForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre du module</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Introduction aux LLMs" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={moduleForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez le contenu du module..."
                        className="min-h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={moduleForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durée</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 45 min" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={moduleForm.control}
                  name="order_index"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ordre d'affichage</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={moduleForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contenu du module</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Contenu du module (markdown supporté)..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Vous pouvez utiliser le format Markdown pour structurer le contenu.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditModuleDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Enregistrer les modifications</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Dialogue de confirmation de suppression de cours */}
      <AlertDialog open={isDeleteCourseDialogOpen} onOpenChange={setIsDeleteCourseDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce cours ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Tous les modules et les données associées à ce cours seront supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCourse} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Dialogue de confirmation de suppression de module */}
      <AlertDialog open={isDeleteModuleDialogOpen} onOpenChange={setIsDeleteModuleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce module ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les données associées à ce module seront supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteModule} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}