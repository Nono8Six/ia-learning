import { SignInForm } from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion - IA Fondations",
  description: "Connectez-vous à votre compte IA Fondations",
};

export default function SignInPage() {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center py-12">
      <SignInForm />
    </div>
  );
}