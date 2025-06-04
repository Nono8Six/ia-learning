import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Réinitialisation du mot de passe - IA Fondations",
  description: "Définissez un nouveau mot de passe pour votre compte IA Fondations",
};

export default function ResetPasswordPage() {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center py-12">
      <ResetPasswordForm />
    </div>
  );
}