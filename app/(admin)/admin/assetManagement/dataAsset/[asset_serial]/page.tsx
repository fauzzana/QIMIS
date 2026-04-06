import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DetailAsset } from "@/components/asset/DetailAsset";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";

interface PageProps {
  params: Promise<{
    asset_serial?: string;
    detail?: string;
  }>;
}

async function getAsset(serial: string) {
  return prisma.asset.findUnique({
    where: {
      asset_serial: serial,
    },
    select: {
      asset_serial: true,
      name: true,
      description: true,
      category: {
        select: {
          category_name: true,
        },
      },
      qty: true,
      purcase_date: true,
      purcase_price: true,
      status: true,
      location: {
        select: {
          location_name: true,
        },
      },
      qr_code_path: true,
      image: true,
    },
  });
}

export default async function AssetDetailPage({ params }: PageProps) {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    redirect("/");
  }

  const resolvedParams = await params;
  const assetSerial = resolvedParams.asset_serial ?? resolvedParams.detail;

  // Guard: if no asset serial, show minimal error or redirect back
  if (!assetSerial || assetSerial === "undefined") {
    redirect("/admin/assetManagement");
  }

  // Fetch asset data server-side
  const asset = await getAsset(assetSerial);

  if (!asset) {
    return (
      <div className="flex flex-3 flex-col">
        <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-white z-10">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-6"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/assetManagement">Asset Management</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Asset Detail</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="@container/main flex flex-1 flex-col gap-2 p-4">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">Asset not found: {assetSerial}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-3 flex-col">
      <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-white z-10">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-6"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/assetManagement">Asset Management</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Asset Detail</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Asset Detail</h1>
            <p className="text-muted-foreground">
              View detailed information about the scanned asset.
            </p>
          </div>
          <DetailAsset asset={asset} />
        </div>
      </div>
    </div>
  );
}