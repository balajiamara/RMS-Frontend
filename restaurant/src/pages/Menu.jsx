// import React, { useEffect, useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const API_BASE =
//   import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") || "https://rms-i0wj.onrender.com";

// export default function MenuPage() {
//   const { user } = useContext(AuthContext);
//   const isAdmin = user?.role?.toLowerCase() === "admin";
//   const nav = useNavigate();

//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   async function fetchMenu() {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch(`${API_BASE}/show_item/`, {
//         method: "GET",
//         credentials: "include",
//       });
//       if (!res.ok) {
//         const err = await res.json().catch(() => ({ error: res.statusText }));
//         throw new Error(err.error || err.msg || `Status ${res.status}`);
//       }
//       const data = await res.json();
//       // normalize: array or { menu: [...] }
//       const normalized = Array.isArray(data) ? data : (data.menu || data.results || []);
//       setItems(normalized);
//     } catch (e) {
//       setError(e.message || "Failed to load menu");
//       setItems([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchMenu();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   async function handleDelete(id) {
//     if (!confirm("Delete this dish?")) return;
//     try {
//       const res = await fetch(`${API_BASE}/remove_item/${encodeURIComponent(id)}/`, {
//         method: "DELETE",
//         credentials: "include",
//       });
//       if (!res.ok) {
//         const err = await res.json().catch(() => ({}));
//         throw new Error(err.error || err.msg || `Status ${res.status}`);
//       }
//       // refresh
//       fetchMenu();
//     } catch (e) {
//       alert("Delete failed: " + (e.message || "unknown"));
//     }
//   }

//   return (
//     <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
//         <h2>Menu</h2>
//         {isAdmin && (
//           <button onClick={() => nav("/add_item")} style={{ padding: "8px 12px" }}>
//             + Add New Dish
//           </button>
//         )}
//       </div>

//       {loading && <p>Loading...</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <div style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
//         gap: 16
//       }}>
//         {items.length === 0 && !loading ? (
//           <div style={{ gridColumn: "1/-1" }}>No items found.</div>
//         ) : items.map((it) => {
//           const id = it.DishId ?? it.id ?? it.dishid;
//           return (
//             <div key={id} style={{
//               border: "1px solid #e6e6e6",
//               borderRadius: 8,
//               overflow: "hidden",
//               background: "#fff",
//               boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
//             }}>
//               <div style={{ width: "100%", height: 160, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                 <img
//                   src={it.Image || it.image || "https://via.placeholder.com/300x160"}
//                   alt={it.DishName}
//                   style={{ width: "100%", height: "160px", objectFit: "cover" }}
//                   onError={(e)=> e.target.src = "https://via.placeholder.com/300x160"}
//                 />
//               </div>

//               <div style={{ padding: 12 }}>
//                 <div style={{ fontSize: 13, color: "#666" }}>DishId: {id}</div>
//                 <h3 style={{ margin: "6px 0 8px" }}>{it.DishName}</h3>
//                 <div style={{ fontSize: 13, color: "#444", minHeight: 36 }}>{it.Ingredients}</div>
//                 <div style={{ marginTop: 8, fontWeight: 700 }}>₹{it.Price}</div>

//                 <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
//                   {/* <button onClick={() => nav(`/view_item/${encodeURIComponent(id)}`)} style={{ padding: "6px 10px" }}>
//                     View
//                   </button> */}
//                   <button onClick={() => nav(`/view_item/${encodeURIComponent(id)}`)}>
//                     View
//                   </button>


//                   {isAdmin && (
//                     <>
//                       <button onClick={() => nav(`/modify_item/${encodeURIComponent(id)}`)} style={{ padding: "6px 10px" }}>
//                         Update
//                       </button>
//                       <button onClick={() => handleDelete(id)} style={{ padding: "6px 10px", color: "white", background: "#d9534f", border: "none", borderRadius: 4 }}>
//                         Delete
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") ||
  "https://rms-i0wj.onrender.com";

export default function MenuPage() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const nav = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // cart-related state
  const [cartHasItems, setCartHasItems] = useState(false);
  const [addingId, setAddingId] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [dishType, setDishType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Debounce timer ref
  const [debounceTimer, setDebounceTimer] = useState(null);

  const fetchMenu = useCallback(async (filters = {}) => {
    setLoading(true);
    setError("");
    try {
      // Build query params
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.category) params.append("category", filters.category);
      if (filters.dishType) params.append("dish_type", filters.dishType);
      if (filters.minPrice) params.append("min_price", filters.minPrice);
      if (filters.maxPrice) params.append("max_price", filters.maxPrice);

      const queryString = params.toString();
      const url = `${API_BASE}/show_item/${queryString ? `?${queryString}` : ""}`;

      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || err.msg || `Status ${res.status}`);
      }
      const data = await res.json();
      const normalized = Array.isArray(data) ? data : (data.menu || data.results || []);
      setItems(normalized);
    } catch (e) {
      setError(e.message || "Failed to load menu");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

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
    } catch (e) {
      console.error("Error checking cart:", e);
    }
  }

  // Debounced search - triggers 400ms after user stops typing
  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(() => {
      fetchMenu({
        search: searchTerm,
        category: category,
        dishType: dishType,
        minPrice: minPrice,
        maxPrice: maxPrice,
      });
    }, 400);

    setDebounceTimer(timer);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, category, dishType, minPrice, maxPrice]);

  // Initial cart check
  useEffect(() => {
    checkCart();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this dish?")) return;
    try {
      const res = await fetch(`${API_BASE}/remove_item/${encodeURIComponent(id)}/`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.msg || `Status ${res.status}`);
      }
      // refresh
      fetchMenu();
    } catch (e) {
      alert("Delete failed: " + (e.message || "unknown"));
    }
  }

  // NEW: add to cart for normal users
  async function handleAddToCart(id) {
    try {
      setAddingId(id);
      const res = await fetch(
        `${API_BASE}/add_to_cart/${encodeURIComponent(id)}/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}), // view doesn't need body, but it's fine
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || data.msg || `Status ${res.status}`);
      }

      // cart now has items, so show "Go to Cart" button
      setCartHasItems(true);
    } catch (e) {
      alert("Failed to add to cart: " + (e.message || "unknown"));
    } finally {
      setAddingId(null);
    }
  }

  function handleGoToCart() {
    nav("/cart");
  }

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2>Menu</h2>
        {isAdmin && (
          <button
            onClick={() => nav("/add_item")}
            style={{ padding: "8px 12px" }}
          >
            + Add New Dish
          </button>
        )}
      </div>

      <button
        onClick={() => nav("/ask-ai")}
        style={{
          padding: "8px 12px",
          background: "#6f42c1",
          color: "white",
          border: "none",
          borderRadius: 6,
        }}
      >
        🤖 Ask AI
      </button>

      {/* Search & Filter Section */}
      <div
        style={{
          marginTop: 20,
          marginBottom: 20,
          padding: 16,
          background: "#f8f9fa",
          borderRadius: 8,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
        }}
      >
        {/* Search Input */}
        <input
          type="text"
          placeholder="🔍 Search dishes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #ddd",
            minWidth: 200,
            flex: "1 1 200px",
          }}
        />

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #ddd",
            background: "#fff",
          }}
        >
          <option value="">All Categories</option>
          <option value="soups">Soups</option>
          <option value="starters">Starters</option>
          <option value="main course">Main Course</option>
          <option value="desserts">Desserts</option>
          <option value="beverages">Beverages</option>
        </select>

        {/* Dish Type Filter */}
        <select
          value={dishType}
          onChange={(e) => setDishType(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #ddd",
            background: "#fff",
          }}
        >
          <option value="">All Types</option>
          <option value="Veg">🥬 Veg</option>
          <option value="Non-Veg">🍖 Non-Veg</option>
        </select>

        {/* Price Range */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#666" }}>Price:</span>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: 6,
              border: "1px solid #ddd",
              width: 70,
            }}
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: 6,
              border: "1px solid #ddd",
              width: 70,
            }}
          />
        </div>

        {/* Clear Filters */}
        {(searchTerm || category || dishType || minPrice || maxPrice) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setCategory("");
              setDishType("");
              setMinPrice("");
              setMaxPrice("");
            }}
            style={{
              padding: "8px 12px",
              background: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: 16,
        }}
      >
        {items.length === 0 && !loading ? (
          <div style={{ gridColumn: "1/-1" }}>No items found.</div>
        ) : (
          items.map((it) => {
            const id = it.DishId ?? it.id ?? it.dishid;
            return (
              <div
                key={id}
                style={{
                  border: "1px solid #e6e6e6",
                  borderRadius: 8,
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 160,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={
                      it.Image ||
                      it.image ||
                      "https://via.placeholder.com/300x160"
                    }
                    alt={it.DishName}
                    style={{
                      width: "100%",
                      height: "160px",
                      objectFit: "cover",
                    }}
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/300x160")
                    }
                  />
                </div>

                <div style={{ padding: 12 }}>
                  <div style={{ fontSize: 13, color: "#666" }}>
                    DishId: {id}
                  </div>
                  <h3 style={{ margin: "6px 0 8px" }}>{it.DishName}</h3>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#444",
                      minHeight: 36,
                    }}
                  >
                    {it.Ingredients}
                  </div>
                  <div style={{ marginTop: 8, fontWeight: 700 }}>
                    ₹{it.Price}
                  </div>

                  <div
                    style={{
                      marginTop: 12,
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={() =>
                        nav(`/view_item/${encodeURIComponent(id)}`)
                      }
                    >
                      View
                    </button>

                    {isAdmin && (
                      <>
                        <button
                          onClick={() =>
                            nav(`/modify_item/${encodeURIComponent(id)}`)
                          }
                          style={{ padding: "6px 10px" }}
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(id)}
                          style={{
                            padding: "6px 10px",
                            color: "white",
                            background: "#d9534f",
                            border: "none",
                            borderRadius: 4,
                          }}
                        >
                          Delete
                        </button>
                      </>
                    )}

                    {/* Add to cart only for normal users (non-admin) */}
                    {!isAdmin && (
                      <button
                        onClick={() => handleAddToCart(id)}
                        disabled={addingId === id}
                        style={{
                          padding: "6px 10px",
                          color: "white",
                          background: "#28a745",
                          border: "none",
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
          })
        )}
      </div>

      {/* Go to cart button at bottom — only for normal users & only if cart has items */}
      {!isAdmin && cartHasItems && (
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

// ASK AI

// import React, { useEffect, useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const API_BASE =
//   import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") || "http://127.0.0.1:8000/"
//   // "https://rms-i0wj.onrender.com";

// export default function MenuPage() {
//   const { user } = useContext(AuthContext);
//   const isAdmin = user?.role?.toLowerCase() === "admin";
//   const nav = useNavigate();

//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [cartHasItems, setCartHasItems] = useState(false);
//   const [addingId, setAddingId] = useState(null);

//   async function fetchMenu() {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch(`${API_BASE}/show_item/`, {
//         method: "GET",
//         credentials: "include",
//       });
//       if (!res.ok) throw new Error("Failed to load menu");
//       const data = await res.json();
//       setItems(Array.isArray(data) ? data : data.menu || []);
//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function checkCart() {
//     try {
//       const res = await fetch(`${API_BASE}/get_cart/`, {
//         credentials: "include",
//       });
//       const data = await res.json();
//       if (Array.isArray(data.cart_items) && data.cart_items.length > 0) {
//         setCartHasItems(true);
//       }
//     } catch (e) {
//   console.error("Error checking cart:", e);
// }
//   }

//   useEffect(() => {
//     fetchMenu();
//     checkCart();
//   }, []);

//   async function handleAddToCart(id) {
//     try {
//       setAddingId(id);
//       const res = await fetch(`${API_BASE}/add_to_cart/${id}/`, {
//         method: "POST",
//         credentials: "include",
//       });
//       if (!res.ok) throw new Error("Add to cart failed");
//       setCartHasItems(true);
//     } catch (e) {
//       alert(e.message);
//     } finally {
//       setAddingId(null);
//     }
//   }

//   return (
//     <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
//       {/* HEADER */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: 16,
//         }}
//       >
//         <h2>Menu</h2>

//         {/* 🤖 Ask AI button – only for normal users */}
//         {!isAdmin && (
//           <button
//             onClick={() => nav("/ask-ai")}
//             style={{
//               padding: "8px 14px",
//               borderRadius: 6,
//               background: "#6f42c1",
//               color: "#fff",
//               border: "none",
//               cursor: "pointer",
//             }}
//           >
//             🤖 Ask AI
//           </button>
//         )}
//       </div>

//       {loading && <p>Loading...</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
//           gap: 16,
//         }}
//       >
//         {items.map((it) => {
//           const id = it.DishId;
//           return (
//             <div
//               key={id}
//               style={{
//                 border: "1px solid #ddd",
//                 borderRadius: 8,
//                 background: "#fff",
//               }}
//             >
//               <img
//                 src={it.Image}
//                 alt={it.DishName}
//                 style={{ width: "100%", height: 160, objectFit: "cover" }}
//               />

//               <div style={{ padding: 12 }}>
//                 <h3>{it.DishName}</h3>
//                 <p style={{ fontSize: 13 }}>{it.Ingredients}</p>
//                 <b>₹{it.Price}</b>

//                 {!isAdmin && (
//                   <button
//                     onClick={() => handleAddToCart(id)}
//                     disabled={addingId === id}
//                     style={{
//                       marginTop: 8,
//                       width: "100%",
//                       padding: 8,
//                       background: "#28a745",
//                       color: "#fff",
//                       border: "none",
//                       borderRadius: 4,
//                     }}
//                   >
//                     {addingId === id ? "Adding..." : "Add to Cart"}
//                   </button>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {!isAdmin && cartHasItems && (
//         <div style={{ marginTop: 24, textAlign: "right" }}>
//           <button
//             onClick={() => nav("/cart")}
//             style={{
//               padding: "10px 16px",
//               background: "#007bff",
//               color: "#fff",
//               border: "none",
//               borderRadius: 6,
//             }}
//           >
//             Go to Cart
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
