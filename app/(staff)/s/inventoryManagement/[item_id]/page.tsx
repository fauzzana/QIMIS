import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DetailItem } from "@/components/inventory/DetailItem";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader"

interface PageProps {
  params: Promise<{
    item_id?: string;
  }>;
}

async function getItem(itemId: string) {
  return prisma.item.findUnique({
    where: {
      item_id: itemId,
    },
    select: {
      item_id: true,
      name: true,
      category: {
        select: {
          category_name: true,
        },
      },
      location: {
        select: {
          location_name: true,
        },
      },
      status: true,
      image: true,
      qr_code_path: true,
      stockItems: {
        select: {
          current_qty: true,
          min_qty: true,
        },
      },
    },
  });
}

export default async function ItemDetailPage({ params }: PageProps) {
  const session = await auth();

  if (session?.user.role !== "STAFF") {
    redirect("/");
  }

  const resolvedParams = await params;
  const itemId = resolvedParams.item_id;

  // Guard: if no item id, show minimal error or redirect back
  if (!itemId || itemId === "undefined") {
    redirect("/s/inventoryManagement");
  }

  // Fetch item data server-side
  const item = await getItem(itemId);

  if (!item) {
    return (
      <div className="flex flex-3 flex-col">
        <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-white z-10">
          <PageHeader items={[
            { label: "Dashboard", href: "/" },
            { label: "Data Items", href: "/s/inventoryManagement" },
            { label: "Detail Items" }
          ]} />
        </header>
        <div className="@container/main flex flex-1 flex-col gap-2 p-4">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">Item not found: {itemId}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-3 flex-col">
      <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-white z-10">
        <PageHeader items={[
          { label: "Dashboard", href: "/" },
          { label: "Data Items", href: "/s/inventoryManagement" },
        ]} />
      </header>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Item Detail</h1>
            <p className="text-muted-foreground">
              View detailed information about the scanned item.
            </p>
          </div>
          <DetailItem item={item} />
        </div>
      </div>
    </div>
  );
}