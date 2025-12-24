import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") || "https://rms-i0wj.onrender.com";

export default function EditDish() {
  const { id } = useParams();
  const nav = useNavigate();

  const [DishId, setDishId] = useState(id || "");
  const [DishName, setDishName] = useState("");
  const [Ingredients, setIngredients] = useState("");
  const [Category, setCategory] = useState("");
  const [Price, setPrice] = useState("");
  const [Image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(()=>{
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/show_item/`, { method: "GET", credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch items");
        const data = await res.json();
        const arr = Array.isArray(data) ? data : (data.menu || data.results || []);
        const item = arr.find(it => String(it.DishId) === String(id) || String(it.id) === String(id));
        if (!item) throw new Error("Dish not found");
        setDishId(item.DishId);
        setDishName(item.DishName);
        setIngredients(item.Ingredients);
        setCategory(item.Category);
        setPrice(item.Price);
        setImage(item.Image);
      } catch (e) {
        setMsg(e.message || "Load error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const form = new FormData();
      // include updated fields; include DishId if your backend expects it
      form.append("DishName", DishName);
      form.append("Ingredients", Ingredients);
      form.append("Category", Category);
      form.append("Price", Price);
      form.append("Image", Image);

      const res = await fetch(`${API_BASE}/modify_item/${encodeURIComponent(id)}/`, {
        method: "PATCH", // your view might accept POST for update
        credentials: "include",
        body: form,
      });
      if (!res.ok) {
        const err = await res.json().catch(()=>({error:res.statusText}));
        throw new Error(err.error || err.msg || `Status ${res.status}`);
      }
      setMsg("Updated");
      setTimeout(()=> nav("/menu"), 700);
    } catch (e) {
      setMsg(e.message || "Update failed");
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 640, margin: "30px auto", padding: 12 }}>
      <h2>Update Dish: {DishId}</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        <input value={DishId} disabled />
        <input value={DishName} onChange={(e)=>setDishName(e.target.value)} required />
        <textarea value={Ingredients} onChange={(e)=>setIngredients(e.target.value)} rows={3} />
        <input value={Category} onChange={(e)=>setCategory(e.target.value)} />
        <input value={Price} onChange={(e)=>setPrice(e.target.value)} />
        <input value={Image} onChange={(e)=>setImage(e.target.value)} placeholder="Image URL" />
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit">Save</button>
          <button type="button" onClick={() => nav("/menu")}>Cancel</button>
        </div>
        {msg && <div style={{ marginTop: 8 }}>{msg}</div>}
      </form>
    </div>
  );
}
