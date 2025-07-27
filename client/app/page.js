'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LandingPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState('');

  const handleTrack = () => {
    if (orderId.trim()) {
      router.push(`/track-order/${orderId}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-24 text-center space-y-8">
      <h1 className="text-4xl font-bold">Welcome to Igniflo OMS</h1>
      <p className="text-gray-600">Place and manage your orders with ease.</p>

      <div className="space-x-4">
        <Button onClick={() => router.push('/place-order')}>🛒 Place Order</Button>
        <Button variant="outline" onClick={() => router.push('/login')}>🔐 Admin Login</Button>
      </div>

      <div className="mt-10 space-y-2">
        <p className="text-lg font-medium">Already placed an order?</p>
        <div className="flex justify-center items-center gap-2">
          <Input
            type="text"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-64"
          />
          <Button onClick={handleTrack}>Track Order</Button>
        </div>
      </div>
    </div>
  );
}
