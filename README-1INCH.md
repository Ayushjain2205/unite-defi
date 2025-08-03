# 1inch Limit Order Integration

This project includes a complete integration with the 1inch protocol for creating and managing limit orders.

## Features

- **Limit Order Creation**: Create buy/sell limit orders with custom prices and expiry times
- **Order Management**: View, modify, and cancel existing orders
- **Real-time Quotes**: Get quotes for token swaps before placing orders
- **Order Monitoring**: Track order status, fills, and execution details
- **Multi-chain Support**: Support for Ethereum mainnet and other EVM chains

## API Routes

### `/api/1inch/limit-orders`

**POST** - Create a new limit order

```json
{
  "orderSide": "BUY",
  "amount": 100,
  "fromToken": "USDT",
  "toToken": "ETH",
  "limitPrice": 1800,
  "expiry": "1D",
  "walletAddress": "0x...",
  "chainId": 1
}
```

**GET** - Get limit orders for a wallet

```
/api/1inch/limit-orders?walletAddress=0x...&chainId=1&status=active
```

**PUT** - Modify an existing order

```json
{
  "orderId": "order_id",
  "newPrice": 1850,
  "newAmount": 150,
  "walletAddress": "0x..."
}
```

**DELETE** - Cancel an order

```
/api/1inch/limit-orders?orderId=order_id&walletAddress=0x...
```

### `/api/1inch/tokens`

**GET** - Get token information

```
/api/1inch/tokens?tokenAddress=0x...&chainId=1
```

**POST** - Get quote for a swap

```json
{
  "fromToken": "USDT",
  "toToken": "ETH",
  "amount": 100,
  "chainId": 1,
  "walletAddress": "0x..."
}
```

### `/api/1inch/swap`

**POST** - Execute a swap

```json
{
  "fromToken": "USDT",
  "toToken": "ETH",
  "amount": 100,
  "slippage": 1,
  "walletAddress": "0x...",
  "chainId": 1
}
```

## React Hook

Use the `use1Inch` hook to interact with the API:

```typescript
import { use1Inch } from "@/hooks/use-1inch";

function MyComponent() {
  const {
    loading,
    error,
    createLimitOrder,
    getLimitOrders,
    modifyLimitOrder,
    cancelLimitOrder,
    getQuote,
    executeSwap,
  } = use1Inch();

  const handleCreateOrder = async () => {
    try {
      const order = await createLimitOrder({
        orderSide: "BUY",
        amount: 100,
        fromToken: "USDT",
        toToken: "ETH",
        limitPrice: 1800,
        expiry: "1D",
        walletAddress: "0x...",
        chainId: 1,
      });
      console.log("Order created:", order);
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  return (
    <div>
      <button onClick={handleCreateOrder} disabled={loading}>
        Create Limit Order
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

## React Component

Use the `OneInchLimitOrderPanel` component for a complete UI:

```typescript
import { OneInchLimitOrderPanel } from "@/components/1inch-limit-order-panel";

function MyPage() {
  return (
    <div>
      <h1>1inch Limit Orders</h1>
      <OneInchLimitOrderPanel />
    </div>
  );
}
```

## Environment Variables

Add the following environment variables to your `.env.local`:

```bash
ONEINCH_API_KEY=your_1inch_api_key_here
```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Add your 1inch API key to `.env.local`

3. Start the development server:

```bash
npm run dev
```

4. Visit `/1inch` to see the limit order interface

## Blockly Integration

The 1inch limit order blocks are available in the Blockly editor:

- **1inch Limit Order**: Create limit orders with custom parameters
- **Limit Order Condition**: Set conditions for order execution
- **Limit Order Management**: Manage existing orders
- **Limit Order Strategy**: Configure trading strategies
- **Limit Order Config**: Set strategy parameters
- **Limit Order Monitoring**: Monitor order status and alerts

## Supported Tokens

- USDT, USDC, ETH, BTC, SOL, ADA, DOT, LINK, MATIC, AVAX
- Additional tokens can be added by updating the token registry in the service

## Supported Chains

- Ethereum Mainnet (chainId: 1)
- Polygon (chainId: 137)
- Additional chains can be added by updating the service

## Error Handling

The integration includes comprehensive error handling:

- API errors are caught and displayed to users
- Network errors are handled gracefully
- Invalid parameters are validated before API calls
- Order status is tracked and updated

## Security Considerations

- API keys are stored server-side only
- Wallet addresses are validated before use
- Order parameters are sanitized
- Rate limiting is implemented for API calls

## Testing

To test the integration:

1. Use a test wallet address
2. Create small test orders
3. Monitor order status
4. Test quote functionality
5. Verify order cancellation

## Contributing

When adding new features:

1. Update the service with new methods
2. Add corresponding API routes
3. Update the React hook
4. Add UI components if needed
5. Update documentation

## License

This integration is part of the Orbfi project and follows the same license terms.
