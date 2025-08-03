import { useState, useCallback } from "react";

export interface LimitOrderParams {
  orderSide: "BUY" | "SELL";
  amount: number;
  fromToken: string;
  toToken: string;
  limitPrice: number;
  expiry: string;
  walletAddress: string;
  chainId?: number;
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

export interface QuoteParams {
  fromToken: string;
  toToken: string;
  amount: number;
  chainId?: number;
  walletAddress: string;
}

export interface SwapParams {
  fromToken: string;
  toToken: string;
  amount: number;
  slippage?: number;
  walletAddress: string;
  chainId?: number;
  gasPrice?: number;
  gasLimit?: number;
  deadline?: number;
}

export interface WalletBalanceParams {
  walletAddress: string;
  chainId?: number;
  tokenAddress?: string;
}

export interface TokenBalanceParams {
  walletAddress: string;
  chainId?: number;
  tokenAddresses: string[];
}

export interface TokenMetadataParams {
  chainId?: number;
  tokenAddress?: string;
  tokenSymbol?: string;
}

export interface TokenPriceParams {
  chainId?: number;
  tokenAddress?: string;
  tokenSymbol?: string;
  currency?: string;
}

export function use1Inch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLimitOrder = useCallback(
    async (params: LimitOrderParams): Promise<LimitOrderResponse> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/1inch/limit-orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create limit order");
        }

        return data.order;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getLimitOrders = useCallback(
    async (
      walletAddress: string,
      chainId: number = 1,
      status?: string
    ): Promise<LimitOrderResponse[]> => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          walletAddress,
          chainId: chainId.toString(),
          ...(status && { status }),
        });

        const response = await fetch(`/api/1inch/limit-orders?${params}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch limit orders");
        }

        return data.orders;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const modifyLimitOrder = useCallback(
    async (
      orderId: string,
      newPrice?: number,
      newAmount?: number,
      walletAddress: string
    ): Promise<LimitOrderResponse> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/1inch/limit-orders", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            newPrice,
            newAmount,
            walletAddress,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to modify limit order");
        }

        return data.order;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const cancelLimitOrder = useCallback(
    async (orderId: string, walletAddress: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          orderId,
          walletAddress,
        });

        const response = await fetch(`/api/1inch/limit-orders?${params}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to cancel limit order");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getQuote = useCallback(async (params: QuoteParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/1inch/tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get quote");
      }

      return data.quote;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const executeSwap = useCallback(async (params: SwapParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/1inch/swap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to execute swap");
      }

      return data.swap;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTokenInfo = useCallback(
    async (
      tokenAddress?: string,
      tokenSymbol?: string,
      chainId: number = 1
    ) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          chainId: chainId.toString(),
          ...(tokenAddress && { tokenAddress }),
          ...(tokenSymbol && { tokenSymbol }),
        });

        const response = await fetch(`/api/1inch/tokens?${params}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to get token info");
        }

        return data.token;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Wallet and Token Methods
  const getWalletBalances = useCallback(async (params: WalletBalanceParams) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        walletAddress: params.walletAddress,
        chainId: (params.chainId || 1).toString(),
        ...(params.tokenAddress && { tokenAddress: params.tokenAddress }),
      });

      const response = await fetch(`/api/1inch/wallet?${queryParams}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get wallet balances");
      }

      return data.balances;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTokenBalances = useCallback(async (params: TokenBalanceParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/1inch/wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get token balances");
      }

      return data.tokenBalances;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTokenMetadata = useCallback(async (params: TokenMetadataParams) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        chainId: (params.chainId || 1).toString(),
        ...(params.tokenAddress && { tokenAddress: params.tokenAddress }),
        ...(params.tokenSymbol && { tokenSymbol: params.tokenSymbol }),
      });

      const response = await fetch(`/api/1inch/tokens/metadata?${queryParams}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get token metadata");
      }

      return data.metadata;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMultipleTokenMetadata = useCallback(
    async (chainId: number, tokenAddresses: string[]) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/1inch/tokens/metadata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chainId, tokenAddresses }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to get multiple token metadata"
          );
        }

        return data.metadata;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getTokenPrice = useCallback(async (params: TokenPriceParams) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        chainId: (params.chainId || 1).toString(),
        currency: params.currency || "USD",
        ...(params.tokenAddress && { tokenAddress: params.tokenAddress }),
        ...(params.tokenSymbol && { tokenSymbol: params.tokenSymbol }),
      });

      const response = await fetch(`/api/1inch/prices?${queryParams}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get token price");
      }

      return data.price;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMultipleTokenPrices = useCallback(
    async (
      chainId: number,
      tokenAddresses: string[],
      currency: string = "USD"
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/1inch/prices", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chainId, tokenAddresses, currency }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to get multiple token prices");
        }

        return data.prices;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    createLimitOrder,
    getLimitOrders,
    modifyLimitOrder,
    cancelLimitOrder,
    getQuote,
    executeSwap,
    getTokenInfo,
    getWalletBalances,
    getTokenBalances,
    getTokenMetadata,
    getMultipleTokenMetadata,
    getTokenPrice,
    getMultipleTokenPrices,
  };
}
