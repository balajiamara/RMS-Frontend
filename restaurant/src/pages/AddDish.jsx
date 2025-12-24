import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") || "https://rms-i0wj.onrender.com";

export default function AddDish() {
  const [DishId, setDishId] = useState("");
  const [DishName, setDishName] = useState("");
  const [Ingredients, setIngredients] = useState("");
  const [Category, setCategory] = useState("");
  const [Price, setPrice] = useState("");
  const [Image, setImage] = useState(""); // URL or leave blank
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!DishId || !DishName) {
      setMsg("DishId and DishName required");
      return;
    }

    try {
      const form = new FormData();
      form.append("DishId", DishId);
      form.append("DishName", DishName);
      form.append("Ingredients", Ingredients);
      form.append("Category", Category);
      form.append("Price", Price);
      form.append("Image", Image);

      const res = await fetch(`${API_BASE}/add_item/`, {
        method: "POST",
        credentials: "include",
        body: form,
      });
      if (!res.ok) {
        const err = await res.json().catch(()=>({error:res.statusText}));
        throw new Error(err.error || err.msg || `Status ${res.status}`);
      }
      setMsg("Added successfully");
      setTimeout(()=> nav("/menu"), 900);
    } catch (e) {
      setMsg(e.message || "Add failed");
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: "30px auto", padding: 12 }}>
      <h2>Add Dish</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        <input value={DishId} onChange={(e)=>setDishId(e.target.value)} placeholder="DishId (unique)" required />
        <input value={DishName} onChange={(e)=>setDishName(e.target.value)} placeholder="DishName" required />
        <textarea value={Ingredients} onChange={(e)=>setIngredients(e.target.value)} placeholder="Ingredients" rows={3} />
        <input value={Category} onChange={(e)=>setCategory(e.target.value)} placeholder="Category" />
        <input value={Price} onChange={(e)=>setPrice(e.target.value)} placeholder="Price" />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit">Add Dish</button>
          <button type="button" onClick={() => nav("/menu")}>Cancel</button>
        </div>
        {msg && <div style={{ marginTop: 8 }}>{msg}</div>}
      </form>
    </div>
  );
}
