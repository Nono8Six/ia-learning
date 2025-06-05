"use client";

import React from 'react';
import { logError } from '@/error'; // Assuming this now also reports to Sentry or similar if integrated
import { Button } from '@/components/ui/button'; // Assuming you have a Button component

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode; // User can still provide a completely custom fallback
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log errorInfo, which contains information about which component threw the error.
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    logError(error); // This function should handle reporting to your backend and/or Sentry

    // If Sentry or similar is integrated, you might do something like:
    // Sentry.withScope((scope) => {
    //   scope.setExtras(errorInfo);
    //   Sentry.captureException(error);
    // });
  }

  handleReload = () => {
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default enhanced fallback UI
      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center min-h-[60vh] p-6 bg-background text-foreground"
        >
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-semibold text-destructive mb-4">
              Oops! Quelque chose s'est mal passé.
            </h1>
            <p className="text-muted-foreground mb-6">
              Nous sommes désolés pour le désagrément. Veuillez essayer de recharger la page.
              Si le problème persiste, contactez notre support.
            </p>
            <Button onClick={this.handleReload} variant="destructive">
              Recharger la page
            </Button>
            {/*
              Optionally, display error details in development or a reference ID.
              Be careful about showing raw error messages in production.
            */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 p-2 bg-muted text-destructive-foreground rounded text-left text-xs">
                <summary>Détails de l'erreur (Développement)</summary>
                <pre className="mt-2 whitespace-pre-wrap">
                  {this.state.error.message}
                  {this.state.error.stack && `\n\nStack Trace:\n${this.state.error.stack}`}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
