import { NextRequest, NextResponse } from "next/server";
import { OneInchService } from "@/lib/services/1inch-service";

const oneInchService = new OneInchService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chainId = searchParams.get("chainId") || "1";
    const tokenAddress = searchParams.get("tokenAddress") || undefined;
    const tokenSymbol = searchParams.get("tokenSymbol") || undefined;

    if (!tokenAddress && !tokenSymbol) {
      return NextResponse.json(
        { error: "Either tokenAddress or tokenSymbol is required" },
        { status: 400 }
      );
    }

    // Get token metadata
    const metadata = await oneInchService.getTokenMetadata({
      chainId: parseInt(chainId),
      tokenAddress,
      tokenSymbol,
    });

    return NextResponse.json({
      success: true,
      metadata,
    });
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to fetch token metadata", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chainId = 1, tokenAddresses = [] } = body;

    if (!tokenAddresses || tokenAddresses.length === 0) {
      return NextResponse.json(
        { error: "Token addresses array is required" },
        { status: 400 }
      );
    }

    // Get metadata for multiple tokens
    const metadataList = await oneInchService.getMultipleTokenMetadata({
      chainId,
      tokenAddresses,
    });

    return NextResponse.json({
      success: true,
      metadata: metadataList,
    });
  } catch (error) {
    console.error("Error fetching multiple token metadata:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to fetch token metadata", details: errorMessage },
      { status: 500 }
    );
  }
}
