"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

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
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>{asset.name}</CardTitle>
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
        </CardContent>

      </Card>
    </div>
  );
}