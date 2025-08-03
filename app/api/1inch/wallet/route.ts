import { NextRequest, NextResponse } from "next/server";
import { OneInchService } from "@/lib/services/1inch-service";

const oneInchService = new OneInchService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");
    const chainId = searchParams.get("chainId") || "1";
    const tokenAddress = searchParams.get("tokenAddress");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    // Get wallet balances
    const balances = await oneInchService.getWalletBalances({
      walletAddress,
      chainId: parseInt(chainId),
      tokenAddress,
    });

    return NextResponse.json({
      success: true,
      balances,
    });
  } catch (error) {
    console.error("Error fetching wallet balances:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet balances", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, chainId = 1, tokenAddresses = [] } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    // Get detailed token balances for specific tokens
    const tokenBalances = await oneInchService.getTokenBalances({
      walletAddress,
      chainId,
      tokenAddresses,
    });

    return NextResponse.json({
      success: true,
      tokenBalances,
    });
  } catch (error) {
    console.error("Error fetching token balances:", error);
    return NextResponse.json(
      { error: "Failed to fetch token balances", details: error.message },
      { status: 500 }
    );
  }
}
