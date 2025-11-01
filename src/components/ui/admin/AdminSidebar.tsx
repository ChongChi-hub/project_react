import { useState } from "react";
import { LayoutDashboard, Users, Folder, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import '../../../assets/css/AdminSidebar.css'

export default function AdminSidebar() {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menu = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/admin/users", label: "Users", icon: <Users size={18} /> },
    { to: "/admin/categories", label: "Category", icon: <Folder size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin");
  };

  return (
    <>
      <div className="fixed top-0 left-0 h-screen w-56 bg-white border-r border-gray-200 shadow-sm flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="h-14 flex items-center justify-center border-b border-gray-200">
            <h1 className="text-lg font-semibold text-gray-800 text-center">
              Financial Manager
            </h1>
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
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 text-gray-700 hover:text-red-500 text-sm font-medium"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Modal xác nhận đăng xuất */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-60 backdrop-blur-[2px] z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-80 text-center border border-gray-100 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Xác nhận đăng xuất
            </h3>
            <p className="text-gray-600 mb-6 text-sm">
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản admin?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
