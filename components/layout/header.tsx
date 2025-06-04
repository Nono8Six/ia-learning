"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Lightbulb, Sparkles, Rocket, LogOut, User, UserPlus, LogIn, LayoutDashboard, Gauge, Award, BookOpen } from "lucide-react";
import { ModeToggle } from "../mode-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const { user, signOut, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    // Set active item based on current path
    const path = window.location.pathname;
    if (path === "/") setActiveItem("decouvrir");
    else if (path === "/programme") setActiveItem("parcours");
    else if (path === "/dashboard") setActiveItem("mon-espace");
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const getNameInitials = (name?: string): string => {
    if (!name) return "UT";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const displayName = user?.full_name || user?.email?.split('@')[0] || "Utilisateur";
  const userInitials = getNameInitials(user?.full_name);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/95 backdrop-blur-md shadow-md py-2" 
          : "bg-gradient-to-r from-background/90 to-background/80 backdrop-blur-sm py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-primary group">
          <div className="relative">
            <Lightbulb className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-chart-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span className="font-bold text-xl relative overflow-hidden">
            IA Fondations
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-chart-1 to-primary/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {!user ? (
            <>
              <Link 
                href="/" 
                className={`group relative px-2 py-1 text-foreground/80 font-medium transition-colors ${
                  activeItem === "decouvrir" ? "text-chart-1" : "hover:text-primary"
                }`}
                onMouseEnter={() => setActiveItem("decouvrir")}
                onMouseLeave={() => setActiveItem("")}
              >
                <span className="flex items-center">
                  <Sparkles className={`h-4 w-4 mr-1.5 transition-all duration-300 ${
                    activeItem === "decouvrir" ? "text-chart-1" : "text-primary/60 group-hover:text-primary"
                  }`} />
                  Découvrir
                </span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-chart-1/80 transform transition-transform duration-300 origin-left ${
                  activeItem === "decouvrir" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}></span>
              </Link>
              
              <Link 
                href="/programme" 
                className={`group relative px-2 py-1 text-foreground/80 font-medium transition-colors ${
                  activeItem === "parcours" ? "text-chart-1" : "hover:text-primary"
                }`}
                onMouseEnter={() => setActiveItem("parcours")}
                onMouseLeave={() => setActiveItem("")}
              >
                <span className="flex items-center">
                  <Rocket className={`h-4 w-4 mr-1.5 transition-all duration-300 ${
                    activeItem === "parcours" ? "text-chart-1" : "text-primary/60 group-hover:text-primary"
                  }`} />
                  Parcours
                </span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-chart-1/80 transform transition-transform duration-300 origin-left ${
                  activeItem === "parcours" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}></span>
              </Link>
            </>
          ) : (
            <>
              <Link 
                href="/dashboard" 
                className={`group relative px-2 py-1 text-foreground/80 font-medium transition-colors ${
                  activeItem === "mon-espace" ? "text-chart-1" : "hover:text-primary"
                }`}
                onMouseEnter={() => setActiveItem("mon-espace")}
                onMouseLeave={() => setActiveItem("")}
              >
                <span className="flex items-center">
                  <LayoutDashboard className={`h-4 w-4 mr-1.5 transition-all duration-300 ${
                    activeItem === "mon-espace" ? "text-chart-1" : "text-primary/60 group-hover:text-primary"
                  }`} />
                  Mon Espace
                </span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-chart-1/80 transform transition-transform duration-300 origin-left ${
                  activeItem === "mon-espace" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}></span>
              </Link>
              
              <Link 
                href="/programme" 
                className={`group relative px-2 py-1 text-foreground/80 font-medium transition-colors ${
                  activeItem === "parcours" ? "text-chart-1" : "hover:text-primary"
                }`}
                onMouseEnter={() => setActiveItem("parcours")}
                onMouseLeave={() => setActiveItem("")}
              >
                <span className="flex items-center">
                  <BookOpen className={`h-4 w-4 mr-1.5 transition-all duration-300 ${
                    activeItem === "parcours" ? "text-chart-1" : "text-primary/60 group-hover:text-primary"
                  }`} />
                  Modules
                </span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-chart-1/80 transform transition-transform duration-300 origin-left ${
                  activeItem === "parcours" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}></span>
              </Link>
              
              <Link 
                href="/profile" 
                className={`group relative px-2 py-1 text-foreground/80 font-medium transition-colors ${
                  activeItem === "profil" ? "text-chart-1" : "hover:text-primary"
                }`}
                onMouseEnter={() => setActiveItem("profil")}
                onMouseLeave={() => setActiveItem("")}
              >
                <span className="flex items-center">
                  <Award className={`h-4 w-4 mr-1.5 transition-all duration-300 ${
                    activeItem === "profil" ? "text-chart-1" : "text-primary/60 group-hover:text-primary"
                  }`} />
                  Mon Profil
                </span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-chart-1/80 transform transition-transform duration-300 origin-left ${
                  activeItem === "profil" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}></span>
              </Link>
            </>
          )}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <ModeToggle />
          
          {!isLoading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost\" className="rounded-full p-0 flex items-center space-x-2 h-auto hover:bg-background">
                  <Avatar className="h-10 w-10 border-2 border-indigo-500/20 transition-all duration-300 hover:border-indigo-500">
                    <AvatarImage 
                      src={user.avatar_url || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400"} 
                      alt={displayName}
                      className="object-cover" 
                    />
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 text-lg">{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{displayName}</span>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Gauge className="h-3 w-3 mr-1" />
                      <span>Niveau 3</span>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 p-2 border border-border/50 shadow-xl rounded-xl bg-background/95 backdrop-blur-sm">
                <DropdownMenuLabel className="px-3 py-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={user.avatar_url || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400"} 
                        alt={displayName}
                        className="object-cover" 
                      />
                      <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{displayName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild className="px-3 py-2 cursor-pointer">
                    <Link href="/dashboard" className="flex items-center">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      <span>Tableau de bord</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="px-3 py-2 cursor-pointer">
                    <Link href="/profile" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>Mon Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  {/* Admin access for admin users */}
                  <DropdownMenuItem asChild className="px-3 py-2 cursor-pointer">
                    <Link href="/admin" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>Administration</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem 
                  className="px-3 py-2 text-red-500 hover:text-red-600 cursor-pointer"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : !isLoading && (
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/signin" className="flex items-center">
                  <LogIn className="h-4 w-4 mr-1.5" />
                  <span>Connexion</span>
                </Link>
              </Button>
              <Button 
                asChild 
                size="sm"
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 transition-all duration-500 shadow-md"
              >
                <Link href="/auth/signup" className="flex items-center">
                  <UserPlus className="h-4 w-4 mr-1.5" />
                  <span>Inscription</span>
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-4">
          <ModeToggle />
          {!isLoading && user ? (
            <Avatar className="h-8 w-8 border-2 border-indigo-500/20">
              <AvatarImage 
                src={user.avatar_url || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400"} 
                alt={displayName}
                className="object-cover" 
              />
              <AvatarFallback className="text-sm">{userInitials}</AvatarFallback>
            </Avatar>
          ) : !isLoading && (
            <Button variant="outline" size="sm" asChild className="mr-1">
              <Link href="/auth/signin" className="flex items-center">
                <LogIn className="h-4 w-4 mr-1" />
                <span>Connexion</span>
              </Link>
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
            className="hover:bg-primary/10"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border/40 py-4 animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            {!isLoading && user && (
              <div className="flex items-center p-3 bg-muted/40 rounded-lg">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage 
                    src={user.avatar_url || "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400"} 
                    alt={displayName}
                    className="object-cover" 
                  />
                  <AvatarFallback className="text-sm">{userInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{displayName}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Gauge className="h-3 w-3 mr-1" />
                    <span>Niveau 3</span>
                  </div>
                </div>
              </div>
            )}
            
            {!user ? (
              <>
                <Link 
                  href="/" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 p-3 rounded-md hover:bg-muted transition-colors"
                >
                  <Sparkles className="h-5 w-5 text-chart-1" />
                  <span>Découvrir</span>
                </Link>
                <Link 
                  href="/programme" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 p-3 rounded-md hover:bg-muted transition-colors"
                >
                  <Rocket className="h-5 w-5 text-chart-1" />
                  <span>Parcours</span>
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/dashboard" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 p-3 rounded-md hover:bg-muted transition-colors"
                >
                  <LayoutDashboard className="h-5 w-5 text-chart-1" />
                  <span>Tableau de bord</span>
                </Link>
                <Link 
                  href="/programme" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 p-3 rounded-md hover:bg-muted transition-colors"
                >
                  <BookOpen className="h-5 w-5 text-chart-1" />
                  <span>Modules</span>
                </Link>
              </>
            )}
            
            {!isLoading && user && (
              <>
                <Link 
                  href="/profile" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 p-3 rounded-md hover:bg-muted transition-colors"
                >
                  <User className="h-5 w-5 text-chart-1" />
                  <span>Mon Profil</span>
                </Link>
                <Link 
                  href="/admin" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 p-3 rounded-md hover:bg-muted transition-colors"
                >
                  <User className="h-5 w-5 text-chart-1" />
                  <span>Administration</span>
                </Link>
                <Button 
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  variant="ghost" 
                  className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 p-3"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Déconnexion</span>
                </Button>
              </>
            )}
            
            {!isLoading && !user && (
              <>
                <Link 
                  href="/auth/signin" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 p-3 rounded-md hover:bg-muted transition-colors"
                >
                  <LogIn className="h-5 w-5 text-chart-1" />
                  <span>Se connecter</span>
                </Link>
                
                <Button 
                  asChild 
                  className="w-full mt-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 transition-all duration-500 rounded-md overflow-hidden relative group"
                >
                  <Link 
                    href="/auth/signup" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center px-5 py-2.5"
                  >
                    <UserPlus className="h-4 w-4 mr-1.5" />
                    <span>S'inscrire</span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transform scale-x-0 group-hover:scale-x-100 transition-all duration-500"></div>
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}