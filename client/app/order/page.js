'use client';
import { useEffect, useState } from 'react';
import { API } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function OrderPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', items: [] });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${API}/products`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const handleQtyChange = (productId, qty) => {
    const quantity = parseInt(qty) || 0;
    setForm(prev => ({
      ...prev,
      items: [
        ...prev.items.filter(i => i.product !== productId),
        ...(quantity > 0 ? [{ product: productId, quantity }] : [])
      ]
    }));
  };

  const handleSubmit = async () => {
    try {
      const customerRes = await fetch(`${API}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email })
      });
      const customer = await customerRes.json();

      const orderRes = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: customer._id,
          items: form.items,
          paymentCollected: false
        })
      });
      const order = await orderRes.json();
      setMessage(`✅ Order placed! Your Order ID: ${order._id}`);
    } catch (err) {
      console.error(err);
      setMessage('❌ Something went wrong.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold">Place an Order</h2>

        <Input
          placeholder="Your Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <Input
          placeholder="Email Address"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <div className="space-y-2">
          {products.map(p => (
            <div key={p._id} className="flex items-center justify-between">
              <span>{p.name} (${p.price})</span>
              <Input
                type="number"
                min={0}
                placeholder="Qty"
                className="w-20"
                onChange={e => handleQtyChange(p._id, e.target.value)}
              />
            </div>
          ))}
        </div>

        <Button onClick={handleSubmit}>Submit Order</Button>
        {message && <p className="text-sm text-green-600 mt-2">{message}</p>}
      </Card>
    </div>
  );
}
