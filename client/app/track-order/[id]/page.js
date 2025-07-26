'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { API } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TrackOrderPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`${API}/orders/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Order not found');
        return res.json();
      })
      .then(data => setOrder(data))
      .catch(err => setError(err.message));
  }, [id]);

  if (error) return <p className="text-red-600 text-center mt-10">❌ {error}</p>;

  if (!order) return <p className="text-center mt-10">Loading order details...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold">Order Status</h2>
        <p><strong>Customer:</strong> {order.customer?.name}</p>
        <p><strong>Email:</strong> {order.customer?.email}</p>
        <p>
          <strong>Status:</strong>{' '}
          <Badge variant="outline" className="capitalize">{order.status}</Badge>
        </p>
        <p><strong>Payment Collected:</strong> {order.paymentCollected ? 'Yes' : 'No'}</p>

        <div>
          <h4 className="font-semibold">Items:</h4>
          <ul className="list-disc ml-5">
            {order.items.map(item => (
              <li key={item.product._id}>
                {item.product.name} × {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}
