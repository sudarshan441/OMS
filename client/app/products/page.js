'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

export default function ProductsPage() {
  const router = useRouter();
  const { token, user, logout } = useAuth();
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await fetch(`${API}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) return logout();
    const data = await res.json();
    setProducts(data);
  };

  const deleteProduct = async (id) => {
    const res = await fetch(`${API}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchProducts();
  };

  useEffect(() => {
    if (user?.role !== 'admin') return router.push('/login');
    fetchProducts();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => router.push('/products/new')}>New Product</Button>
      </div>

      {products.map((product) => (
        <Card key={product._id} className="p-5 flex justify-between items-center">
          <div>
            <p className="font-semibold">{product.name}</p>
            <p>${product.price} | Stock: {product.stock}</p>
          </div>
          <div className="space-x-2">
            <Button onClick={() => router.push(`/products/${product._id}/edit`)}>
              Edit
            </Button>
            <Button variant="destructive" onClick={() => deleteProduct(product._id)}>
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
