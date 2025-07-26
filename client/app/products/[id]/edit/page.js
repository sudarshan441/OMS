'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { API } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token, user } = useAuth();

  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || !token) return;

    fetch(`${API}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load product');
        return res.json();
      })
      .then((data) => {
        setForm({
          name: data.name,
          price: data.price.toString(),
          stock: data.stock.toString(),
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, token]);

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${API}/products/${id}`, {
        method: 'PUT',
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
      if (!res.ok) throw new Error(data.error || 'Update failed');

      router.push('/products');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading product...</p>;

  return (
    <div className="max-w-md mx-auto mt-16">
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold">Edit Product</h2>
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
        <Button onClick={handleUpdate}>Update</Button>
        {error && <p className="text-red-600">{error}</p>}
      </Card>
    </div>
  );
}
