import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getDashboardData } from "../../apis/core/Admin.api"; // ✅ import API tách riêng

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState<number>(0);
  const [categoryCount, setCategoryCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await getDashboardData();
      setUserCount(data.userCount);
      setCategoryCount(data.categoryCount);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="flex-1 bg-gray-50 min-h-screen px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-8 text-gray-800">
          Dashboard Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* 🧍 User */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <p className="text-gray-500 text-sm uppercase mb-2">User</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-gray-900">
                {loading ? "..." : userCount.toLocaleString()}
              </h3>
              <p className="text-green-500 text-sm flex items-center gap-1">
                +36% <ArrowUpRight size={16} />
              </p>
            </div>
          </div>

          {/* 📂 Category */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <p className="text-gray-500 text-sm uppercase mb-2">Category</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-gray-900">
                {loading ? "..." : categoryCount.toLocaleString()}
              </h3>
              <p className="text-red-500 text-sm flex items-center gap-1">
                -14% <ArrowDownRight size={16} />
              </p>
            </div>
          </div>

          {/* 💸 Spending */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <p className="text-gray-500 text-sm uppercase mb-2">Spending</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-gray-900">84,382</h3>
              <p className="text-green-500 text-sm flex items-center gap-1">
                +36% <ArrowUpRight size={16} />
              </p>
            </div>
          </div>

          {/* 💰 Total Money */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <p className="text-gray-500 text-sm uppercase mb-2">Total Money</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-gray-900">$33,493,022</h3>
              <p className="text-green-500 text-sm flex items-center gap-1">
                +36% <ArrowUpRight size={16} />
              </p>
            </div>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-[400px] flex items-center justify-center text-gray-400 text-sm">
          📊 Chart area (sắp thêm ở đây)
        </div>
      </div>
    </div>
  );
}
