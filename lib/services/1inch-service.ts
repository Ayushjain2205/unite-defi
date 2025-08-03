import { ethers } from "ethers";

export interface LimitOrderParams {
  orderSide: "BUY" | "SELL";
  amount: number;
  fromToken: string;
  toToken: string;
  limitPrice: number;
  expiry: string;
  walletAddress: string;
  chainId: number;
}

export interface LimitOrderResponse {
  orderId: string;
  status: "pending" | "active" | "filled" | "cancelled" | "expired";
  createdAt: Date;
  expiresAt: Date;
  amount: number;
  limitPrice: number;
  fromToken: string;
  toToken: string;
  orderSide: "BUY" | "SELL";
  txHash?: string;
  fillAmount?: number;
  fillPrice?: number;
}

export interface GetOrdersParams {
  walletAddress: string;
  chainId: number;
  status?: string;
}

export interface ModifyOrderParams {
  orderId: string;
  newPrice?: number;
  newAmount?: number;
  walletAddress: string;
}

export interface CancelOrderParams {
  orderId: string;
  walletAddress: string;
}

export class OneInchService {
  private baseUrl = "https://api.1inch.dev";
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.ONEINCH_API_KEY || "";
    if (!this.apiKey) {
      console.warn(
        "1inch API key not found. Please set ONEINCH_API_KEY environment variable."
      );
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `1inch API error: ${response.status} - ${
          errorData.message || response.statusText
        }`
      );
    }

    return response.json();
  }

  async createLimitOrder(
    params: LimitOrderParams
  ): Promise<LimitOrderResponse> {
    try {
      const {
        orderSide,
        amount,
        fromToken,
        toToken,
        limitPrice,
        expiry,
        walletAddress,
        chainId,
      } = params;

      // Get token addresses for the specified chain
      const fromTokenAddress = await this.getTokenAddress(fromToken, chainId);
      const toTokenAddress = await this.getTokenAddress(toToken, chainId);

      // Calculate expiry timestamp
      const expiryTimestamp = this.calculateExpiryTimestamp(expiry);

      // Prepare order data
      const orderData = {
        makerAsset: orderSide === "BUY" ? toTokenAddress : fromTokenAddress,
        takerAsset: orderSide === "BUY" ? fromTokenAddress : toTokenAddress,
        makerAmount: this.calculateMakerAmount(amount, limitPrice, orderSide),
        takerAmount: this.calculateTakerAmount(amount, limitPrice, orderSide),
        maker: walletAddress,
        receiver: walletAddress,
        allowedSender: walletAddress,
        permit: "0x", // No permit for now
        interactions: "0x", // No interactions for now
        expiry: expiryTimestamp,
        salt: this.generateSalt(),
      };

      // Create limit order using 1inch API
      const response = await this.makeRequest(
        "/limit-order-protocol/v4.0/1/limit-order",
        {
          method: "POST",
          body: JSON.stringify(orderData),
        }
      );

      return {
        orderId: response.orderId || this.generateOrderId(),
        status: "pending",
        createdAt: new Date(),
        expiresAt: new Date(expiryTimestamp * 1000),
        amount,
        limitPrice,
        fromToken,
        toToken,
        orderSide,
      };
    } catch (error) {
      console.error("Error creating limit order:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to create limit order: ${errorMessage}`);
    }
  }

  async getLimitOrders(params: GetOrdersParams): Promise<LimitOrderResponse[]> {
    try {
      const { walletAddress, chainId, status } = params;

      // Get orders from 1inch API
      const response = await this.makeRequest(
        `/limit-order-protocol/v4.0/${chainId}/limit-orders?maker=${walletAddress}${
          status ? `&status=${status}` : ""
        }`
      );

      // Transform response to our format
      return (
        response.orders?.map((order: any) => ({
          orderId: order.orderId,
          status: this.mapOrderStatus(order.status),
          createdAt: new Date(order.createdAt),
          expiresAt: new Date(order.expiry * 1000),
          amount: this.parseAmount(order.makerAmount, order.takerAmount),
          limitPrice: this.calculatePrice(order.makerAmount, order.takerAmount),
          fromToken: order.makerAsset,
          toToken: order.takerAsset,
          orderSide: this.determineOrderSide(
            order.makerAsset,
            order.takerAsset
          ),
          txHash: order.txHash,
          fillAmount: order.fillAmount,
          fillPrice: order.fillPrice,
        })) || []
      );
    } catch (error) {
      console.error("Error fetching limit orders:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to fetch limit orders: ${errorMessage}`);
    }
  }

  async modifyLimitOrder(
    params: ModifyOrderParams
  ): Promise<LimitOrderResponse> {
    try {
      const { orderId, newPrice, newAmount, walletAddress } = params;

      // First cancel the existing order
      await this.cancelLimitOrder({ orderId, walletAddress });

      // Then create a new order with updated parameters
      // Note: This is a simplified approach. In production, you'd want to use 1inch's order modification API
      const existingOrder = await this.getOrderById(orderId);

      if (!existingOrder) {
        throw new Error("Order not found");
      }

      const updatedOrder = await this.createLimitOrder({
        orderSide: existingOrder.orderSide,
        amount: newAmount || existingOrder.amount,
        fromToken: existingOrder.fromToken,
        toToken: existingOrder.toToken,
        limitPrice: newPrice || existingOrder.limitPrice,
        expiry: "1D", // Default expiry
        walletAddress,
        chainId: 1, // Default to Ethereum
      });

      return updatedOrder;
    } catch (error) {
      console.error("Error modifying limit order:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to modify limit order: ${errorMessage}`);
    }
  }

  async cancelLimitOrder(params: CancelOrderParams): Promise<void> {
    try {
      const { orderId, walletAddress } = params;

      // Cancel order using 1inch API
      await this.makeRequest(
        `/limit-order-protocol/v4.0/1/limit-order/${orderId}/cancel`,
        {
          method: "POST",
          body: JSON.stringify({
            maker: walletAddress,
          }),
        }
      );
    } catch (error) {
      console.error("Error cancelling limit order:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to cancel limit order: ${errorMessage}`);
    }
  }

  async getOrderById(orderId: string): Promise<LimitOrderResponse | null> {
    try {
      const response = await this.makeRequest(
        `/limit-order-protocol/v4.0/1/limit-order/${orderId}`
      );

      if (!response) {
        return null;
      }

      return {
        orderId: response.orderId,
        status: this.mapOrderStatus(response.status),
        createdAt: new Date(response.createdAt),
        expiresAt: new Date(response.expiry * 1000),
        amount: this.parseAmount(response.makerAmount, response.takerAmount),
        limitPrice: this.calculatePrice(
          response.makerAmount,
          response.takerAmount
        ),
        fromToken: response.makerAsset,
        toToken: response.takerAsset,
        orderSide: this.determineOrderSide(
          response.makerAsset,
          response.takerAsset
        ),
        txHash: response.txHash,
        fillAmount: response.fillAmount,
        fillPrice: response.fillPrice,
      };
    } catch (error) {
      console.error("Error fetching order by ID:", error);
      return null;
    }
  }

  // Helper methods
  private async getTokenAddress(
    symbol: string,
    chainId: number
  ): Promise<string> {
    // In a real implementation, you'd have a token registry
    // For now, return common token addresses
    const tokenAddresses: Record<string, Record<number, string>> = {
      USDT: {
        1: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        137: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      },
      USDC: {
        1: "0xA0b86a33E6441b8C4C8C0C8C0C8C0C8C0C8C0C8",
        137: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      },
      ETH: {
        1: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeEe",
        137: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      },
      BTC: {
        1: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        137: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
      },
    };

    return (
      tokenAddresses[symbol]?.[chainId] ||
      "0x0000000000000000000000000000000000000000"
    );
  }

  private calculateExpiryTimestamp(expiry: string): number {
    const now = Math.floor(Date.now() / 1000);

    switch (expiry) {
      case "1H":
        return now + 3600;
      case "4H":
        return now + 14400;
      case "1D":
        return now + 86400;
      case "7D":
        return now + 604800;
      case "30D":
        return now + 2592000;
      case "NEVER":
        return now + 31536000; // 1 year
      default:
        return now + 86400; // Default to 1 day
    }
  }

  private calculateMakerAmount(
    amount: number,
    price: number,
    side: "BUY" | "SELL"
  ): string {
    if (side === "BUY") {
      return ethers.utils.parseUnits(amount.toString(), 18).toString();
    } else {
      return ethers.utils
        .parseUnits((amount * price).toString(), 18)
        .toString();
    }
  }

  private calculateTakerAmount(
    amount: number,
    price: number,
    side: "BUY" | "SELL"
  ): string {
    if (side === "BUY") {
      return ethers.utils
        .parseUnits((amount * price).toString(), 18)
        .toString();
    } else {
      return ethers.utils.parseUnits(amount.toString(), 18).toString();
    }
  }

  private generateSalt(): string {
    return ethers.utils.randomBytes(32).toString();
  }

  private generateOrderId(): string {
    return Date.now().toString() + Math.random().toString();
  }

  private mapOrderStatus(status: string): LimitOrderResponse["status"] {
    switch (status?.toLowerCase()) {
      case "pending":
        return "pending";
      case "active":
        return "active";
      case "filled":
        return "filled";
      case "cancelled":
        return "cancelled";
      case "expired":
        return "expired";
      default:
        return "pending";
    }
  }

  private parseAmount(makerAmount: string, takerAmount: string): number {
    return parseFloat(ethers.utils.formatUnits(makerAmount, 18));
  }

  private calculatePrice(makerAmount: string, takerAmount: string): number {
    const maker = parseFloat(ethers.utils.formatUnits(makerAmount, 18));
    const taker = parseFloat(ethers.utils.formatUnits(takerAmount, 18));
    return taker / maker;
  }

  private determineOrderSide(
    makerAsset: string,
    takerAsset: string
  ): "BUY" | "SELL" {
    // This is a simplified logic. In practice, you'd need to know the base token
    const baseTokens = ["USDT", "USDC", "ETH"];
    const makerSymbol = this.getTokenSymbol(makerAsset);
    const takerSymbol = this.getTokenSymbol(takerAsset);

    if (baseTokens.includes(makerSymbol)) {
      return "BUY";
    } else {
      return "SELL";
    }
  }

  private getTokenSymbol(address: string): string {
    // In a real implementation, you'd have a token registry
    // For now, return a default symbol
    return "UNKNOWN";
  }

  async getTokenInfo(params: {
    chainId: number;
    tokenAddress?: string;
    tokenSymbol?: string;
  }) {
    try {
      const { chainId, tokenAddress, tokenSymbol } = params;

      if (tokenAddress) {
        // Get token info by address
        const response = await this.makeRequest(
          `/swap/v6.0/${chainId}/tokens/${tokenAddress}`
        );
        return response;
      } else if (tokenSymbol) {
        // Get token info by symbol
        const response = await this.makeRequest(
          `/swap/v6.0/${chainId}/tokens?symbol=${tokenSymbol}`
        );
        return response.tokens?.[0] || null;
      }

      return null;
    } catch (error) {
      console.error("Error getting token info:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to get token info: ${errorMessage}`);
    }
  }

  async getQuote(params: {
    fromToken: string;
    toToken: string;
    amount: number;
    chainId: number;
    walletAddress: string;
  }) {
    try {
      const { fromToken, toToken, amount, chainId, walletAddress } = params;

      // Get token addresses
      const fromTokenAddress = await this.getTokenAddress(fromToken, chainId);
      const toTokenAddress = await this.getTokenAddress(toToken, chainId);

      // Get quote from 1inch API
      const response = await this.makeRequest(
        `/swap/v6.0/${chainId}/quote?src=${fromTokenAddress}&dst=${toTokenAddress}&amount=${amount}&from=${walletAddress}`
      );

      return {
        fromToken,
        toToken,
        fromAmount: amount,
        toAmount: response.toAmount,
        price: response.toAmount / amount,
        gasEstimate: response.gas,
        protocols: response.protocols,
      };
    } catch (error) {
      console.error("Error getting quote:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to get quote: ${errorMessage}`);
    }
  }

  async executeSwap(params: {
    fromToken: string;
    toToken: string;
    amount: number;
    slippage: number;
    walletAddress: string;
    chainId: number;
    gasPrice?: number;
    gasLimit?: number;
    deadline?: number;
  }) {
    try {
      const {
        fromToken,
        toToken,
        amount,
        slippage,
        walletAddress,
        chainId,
        gasPrice,
        gasLimit,
        deadline,
      } = params;

      // Get token addresses
      const fromTokenAddress = await this.getTokenAddress(fromToken, chainId);
      const toTokenAddress = await this.getTokenAddress(toToken, chainId);

      // Get swap transaction data
      const response = await this.makeRequest(
        `/swap/v6.0/${chainId}/swap?src=${fromTokenAddress}&dst=${toTokenAddress}&amount=${amount}&from=${walletAddress}&slippage=${slippage}${
          gasPrice ? `&gasPrice=${gasPrice}` : ""
        }${gasLimit ? `&gasLimit=${gasLimit}` : ""}${
          deadline ? `&deadline=${deadline}` : ""
        }`
      );

      return {
        tx: response.tx,
        toAmount: response.toAmount,
        fromAmount: amount,
        protocols: response.protocols,
        gas: response.gas,
        gasPrice: response.gasPrice,
        gasLimit: response.gasLimit,
        value: response.value,
        data: response.data,
        to: response.to,
      };
    } catch (error) {
      console.error("Error executing swap:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to execute swap: ${errorMessage}`);
    }
  }

  // Wallet and Token Balance Methods
  async getWalletBalances(params: {
    walletAddress: string;
    chainId: number;
    tokenAddress?: string;
  }) {
    try {
      const { walletAddress, chainId, tokenAddress } = params;

      if (tokenAddress) {
        // Get balance for specific token
        const response = await this.makeRequest(
          `/balance/v1.2/${chainId}/balance?walletAddress=${walletAddress}&tokenAddresses=${tokenAddress}`
        );
        return response;
      } else {
        // Get all token balances for wallet
        const response = await this.makeRequest(
          `/balance/v1.2/${chainId}/balance?walletAddress=${walletAddress}`
        );
        return response;
      }
    } catch (error) {
      console.error("Error getting wallet balances:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to get wallet balances: ${errorMessage}`);
    }
  }

  async getTokenBalances(params: {
    walletAddress: string;
    chainId: number;
    tokenAddresses: string[];
  }) {
    try {
      const { walletAddress, chainId, tokenAddresses } = params;

      const response = await this.makeRequest(
        `/balance/v1.2/${chainId}/balance?walletAddress=${walletAddress}&tokenAddresses=${tokenAddresses.join(
          ","
        )}`
      );

      return response;
    } catch (error) {
      console.error("Error getting token balances:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to get token balances: ${errorMessage}`);
    }
  }

  async getTokenMetadata(params: {
    chainId: number;
    tokenAddress?: string;
    tokenSymbol?: string;
  }) {
    try {
      const { chainId, tokenAddress, tokenSymbol } = params;

      if (tokenAddress) {
        // Get metadata by token address
        const response = await this.makeRequest(
          `/tokens/v1.2/${chainId}/tokens/${tokenAddress}`
        );
        return response;
      } else if (tokenSymbol) {
        // Get metadata by token symbol
        const response = await this.makeRequest(
          `/tokens/v1.2/${chainId}/tokens?symbol=${tokenSymbol}`
        );
        return response.tokens?.[0] || null;
      }

      return null;
    } catch (error) {
      console.error("Error getting token metadata:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to get token metadata: ${errorMessage}`);
    }
  }

  async getMultipleTokenMetadata(params: {
    chainId: number;
    tokenAddresses: string[];
  }) {
    try {
      const { chainId, tokenAddresses } = params;

      const metadataPromises = tokenAddresses.map(async (address) => {
        try {
          return await this.getTokenMetadata({
            chainId,
            tokenAddress: address,
          });
        } catch (error) {
          console.error(`Error getting metadata for ${address}:`, error);
          return null;
        }
      });

      const results = await Promise.all(metadataPromises);
      return results.filter(Boolean);
    } catch (error) {
      console.error("Error getting multiple token metadata:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to get multiple token metadata: ${errorMessage}`);
    }
  }

  async getTokenPrice(params: {
    chainId: number;
    tokenAddress?: string;
    tokenSymbol?: string;
    currency?: string;
  }) {
    try {
      const { chainId, tokenAddress, tokenSymbol, currency = "USD" } = params;

      if (tokenAddress) {
        // Get price by token address
        const response = await this.makeRequest(
          `/price/v1.1/${chainId}/price?tokenAddress=${tokenAddress}&currency=${currency}`
        );
        return response;
      } else if (tokenSymbol) {
        // Get price by token symbol
        const response = await this.makeRequest(
          `/price/v1.1/${chainId}/price?symbol=${tokenSymbol}&currency=${currency}`
        );
        return response;
      }

      return null;
    } catch (error) {
      console.error("Error getting token price:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to get token price: ${errorMessage}`);
    }
  }

  async getMultipleTokenPrices(params: {
    chainId: number;
    tokenAddresses: string[];
    currency?: string;
  }) {
    try {
      const { chainId, tokenAddresses, currency = "USD" } = params;

      const pricePromises = tokenAddresses.map(async (address) => {
        try {
          return await this.getTokenPrice({
            chainId,
            tokenAddress: address,
            currency,
          });
        } catch (error) {
          console.error(`Error getting price for ${address}:`, error);
          return null;
        }
      });

      const results = await Promise.all(pricePromises);
      return results.filter(Boolean);
    } catch (error) {
      console.error("Error getting multiple token prices:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Failed to get multiple token prices: ${errorMessage}`);
    }
  }
}
