import { SignUpForm } from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription - IA Fondations",
  description: "Créez votre compte IA Fondations",
};

export default function SignUpPage() {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center py-12">
      <SignUpForm />
    </div>
  );
}