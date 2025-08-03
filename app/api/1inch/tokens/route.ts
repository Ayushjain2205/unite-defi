import { NextRequest, NextResponse } from "next/server";
import { OneInchService } from "@/lib/services/1inch-service";

const oneInchService = new OneInchService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chainId = searchParams.get("chainId") || "1";
    const tokenAddress = searchParams.get("tokenAddress");
    const tokenSymbol = searchParams.get("tokenSymbol");

    if (!tokenAddress && !tokenSymbol) {
      return NextResponse.json(
        { error: "Either tokenAddress or tokenSymbol is required" },
        { status: 400 }
      );
    }

    // Get token information
    const tokenInfo = await oneInchService.getTokenInfo({
      chainId: parseInt(chainId),
      tokenAddress,
      tokenSymbol,
    });

    return NextResponse.json({
      success: true,
      token: tokenInfo,
    });
  } catch (error) {
    console.error("Error fetching token info:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to fetch token info", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromToken, toToken, amount, chainId = 1, walletAddress } = body;

    if (!fromToken || !toToken || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get quote for the swap
    const quote = await oneInchService.getQuote({
      fromToken,
      toToken,
      amount,
      chainId,
      walletAddress,
    });

    return NextResponse.json({
      success: true,
      quote,
    });
  } catch (error) {
    console.error("Error getting quote:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to get quote", details: errorMessage },
      { status: 500 }
    );
  }
}
