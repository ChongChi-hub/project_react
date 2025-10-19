import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import '../../assets/css/AdminNavbar.css'

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = (): void => {
    localStorage.removeItem("admin");
    navigate("/admin");
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between bg-white border-b px-6 py-3 shadow-sm">
      {/* Logo */}
      <h1 className="text-xl font-bold">
        Financial <span className="text-indigo-600">Manager</span>
      </h1>

      {/* Avatar + Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition"
        >
          <User size={18} className="text-gray-700" />
        </button>

        {open && (
          <div className="absolute right-0 mt-3 w-44 bg-white border rounded-lg shadow-lg z-50 p-2 animate-fadeIn">
            <button className="w-full text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-center">
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md mt-1 text-center"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
