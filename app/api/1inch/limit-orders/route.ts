import { NextRequest, NextResponse } from "next/server";
import { OneInchService } from "@/lib/services/1inch-service";

const oneInchService = new OneInchService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderSide,
      amount,
      fromToken,
      toToken,
      limitPrice,
      expiry,
      walletAddress,
      chainId = 1, // Default to Ethereum mainnet
    } = body;

    // Validate required fields
    if (
      !orderSide ||
      !amount ||
      !fromToken ||
      !toToken ||
      !limitPrice ||
      !walletAddress
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create limit order
    const order = await oneInchService.createLimitOrder({
      orderSide,
      amount,
      fromToken,
      toToken,
      limitPrice,
      expiry,
      walletAddress,
      chainId,
    });

    return NextResponse.json({
      success: true,
      order,
      message: "Limit order created successfully",
    });
  } catch (error) {
    console.error("Error creating limit order:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to create limit order", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");
    const chainId = searchParams.get("chainId") || "1";
    const status = searchParams.get("status") || undefined; // 'active', 'filled', 'cancelled'

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    // Get limit orders for the wallet
    const orders = await oneInchService.getLimitOrders({
      walletAddress,
      chainId: parseInt(chainId),
      status,
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching limit orders:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to fetch limit orders", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, newPrice, newAmount, walletAddress } = body;

    if (!orderId || !walletAddress) {
      return NextResponse.json(
        { error: "Order ID and wallet address are required" },
        { status: 400 }
      );
    }

    // Modify existing limit order
    const updatedOrder = await oneInchService.modifyLimitOrder({
      orderId,
      newPrice,
      newAmount,
      walletAddress,
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: "Limit order modified successfully",
    });
  } catch (error) {
    console.error("Error modifying limit order:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to modify limit order", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const walletAddress = searchParams.get("walletAddress");

    if (!orderId || !walletAddress) {
      return NextResponse.json(
        { error: "Order ID and wallet address are required" },
        { status: 400 }
      );
    }

    // Cancel limit order
    await oneInchService.cancelLimitOrder({
      orderId,
      walletAddress,
    });

    return NextResponse.json({
      success: true,
      message: "Limit order cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling limit order:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to cancel limit order", details: errorMessage },
      { status: 500 }
    );
  }
}
