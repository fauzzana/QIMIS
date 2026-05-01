import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Tab } from "@/components/inventory/Transaction";
import { PageHeader } from "@/components/layout/PageHeader"

export default async function scanPage() {
  const session = await auth();

  if (session?.user.role !== "STAFF") {
    redirect("/");
  }

  return (
    <div className="flex flex-3 flex-col">
      <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-white z-10">
        <PageHeader items={[
          { label: "Dashboard", href: "/" },
          { label: "Transaction" }
        ]}
        />
      </header>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <Tab />
        </div>
      </div>
    </div>
  )
}