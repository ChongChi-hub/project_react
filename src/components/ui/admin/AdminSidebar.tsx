import { LayoutDashboard, Users, Folder, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const menu = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/admin/users", label: "Users", icon: <Users size={18} /> },
    { to: "/admin/categories", label: "Category", icon: <Folder size={18} /> },
  ];

  const handleLogout = () => {
    navigate("/signin");
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-56 bg-white border-r border-gray-200 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="h-14 flex items-center justify-center border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-800 text-center">Financial Manager</h1>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-1 mt-2 px-2">
          {menu.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm rounded-md transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {item.icon}
              <span className="whitespace-nowrap">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-gray-700 hover:text-red-500 text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
