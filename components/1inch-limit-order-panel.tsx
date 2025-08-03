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
import {
  use1Inch,
  type LimitOrderParams,
  type LimitOrderResponse,
} from "@/hooks/use-1inch";
import { toast } from "sonner";

export function OneInchLimitOrderPanel() {
  const {
    loading,
    error,
    createLimitOrder,
    getLimitOrders,
    modifyLimitOrder,
    cancelLimitOrder,
    getQuote,
  } = use1Inch();

  const [orders, setOrders] = useState<LimitOrderResponse[]>([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [formData, setFormData] = useState({
    orderSide: "BUY" as "BUY" | "SELL",
    amount: "",
    fromToken: "USDT",
    toToken: "ETH",
    limitPrice: "",
    expiry: "1D",
    chainId: 1,
  });

  const [quote, setQuote] = useState<any>(null);

  // Load orders on component mount
  useEffect(() => {
    if (walletAddress) {
      loadOrders();
    }
  }, [walletAddress]);

  const loadOrders = async () => {
    try {
      const ordersData = await getLimitOrders(walletAddress, formData.chainId);
      setOrders(ordersData);
    } catch (error) {
      console.error("Failed to load orders:", error);
    }
  };

  const handleCreateOrder = async () => {
    if (!walletAddress) {
      toast.error("Please enter a wallet address");
      return;
    }

    if (!formData.amount || !formData.limitPrice) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const orderParams: LimitOrderParams = {
        orderSide: formData.orderSide,
        amount: parseFloat(formData.amount),
        fromToken: formData.fromToken,
        toToken: formData.toToken,
        limitPrice: parseFloat(formData.limitPrice),
        expiry: formData.expiry,
        walletAddress,
        chainId: formData.chainId,
      };

      const newOrder = await createLimitOrder(orderParams);
      toast.success("Limit order created successfully!");

      // Reload orders
      await loadOrders();

      // Reset form
      setFormData((prev) => ({
        ...prev,
        amount: "",
        limitPrice: "",
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to create order: ${errorMessage}`);
    }
  };

  const handleGetQuote = async () => {
    if (!walletAddress || !formData.amount) {
      toast.error("Please enter wallet address and amount");
      return;
    }

    try {
      const quoteData = await getQuote({
        fromToken: formData.fromToken,
        toToken: formData.toToken,
        amount: parseFloat(formData.amount),
        chainId: formData.chainId,
        walletAddress,
      });
      setQuote(quoteData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to get quote: ${errorMessage}`);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelLimitOrder(orderId, walletAddress);
      toast.success("Order cancelled successfully!");
      await loadOrders();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to cancel order: ${errorMessage}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "filled":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>1inch Limit Orders</CardTitle>
          <CardDescription>
            Create and manage limit orders using 1inch protocol
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Wallet Address */}
          <div className="space-y-2">
            <Label htmlFor="wallet">Wallet Address</Label>
            <Input
              id="wallet"
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
          </div>

          {/* Order Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orderSide">Order Side</Label>
              <Select
                value={formData.orderSide}
                onValueChange={(value: "BUY" | "SELL") =>
                  setFormData((prev) => ({ ...prev, orderSide: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUY">Buy</SelectItem>
                  <SelectItem value="SELL">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.0"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromToken">From Token</Label>
              <Select
                value={formData.fromToken}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, fromToken: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USDT">USDT</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="toToken">To Token</Label>
              <Select
                value={formData.toToken}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, toToken: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USDT">USDT</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="limitPrice">Limit Price</Label>
              <Input
                id="limitPrice"
                type="number"
                placeholder="0.0"
                value={formData.limitPrice}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    limitPrice: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry</Label>
              <Select
                value={formData.expiry}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, expiry: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1H">1 Hour</SelectItem>
                  <SelectItem value="4H">4 Hours</SelectItem>
                  <SelectItem value="1D">1 Day</SelectItem>
                  <SelectItem value="7D">7 Days</SelectItem>
                  <SelectItem value="30D">30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={handleGetQuote} disabled={loading}>
              Get Quote
            </Button>
            <Button onClick={handleCreateOrder} disabled={loading}>
              {loading ? "Creating..." : "Create Limit Order"}
            </Button>
            <Button onClick={loadOrders} variant="outline" disabled={loading}>
              Refresh Orders
            </Button>
          </div>

          {/* Quote Display */}
          {quote && (
            <Card className="bg-blue-50">
              <CardHeader>
                <CardTitle className="text-sm">Quote</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <div>
                    From: {quote.fromAmount} {quote.fromToken}
                  </div>
                  <div>
                    To: {quote.toAmount} {quote.toToken}
                  </div>
                  <div>Price: {quote.price}</div>
                  <div>Gas Estimate: {quote.gasEstimate}</div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Orders</CardTitle>
          <CardDescription>Your current limit orders</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No orders found</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.orderId}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">
                        {order.orderSide} {order.amount} {order.fromToken} for{" "}
                        {order.toToken}
                      </div>
                      <div className="text-sm text-gray-600">
                        Limit Price: {order.limitPrice}
                      </div>
                      <div className="text-sm text-gray-600">
                        Created: {new Date(order.createdAt).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        Expires: {new Date(order.expiresAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancelOrder(order.orderId)}
                        disabled={order.status !== "active"}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                  {order.txHash && (
                    <div className="text-sm text-gray-600">
                      TX Hash: {order.txHash}
                    </div>
                  )}
                  {order.fillAmount && (
                    <div className="text-sm text-green-600">
                      Filled: {order.fillAmount} at {order.fillPrice}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
