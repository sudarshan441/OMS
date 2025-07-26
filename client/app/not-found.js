export default function NotFound() {
  return (
    <div className="text-center mt-20 space-y-4">
      <h1 className="text-3xl font-bold text-red-600">404 - Page Not Found</h1>
      <p className="text-gray-600">Sorry, we couldn't find what you're looking for.</p>
      <a href="/" className="text-blue-600 underline">Go back home</a>
    </div>
  );
}
