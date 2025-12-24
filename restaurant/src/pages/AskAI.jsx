import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") ||
  "https://rms-i0wj.onrender.com";

export default function AskAI() {
  const nav = useNavigate();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [mood, setMood] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // cart state
  const [cartHasItems, setCartHasItems] = useState(false);
  const [addingId, setAddingId] = useState(null);

  const [hasSearched, setHasSearched] = useState(false);


  // 🔹 Ask AI
  async function askAI(e) {
    e.preventDefault();

    setHasSearched(true);

    if (!mood) {
      setError("Please select your mood");
      return;
    }

    setLoading(true);
    setError("");
    setItems([]);

    try {
      const res = await fetch(`${API_BASE}/recommend/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ mood }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");

      // 🔥 ROBUST RESPONSE HANDLING
      let result = [];

      if (Array.isArray(data)) {
        result = data;
      } else if (Array.isArray(data.items)) {
        result = data.items;
      } else if (Array.isArray(data.recommendations)) {
        result = data.recommendations;
      } else if (Array.isArray(data.data)) {
        result = data.data;
      }

      setItems(result);
      setHasSearched(true);
    } catch (err) {
      console.error("AskAI error:", err);
      setError("AI service failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Check cart
  async function checkCart() {
    try {
      const res = await fetch(`${API_BASE}/get_cart/`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) return;

      const data = await res.json().catch(() => ({}));
      if (Array.isArray(data.cart_items) && data.cart_items.length > 0) {
        setCartHasItems(true);
      }
    } catch (err) {
      console.warn("checkCart failed:", err);
    }
  }

  useEffect(() => {
    checkCart();
  }, []);

  // 🔹 Add to cart
  async function handleAddToCart(id) {
    try {
      setAddingId(id);

      const res = await fetch(
        `${API_BASE}/add_to_cart/${encodeURIComponent(id)}/`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed");

      setCartHasItems(true);
    } catch {
      alert("Failed to add to cart");
    } finally {
      setAddingId(null);
    }
  }

  function handleGoToCart() {
    nav("/cart");
  }

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <h2>🤖 Ask AI</h2>

      <form onSubmit={askAI} style={{ marginBottom: 20 }}>
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          style={{ padding: 6 }}
        >
          <option value="">-- select mood --</option>
          <option value="happy">Happy</option>
          <option value="light">Light</option>
          <option value="ill">Ill</option>
          <option value="comfort">Comfort</option>
          <option value="stressed">Stressed</option>
          <option value="party">Party</option>
          <option value="special">Special</option>
        </select>

        <button type="submit" disabled={loading} style={{ marginLeft: 10 }}>
          {loading ? "Thinking..." : "Ask AI"}
        </button>

        <button type="button" onClick={() => nav(-1)} style={{ marginLeft: 10 }}>
          Back
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 🔹 EMPTY STATE */}
      {hasSearched && !loading && items.length === 0 && !error && (
        <p>No recommendations found for this mood.</p>
      )}


      {/* 🔹 AI RECOMMENDED MENU */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: 16,
        }}
      >
        {items.map((it) => {
          const id = it.DishId;

          return (
            <div
              key={id}
              style={{
                border: "1px solid #e6e6e6",
                borderRadius: 8,
                overflow: "hidden",
                background: "#fff",
              }}
            >
              <img
                src={it.Image || "https://via.placeholder.com/300x160"}
                alt={it.DishName}
                style={{ width: "100%", height: 160, objectFit: "cover" }}
              />

              <div style={{ padding: 12 }}>
                <h3>{it.DishName}</h3>
                <p style={{ fontSize: 13 }}>{it.Ingredients}</p>
                <b>₹{it.Price}</b>

                {it.reason && (
                  <div
                    style={{
                      marginTop: 8,
                      padding: "8px 10px",
                      background: "#f5f7fa",
                      borderLeft: "4px solid #6c63ff",
                      borderRadius: 4,
                      fontSize: 13,
                      color: "#333",
                    }}
                  >
                    <strong style={{ color: "#6c63ff" }}>🤖 AI says:</strong>{" "}
                    <span>{it.reason}</span>
                  </div>
                )}

                <div style={{ marginTop: 10 }}>
                  <button onClick={() => nav(`/view_item/${id}`)}>
                    View
                  </button>

                  {!isAdmin && (
                    <button
                      onClick={() => handleAddToCart(id)}
                      disabled={addingId === id}
                      style={{
                        marginLeft: 8,
                        background: "#28a745",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: 4,
                      }}
                    >
                      {addingId === id ? "Adding..." : "Add to cart"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔹 Go to cart */}
      {!isAdmin && cartHasItems && hasSearched && items.length > 0 && (
        <div style={{ marginTop: 24, textAlign: "right" }}>
          <button
            onClick={handleGoToCart}
            style={{
              padding: "10px 16px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              color: "#fff",
              background: "#007bff",
            }}
          >
            Go to Cart
          </button>
        </div>
      )}
    </div>
  );
}
