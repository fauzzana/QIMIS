import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ asset_serial: string }> }
) {
  try {
    const resolvedParams = await params;
    const { asset_serial } = resolvedParams;

    if (!asset_serial || asset_serial === "undefined") {
      return NextResponse.json(
        { error: "Asset serial is required and must be valid" },
        { status: 400 }
      )
    }

    const session = await auth()

    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      )
    }

    const asset = await prisma.asset.findUnique({
      where: {
        asset_serial: asset_serial,
      },
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
    })

    if (!asset) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: asset,
    })
  } catch (error) {
    console.error("Error fetching asset - Details:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}