'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function PlaceOrderPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [quantities, setQuantities] = useState({});
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch(`${API}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleSubmit = async () => {
    const items = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([productId, quantity]) => ({
        product: productId,
        quantity: Number(quantity),
      }));

    if (!form.name || !form.email || items.length === 0) {
      return setError('Please fill in all fields and add at least one product');
    }

    try {
      const res = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          items,
          paymentCollected: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order failed');
      router.push(`/track-order/${data._id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold">Place Order</h2>
        <Input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <div className="space-y-2">
          {products.map((product) => (
            <div key={product._id} className="flex justify-between items-center border-b py-2">
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-600">₹{product.price} | Stock: {product.stock}</p>
              </div>
              <Input
                type="number"
                className="w-20"
                min="0"
                max={product.stock}
                value={quantities[product._id] || ''}
                onChange={(e) =>
                  setQuantities({ ...quantities, [product._id]: e.target.value })
                }
              />
            </div>
          ))}
        </div>

        <Button onClick={handleSubmit}>Submit Order</Button>
        {error && <p className="text-red-600">{error}</p>}
      </Card>
    </div>
  );
}
