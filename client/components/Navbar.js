'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-100 border-b px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-blue-600">
        Igniflo OMS
      </Link>

      <div className="flex gap-4 items-center">
        {user?.role === 'admin' && (
          <>
            <Link href="/admin" className="hover:underline">Dashboard</Link>
            <Link href="/products" className="hover:underline">Products</Link>
            <Link href="/products/new" className="hover:underline">Add Product</Link>
          </>
        )}

        {user?.role === 'customer' && (
          <>
            <Link href="/place-order" className="hover:underline">Place Order</Link>
            <Link href="/track-order" className="hover:underline">Track Order</Link>
          </>
        )}

        {!user && (
          <>
            <Link href="/login" className="hover:underline">Login</Link>
            <Link href="/register" className="hover:underline">Register</Link>
          </>
        )}

        {user && (
          <button onClick={() => {
            logout()
          }} className="text-red-600 hover:underline">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
