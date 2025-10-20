import { Route, Routes } from "react-router";
import SignUpPage from "./pages/auth/SignUpPage";
import SignInPage from "./pages/auth/SignInPage";
import AdminSignIn from "./pages/admin/AdminSignIn";
import AdminLayout from "./components/ui/admin/AdminLayout";
import AdminDashboard from "./components/ui/admin/AdminDashboard";
import AdminUsers from "./components/ui/admin/AdminUsers";


export default function RouterConfig() {
  return (
    <Routes>
    {/* User */}
    <Route path="/" element={<SignInPage />} />
    <Route path="/sign-up" element={<SignUpPage />} />

    {/* Admin */}
    <Route path="/admin" element={<AdminSignIn />} />
    <Route path="/admin" element={<AdminLayout />}>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
    </Route>
</Routes>

  );
}
