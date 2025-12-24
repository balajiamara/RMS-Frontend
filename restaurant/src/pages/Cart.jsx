import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") || 
  "https://rms-i0wj.onrender.com";
  // "http://127.0.0.1:8000"

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  // Load cart items from backend
  async function fetchCart() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/get_cart/`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.msg || `Status ${res.status}`);
      }
      const data = await res.json();
      setItems(Array.isArray(data.cart_items) ? data.cart_items : []);
    } catch (e) {
      console.error("Cart fetch error:", e);
      setError(e.message || "Failed to load cart");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (sum, it) => sum + (parseInt(it.Price, 10) || 0),
        0
      ),
    [items]
  );

  // async function handlePlaceOrder() {
  //   if (!items.length) {
  //     alert("Your cart is empty");
  //     return;
  //   }

  //   try {
  //     setPlacing(true);
  //     const res = await fetch(`${API_BASE}/place_order/`, {
  //       method: "POST",
  //       credentials: "include",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({}), // view doesn't need body
  //     });

  //     const data = await res.json().catch(() => ({}));

  //     if (!res.ok) {
  //       throw new Error(data.error || data.msg || `Status ${res.status}`);
  //     }

  //     // Build message with all order info
  //     const itemsLines = items
  //       .map(
  //         (it) =>
  //           `- ${it.DishName} — ₹${it.Price}`
  //       )
  //       .join("\n");

  //     const msg =
  //       "Thanks for ordering!\n\n" +
  //       `Order ID: ${data.order_id}\n` +
  //       `Total Price: ₹${data.total_price}\n` +
  //       `Approx Total Time: 30 minutes\n` +
  //       `Estimated Delivery Time: ${data.expected_delivery}\n\n` +
  //       "Ordered Items:\n" +
  //       itemsLines;

  //     alert(msg);

  //     // Backend already cleared session cart, so clear UI too
  //     setItems([]);
  //     // Optional: go back to menu after order
  //     nav("/menu");
  //   } catch (e) {
  //     console.error("Place order error:", e);
  //     alert("Failed to place order: " + (e.message || "unknown"));
  //   } finally {
  //     setPlacing(false);
  //   }
  // }


      async function handlePlaceOrder() {
    if (!items.length) {
      alert("Your cart is empty");
      return;
    }

    try {
      setPlacing(true);
      const res = await fetch(`${API_BASE}/place_order/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // view doesn't need body
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || data.msg || `Status ${res.status}`);
      }

      // navigate to checkout page and pass order info
      nav("/checkout", {
        state: {
          order_id: data.order_id,
          total_price: data.total_price,
        },
      });

      // do not clear UI here — Checkout will handle it
    } catch (e) {
      console.error("Place order error:", e);
      alert("Failed to place order: " + (e.message || "unknown"));
    } finally {
      setPlacing(false);
    }
  }


  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2>Your Cart</h2>
        <button onClick={() => nav("/menu")} style={{ padding: "6px 10px" }}>
          ← Back to Menu
        </button>
      </div>

      {loading && <p>Loading cart...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {items.length === 0 && !loading ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {items.map((it) => {
              const id = it.DishId ?? it.id ?? it.dishid;
              return (
                <li
                  key={id}
                  style={{
                    background: "#fff",
                    marginBottom: 10,
                    padding: 10,
                    borderRadius: 6,
                    boxShadow: "0 1px 4px rgba(0,0,0,.06)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>{it.DishName}</strong>
                    <div style={{ fontSize: 13, color: "#555" }}>
                      {it.Category} • {it.Ingredients}
                    </div>
                  </div>
                  <div style={{ fontWeight: 600 }}>₹{it.Price}</div>
                </li>
              );
            })}
          </ul>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700 }}>
              Total: ₹{totalPrice}
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              style={{
                padding: "10px 16px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                color: "#fff",
                background: "#28a745",
              }}
            >
              {placing ? "Placing..." : "Place Order"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
