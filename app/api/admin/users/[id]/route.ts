import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { name, role, department_name } = body

    // Find department by name
    let depart_id = null
    if (department_name) {
      const department = await prisma.department.findFirst({
        where: { depart_name: department_name },
        select: { depart_id: true },
      })
      depart_id = department?.depart_id || null
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        role,
        depart_id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        userId: true,
        department: {
          select: {
            depart_name: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: updatedUser })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}