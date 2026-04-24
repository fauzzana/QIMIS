"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "An interactive bar chart"

const chartConfig = {
  borrow: {
    label: "Peminjaman",
    color: "var(--chart-2)",
  },
  return: {
    label: "Pengembalian",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartBarInteractive({ data }: { data: { date: string; borrow: number; return: number }[] }) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("borrow")

  const total = React.useMemo(
    () => ({
      borrow: data.reduce((acc, curr) => acc + curr.borrow, 0),
      return: data.reduce((acc, curr) => acc + curr.return, 0),
    }),
    [data]
  )

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
          <CardTitle>Transaksi Bulanan</CardTitle>
          <CardDescription>
            Peminjaman dan pengembalian 3 bulan terakhir
          </CardDescription>
        </div>
        <div className="flex">
          {["borrow", "return"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-62.5 w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("id-ID", {
                  month: "short",
                  year: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-37.5"
                  nameKey="transactions"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("id-ID", {
                      month: "short",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
