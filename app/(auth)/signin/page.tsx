import { Metadata } from "next";
import { CardDemo } from "@/components/auth/app-signin";
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default async function AuthPage() {
  const session = await auth()

  if (!session) {
    return <CardDemo />;
  }

  const role = session.user.role

  if (role === "ADMIN") {
    redirect("/admin/dashboard")
  }

  if (role === "MANAGEMENT") {
    redirect("/management/dashboard")
  }

  if (role === "STAFF") {
    redirect("/operational/dashboard")
  }
}