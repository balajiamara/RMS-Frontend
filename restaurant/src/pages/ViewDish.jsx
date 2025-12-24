import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") ||
  "https://rms-i0wj.onrender.com";

export default function ViewDish() {
  const { id } = useParams();
  const nav = useNavigate();

  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/show_item/`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch dish");

        const data = await res.json();
        const arr = Array.isArray(data) ? data : data.menu || [];

        const item = arr.find(
          (it) =>
            String(it.DishId) === String(id) ||
            String(it.id) === String(id)
        );

        if (!item) throw new Error("Dish not found");
        setDish(item);

      } catch (e) {
        setMsg(e.message || "Error loading dish");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (msg) return <div style={{ padding: 20, color: "red" }}>{msg}</div>;
  if (!dish) return <div>No dish found</div>;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 20 }}>
      <button onClick={() => nav("/menu")} style={{ marginBottom: 20 }}>
        ⬅ Back to Menu
      </button>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 10,
          padding: 20,
          background: "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <img
          src={dish.Image || "https://via.placeholder.com/500x300"}
          alt={dish.DishName}
          style={{
            width: "100%",
            height: "320px",
            objectFit: "cover",
            borderRadius: 8,
            marginBottom: 20,
          }}
        />

        <h2>{dish.DishName}</h2>

        <p><strong>Dish ID:</strong> {dish.DishId}</p>

        <p><strong>Category:</strong> {dish.Category}</p>

        <p>
          <strong>Ingredients:</strong><br /> 
          {dish.Ingredients}
        </p>

        <p style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>
          ₹{dish.Price}
        </p>
      </div>
    </div>
  );
}
