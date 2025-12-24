// import { useEffect, useState } from "react";
// import { apiGet } from "../api/api";

// export default function ManageUsers() {
//   const [users, setUsers] = useState([]);

// useEffect(() => {
//   apiGet("show_users/")
//     .then(data => {
//       console.log("API Response:", data);
//       const arr =
//         data.users ||
//         data.data ||
//         data.results ||
//         (Array.isArray(data) ? data : []);
//       setUsers(arr);
//     })
//     .catch(err => console.error("API error:", err));
// }, []);


//   return (
//     <div>
//       <h1>All Users</h1>
//       <table border="1">
//         <thead>
//           <tr>
//             <th>Userid</th>
//             <th>Username</th>
//             <th>Email</th>
//             <th>Role</th>
//           </tr>
//         </thead>

//         <tbody>
//           {users.map(u => (
//             <tr key={u.Userid}>
//               <td>{u.Userid}</td>
//               <td>{u.Username}</td>
//               <td>{u.Email}</td>
//               <td>{u.Role}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import { apiGet, apiPost } from "../api/api";

// export default function ManageUsers() {
//   const [users, setUsers] = useState([]);

//   const fetchUsers = () => {
//     apiGet("show_users/")
//       .then(data => {
//         const arr =
//           data.users ||
//           data.data ||
//           data.results ||
//           (Array.isArray(data) ? data : []);
//         setUsers(arr);
//       })
//       .catch(err => console.error("API error:", err));
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // 🔹 Delete User
//   const deleteUser = (id) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;

//     apiPost(`remove_user/${id}/`)
//       .then(() => fetchUsers())
//       .catch(err => console.error("Delete error:", err));
//   };

//   // 🔹 Promote User to Admin
//   const promoteUser = (id) => {
//     apiPost(`promote_user/${id}/`)
//       .then(() => fetchUsers())
//       .catch(err => console.error("Promote error:", err));
//   };

//   // 🔹 Update User
//   const updateUser = (id) => {
//     const newName = prompt("Enter new username:");
//     const newEmail = prompt("Enter new email:");

//     if (!newName || !newEmail) return;

//     apiPost(`modify_user/${id}/`, {
//       Username: newName,
//       Email: newEmail,
//     })
//       .then(() => fetchUsers())
//       .catch(err => console.error("Update error:", err));
//   };

//   return (
//     <div>
//       <h1>All Users</h1>

//       <table border="1">
//         <thead>
//           <tr>
//             <th>Userid</th>
//             <th>Username</th>
//             <th>Email</th>
//             <th>Role</th>
//             <th>Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {users.map(u => (
//             <tr key={u.Userid}>
//               <td>{u.Userid}</td>
//               <td>{u.Username}</td>
//               <td>{u.Email}</td>
//               <td>{u.Role}</td>
//               <td>
//                 <button onClick={() => updateUser(u.Userid)}>
//                   Update
//                 </button>

//                 <button onClick={() => promoteUser(u.Userid)}>
//                   Promote
//                 </button>

//                 <button onClick={() => deleteUser(u.Userid)}>
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete, apiPutForm } from "../api/api";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    apiGet("show_users")
      .then(data => {
        const arr =
          data.users ||
          data.data ||
          data.results ||
          (Array.isArray(data) ? data : []);

        setUsers(arr);
      })
      .catch(err => console.error("API error:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔴 DELETE USER → DELETE method required by backend
  const deleteUser = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    apiDelete(`remove_user/${id}`)
      .then(fetchUsers)
      .catch(err => console.error("Delete error:", err));
  };

  // 🔵 PROMOTE USER → backend expects POST
  const promoteUser = (id) => {
    apiPost(`promote_user/${id}`)
      .then(fetchUsers)
      .catch(err => console.error("Promote error:", err));
  };

  // 🟢 UPDATE USER → backend requires PUT or PATCH
const updateUser = (id) => {
  const newName = prompt("Enter new username:");
  const newEmail = prompt("Enter new email:");

  if (!newName || !newEmail) return;

  const form = new FormData();
  form.append("Username", newName);
  form.append("Email", newEmail);

  apiPutForm(`modify_user/${id}`, form)
    .then(fetchUsers)
    .catch(err => console.error("Update error:", err));
};



  return (
    <div>
      <h1>All Users</h1>

      <table border="1">
        <thead>
          <tr>
            <th>Userid</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map(u => (
            <tr key={u.Userid}>
              <td>{u.Userid}</td>
              <td>{u.Username}</td>
              <td>{u.Email}</td>
              <td>{u.Role}</td>

              <td>
                {/* 🟢 Green Update */}
                <button
                  style={{
                    background: "green",
                    color: "white",
                    padding: "6px 10px",
                    marginRight: "6px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => updateUser(u.Userid)}
                >
                  Update
                </button>

                {/* 🔵 Blue Promote */}
                <button
                  style={{
                    background: "blue",
                    color: "white",
                    padding: "6px 10px",
                    marginRight: "6px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => promoteUser(u.Userid)}
                >
                  Promote
                </button>

                {/* 🔴 Red Delete */}
                <button
                  style={{
                    background: "red",
                    color: "white",
                    padding: "6px 10px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => deleteUser(u.Userid)}
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

