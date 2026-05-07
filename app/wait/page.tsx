import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { IconCloud } from "@tabler/icons-react";
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { handleLogout } from "@/components/auth/action";

export default async function WaitPage() {
  const session = await auth();
  const role = session?.user?.role;

  if (role === "ADMIN") {
    redirect("/dashboard");
  }

  if (role === "MANAGEMENT") {
    redirect("/m/dashboard");
  }

  if (role === "STAFF") {
    redirect("/s/dashboard");
  }

  return (
    <Empty className="border border-dashed mt-50">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconCloud />
        </EmptyMedia>
        <EmptyTitle>This is waiting page</EmptyTitle>
        <EmptyDescription>
          Ask to admin to give you access to the system, or wait until your account is activated.
        </EmptyDescription>
        <form action={handleLogout}>
          <Button type="submit">Relog</Button>
        </form>
      </EmptyHeader>
    </Empty>
  );
}
