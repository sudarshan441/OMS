'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-4">Sorry, we can&apos;t find that page.</p>
      <Link href="/" className="text-blue-600 underline">
        Go back home
      </Link>
    </div>
  );
}
