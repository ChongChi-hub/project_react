import { useEffect, useState } from "react";
import { Input, Button, DatePicker, message, Card } from "antd";
import { useNavigate } from "react-router-dom";
import ModalChangeInformation from "../../components/ui/user/ModalChangeInformation";
import ModalChangePassword from "../../components/ui/user/ModalChangePassword";
import { MonthlyCategoryApi } from "../../apis/core/monthlyCategory.api";
import type { User } from "../../types/user.type";
import type { MonthlyCategory } from "../../types/monthlyData.type";

export default function UserInformation() {
  const [user, setUser] = useState<User | null>(null);
  const [budget, setBudget] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [monthlyId, setMonthlyId] = useState<string | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const navigate = useNavigate();

  // ✅ Lấy thông tin user từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (!saved) {
      message.warning("⚠️ Bạn cần đăng nhập để truy cập trang này!");
      navigate("/");
      return;
    }
    setUser(JSON.parse(saved));
  }, [navigate]);

  // ✅ Lấy ngân sách khi load trang hoặc đổi tháng
  useEffect(() => {
    if (!user) return;

    const fetchBudget = async () => {
      try {
        const data: MonthlyCategory[] = await MonthlyCategoryApi.getByUserId(
          String(user.id)
        );

        if (data.length > 0) {
          // Nếu có tháng được chọn thì tìm đúng tháng
          if (selectedMonth) {
            const found = data.find((item) => item.month === selectedMonth);
            if (found) {
              setBudget(found.balence);
              setMonthlyId(found.id);
              return;
            }
          }

          // Nếu chưa chọn tháng thì lấy tháng đầu tiên trong dữ liệu
          setBudget(data[0].balence);
          setMonthlyId(data[0].id);
          setSelectedMonth(data[0].month);
        } else {
          setBudget(0);
          setMonthlyId(null);
        }
      } catch (err) {
        console.error(err);
        message.error("❌ Không thể tải ngân sách từ server!");
      }
    };

    fetchBudget();
  }, [user, selectedMonth]);

  // ✅ Lưu ngân sách tháng (cập nhật hoặc tạo mới)
  const handleSaveBudget = async () => {
    if (!user) return;
    if (!budget) {
      message.warning("⚠️ Vui lòng nhập số tiền ngân sách!");
      return;
    }

    const monthToSave =
      selectedMonth || new Date().toISOString().slice(0, 7); // YYYY-MM

    try {
      if (monthlyId) {
        // Cập nhật bản ghi có sẵn
        await MonthlyCategoryApi.update(monthlyId, {
          balence: budget,
          month: monthToSave,
        });
        message.success("✅ Cập nhật ngân sách thành công!");
      } else {
        // Tạo mới bản ghi ngân sách
        const newRecord = await MonthlyCategoryApi.create({
          month: monthToSave,
          balence: budget,
          userId: String(user.id),
          categories: [],
        });
        setMonthlyId(newRecord.id);
        message.success("💰 Ngân sách đã được lưu!");
      }
    } catch (err) {
      console.error(err);
      message.error("❌ Lỗi khi lưu ngân sách!");
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-indigo-600 text-white rounded-xl text-center py-4 shadow-md">
          <h2 className="text-lg font-semibold">🎯 Kiểm soát chi tiêu thông minh</h2>
          <p className="text-sm opacity-90">
            Theo dõi ngân sách và thu chi hàng tháng dễ dàng
          </p>
        </div>

        {/* Thông tin tài chính */}
        <div className="flex flex-col gap-4">
          <Card className="rounded-xl shadow-md text-center">
            <p className="text-[22px] font-semibold">📊 Quản Lý Tài Chính Cá Nhân</p>
          </Card>

          <Card title="💵 Số tiền còn lại" className="rounded-xl shadow-md text-center">
            <p className="text-green-600 text-xl font-semibold">
              {budget ? `${budget.toLocaleString()} VND` : "0 VND"}
            </p>
          </Card>

          <Card title="🗓️ Chọn tháng" className="rounded-xl shadow-md text-center">
            <DatePicker
              picker="month"
              onChange={(_, dateString) => setSelectedMonth(dateString as string)}
              placeholder="Chọn tháng"
            />
          </Card>
        </div>

        {/* Ô nhập ngân sách */}
        <Card className="rounded-xl shadow-md text-center p-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="text-gray-600 text-sm">💰 Ngân sách tháng:</span>
            <Input
              type="number"
              placeholder="VD: 5000000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-52"
            />
            <Button type="primary" onClick={handleSaveBudget}>
              Lưu
            </Button>
          </div>
        </Card>

        {/* Quản lý thông tin cá nhân */}
        <Card title="🧍‍♂️ Quản Lý Thông Tin Cá Nhân" className="rounded-xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Họ và tên</label>
              <Input value={user.fullName} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input value={user.email} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Số điện thoại</label>
              <Input value={user.phone || ""} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Giới tính</label>
              <Input value={user.gender ? "Nam" : "Nữ"} disabled />
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <Button
              onClick={() => setShowInfoModal(true)}
              className="border-indigo-600 text-indigo-600"
            >
              Cập nhật thông tin
            </Button>
            <Button
              onClick={() => setShowPasswordModal(true)}
              className="border-indigo-600 text-indigo-600"
            >
              Đổi mật khẩu
            </Button>
          </div>
        </Card>
      </div>

      {/* Hai modal riêng */}
      <ModalChangeInformation
        open={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        user={user}
        onUpdate={(updated) => setUser(updated)}
      />
      <ModalChangePassword
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        user={user}
      />
    </div>
  );
}
