import { OneInchLimitOrderPanel } from "@/components/1inch-limit-order-panel";
import { WalletBalancePanel } from "@/components/wallet-balance-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function OneInchPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">1inch Integration</h1>
          <p className="text-gray-600">
            Complete integration with 1inch protocol for limit orders, wallet
            balances, and token information.
          </p>
        </div>

        <Tabs defaultValue="limit-orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="limit-orders">Limit Orders</TabsTrigger>
            <TabsTrigger value="wallet-balances">Wallet & Tokens</TabsTrigger>
          </TabsList>

          <TabsContent value="limit-orders" className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Limit Orders</h2>
              <p className="text-gray-600">
                Create and manage limit orders using the 1inch protocol. This
                integration allows you to:
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                <li>Create limit orders with custom prices and expiry times</li>
                <li>Get real-time quotes for token swaps</li>
                <li>Monitor order status and execution</li>
                <li>Cancel or modify existing orders</li>
                <li>View order history and fill details</li>
              </ul>
            </div>
            <OneInchLimitOrderPanel />
          </TabsContent>

          <TabsContent value="wallet-balances" className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">
                Wallet & Token Information
              </h2>
              <p className="text-gray-600">
                View wallet balances and token information using 1inch APIs.
                This includes:
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                <li>Get wallet balances across multiple chains</li>
                <li>View token metadata and information</li>
                <li>Get real-time token prices</li>
                <li>
                  Support for multiple chains (Ethereum, Polygon, BSC, etc.)
                </li>
                <li>Token logos and detailed information</li>
              </ul>
            </div>
            <WalletBalancePanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
