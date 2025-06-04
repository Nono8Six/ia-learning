import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mot de passe oublié - IA Fondations",
  description: "Réinitialisez votre mot de passe IA Fondations",
};

export default function ForgotPasswordPage() {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center py-12">
      <ForgotPasswordForm />
    </div>
  );
}