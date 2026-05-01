import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CollapsibleReport } from "@/components/reports/ReportList";
import { PageHeader } from "@/components/layout/PageHeader";

export default async function statusUsersPage() {
  const session = await auth();

  if (session?.user.role !== "MANAGEMENT") {
    redirect("/");
  }


  return (
    <div className="flex flex-3 flex-col">
      <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-white z-10">
        <PageHeader items={[
          { label: "Dashboard", href: "/" },
          { label: "Reports" },
        ]}
        />
      </header>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-muted-foreground">
              View reports do you need
            </p>
          </div>
          <div className="px-4 lg:px-6">
            <CollapsibleReport />
          </div>
        </div>
      </div>
    </div>
  )
}