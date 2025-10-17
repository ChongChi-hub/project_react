import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin");
  };

  return (
    <div className="flex items-center  justify-between bg-white border-b px-6 py-3 shadow-sm">
      <h1 className="text-xl font-bold">
        Financial <span className="text-indigo-600">Manager</span> 
      </h1>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-gray-600 hover:text-red-600"
      >
        <LogOut size={18} />
        Sign out
      </button>
    </div>
  );
}
