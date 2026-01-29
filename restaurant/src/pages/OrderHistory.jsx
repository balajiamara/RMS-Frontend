import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE =
    import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") ||
    "https://rms-i0wj.onrender.com";

export default function OrderHistory() {
    const nav = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedOrder, setExpandedOrder] = useState(null);

    async function fetchOrders() {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API_BASE}/my_orders/`, {
                method: "GET",
                credentials: "include",
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || `Status ${res.status}`);
            }
            const data = await res.json();
            setOrders(Array.isArray(data.orders) ? data.orders : []);
        } catch (e) {
            console.error("Order fetch error:", e);
            setError(e.message || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    function toggleExpand(orderId) {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    }

    function getStatusColor(status) {
        const s = status?.toLowerCase() || "";
        if (s === "paid") return "#28a745";
        if (s === "confirmed") return "#007bff";
        if (s.includes("fail")) return "#dc3545";
        return "#6c757d";
    }

    return (
        <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                }}
            >
                <h2>📦 My Orders</h2>
                <button onClick={() => nav("/menu")} style={{ padding: "6px 12px" }}>
                    ← Back to Menu
                </button>
            </div>

            {loading && <p>Loading orders...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && orders.length === 0 && (
                <div
                    style={{
                        textAlign: "center",
                        padding: 40,
                        background: "#f8f9fa",
                        borderRadius: 8,
                    }}
                >
                    <p style={{ fontSize: 18, color: "#666" }}>
                        You haven't placed any orders yet.
                    </p>
                    <button
                        onClick={() => nav("/menu")}
                        style={{
                            marginTop: 16,
                            padding: "10px 20px",
                            background: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            cursor: "pointer",
                        }}
                    >
                        Browse Menu
                    </button>
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {orders.map((order) => {
                    const isExpanded = expandedOrder === order.OrderId;
                    return (
                        <div
                            key={order.OrderId}
                            style={{
                                background: "#fff",
                                border: "1px solid #e0e0e0",
                                borderRadius: 8,
                                overflow: "hidden",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                            }}
                        >
                            {/* Order Header */}
                            <div
                                onClick={() => toggleExpand(order.OrderId)}
                                style={{
                                    padding: 16,
                                    cursor: "pointer",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    background: isExpanded ? "#f8f9fa" : "#fff",
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 16 }}>
                                        Order #{order.OrderId}
                                    </div>
                                    <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
                                        {order.OrderedTime}
                                    </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div
                                        style={{
                                            padding: "4px 10px",
                                            borderRadius: 12,
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: "#fff",
                                            background: getStatusColor(order.Status),
                                            display: "inline-block",
                                        }}
                                    >
                                        {order.Status}
                                    </div>
                                    <div style={{ fontWeight: 700, marginTop: 6, fontSize: 18 }}>
                                        ₹{order.TotalPrice}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <div
                                    style={{
                                        padding: 16,
                                        borderTop: "1px solid #e0e0e0",
                                        background: "#fafafa",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 13,
                                            color: "#666",
                                            marginBottom: 12,
                                        }}
                                    >
                                        Expected Delivery: <strong>{order.ExpectedDelivery}</strong>
                                    </div>

                                    <div style={{ fontWeight: 600, marginBottom: 8 }}>
                                        Items Ordered:
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                                        {(order.Items || []).map((item, idx) => (
                                            <li
                                                key={idx}
                                                style={{
                                                    marginBottom: 8,
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <span>
                                                    {item.DishName}{" "}
                                                    {item.quantity > 1 && `x${item.quantity}`}
                                                </span>
                                                <span style={{ fontWeight: 600 }}>
                                                    ₹{item.line_total || item.Price}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
