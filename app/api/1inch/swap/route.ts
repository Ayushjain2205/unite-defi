import { NextRequest, NextResponse } from "next/server";
import { OneInchService } from "@/lib/services/1inch-service";

const oneInchService = new OneInchService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fromToken,
      toToken,
      amount,
      slippage = 1, // Default 1% slippage
      walletAddress,
      chainId = 1,
      gasPrice,
      gasLimit,
      deadline,
    } = body;

    // Validate required fields
    if (!fromToken || !toToken || !amount || !walletAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Execute swap
    const swapResult = await oneInchService.executeSwap({
      fromToken,
      toToken,
      amount,
      slippage,
      walletAddress,
      chainId,
      gasPrice,
      gasLimit,
      deadline,
    });

    return NextResponse.json({
      success: true,
      swap: swapResult,
      message: "Swap executed successfully",
    });
  } catch (error) {
    console.error("Error executing swap:", error);
    return NextResponse.json(
      { error: "Failed to execute swap", details: error.message },
      { status: 500 }
    );
  }
}
