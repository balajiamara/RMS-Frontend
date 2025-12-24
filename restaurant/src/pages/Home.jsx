// // src/pages/Home.jsx
// import React, { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

// export default function Home() {
//   const { user, setUser, loadUser } = useContext(AuthContext);
//   const isAdmin = user?.role?.toLowerCase() === "admin";

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Welcome {user?.username}</h1>
//       <p>Role: {user?.role}</p>

//       <div style={{ display: "flex", gap: 12 }}>
//         {isAdmin ? (
//           <>
//             <button onClick={() => (location.href = "/view_users")}>View Users</button>
//             <button onClick={() => (location.href = "/view_menu")}>View Menu</button>
//           </>
//         ) : (
//           <>
//             <button onClick={() => (location.href = `/update_user/${user.userid}`)}>Update My Details</button>
//             <button onClick={() => (location.href = "/view_menu")}>View Menu</button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }


// src/pages/Home.jsx
// import React, { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

// export default function Home() {
//   const { user } = useContext(AuthContext);   // Only user is needed
//   const isAdmin = user?.role?.toLowerCase() === "admin";

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Welcome {user?.username}</h1>
//       <p>Role: {user?.role}</p>

//       <div style={{ display: "flex", gap: 12 }}>
//         {isAdmin ? (
//           <>
//             <button onClick={() => (location.href = "/view_users")}>
//               View Users
//             </button>
//             <button onClick={() => (location.href = "/view_menu")}>
//               View Menu
//             </button>
//           </>
//         ) : (
//           <>
//             <button onClick={() => (location.href = `/update_user/${user.userid}`)}>
//               Update My Details
//             </button>
//             <button onClick={() => (location.href = "/view_menu")}>
//               View Menu
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }



import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user, setUser } = useContext(AuthContext);
  const nav = useNavigate();
  const isAdmin = user?.role?.toLowerCase() === "admin";

  function handleLogout() {
    // clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("auth_user");

    // clear context
    setUser(null);

    // redirect to login
    nav("/login");
  }

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <h1>Welcome {user?.username}</h1>
          <p>Role: {user?.role}</p>
        </div>

        {/* 🔴 Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 14px",
            background: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        {isAdmin ? (
          <>
            <button onClick={() => nav("/manage_users")}>View Users</button>
            <button onClick={() => nav("/menu")}>View Menu</button>
          </>
        ) : (
          <>
            <button onClick={() => nav(`/editusers/${user.userid}`)}>
              Update My Details
            </button>
            <button onClick={() => nav("/menu")}>View Menu</button>
          </>
        )}
      </div>
    </div>
  );
}
