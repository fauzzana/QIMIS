import { SectionCards } from "@/components/admin/ui/section-cards";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch dashboard data
  const totalAssets = await prisma.asset.count();
  const totalItems = await prisma.item.count();
  const totalMaintenances = await prisma.assetMaintenance.count();

  // Calculate total asset value
  const assetValueResult = await prisma.asset.aggregate({
    _sum: {
      purcase_price: true,
    },
  });
  const totalAssetValue = assetValueResult._sum.purcase_price || 0;

  // Asset status distribution
  const assetStatusData = await prisma.asset.groupBy({
    by: ['status'],
    _count: { status: true },
  });

  // Item status distribution
  const itemStatusData = await prisma.item.groupBy({
    by: ['status'],
    _count: { status: true },
  });

  // Transaction data for bar chart (last 3 months)
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const transactionData = await prisma.transaction.findMany({
    where: {
      created_at: {
        gte: threeMonthsAgo,
      },
    },
    select: {
      created_at: true,
      action: true,
    },
  });

  // Group transactions by month
  const monthlyTransactions = transactionData.reduce((acc, tx) => {
    const month = tx.created_at.toISOString().slice(0, 7); // YYYY-MM
    if (!acc[month]) acc[month] = { borrow: 0, return: 0 };
    if (tx.action) { // assuming true = borrow
      acc[month].borrow++;
    } else {
      acc[month].return++;
    }
    return acc;
  }, {} as Record<string, { borrow: number; return: number }>);

  const chartData = Object.entries(monthlyTransactions).map(([month, counts]) => ({
    date: month + '-01',
    borrow: counts.borrow,
    return: counts.return,
  }));

  // Notifications: pending maintenances and low stock items
  const pendingMaintenances = await prisma.assetMaintenance.findMany({
    where: { status_maintain: 0 },
    include: { asset: true },
    take: 5,
  });

  const lowStockItems = await prisma.stockItem.findMany({
    where: {
      current_qty: {
        lt: prisma.stockItem.fields.min_qty,
      },
    },
    include: { item: true },
    take: 5,
  });

  return (
    <div className="flex flex-1 flex-col">
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
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards
            totalAssets={totalAssets}
            totalItems={totalItems}
            totalMaintenances={totalMaintenances}
            totalAssetValue={totalAssetValue}
            assetStatusData={assetStatusData}
            itemStatusData={itemStatusData}
            chartData={chartData}
            pendingMaintenances={pendingMaintenances}
            lowStockItems={lowStockItems}
          />
        </div>
      </div>
    </div>
  );
}
