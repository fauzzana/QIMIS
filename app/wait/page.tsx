import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { IconCloud } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
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

  if (session?.user.role !== "GUEST") {
    redirect("/");
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
      </EmptyHeader>
      <form action={handleLogout}>
        <Button className="cursor-pointer">Relog if activated</ Button>
      </form>
    </Empty>
  );
}
