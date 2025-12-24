// // import { useContext } from "react";
// // import { AuthContext } from "../context/AuthContext";
// // import { apiPost } from "../api/api";
// // import { useNavigate } from "react-router-dom";

// // export default function Login() {
// //   const { loadUser } = useContext(AuthContext);
// //   const navigate = useNavigate();

// //   async function handleLogin(e) {
// //     e.preventDefault();

// //     const form = new FormData(e.target);

// //     const res = await apiPost("login_user/", form);

// //     // No response or server down
// //     if (!res) {
// //       alert("Server not responding");
// //       return;
// //     }

// //     // Backend sends: {error: "..."} when login fails
// //     if (res.error || res.msg === "Wrong userid or password") {
// //       alert(res.error || res.msg || "Invalid login");
// //       return;
// //     }

// //     // Backend sends: {success: true}
// //     if (res.success) {
// //       await loadUser();  // refresh user info from cookie
// //       navigate("/");     // go to home page
// //       return;
// //     }

// //     // Fallback
// //     alert("Unknown login problem");
// //   }

// //   return (
// //     <div>
// //       <h1>Login</h1>
// //       <form onSubmit={handleLogin}>
// //         <label>User ID</label>
// //         <input name="Userid" required />

// //         <label>Password</label>
// //         <input name="Password" type="password" required />

// //         <button>Login</button>
// //       </form>
// //     </div>
// //   );
// // }



// import React, { useState, useContext } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { apiPostForm } from "../api/api";
// import { AuthContext } from "../context/AuthContext";

// export default function Login() {
//   const [Userid, setUserid] = useState("");
//   const [Password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const { setUser, loadUser } = useContext(AuthContext);
//   const nav = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!Userid || !Password) {
//       setError("Userid and Password required");
//       return;
//     }

//     try {
//       const form = new FormData();
//       form.append("Userid", Userid);     // EXACT key names backend expects
//       form.append("Password", Password);

//       const data = await apiPostForm("login_user", form); // -> /login_user/
//       // backend should return role & userid in JSON
//       // setUser({ userid: data.userid, role: data.role, username: data.username });
//       // nav("/home");
//       // inside Login submit success
//       const payload = { userid: data.userid, role: data.role, username: data.username };
//       setUser(payload);
//       await loadUser();
//       if (localStorage.getItem("auth_user")) nav("/home");
//       else setError("Login failed: server rejected session");


//     } catch (err) {
//       setError(err.data?.error || err.message || "Login failed");
//     }
//   };

//   return (
//     <div style={{ maxWidth: 360, margin: "40px auto" }}>
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8 }}>
//         <input
//           type="text"
//           placeholder="Userid"
//           value={Userid}
//           onChange={(e) => setUserid(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={Password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Login</button>
//       </form>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <p>Don't have an account? <Link to="/register">Register</Link></p>
//     </div>
//   );
// }



// src/pages/Login.jsx
// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiPostForm } from "../api/api";
import { AuthContext } from "../context/AuthContext";

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
      setError("Userid and Password required");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("Email", email);
      form.append("Password", password);

      // call your existing backend login API
      const data = await apiPostForm("auth/login", form);

      // ✅ STORE TOKEN
      localStorage.setItem("token", data.token);

      // save user
      const payload = {
        userid: data.userid,
        role: data.role,
        username: data.username,
      }

      setUser(payload);
      localStorage.setItem("auth_user", JSON.stringify(payload));

      // load whoami session (not required but safe)
      await loadUser();

      // redirect to home
      nav("/home");

    } catch (err) {
      console.error("Login error:", err);
      setError(err.data?.error || err.message || "Login failed");
    } finally {
        setLoading(false);
      };
  };

  return (
    <div style={{ maxWidth: 360, margin: "40px auto" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8 }}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
