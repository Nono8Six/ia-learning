import "./globals.css";
import type { Metadata } from "next";
// Configuration de la police système
const inter = {
  className: 'font-sans',
  style: { fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }
};
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { ErrorBoundary } from "@/components/error-boundary";



export const metadata: Metadata = {
  title: "Formation IA Fondations Avancées – Devenez Indispensable",
  description: "Boostez votre carrière grâce à notre formation en Intelligence Artificielle. Multipliez votre productivité par 5 à 50, quelle que soit votre profession.",
  keywords: "formation IA, intelligence artificielle, prompt engineering, productivité, certification IA, cours IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AdminProvider>
              <ErrorBoundary>
                <Header />
                <main className="min-h-screen">{children}</main>
                <Footer />
                <Toaster />
              </ErrorBoundary>
            </AdminProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}