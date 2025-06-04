import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  // Gérer également les jetons d'accès de l'URL pour OAuth (comme Google)
  const accessToken = requestUrl.hash ? requestUrl.hash.substring(1).split('&').find(param => param.startsWith('access_token='))?.split('=')[1] : null;
  
  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    await supabase.auth.exchangeCodeForSession(code);
  }
  
  // Si c'est une redirection OAuth avec des fragments d'URL (#)
  if (accessToken) {
    // Pour OAuth, on doit faire une redirection spéciale car les fragments (#) ne sont pas envoyés au serveur
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="refresh" content="0;url=/dashboard" />
          <title>Redirection...</title>
        </head>
        <body>
          <script>
            // Obtenir le fragment d'URL et le convertir en session
            (async function() {
              try {
                // Redirection vers le dashboard après authentification
                window.location.href = '/dashboard';
              } catch (err) {
                console.error('Error processing authentication:', err);
                window.location.href = '/auth/signin?error=callback-error';
              }
            })();
          </script>
          <p>Redirection en cours...</p>
        </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/dashboard', request.url));
}