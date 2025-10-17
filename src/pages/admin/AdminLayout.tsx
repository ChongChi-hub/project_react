import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (!admin) {
      navigate("/admin"); // chưa đăng nhập -> quay lại trang login
    }
  }, [navigate]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <AdminNavbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
