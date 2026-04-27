import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ item_id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { item_id } = resolvedParams;

    if (!item_id || item_id === "undefined") {
      return NextResponse.json(
        { error: "Item ID is required and must be valid" },
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

    const item = await prisma.item.findUnique({
      where: {
        item_id: item_id,
      },
      select: {
        item_id: true,
        name: true,
        category: {
          select: {
            category_name: true,
          }
        },
        location: {
          select: {
            location_name: true,
          }
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
    })

    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: item,
    })
  } catch (error) {
    console.error("Error fetching item - Details:", {
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