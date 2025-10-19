import { LayoutDashboard, Users, Folder, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const menu = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/admin/users", label: "Users", icon: <Users size={18} /> },
    { to: "/admin/category", label: "Category", icon: <Folder size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin");
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-56 bg-white border-r shadow-sm flex flex-col justify-between">
      {/* Menu */}
      <div className="mt-6">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-2 text-sm font-medium hover:bg-indigo-50 ${
                isActive ? "text-indigo-600 bg-indigo-50" : "text-gray-700"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-red-600"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </div>
  );
}
