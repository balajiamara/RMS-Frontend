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
import { useEffect } from "react";
import "../styles/Home.css";

export default function Home() {
  const { user } = useContext(AuthContext);
  const nav = useNavigate();
  const isAdmin = user?.role?.toLowerCase() === "admin";

  useEffect(() => {
    // prevent going back
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        {isAdmin ? (
          <>
            <button onClick={() => nav("/manage_users")}>
              View Users
            </button>
            <button onClick={() => nav("/menu")}>
              View Menu
            </button>
          </>
        ) : (
          <>
            <button onClick={() => nav(`/editusers/${user.userid}`)}>
              Update My Details
            </button>
            <button onClick={() => nav("/menu")}>
              View Menu
            </button>
          </>
        )}
      </div>
    </div>
  );
}
