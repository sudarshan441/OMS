'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

export default function NewProductPage() {
  const router = useRouter();
  const { token, user } = useAuth();

  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
  });

  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (user?.role !== 'admin') return router.push('/login');

    try {
      const res = await fetch(`${API}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Product creation failed');

      router.push('/products');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold">Add New Product</h2>
        <Input
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />
        <Button onClick={handleCreate}>Create</Button>
        {error && <p className="text-red-600">{error}</p>}
      </Card>
    </div>
  );
}
