"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { use1Inch } from "@/hooks/use-1inch";
import { toast } from "sonner";

interface TokenBalance {
  tokenAddress: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  balanceUsd?: string;
  logoURI?: string;
}

interface TokenMetadata {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  tags?: string[];
}

interface TokenPrice {
  tokenAddress: string;
  symbol: string;
  price: number;
  currency: string;
}

export function WalletBalancePanel() {
  const {
    loading,
    error,
    getWalletBalances,
    getTokenBalances,
    getTokenMetadata,
    getTokenPrice,
  } = use1Inch();

  const [walletAddress, setWalletAddress] = useState("");
  const [chainId, setChainId] = useState(1);
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [metadata, setMetadata] = useState<TokenMetadata | null>(null);
  const [price, setPrice] = useState<TokenPrice | null>(null);
  const [selectedToken, setSelectedToken] = useState("");

  const loadWalletBalances = async () => {
    if (!walletAddress) {
      toast.error("Please enter a wallet address");
      return;
    }

    try {
      const balancesData = await getWalletBalances({
        walletAddress,
        chainId,
      });
      setBalances(balancesData.tokens || []);
      toast.success("Wallet balances loaded successfully!");
    } catch (error) {
      console.error("Failed to load wallet balances:", error);
    }
  };

  const loadTokenMetadata = async () => {
    if (!selectedToken) {
      toast.error("Please enter a token address or symbol");
      return;
    }

    try {
      const metadataData = await getTokenMetadata({
        chainId,
        tokenAddress: selectedToken.startsWith("0x")
          ? selectedToken
          : undefined,
        tokenSymbol: selectedToken.startsWith("0x") ? undefined : selectedToken,
      });
      setMetadata(metadataData);
      toast.success("Token metadata loaded successfully!");
    } catch (error) {
      console.error("Failed to load token metadata:", error);
    }
  };

  const loadTokenPrice = async () => {
    if (!selectedToken) {
      toast.error("Please enter a token address or symbol");
      return;
    }

    try {
      const priceData = await getTokenPrice({
        chainId,
        tokenAddress: selectedToken.startsWith("0x")
          ? selectedToken
          : undefined,
        tokenSymbol: selectedToken.startsWith("0x") ? undefined : selectedToken,
        currency: "USD",
      });
      setPrice(priceData);
      toast.success("Token price loaded successfully!");
    } catch (error) {
      console.error("Failed to load token price:", error);
    }
  };

  const formatBalance = (balance: string, decimals: number) => {
    const balanceNum = parseFloat(balance) / Math.pow(10, decimals);
    return balanceNum.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wallet Balances</CardTitle>
          <CardDescription>
            View wallet balances and token information using 1inch APIs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Wallet Address Input */}
          <div className="space-y-2">
            <Label htmlFor="wallet">Wallet Address</Label>
            <Input
              id="wallet"
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
          </div>

          {/* Chain Selection */}
          <div className="space-y-2">
            <Label htmlFor="chain">Chain</Label>
            <Select
              value={chainId.toString()}
              onValueChange={(value) => setChainId(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Ethereum Mainnet</SelectItem>
                <SelectItem value="137">Polygon</SelectItem>
                <SelectItem value="56">Binance Smart Chain</SelectItem>
                <SelectItem value="42161">Arbitrum One</SelectItem>
                <SelectItem value="10">Optimism</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={loadWalletBalances} disabled={loading}>
              {loading ? "Loading..." : "Load Wallet Balances"}
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Balances Display */}
          {balances.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Token Balances</h3>
              <div className="grid gap-4">
                {balances.map((token) => (
                  <div
                    key={token.tokenAddress}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {token.logoURI && (
                          <img
                            src={token.logoURI}
                            alt={token.symbol}
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        <div>
                          <div className="font-medium">{token.symbol}</div>
                          <div className="text-sm text-gray-600">
                            {token.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatBalance(token.balance, token.decimals)}{" "}
                          {token.symbol}
                        </div>
                        {token.balanceUsd && (
                          <div className="text-sm text-gray-600">
                            ${parseFloat(token.balanceUsd).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {token.tokenAddress}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Token Information Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Token Information</CardTitle>
          <CardDescription>
            Get token metadata and price information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Token Input */}
          <div className="space-y-2">
            <Label htmlFor="token">Token Address or Symbol</Label>
            <Input
              id="token"
              placeholder="0x... or ETH"
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={loadTokenMetadata} disabled={loading}>
              Get Metadata
            </Button>
            <Button onClick={loadTokenPrice} disabled={loading}>
              Get Price
            </Button>
          </div>

          {/* Metadata Display */}
          {metadata && (
            <div className="border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold">Token Metadata</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Symbol:</span> {metadata.symbol}
                </div>
                <div>
                  <span className="font-medium">Name:</span> {metadata.name}
                </div>
                <div>
                  <span className="font-medium">Decimals:</span>{" "}
                  {metadata.decimals}
                </div>
                <div>
                  <span className="font-medium">Address:</span>{" "}
                  <span className="font-mono text-xs">{metadata.address}</span>
                </div>
              </div>
              {metadata.tags && metadata.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {metadata.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Price Display */}
          {price && (
            <div className="border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold">Token Price</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Symbol:</span> {price.symbol}
                </div>
                <div>
                  <span className="font-medium">Price:</span> $
                  {price.price.toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Currency:</span>{" "}
                  {price.currency}
                </div>
                <div>
                  <span className="font-medium">Address:</span>{" "}
                  <span className="font-mono text-xs">
                    {price.tokenAddress}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
