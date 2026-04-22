import React, { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import Link from "next/link"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"
import { useAssetActions } from "@/hooks/useAssetActions"
import { EditDialog, EditDrawer } from "@/components/asset/edit-form"
import {
  MoreHorizontal,
  Trash2,
  QrCode,
  Wrench,
  Eye,
} from "lucide-react"


export default function AssetEditForm({ asset }: any) {
  const { performDelete, performQr, isDeleting } = useAssetActions(asset)
  const [openQr, setOpenQr] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const qrRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef: qrRef,
    documentTitle: `QR Code - ${asset.name || asset.asset_serial}`,
  })

  if (isDesktop) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
            size="icon"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          {/* tombol Detail */}
          <DropdownMenuItem asChild>
            <Link href={`/admin/assetManagement/${asset.asset_serial}`} className="flex items-center gap-2">
              <Eye className="mr-2 h-4 w-4" />Detail
            </Link>
          </DropdownMenuItem>
          < EditDialog asset={asset} />
          <Dialog open={openQr} onOpenChange={setOpenQr}>
            {/* tombol qr */}
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                <QrCode className="mr-2 h-4 w-4" />QR Code</DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="text-left">
                <DialogTitle>Asset QR Code</DialogTitle>
                <div ref={qrRef} >
                  <div className="flex items-center justify-center p-4">
                    <DialogDescription>{asset.name} <br /> {asset.asset_serial}</DialogDescription>
                  </div>
                  <div className="flex items-center justify-center p-4">
                    {asset.qr_code_path ? (
                      <img
                        src={asset.qr_code_path}
                        alt="QR Code"
                        className="w-64 h-64"
                        onClick={() => performQr()}
                      />
                    ) : (
                      <p className="text-gray-500">QR Code not available</p>
                    )}
                  </div>
                </div>
              </DialogHeader>
              {/* <div className="flex gap-2"> */}
              <Button variant="default" onClick={handlePrint}>Print</Button>
              <Button variant="destructive" onClick={() => setOpenQr(false)}>Close</Button>
              {/* </div> */}
            </DialogContent>
          </Dialog>
          <DropdownMenuSeparator />
          {/* tombol request maintenance */}
          <DropdownMenuItem onClick={() => alert("Request maintenance feature coming soon!")} onSelect={(event) => event.preventDefault()}>
            <Wrench className="mr-2 h-4 w-4" />Maintain</DropdownMenuItem>
          {/* tombol delete */}
          <DropdownMenuItem
            variant="destructive"
            onClick={performDelete}
            onSelect={(event) => event.preventDefault()}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
          size="icon"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {/* tombol Detail */}
        <DropdownMenuItem asChild>
          <Link href={`/admin/assetManagement/${asset.asset_serial}`} className="flex items-center gap-2">
            <Eye className="mr-2 h-4 w-4" />Detail
          </Link>
        </DropdownMenuItem>
        <EditDrawer asset={asset} />
        <Drawer open={openQr} onOpenChange={setOpenQr}>
          {/* tombol qr */}
          <DrawerTrigger asChild>
            <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
              <QrCode className="mr-2 h-4 w-4" />QR Code</DropdownMenuItem>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Asset QR Code</DrawerTitle>
              <div ref={qrRef} className="flex items-center justify-center p-4">
                QR code for asset {asset.name}
              </div>
            </DrawerHeader>
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
            <DrawerFooter className="pt-2">
              <Button variant="link" onClick={handlePrint}>Print</Button>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <DropdownMenuSeparator />
        {/* tombol request maintenance */}
        <DropdownMenuItem onClick={() => alert("Request maintenance feature coming soon!")} onSelect={(event) => event.preventDefault()}>
          <Wrench className="mr-2 h-4 w-4" />Maintain</DropdownMenuItem>
        {/* tombol delete */}
        <DropdownMenuItem
          variant="destructive"
          onClick={performDelete}
          onSelect={(event) => event.preventDefault()}
          disabled={isDeleting}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {isDeleting ? "Deleting..." : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}