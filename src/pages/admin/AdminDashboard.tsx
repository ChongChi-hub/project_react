import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getDashboardData } from "../../apis/core/Admin.api";

export default function AdminDashboard() {
  const [data, setData] = useState({
    userCount: 0,
    categoryCount: 0,
    totalTransactionCount: 0,
    totalSpending: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await getDashboardData();
      // hỗ trợ cả 2 dạng: {data:{...}} hoặc {...}
      const payload = res && (res as any).data ? (res as any).data : res;

      setData({
        userCount: Number(payload?.userCount ?? 0),
        categoryCount: Number(payload?.categoryCount ?? 0),
        totalTransactionCount: Number(payload?.totalTransactionCount ?? 0),
        totalSpending: Number(payload?.totalSpending ?? 0),
      });
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
                {loading ? "..." : data.userCount.toLocaleString()}
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
                {loading ? "..." : data.categoryCount.toLocaleString()}
              </h3>
              <p className="text-red-500 text-sm flex items-center gap-1">
                -14% <ArrowDownRight size={16} />
              </p>
            </div>
          </div>

          {/* 💰 Total Spending */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <p className="text-gray-500 text-sm uppercase mb-2">
              Spending (VND)
            </p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-gray-900">
                {loading ? "..." : data.totalSpending.toLocaleString("vi-VN")}
              </h3>
              <p className="text-green-500 text-sm flex items-center gap-1">
                +12% <ArrowUpRight size={16} />
              </p>
            </div>
          </div>
          {/* 💸 Total Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
            <p className="text-gray-500 text-sm uppercase mb-2">
              Total Transactions
            </p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-gray-900">
                {loading ? "..." : data.totalTransactionCount.toLocaleString()}
              </h3>
              <p className="text-green-500 text-sm flex items-center gap-1">
                +5% <ArrowUpRight size={16} />
              </p>
            </div>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-[400px] flex items-center justify-center text-gray-400 text-sm">
          Chart area 
        </div>
      </div>
    </div>
  );
}
