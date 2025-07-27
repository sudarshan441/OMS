"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { io } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";

const socket = io(API.replace("/api", ""));

export default function AdminPage() {
  const router = useRouter();
  const { token, logout, loading: authLoading } = useAuth();
  const [allOrders, setAllOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    console.log("Fetching orders with token:", token);
    try {
      const res = await fetch(`${API}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          logout();
          alert("Session expired. Please log in again.");
          router.push("/login");
          return;
        } else {
          throw new Error(data.error);
        }
      }
      setAllOrders(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    socket.on("orderPlaced", fetchOrders);
    socket.on("orderStatusUpdated", fetchOrders);

    return () => {
      socket.off("orderPlaced");
      socket.off("orderStatusUpdated");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
    }
  }, [authLoading, token]);

  const updateStatus = async (id, newStatus) => {
    await fetch(`${API}/orders/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
  };

  if (loading) {
    return <p className="text-center mt-10">Loading admin dashboard...</p>;
  }

  const filteredOrders = allOrders.filter(
    (order) =>
      (order?.customer?.name || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (order?.customer?.email || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (order?._id || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="space-x-2">
          <Button
            onClick={async () => {
              try {
                const res = await fetch(`${API}/orders/export/csv`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });

                if (!res.ok) throw new Error("Failed to export CSV");

                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "orders.csv";
                document.body.appendChild(a);
                a.click();
                a.remove();
              } catch (err) {
                alert("CSV export failed. Please try again.");
                console.error("Export error:", err);
              }
            }}
          >
            Export CSV
          </Button>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search by name, email or order ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredOrders.map((order) => (
        <Card key={order._id} className="p-5 space-y-2">
          <div className="flex justify-between">
            <div>
              <p>
                <strong>Customer:</strong>{" "}
                {order?.customer
                  ? `${order?.customer.name} (${order?.customer.email})`
                  : "N/A"}
              </p>
              <p>
                <strong>Payment:</strong>{" "}
                {order?.paymentCollected ? "✅ Yes" : "❌ No"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <Badge className="capitalize">{order?.status}</Badge>
              </p>
            </div>
            <div>
              <select
                defaultValue={order?.status}
                onChange={(e) => updateStatus(order?._id, e.target.value)}
                className="border rounded px-3 py-1"
              >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="FULFILLED">Fulfilled</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
          <div>
            <strong>Items:</strong>
            <ul className="list-disc ml-5">
              {order.items.map((item) => (
                <li key={item?.product?._id}>
                  {item?.product?.name} × {item?.quantity}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      ))}

      {filteredOrders.length === 0 && (
        <p className="text-center text-gray-500">No matching orders found.</p>
      )}
    </div>
  );
}
