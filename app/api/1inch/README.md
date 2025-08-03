# 1inch API Integration Documentation

## Overview

This project integrates with the 1inch Network API to provide comprehensive DeFi trading capabilities including token swaps, limit orders, price feeds, and wallet management. The integration leverages 1inch's aggregation protocol to find the best trading routes across multiple DEXs and provides a unified interface for trading operations.

## Architecture

The integration is built using a service-oriented architecture with the following components:

- **API Routes**: Next.js API routes that handle HTTP requests
- **1inchService**: Core service class that encapsulates all 1inch API interactions
- **TypeScript Interfaces**: Strongly typed interfaces for all API operations
- **Error Handling**: Comprehensive error handling and validation

## API Endpoints

### 1. Token Swaps (`/api/1inch/swap`)

**POST** - Execute token swaps with optimal routing

**Features:**

- Multi-DEX aggregation for best prices
- Slippage protection
- Gas optimization
- Support for multiple chains
- Customizable gas parameters

**Request Body:**

```typescript
{
  fromToken: string;      // Token symbol or address
  toToken: string;        // Token symbol or address
  amount: number;         // Amount to swap
  slippage?: number;      // Slippage tolerance (default: 1%)
  walletAddress: string;  // User's wallet address
  chainId?: number;       // Chain ID (default: 1 for Ethereum)
  gasPrice?: number;      // Custom gas price
  gasLimit?: number;      // Custom gas limit
  deadline?: number;      // Transaction deadline
}
```

**Response:**

```typescript
{
  success: boolean;
  swap: {
    tx: any;              // Transaction data
    toAmount: string;     // Expected output amount
    fromAmount: number;   // Input amount
    protocols: string[];  // Used protocols
    gas: number;          // Gas estimate
    gasPrice: number;     // Gas price
    gasLimit: number;     // Gas limit
    value: string;        // ETH value
    data: string;         // Transaction data
    to: string;          // Contract address
  };
  message: string;
}
```

### 2. Price Feeds (`/api/1inch/prices`)

**GET** - Get single token price
**POST** - Get multiple token prices

**Features:**

- Real-time price data
- Multi-currency support (USD, EUR, etc.)
- Batch price fetching
- Cross-chain price comparison

**GET Parameters:**

```typescript
{
  chainId?: string;       // Chain ID (default: "1")
  tokenAddress?: string;  // Token contract address
  tokenSymbol?: string;   // Token symbol
  currency?: string;      // Price currency (default: "USD")
}
```

**POST Body:**

```typescript
{
  chainId?: number;       // Chain ID (default: 1)
  tokenAddresses: string[]; // Array of token addresses
  currency?: string;      // Price currency (default: "USD")
}
```

### 3. Token Information (`/api/1inch/tokens`)

**GET** - Get token metadata and information
**POST** - Get swap quotes

**Features:**

- Token metadata retrieval
- Price quotes for swaps
- Token validation
- Cross-chain token support

**GET Parameters:**

```typescript
{
  chainId?: string;       // Chain ID (default: "1")
  tokenAddress?: string;  // Token contract address
  tokenSymbol?: string;   // Token symbol
}
```

**POST Body (for quotes):**

```typescript
{
  fromToken: string;      // Source token
  toToken: string;        // Destination token
  amount: number;         // Amount to swap
  chainId?: number;       // Chain ID (default: 1)
  walletAddress: string;  // User's wallet address
}
```

### 4. Limit Orders (`/api/1inch/limit-orders`)

**POST** - Create limit orders
**GET** - Retrieve user's limit orders
**PUT** - Modify existing orders
**DELETE** - Cancel orders

**Features:**

- Advanced order types (BUY/SELL)
- Custom expiry times
- Order modification
- Order cancellation
- Order status tracking

**POST Body:**

```typescript
{
  orderSide: "BUY" | "SELL";
  amount: number;
  fromToken: string;
  toToken: string;
  limitPrice: number;
  expiry: string;         // "1H", "4H", "1D", "7D", "30D", "NEVER"
  walletAddress: string;
  chainId?: number;       // Default: 1
}
```

**GET Parameters:**

```typescript
{
  walletAddress: string;  // User's wallet address
  chainId?: string;       // Chain ID (default: "1")
  status?: string;        // "active", "filled", "cancelled"
}
```

**PUT Body:**

```typescript
{
  orderId: string;
  newPrice?: number;
  newAmount?: number;
  walletAddress: string;
}
```

**DELETE Parameters:**

```typescript
{
  orderId: string;
  walletAddress: string;
}
```

### 5. Wallet Management (`/api/1inch/wallet`)

**GET** - Get wallet balances
**POST** - Get detailed token balances

**Features:**

- Multi-token balance tracking
- Cross-chain balance aggregation
- Token metadata integration
- Real-time balance updates

**GET Parameters:**

```typescript
{
  walletAddress: string;  // User's wallet address
  chainId?: string;       // Chain ID (default: "1")
  tokenAddress?: string;  // Specific token address
}
```

**POST Body:**

```typescript
{
  walletAddress: string;  // User's wallet address
  chainId?: number;       // Chain ID (default: 1)
  tokenAddresses: string[]; // Array of token addresses
}
```

## 1inch Service Implementation

### Core Service Class

The `OneInchService` class provides a comprehensive interface to all 1inch API endpoints:

```typescript
class OneInchService {
  private baseUrl = "https://api.1inch.dev";
  private apiKey: string;
}
```

### Key Methods

#### Swap Operations

- `executeSwap()` - Execute token swaps with optimal routing
- `getQuote()` - Get price quotes for swaps
- `getTokenInfo()` - Retrieve token metadata

#### Limit Order Operations

- `createLimitOrder()` - Create new limit orders
- `getLimitOrders()` - Retrieve user's orders
- `modifyLimitOrder()` - Update existing orders
- `cancelLimitOrder()` - Cancel orders
- `getOrderById()` - Get specific order details

#### Price and Balance Operations

- `getTokenPrice()` - Get single token price
- `getMultipleTokenPrices()` - Batch price fetching
- `getWalletBalances()` - Get wallet token balances
- `getTokenBalances()` - Get specific token balances
- `getTokenMetadata()` - Get token information

### Supported Chains

The integration supports multiple blockchain networks:

- **Ethereum Mainnet** (Chain ID: 1)
- **Polygon** (Chain ID: 137)
- **BSC** (Chain ID: 56)
- **Arbitrum** (Chain ID: 42161)
- **Optimism** (Chain ID: 10)

### Token Support

**Major Tokens:**

- **Stablecoins**: USDT, USDC, DAI, BUSD
- **Major Cryptocurrencies**: ETH, BTC, MATIC, BNB
- **DeFi Tokens**: UNI, AAVE, COMP, CRV
- **Custom Tokens**: Any ERC-20 token by address

## Protocol Integration

### 1inch Aggregation Protocol

The integration leverages 1inch's aggregation protocol which:

1. **Route Discovery**: Finds optimal trading routes across multiple DEXs
2. **Price Comparison**: Compares prices from various sources
3. **Gas Optimization**: Minimizes gas costs for transactions
4. **Slippage Protection**: Implements slippage tolerance mechanisms
5. **MEV Protection**: Protects against front-running and MEV attacks

### Supported DEXs

The aggregation includes major decentralized exchanges:

- **Uniswap** (V2, V3)
- **SushiSwap**
- **Balancer**
- **Curve**
- **1inch Liquidity Protocol**
- **0x Protocol**
- **ParaSwap**
- **And many more...**

## Security Features

### API Key Management

- Environment variable configuration
- Secure API key storage
- Rate limiting protection

### Transaction Security

- Slippage protection
- Deadline enforcement
- Gas limit validation
- Transaction simulation

### Error Handling

- Comprehensive error catching
- Detailed error messages
- Graceful degradation
- Retry mechanisms

## Usage Examples

### Basic Token Swap

```typescript
const swapResult = await fetch("/api/1inch/swap", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    fromToken: "ETH",
    toToken: "USDT",
    amount: 1.0,
    slippage: 1,
    walletAddress: "0x...",
    chainId: 1,
  }),
});
```

### Create Limit Order

```typescript
const orderResult = await fetch("/api/1inch/limit-orders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    orderSide: "BUY",
    amount: 100,
    fromToken: "USDT",
    toToken: "ETH",
    limitPrice: 2000,
    expiry: "1D",
    walletAddress: "0x...",
    chainId: 1,
  }),
});
```

### Get Token Prices

```typescript
const prices = await fetch("/api/1inch/prices?tokenSymbol=ETH&currency=USD");
```

## Environment Configuration

Required environment variables:

```env
ONEINCH_API_KEY=your_1inch_api_key_here
```

## Rate Limits

The integration respects 1inch API rate limits:

- **Free Tier**: 100 requests/minute
- **Paid Tier**: Higher limits based on plan
- **Rate Limiting**: Automatic retry with exponential backoff

## Error Handling

The service implements comprehensive error handling:

```typescript
try {
  const result = await oneInchService.executeSwap(params);
  return { success: true, data: result };
} catch (error) {
  console.error("Swap error:", error);
  return {
    success: false,
    error: error.message,
    details: error.details,
  };
}
```

## Future Enhancements

### Planned Features

- **Cross-chain Swaps**: Native cross-chain token transfers
- **Advanced Order Types**: Stop-loss, take-profit orders
- **Portfolio Management**: Automated rebalancing
- **Analytics Integration**: Trading performance tracking
- **Mobile SDK**: Native mobile app support

### Protocol Upgrades

- **1inch Fusion**: Integration with 1inch's latest protocol
- **MEV Protection**: Enhanced MEV protection mechanisms
- **Gas Optimization**: Advanced gas optimization strategies
- **Multi-chain Support**: Expanded chain support

## Contributing

When contributing to the 1inch integration:

1. Follow TypeScript best practices
2. Add comprehensive error handling
3. Include unit tests for new features
4. Update documentation for API changes
5. Validate against multiple chains
6. Test with various token types

## Support

For issues related to the 1inch integration:

- Check the 1inch API documentation
- Verify API key configuration
- Test with different chains and tokens
- Review error logs for debugging

---

_This integration provides a robust foundation for DeFi trading operations, leveraging 1inch's aggregation protocol to deliver optimal trading experiences across multiple blockchain networks._
