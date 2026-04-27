"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useAssetActions } from "@/hooks/useAssetActions"
import { AssetActionDetails } from "@/components/asset/action-dropdown";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"

interface Asset {
  asset_serial: string;
  name: string;
  description: string;
  category: {
    category_name: string;
  };
  qty: number;
  purcase_date: Date;
  purcase_price: number | null;
  status: number;
  location: {
    location_name: string;
  };
  qr_code_path: string;
  image: string | null;
}

interface DetailAssetProps {
  asset: Asset;
}

export function DetailAsset({ asset }: DetailAssetProps) {
  const { performQr } = useAssetActions(asset)
  const [openQr, setOpenQr] = React.useState(false)
  const qrRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef: qrRef,
    documentTitle: `QR Code - ${asset.name || asset.asset_serial}`,
  })
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
      <Card className="md:col-span-2 h-min">
        <CardHeader>
          <CardTitle>
            <h1 className="scroll-m-20 text-center text-2xl font-bold tracking-tight text-balance">{asset.name}</h1>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="font-semibold">Asset Serial:</label>
            <p className="text-muted-foreground">{asset.asset_serial}</p>
          </div>
          <div>
            <label className="font-semibold">Description:</label>
            <p className="text-muted-foreground">{asset.description}</p>
          </div>
          <div>
            <label className="font-semibold">Category:</label>
            <p className="text-muted-foreground">{asset.category.category_name}</p>
          </div>
          <div>
            <label className="font-semibold">Location:</label>
            <p className="text-muted-foreground">{asset.location.location_name}</p>
          </div>
          <div>
            <label className="font-semibold">Quantity:</label>
            <p className="text-muted-foreground">{asset.qty}</p>
          </div>
          <div>
            <label className="font-semibold">Purchase Date:</label>
            <p className="text-muted-foreground">
              {new Date(asset.purcase_date).toDateString()}
            </p>
          </div>
          <div>
            <label className="font-semibold">Purchase Price:</label>
            <p className="text-muted-foreground">
              {asset.purcase_price ? `Rp${asset.purcase_price}` : "N/A"}
            </p>
          </div>
          <div>
            <label className="font-semibold">Status: </label>
            <Badge variant={asset.status === 1 ? "default" : "secondary"}>
              {asset.status === 1 ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="bg-white flex justify-end">
          <AssetActionDetails asset={asset} />
        </CardFooter>
      </Card>

      {/* Image Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Asset Image</CardTitle>
        </CardHeader>
        <CardContent>
          {asset.image ? (
            <div className="relative w-full aspect-square">
              <Image
                src={asset.image}
                alt={asset.name}
                fill
                className="object-cover rounded"
              />
            </div>
          ) : (
            <div className="w-full aspect-square bg-muted flex items-center justify-center rounded">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
        </CardContent>

        {/* QR Code Card */}
        <CardHeader>
          <CardTitle className="text-base">QR Code</CardTitle>
        </CardHeader>
        <CardContent>
          <Drawer open={openQr} onOpenChange={setOpenQr}>
            {/* tombol qr */}
            <DrawerTrigger asChild className="cursor-pointer">
              {asset.qr_code_path ? (
                <div className="relative w-full aspect-square">
                  <Image
                    src={asset.qr_code_path}
                    alt="QR Code"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-full aspect-square bg-muted flex items-center justify-center rounded">
                  <span className="text-muted-foreground">No QR code available</span>
                </div>
              )}
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle>Asset QR Code</DrawerTitle>
                <div ref={qrRef}>
                  <div className="flex items-center justify-center p-4">
                    QR code for asset {asset.name}
                  </div>
                  <div className="flex items-center justify-center p-4">
                    {asset.qr_code_path ? (
                      <img
                        src={asset.qr_code_path}
                        alt="QR Code"
                        className="w-48 h-48"
                        onClick={() => performQr()}
                      />
                    ) : (
                      <p className="text-gray-500">QR Code not available</p>
                    )}
                  </div>
                </div>
              </DrawerHeader>
              <DrawerFooter className="pt-2">
                <Button variant="default" onClick={handlePrint}>
                  Print
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

        </CardContent>
      </Card>
    </div >
  );
}