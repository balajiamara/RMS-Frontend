import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const { setUser } = useContext(AuthContext);
  const nav = useNavigate();

  function handleLogout() {
    // clear auth storage
    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");

    // clear context
    setUser(null);

    // redirect to landing page
    nav("/");
  }

  return (
    <button
      onClick={handleLogout}
      className="btn btn-outline-danger btn-sm"
    >
      Logout
    </button>
  );
}
