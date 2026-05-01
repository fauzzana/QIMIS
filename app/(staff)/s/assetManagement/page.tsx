import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AssetTable } from "@/components/asset/AssetTable";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/PageHeader";

async function getAssets() {
  const assets = await prisma.asset.findMany({
    select: {
      asset_serial: true,
      name: true,
      description: true,
      category: {
        select: {
          category_name: true,
        }
      },
      qty: true,
      purchase_date: true,
      purchase_price: true,
      status: true,
      location: {
        select: {
          location_name: true,
        }
      },
      qr_code_path: true,
      image: true,
    },
    orderBy: {
      purchase_date: "desc",
    },
  })
  return assets
}

export default async function assetPage() {
  const session = await auth();

  if (session?.user.role !== "STAFF") {
    redirect("/");
  }

  const assets = await getAssets()
  return (
    <div className="flex flex-3 flex-col">
      <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-white z-10">
        <PageHeader items={[
          { label: "Dashboard", href: "/s/dashboard" },
          { label: "Data Asset" }
        ]} />
      </header>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Asset Management - Data Asset</h1>
            <p className="text-muted-foreground">
              View and manage all assets in the system
            </p>
          </div>
          <div className="px-4 lg:px-6">
            <AssetTable data={assets} basePath="/s/assetManagement" />
          </div>
        </div>
      </div>
    </div>
  )
}