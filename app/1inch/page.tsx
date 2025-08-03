import { OneInchLimitOrderPanel } from "@/components/1inch-limit-order-panel";

export default function OneInchPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">1inch Limit Orders</h1>
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
      </div>
    </div>
  );
}
