import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import RolesPermissions from "./pages/RolesPermissions.jsx";
import ProtectedRoute from "./features/auth/ProtectedRoute.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <RolesPermissions />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
