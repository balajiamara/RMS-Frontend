import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") || "https://rms-i0wj.onrender.com";

export default function AddDish() {
  const nav = useNavigate();

  const [DishId, setDishId] = useState("");
  const [DishName, setDishName] = useState("");
  const [Ingredients, setIngredients] = useState("");
  const [Category, setCategory] = useState("");
  const [DishType, setDishType] = useState("Veg");
  const [Price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: "", type: "" });

    if (!DishId || !DishName) {
      setMsg({ text: "DishId and DishName are required", type: "error" });
      return;
    }

    setSubmitting(true);

    try {
      const form = new FormData();
      form.append("DishId", DishId);
      form.append("DishName", DishName);
      form.append("Ingredients", Ingredients);
      form.append("Category", Category);
      form.append("DishType", DishType);
      form.append("Price", Price);

      if (imageFile) {
        form.append("Image", imageFile);
      }

      const res = await fetch(`${API_BASE}/add_item/`, {
        method: "POST",
        credentials: "include",
        body: form,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || err.msg || `Status ${res.status}`);
      }

      setMsg({ text: "✅ Dish added successfully!", type: "success" });
      setTimeout(() => nav("/menu"), 1200);
    } catch (e) {
      setMsg({ text: e.message || "Add failed", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>➕ Add New Dish</h2>
        </div>

        {/* Image Preview */}
        <div style={styles.imagePreview}>
          {imageFile ? (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              style={styles.previewImg}
            />
          ) : (
            <div style={styles.placeholderImg}>
              <span style={{ fontSize: 48 }}>🍽️</span>
              <p style={{ margin: "8px 0 0", color: "#9ca3af" }}>Upload an image</p>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Dish ID & Name Row */}
          <div style={styles.row}>
            <div style={styles.formGroupHalf}>
              <label style={styles.label}>Dish ID *</label>
              <input
                type="text"
                value={DishId}
                onChange={(e) => setDishId(e.target.value)}
                style={styles.input}
                placeholder="e.g. 101"
                required
              />
            </div>

            <div style={styles.formGroupHalf}>
              <label style={styles.label}>Dish Name *</label>
              <input
                type="text"
                value={DishName}
                onChange={(e) => setDishName(e.target.value)}
                style={styles.input}
                placeholder="Enter dish name"
                required
              />
            </div>
          </div>

          {/* Ingredients */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Ingredients</label>
            <textarea
              value={Ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              style={styles.textarea}
              placeholder="List the ingredients..."
              rows={3}
            />
          </div>

          {/* Category & Dish Type Row */}
          <div style={styles.row}>
            <div style={styles.formGroupHalf}>
              <label style={styles.label}>Category</label>
              <select
                value={Category}
                onChange={(e) => setCategory(e.target.value)}
                style={styles.select}
              >
                <option value="">Select Category</option>
                <option value="Soups">Soups</option>
                <option value="Starters">Starters</option>
                <option value="Main Course">Main Course</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>

            <div style={styles.formGroupHalf}>
              <label style={styles.label}>Dish Type</label>
              <div style={styles.toggleContainer}>
                <button
                  type="button"
                  onClick={() => setDishType("Veg")}
                  style={{
                    ...styles.toggleBtn,
                    ...(DishType === "Veg" ? styles.toggleActiveVeg : {}),
                  }}
                >
                  🥬 Veg
                </button>
                <button
                  type="button"
                  onClick={() => setDishType("Non-Veg")}
                  style={{
                    ...styles.toggleBtn,
                    ...(DishType === "Non-Veg" ? styles.toggleActiveNonVeg : {}),
                  }}
                >
                  🍖 Non-Veg
                </button>
              </div>
            </div>
          </div>

          {/* Price */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Price (₹)</label>
            <input
              type="number"
              value={Price}
              onChange={(e) => setPrice(e.target.value)}
              style={styles.input}
              placeholder="e.g. 299"
              min="0"
            />
          </div>

          {/* Image Upload */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Dish Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              style={styles.fileInput}
            />
          </div>

          {/* Message */}
          {msg.text && (
            <div
              style={{
                ...styles.message,
                background: msg.type === "error" ? "#fee2e2" : "#d1fae5",
                color: msg.type === "error" ? "#dc2626" : "#059669",
              }}
            >
              {msg.text}
            </div>
          )}

          {/* Buttons */}
          <div style={styles.buttonRow}>
            <button
              type="button"
              onClick={() => nav("/menu")}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                ...styles.submitBtn,
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Adding..." : "➕ Add Dish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    padding: 32,
    maxWidth: 540,
    width: "100%",
  },
  header: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottom: "1px solid #e5e7eb",
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    color: "#1f2937",
  },
  imagePreview: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
    background: "#f9fafb",
  },
  previewImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  placeholderImg: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  formGroupHalf: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  row: {
    display: "flex",
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: "#374151",
  },
  input: {
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 15,
    outline: "none",
  },
  textarea: {
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 15,
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  select: {
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 15,
    background: "#fff",
    cursor: "pointer",
  },
  toggleContainer: {
    display: "flex",
    gap: 8,
  },
  toggleBtn: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 8,
    border: "2px solid #e5e7eb",
    background: "#fff",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  toggleActiveVeg: {
    borderColor: "#22c55e",
    background: "#dcfce7",
    color: "#15803d",
  },
  toggleActiveNonVeg: {
    borderColor: "#ef4444",
    background: "#fee2e2",
    color: "#dc2626",
  },
  fileInput: {
    padding: 10,
    border: "2px dashed #d1d5db",
    borderRadius: 8,
    background: "#f9fafb",
    cursor: "pointer",
  },
  message: {
    padding: "12px 16px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    textAlign: "center",
  },
  buttonRow: {
    display: "flex",
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    padding: "14px 20px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    background: "#fff",
    fontSize: 15,
    fontWeight: 600,
    color: "#4b5563",
    cursor: "pointer",
  },
  submitBtn: {
    flex: 2,
    padding: "14px 20px",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontSize: 15,
    fontWeight: 600,
    color: "#fff",
    cursor: "pointer",
  },
};
