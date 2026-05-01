import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { MaintenanceAsset } from "@/components/asset/MaintenanceAsset";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";

async function getMaintenanceAssets() {
  const assets = await prisma.asset.findMany({
    where: {
      // status: 3, 
    },
    include: {
      category: true,
      location: true,
      maintenances: {
        orderBy: {
          create_at: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      purchase_date: "desc",
    },
  })

  return assets.map((asset: any) => ({
    asset_serial: asset.asset_serial,
    name: asset.name,
    description: asset.description,
    category: {
      category_name: asset.category.category_name,
    },
    location: {
      location_name: asset.location.location_name,
    },
    qty: asset.qty,
    purchase_date: asset.purchase_date.toISOString().split('T')[0],
    purchase_price: asset.purchase_price,
    status: asset.status,
    qr_code_path: asset.qr_code_path,
    image: asset.image,
    condition: asset.maintenances[0]?.condition,
    maintenance: asset.maintenances.map((m: any) => ({
      maintenance_id: m.maintenance_id,
      attachment: m.attachment,
      create_at: m.create_at.toISOString(),
      date_end: m.date_end ? m.date_end.toISOString().split('T')[0] : null,
      status_maintain: m.status_maintain,
    })),
  }))
}


export default async function assetPage() {
  const session = await auth();

  if (session?.user.role !== "MANAGEMENT") {
    redirect("/");
  }

  const maintenanceAssets = await getMaintenanceAssets()
  return (
    <div className="flex flex-3 flex-col">
      <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-white z-10">
        <PageHeader items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Data Asset", href: "/m/assetManagement" },
          { label: "Asset Maintenance" },
        ]} />
      </header>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Asset Management - Data Asset - Maintenance</h1>
            <p className="text-muted-foreground">
              View and manage asset maintenance
            </p>
          </div>
          <div className="px-4 lg:px-6">
            <MaintenanceAsset data={maintenanceAssets} />
          </div>
        </div>
      </div>
    </div>
  )
}
