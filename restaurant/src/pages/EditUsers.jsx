import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet, apiPostForm } from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function EditUser() {
  const { id } = useParams();
  const nav = useNavigate();
  // const { setUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    Username: "",
    Email: "",
  });

  const [loading, setLoading] = useState(true);

  // Load existing user data
  useEffect(() => {
    apiGet(`get_user/${id}/`)
      .then(data => {
        setForm({
          Username: data.Username || "",
          Email: data.Email || "",
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load user:", err);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const { loadUser } = useContext(AuthContext);


  // Submit updated details
  const handleSubmit = (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("Username", form.Username);
    fd.append("Email", form.Email);

    apiPostForm(`modify_my_details/`, fd)
      .then(async () => {
        // Fetch fresh user data so Home page shows updated name
        // const newUser = await apiGet("whoami/");
        // setUser(newUser);
        const whoamiData = await apiGet("whoami/");
        console.log("WHOAMI after update:", whoamiData);

        await loadUser();

        alert("Details updated!");
        nav("/home");
      })
      .catch(err => {
        console.error("Update failed:", err);
        alert(err.message);
      });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Edit My Details</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: 300,
        }}
      >
        <label>
          Username:
          <input
            type="text"
            name="Username"
            value={form.Username}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="Email"
            value={form.Email}
            onChange={handleChange}
            required
          />
        </label>

        <button
          type="submit"
          style={{
            background: "green",
            padding: "8px 12px",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>

        <button
          type="button"
          onClick={() => nav("/home")}
          style={{
            background: "gray",
            padding: "8px 12px",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
