import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin");
  };

  const admin = JSON.parse(localStorage.getItem("admin") || "{}");

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
    <div className="fixed top-0 left-0 w-full h-14 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 z-50">
      {/* Logo */}
      <h1 className="text-xl font-bold">
        Financial <span className="text-indigo-600">Manager</span>
      </h1>

      {/* Avatar + Dropdown */}
      <h3 className="text-sm font-medium">{admin.fullName}</h3>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition"
        >
          <User size={18} className="text-gray-700" />
        </button>

        {open && (
          <div className="absolute right-0 mt-3 w-44 bg-white border rounded-lg shadow-lg z-50 p-2 border-white">
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
