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

    const asset = await prisma.asset.findMany({
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
        purcase_date: true,
        purcase_price: true,
        status: true,
        location: {
          select: {
            location_name: true,
          }
        },
        qr_code_path: true,
      },
      orderBy: {
        purcase_date: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      data: asset,
      total: asset.length,
    })
  } catch (error) {
    console.error("Error fetching assets:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      asset_serial,
      name,
      description,
      qty,
      purcase_date,
      purcase_price,
      status,
    } = body

    if (!asset_serial) {
      return NextResponse.json(
        { error: "asset_serial is required" },
        { status: 400 }
      )
    }

    const updatedAsset = await prisma.asset.update({
      where: { asset_serial },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(qty !== undefined ? { qty: Number(qty) } : {}),
        ...(purcase_date !== undefined
          ? { purcase_date: new Date(purcase_date) }
          : {}),
        ...(purcase_price !== undefined
          ? { purcase_price: purcase_price === null ? null : Number(purcase_price) }
          : {}),
        ...(status !== undefined ? { status: Number(status) } : {}),
      },
    })

    return NextResponse.json({ success: true, data: updatedAsset })
  } catch (error) {
    console.error("Error updating asset:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { asset_serial } = body

    if (!asset_serial) {
      return NextResponse.json(
        { error: "asset_serial is required" },
        { status: 400 }
      )
    }

    await prisma.asset.delete({ where: { asset_serial } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting asset:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}