import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check auth condition for protected routes
  const isAuthRoute = req.nextUrl.pathname.startsWith('/auth');
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard') || 
                           req.nextUrl.pathname.startsWith('/profile');
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

  // Si l'utilisateur essaie d'accéder aux pages d'authentification alors qu'il est déjà connecté,
  // le rediriger vers le tableau de bord
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  // Si l'utilisateur essaie d'accéder à des routes protégées sans être connecté,
  // le rediriger vers la page de connexion
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  // Pour les routes d'administration, vérifier si l'utilisateur est un administrateur
  if (isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
    
    // Appeler la fonction RPC is_admin pour vérifier si l'utilisateur est administrateur
    const { data: isAdmin, error } = await supabase.rpc('is_admin', {
      user_id: session.user.id
    });
    
    if (error || !isAdmin) {
      // Si l'utilisateur n'est pas administrateur, le rediriger vers le tableau de bord
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }
  
  return res;
}

// Define which routes are affected by this middleware
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/admin/:path*', '/auth/:path*'],
};