import { NextRequest, NextResponse } from "next/server";
import { OneInchService } from "@/lib/services/1inch-service";

const oneInchService = new OneInchService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chainId = searchParams.get("chainId") || "1";
    const tokenAddress = searchParams.get("tokenAddress");
    const tokenSymbol = searchParams.get("tokenSymbol");
    const currency = searchParams.get("currency") || "USD";

    if (!tokenAddress && !tokenSymbol) {
      return NextResponse.json(
        { error: "Either tokenAddress or tokenSymbol is required" },
        { status: 400 }
      );
    }

    // Get token price
    const price = await oneInchService.getTokenPrice({
      chainId: parseInt(chainId),
      tokenAddress,
      tokenSymbol,
      currency,
    });

    return NextResponse.json({
      success: true,
      price,
    });
  } catch (error) {
    console.error("Error fetching token price:", error);
    return NextResponse.json(
      { error: "Failed to fetch token price", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chainId = 1, tokenAddresses = [], currency = "USD" } = body;

    if (!tokenAddresses || tokenAddresses.length === 0) {
      return NextResponse.json(
        { error: "Token addresses array is required" },
        { status: 400 }
      );
    }

    // Get prices for multiple tokens
    const prices = await oneInchService.getMultipleTokenPrices({
      chainId,
      tokenAddresses,
      currency,
    });

    return NextResponse.json({
      success: true,
      prices,
    });
  } catch (error) {
    console.error("Error fetching multiple token prices:", error);
    return NextResponse.json(
      { error: "Failed to fetch token prices", details: error.message },
      { status: 500 }
    );
  }
}
