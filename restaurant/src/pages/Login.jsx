// import React, { useState, useContext } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { apiPostForm } from "../api/api";
// import { AuthContext } from "../context/AuthContext";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { setUser, loadUser } = useContext(AuthContext);
//   const nav = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!email || !password) {
//       setError("Userid and Password required");
//       return;
//     }
//     setLoading(true);
//     try {
//       const form = new FormData();
//       form.append("Email", email);
//       form.append("Password", password);

//       // call your existing backend login API
//       const data = await apiPostForm("auth/login", form);

//       // ✅ STORE TOKEN
//       localStorage.setItem("token", data.token);

//       // save user
//       const payload = {
//         userid: data.userid,
//         role: data.role,
//         username: data.username,
//       }

//       setUser(payload);
//       localStorage.setItem("auth_user", JSON.stringify(payload));

//       // load whoami session (not required but safe)
//       await loadUser();

//       // redirect to home
//       nav("/home");

//     } catch (err) {
//       console.error("Login error:", err);
//       setError(err.data?.error || err.message || "Login failed");
//     } finally {
//         setLoading(false);
//       };
//   };

//   return (
//     <div style={{ maxWidth: 360, margin: "40px auto" }}>
//       <h2>Login</h2>

//       <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8 }}>
//         <input
//           type="text"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button type="submit" disabled={loading}>
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <p>
//         Don't have an account? <Link to="/register">Register</Link>
//       </p>
//     </div>
//   );
// }


import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiPostForm } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useEffect } from "react";
import dine2 from "../assets/dine2.jpg";
import "../styles/Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser, loadUser } = useContext(AuthContext);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and Password required");
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append("Email", email);
      form.append("Password", password);

      const data = await apiPostForm("auth/login", form);

      localStorage.setItem("token", data.token);
      const payload = {
        userid: data.userid,
        role: data.role,
        username: data.username,
      };
      setUser(payload);
      localStorage.setItem("auth_user", JSON.stringify(payload));
      await loadUser();
      nav("/home");
    } catch (err) {
      setError(err.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  setEmail("");
  setPassword("");
}, []);

  return (
    <div
      className="auth-page"
      style={{ backgroundImage: `url(${dine2})` }}
    >
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            autoComplete="new-email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter your Password"
            value={password}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && <p className="auth-error">{error}</p>}

        <p>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
