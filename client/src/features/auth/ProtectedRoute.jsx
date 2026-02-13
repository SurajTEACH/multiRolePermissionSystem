import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../../lib/auth.js";
import { useAuth } from "./AuthProvider.jsx";

export default function ProtectedRoute({ children }) {
  const { isLoading } = useAuth();

  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  if (isLoading) return <div className="p-6 text-sm text-slate-600">Loading...</div>;

  return children;
}
