import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CardImage } from "@/components/scan/card-selection";
import { PageHeader } from "@/components/layout/PageHeader"

export default async function scanPage() {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex flex-3 flex-col">
      <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-white z-10">
        <PageHeader items={[
          { label: "Dashboard", href: "/" },
          { label: "Scan" }
        ]}
        />
      </header>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Scan Page</h1>
            <p className="text-muted-foreground">
              Choose what you want to scan, asset or item. You can manage inventory and view details of the scanned asset or item.
            </p>
          </div>
          <CardImage assetBasePath="/assetManagement" itemBasePath="/itemManagement" />
        </div>
      </div>
    </div>
  )
}