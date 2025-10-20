import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (!admin) navigate("/admin");
  }, [navigate]);

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col ml-56">
        <AdminNavbar />
        <main className="flex-1 bg-gray-50 p-6 mt-14 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
