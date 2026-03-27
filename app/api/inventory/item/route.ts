import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      )
    }

    const item = await prisma.item.findMany({
      select: {
      item_id: true,
      name: true,
      category: {
        select: {
          category_name: true,
        },
      },
      stockItems: {
        select: {
          current_qty: true,
        },
      },
      location: {
        select: {
          location_name: true,
        },
      },
    },
    orderBy: {
      category_id: "desc",
    },
    })

    return NextResponse.json({
      success: true,
      data: item,
      total: item.length,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}