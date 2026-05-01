import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AddAssetForm } from "@/components/asset/AddAsset";
import { PageHeader } from "@/components/layout/PageHeader";

export default async function addAssetPage() {
  const session = await auth();

  if (session?.user.role !== "STAFF") {
    redirect("/");
  }

  return (
    <div className="flex flex-3 flex-col">
      <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-white z-10">
        <PageHeader items={[
          { href: "/s/dashboard", label: "Dashboard", },
          { href: "/s/assetManagement", label: "Asset Management", },
          { label: "Add Asset" }
        ]}
        />
      </header>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Add your asset</h1>
            <p className="text-muted-foreground">
              Fill this form to save your asset
            </p>
          </div>
          <div className="px-4 lg:px-6">
            <AddAssetForm />
          </div>
        </div>
      </div>
    </div>
  )
}