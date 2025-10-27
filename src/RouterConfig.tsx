import { Route, Routes } from "react-router";
import SignUpPage from "./pages/auth/SignUpPage";
import SignInPage from "./pages/auth/SignInPage";
import AdminSignIn from "./pages/admin/AdminSignIn";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCategories from "./pages/admin/AdminCategories";
import UserCategory from "./pages/user/UserCategory";
import UserHistory from "./pages/user/UserHistory";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminLayout from "./pages/admin/AdminLayout";
import UserLayout from "./pages/user/UserLayout";
import UserInformation from "./pages/user/UserInformation";


export default function RouterConfig() {
  return (
    <Routes>
      {/* User */}
      <Route path="/" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/user" element={<UserLayout />}>
        <Route path="information" element={<UserInformation />} />
        <Route path="category" element={<UserCategory />} />
        <Route path="history" element={<UserHistory />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<AdminSignIn />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
      </Route>
    </Routes>
  );
}
