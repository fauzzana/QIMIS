import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LocationTable } from "@/components/location/LocationTable";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader"

async function getLocation() {
  const locations = await prisma.location.findMany({
    select: {
      location_id: true,
      location_name: true,
    },
    orderBy: {
      location_name: "asc",
    },
  })
  return locations
}

export default async function assetPage() {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    redirect("/");
  }

  const location = await getLocation()
  return (
    <div className="flex flex-3 flex-col">
      <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-white z-10">
        <PageHeader items={[
          { label: "Dashboard", href: "/" },
          { label: "Location" },
        ]} />
      </header>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">More - Location</h1>
            <p className="text-muted-foreground">
              View and manage all locations in the system
            </p>
          </div>
          <div className="px-4 lg:px-6">
            <LocationTable data={location} />
          </div>
        </div>
      </div>
    </div>
  )
}