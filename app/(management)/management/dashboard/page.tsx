import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  // const session = await auth();

  // if (session?.user.role !== "MANAGEMENT") {
  //   redirect("/");
  // }
  return (
    <div className="flex h-full w-full items-center justify-center">
      <h1 className="text-2xl font-bold">Dashboard Management</h1>
    </div>
  );
}