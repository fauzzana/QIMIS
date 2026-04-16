import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { string } from "zod"

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { item_id, person_name, department, qty, action } = body

    if (!item_id || !person_name || !department || qty === undefined || action === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (typeof qty !== 'number' || qty <= 0) {
      return NextResponse.json(
        { error: "Quantity must be a positive number" },
        { status: 400 }
      )
    }

    // Check if item exists and get current stock
    const item = await prisma.item.findUnique({
      where: { item_id },
      include: {
        stockItems: true,
      },
    })

    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      )
    }

    const currentQty = item.stockItems[0]?.current_qty ?? 0
    const stockId = item.stockItems[0]?.stock_id

    if (item.stockItems.length === 0) {
      return NextResponse.json(
        { error: "No stock information found for this item" },
        { status: 404 }
      )
    }

    // For retrieval (action = false), check if enough stock
    if (!action && qty > currentQty) {
      return NextResponse.json(
        {
          error: `Insufficient stock. Available: ${currentQty}, Requested: ${qty}`,
          alert: true
        },
        { status: 400 }
      )
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        user_id: session.user.id,
        action: action, // true for store, false for retrieval
      },
    })

    // Create transaction detail
    await prisma.transactionDetail.create({
      data: {
        transaction_id: transaction.id,
        item_id,
        person_name,
        qty,
      },
    })

    // Update stock
    const newQty = action ? currentQty + qty : currentQty - qty

    await prisma.stockItem.update({
      where: { stock_id: stockId },
      data: {
        current_qty: newQty,
      },
    })

    return NextResponse.json({
      success: true,
      message: action ? "Item stored successfully" : "Item retrieved successfully",
      transaction_id: transaction.id,
      new_quantity: newQty,
    })

  } catch (error) {
    console.error("Transaction error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}