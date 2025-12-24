// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Login from "./pages/Login.jsx";
// import Menu from "./pages/Menu.jsx";
// import ManageUsers from "./pages/ManageUsers.jsx";

// import ProtectedRoute from "./components/ProtectedRoute.jsx";
// import AuthProvider from "./context/AuthProvider.jsx";   // ✔ correct import

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/login" element={<Login />} />

//           <Route
//             path="/"
//             element={
//               <ProtectedRoute>
//                 <Menu />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/manage-users"
//             element={
//               <ProtectedRoute adminOnly={true}>
//                 <ManageUsers />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }


// ----------------------------------------------------------


// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login.jsx";
// import Home from "./pages/Home.jsx";
// import Register from "./pages/Register.jsx";
// import ProtectedRoute from "./pages/ProtectedRoute.jsx";
// import AuthProvider from "./context/AuthProvider.jsx";


// function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           <Route
//             path="/home"
//             element={
//               <ProtectedRoute>
//                 <Home />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// export default App;




import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import MenuPage from "./pages/Menu.jsx";
import AddDish from "./pages/AddDish.jsx";
import EditDish from "./pages/EditDish.jsx";
import EditUser from "./pages/EditUsers.jsx";
import ViewDish from "./pages/ViewDish.jsx";
import ManageUsers from "./pages/ManageUsers.jsx";
import CartPage from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import AskAI from "./pages/AskAI.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* default -> go to /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* optional aliases so backend-like paths work in frontend */}
          <Route path="/login_user" element={<Login />} />
          <Route path="/register_user" element={<Register />} />

          {/* protected */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/menu" element={<ProtectedRoute><MenuPage/></ProtectedRoute>} />
          <Route path="/add_item" element={<ProtectedRoute><AddDish/></ProtectedRoute>} />
          <Route path="/modify_item/:id" element={<ProtectedRoute><EditDish/></ProtectedRoute>} />
          <Route path="/view_item/:id" element={<ViewDish />} />
          <Route path="/manage_users" element={<ManageUsers />} />
          <Route path="/editusers/:id" element={<EditUser/>}/>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/ask-ai" element={<AskAI />} />



          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
