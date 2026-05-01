import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ItemTable } from "@/components/inventory/ItemTable"
import { PageHeader } from "@/components/layout/PageHeader"

async function getItems() {
  const items = await prisma.item.findMany({
    select: {
      item_id: true,
      name: true,
      category: {
        select: {
          category_name: true,
        },
      },
      status: true,
      stockItems: {
        select: {
          current_qty: true,
        },
      },
      location: {
        select: {
          location_name: true,
        },
      },
      qr_code_path: true,
      image: true,
    },
    orderBy: {
      category_id: "desc",
    },
  })
  return items
}

export default async function itemPage() {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    redirect("/");
  }

  const items = await getItems()
  return (
    <div className="flex flex-3 flex-col">
      <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-white z-10">
        <PageHeader items={[
          { label: "Dashboard", href: "/" },
          { label: "Data Items", },
        ]} />
      </header>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Inventory Management - Data Item</h1>
            <p className="text-muted-foreground">
              View and manage all assets in the system
            </p>
          </div>
          <div className="px-4 lg:px-6">
            <ItemTable data={items} basePath="/inventoryManagement" />
          </div>
        </div>
      </div>
    </div>
  )
}