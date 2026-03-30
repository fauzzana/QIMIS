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

    const departments = await prisma.department.findMany({
      select: {
        depart_id: true,
        depart_name: true,
      },
      orderBy: { depart_name: "asc" },
    })

    return NextResponse.json({ success: true, data: departments })
  } catch (error) {
    console.error("Error fetching departments:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}