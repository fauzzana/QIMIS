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

    const locations = await prisma.location.findMany({
      select: {
        location_id: true,
        location_name: true,
      },
      orderBy: { location_name: "asc" },
    })

    return NextResponse.json({ success: true, data: locations })
  } catch (error) {
    console.error("Error fetching locations:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      )
    }

    const data = await request.json()
    const { location_id, location_name } = data

    if (!location_id) {
      return NextResponse.json(
        { error: "asset_serial is required" },
        { status: 400 }
      )
    }

    const location =
      location_id || ""
        ? await prisma.location.findUnique({ where: { location_id: location_id } })
        : await prisma.location.findFirst()

    if (!location) {
      return NextResponse.json(
        { error: "Location not found. Please create a location first." },
        { status: 400 }
      )
    }

    const newLocation = await prisma.location.create({
      data: {
        location_id,
        location_name,
      },
    })

    return NextResponse.json({ success: true, data: newLocation })
  } catch (error) {
    console.error("Error creating location:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
