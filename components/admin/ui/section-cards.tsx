import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ChartPieAsset, ChartPieItem } from "@/components/admin/ui/chart-pie"
import { ChartBarInteractive } from "@/components/admin/ui/chart-area-interactive"

interface SectionCardsProps {
  totalAssets: number;
  totalItems: number;
  totalMaintenances: number;
  totalAssetValue: number;
  assetStatusData: { status: number; _count: { status: number } }[];
  itemStatusData: { status: number; _count: { status: number } }[];
  chartData: { date: string; borrow: number; return: number }[];
  pendingMaintenances: any[];
  lowStockItems: any[];
}

export function SectionCards({
  totalAssets,
  totalItems,
  totalMaintenances,
  totalAssetValue,
  assetStatusData,
  itemStatusData,
  chartData,
  pendingMaintenances,
  lowStockItems,
}: SectionCardsProps) {
  // Calculate additional metrics
  const totalTransactions = chartData.reduce((acc, curr) => acc + curr.borrow + curr.return, 0);
  const totalBorrowed = chartData.reduce((acc, curr) => acc + curr.borrow, 0);
  const totalReturned = chartData.reduce((acc, curr) => acc + curr.return, 0);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side: Cards and Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Asset Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Asset Management</h3>
            <div className="grid grid-cols-1 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
              <Card className="@container/card justify-between">
                <CardHeader>
                  <CardTitle>Total Asset</CardTitle>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {totalAssets.toLocaleString()}
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <TrendingUp className="h-4 w-4" />
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Total aset terdaftar
                  </div>
                </CardFooter>
              </Card>

              <ChartPieAsset data={assetStatusData} />

              <Card className="@container/card justify-between">
                <CardHeader>
                  <CardTitle>Total Maintenance</CardTitle>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {totalMaintenances.toLocaleString()}
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <TrendingUp className="h-4 w-4" />
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Perawatan aset aktif
                  </div>
                </CardFooter>
              </Card>

              <Card className="@container/card justify-between">
                <CardHeader>
                  <CardTitle>Asset Value</CardTitle>
                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    Rp {totalAssetValue.toLocaleString()}
                  </CardTitle>
                  <CardAction>
                    <Badge variant="outline">
                      <TrendingUp className="h-4 w-4" />
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Total nilai aset
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Item Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Inventory Management</h3>
            <div className="grid grid-cols-1 @xl/main:grid-cols-2 gap-4">
              <div className="grid grid-cols-1 gap-4">
                <Card className="@container/card data-[slot=card]:bg-linear-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card data-[slot=card]:shadow-xs dark:data-[slot=card]:bg-card">
                  <CardHeader>
                    <CardTitle>Total Item</CardTitle>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                      {totalItems.toLocaleString()}
                    </CardTitle>
                    <CardAction>
                      <Badge variant="outline">
                        <TrendingUp className="h-4 w-4" />
                      </Badge>
                    </CardAction>
                  </CardHeader>
                  <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                      Total item inventaris
                    </div>
                  </CardFooter>
                </Card>

                <Card className="@container/card data-[slot=card]:bg-linear-to-t data-[slot=card]:from-primary/5 data-[slot=card]:to-card data-[slot=card]:shadow-xs dark:data-[slot=card]:bg-card">
                  <CardHeader>
                    <CardTitle>Total Transaksi</CardTitle>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                      {totalTransactions.toLocaleString()}
                    </CardTitle>
                    <CardAction>
                      <Badge variant="outline">
                        <TrendingUp className="h-4 w-4" />
                      </Badge>
                    </CardAction>
                  </CardHeader>
                  <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                      Peminjaman & pengembalian
                    </div>
                  </CardFooter>
                </Card>
              </div>

              <ChartPieItem data={itemStatusData} />
            </div>

            <div className="mt-4">
              <ChartBarInteractive data={chartData} />
            </div>
          </div>
        </div>

        {/* Right side: Notifications */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Notifikasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingMaintenances.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Perawatan Pending</h4>
                  {pendingMaintenances.map((maintenance) => (
                    <div key={maintenance.maintenance_id} className="text-sm p-2 bg-yellow-50 rounded mb-1">
                      {maintenance.asset.name} - {maintenance.note}
                    </div>
                  ))}
                </div>
              )}
              {lowStockItems.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Stok Rendah</h4>
                  {lowStockItems.map((stock) => (
                    <div key={stock.stock_id} className="text-sm p-2 bg-red-50 rounded mb-1">
                      {stock.item.name} - Stok: {stock.current_qty} (Min: {stock.min_qty})
                    </div>
                  ))}
                </div>
              )}
              {pendingMaintenances.length === 0 && lowStockItems.length === 0 && (
                <p className="text-sm text-muted-foreground">Tidak ada notifikasi</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
