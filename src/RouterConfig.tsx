import { Route, Routes } from "react-router";
import SignUpPage from "./pages/auth/SignUpPage";
import SignInPage from "./pages/auth/SignInPage";
import AdminSignIn from "./pages/admin/AdminSignIn";
import AdminDashboard from "./components/ui/AdminDashboard";
import AdminLayout from "./components/ui/AdminLayout";



export default function RouterConfig() {
  return (
    <Routes>
      {/* User */}
      <Route path="/" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      {/* Admin */}
      <Route path="/admin" element={<AdminSignIn />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}
