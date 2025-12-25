import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPostForm } from "../api/api";

export default function Register() {
  // const [Userid, setUserid] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!username || !email || !password) {   //!Userid || 
      setMsg("All fields are required");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      // form.append("Userid", Userid);
      form.append("Username", username);
      form.append("Email", email);
      form.append("Password", password);

      await apiPostForm("auth/register/", form); // -> /add_user/
      setMsg("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login", {replace:true}), 1200);
    } catch (err) {
      setMsg(err.data?.error || err.message || "Registration failed");
    } finally {
        setLoading(false);
      };
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* <input placeholder="Userid" value={Userid} onChange={(e)=>setUserid(e.target.value)} required /> */}
        <input placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} required />
        <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}
