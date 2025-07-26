"use client";
import { useState } from "react";
import { API } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();
      login(data.token, data.user); // ✅ Context-based
      router.push("/admin"); // ✅ Soft redirect
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold">Admin Login</h2>
        <Input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Button onClick={handleLogin}>Login</Button>
        {error && <p className="text-red-600">{error}</p>}
        <p className="text-sm">
          Don&apos;t have an account?
          <a href="/register" className="text-blue-600 underline">
            Register here
          </a>
        </p>
      </Card>
    </div>
  );
}
