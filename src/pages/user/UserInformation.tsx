// src/pages/user/UserInformation.tsx
import { useEffect, useMemo, useState } from "react";
import { DatePicker,Input,Button,message,Alert,type DatePickerProps } from "antd";
import axios from "axios";
import type { Dayjs } from "dayjs";
import ModalChangeInformation from "../../components/ui/user/ModalChangeInformation";
import ModalChangePassword from "../../components/ui/user/ModalChangePassword";
import type { User } from "../../types/user.type";
import type { MonthlyCategory } from "../../types/monthlyData.type";
import dayjs from "dayjs";

const API_URL = import.meta.env.VITE_API_URL as string;
const LS_MONTH_KEY = "lastSelectedMonth";

const toYMD = (s: string) => (s ? s.slice(0, 7) : "");

export default function UserInformation() {
  const [user, setUser] = useState<User | null>(null);

  // tháng đang chọn (YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  // dữ liệu tháng hiện tại từ API
  const [monthlyData, setMonthlyData] = useState<MonthlyCategory | null>(null);
  // input ngân sách 
  const [budgetInput, setBudgetInput] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [openPass, setOpenPass] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) setUser(JSON.parse(raw));
    const saved = localStorage.getItem(LS_MONTH_KEY);
    const fallback = new Date().toISOString().slice(0, 7);
    setSelectedMonth(saved || fallback);
  }, []);

  // đổi tháng lưu localStorage
  const handleChangeMonth: DatePickerProps["onChange"] = (
    _date: Dayjs | null,
    dateString: string | string[]
  ) => {
    const s = Array.isArray(dateString) ? dateString[0] : dateString;
    const m = String(s); // 'YYYY-MM'
    setSelectedMonth(m);
    localStorage.setItem(LS_MONTH_KEY, m);
  };

  // nạp dữ liệu tháng theo user + tháng
  useEffect(() => {
    if (!user || !selectedMonth) return;
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<MonthlyCategory[]>(
          `${API_URL}/monthlyCategories`,
          { params: { userId: String(user.id) } }
        );
        const found =
          data.find((i) => toYMD(i.month) === selectedMonth) || null;
        setMonthlyData(found);
        setBudgetInput(found?.balence);
      } catch {
        message.error("Không tải được dữ liệu tháng!");
      } finally {
        setLoading(false);
      }
    })();
  }, [user, selectedMonth]);

  const totalCategoryBudget = useMemo(() => {
    if (!monthlyData?.categories?.length) return 0;
    return monthlyData.categories.reduce((sum, c) => sum + (c.budget || 0), 0);
  }, [monthlyData]);

  const remaining = useMemo(() => {
    const base = budgetInput ?? monthlyData?.balence ?? 0;
    const remain = base - totalCategoryBudget;
    return remain > 0 ? remain : 0;
  }, [budgetInput, monthlyData, totalCategoryBudget]);

  // lưu ngân sách tháng
  const handleSaveBudget = async () => {
    if (!user) return;
    if (!selectedMonth) {
      message.warning("Vui lòng chọn tháng!");
      return;
    }
    if (budgetInput === undefined || Number.isNaN(budgetInput)) {
      message.warning("Vui lòng nhập mức ngân sách tháng!");
      return;
    }
    try {
      setLoading(true);
      localStorage.setItem(LS_MONTH_KEY, selectedMonth); // giữ lại tháng hiện tại
      if (monthlyData) {
        // cập nhật
        const { data } = await axios.patch<MonthlyCategory>(
          `${API_URL}/monthlyCategories/${monthlyData.id}`,
          { balence: budgetInput, month: selectedMonth }
        );
        setMonthlyData(data);
        message.success("Đã cập nhật ngân sách!");
      } else {
        // tạo mới
        const { data } = await axios.post<MonthlyCategory>(
          `${API_URL}/monthlyCategories`,
          {
            month: selectedMonth,
            balence: budgetInput,
            userId: String(user.id),
            categories: [],
          }
        );
        setMonthlyData(data);
        message.success("Đã lưu ngân sách tháng!");
      }
    } catch {
      message.error("Lỗi khi lưu ngân sách!");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-[880px] mx-auto">
      <div className="bg-indigo-600 text-white rounded-[14px] px-6 py-5 shadow text-center">
        <p className="text-[15px] md:text-[16px] font-semibold">
          🎯 Kiểm soát chi tiêu thông minh
        </p>
        <p className="text-[12px] md:text-[13px] opacity-90">
          Theo dõi ngân sách và thu chi hàng tháng dễ dàng
        </p>
      </div>

      {/* Tiêu đề */}
      <h2 className="text-center text-indigo-700 mt-6 mb-3 font-semibold text-lg md:text-xl">
        📊 Quản Lý Tài Chính Cá Nhân
      </h2>

      {/* Số tiền còn lại */}
      <div className="bg-white rounded-[10px] border border-gray-200 shadow-sm px-6 py-5 text-center">
        <p className="text-gray-500 text-sm">Số tiền còn lại</p>
        <p className="text-green-600 text-[18px] font-semibold">
          {remaining.toLocaleString()} VND
        </p>
        {monthlyData?.categories?.length ? (
          <p className="text-xs text-gray-500 mt-1">
            (Đã phân bổ danh mục: {totalCategoryBudget.toLocaleString()} VND)
          </p>
        ) : null}
      </div>

      {/* Chọn tháng */}
      <div className="bg-white rounded-[10px] border border-gray-200 shadow-sm px-6 py-5 mt-3">
        <div className="flex items-center justify-center gap-3">
          <span className="text-gray-600 text-[13px]">📅 Chọn tháng</span>
          <DatePicker
            picker="month"
            allowClear={false}
            value={selectedMonth ? dayjs(selectedMonth) : null}
            onChange={handleChangeMonth}
          />
        </div>
      </div>

      {/* Ngân sách tháng, Cảnh báo */}
      <div className="bg-white rounded-[10px] border border-gray-200 shadow-sm px-6 py-5 mt-3">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3">
          <span className="text-gray-600 text-[13px]">💰 Ngân sách tháng:</span>
          <Input
            type="number"
            placeholder="VD: 5000000"
            className="!w-56 !h-9"
            value={budgetInput === undefined ? undefined : budgetInput}
            onChange={(e) => setBudgetInput(Number(e.target.value))}
          />
          <Button
            type="primary"
            className="!h-9"
            onClick={handleSaveBudget}
            loading={loading}
          >
            Lưu
          </Button>
        </div>

        {/* cảnh báo khi thiếu dữ liệu */}
        {(!selectedMonth || budgetInput === undefined) && (
          <div className="mt-3">
            <Alert
              type="warning"
              showIcon
              message="Chưa nhập đủ thông tin"
              description={
                !selectedMonth
                  ? "Vui lòng chọn tháng chi tiêu."
                  : "Vui lòng nhập mức ngân sách cho tháng."
              }
            />
          </div>
        )}
      </div>

      {/* Thông tin cá nhân + 2 nút modal */}
      <h3 className="text-center text-indigo-700 font-semibold text-lg mt-6">
        Quản Lý Thông tin cá nhân
      </h3>

      <div className="bg-white rounded-[10px] border border-gray-200 shadow-sm px-6 py-6 mt-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[13px] font-medium mb-1">Name *</label>
            <Input value={user.fullName} disabled className="!h-9" />
          </div>
          <div>
            <label className="block text-[13px] font-medium mb-1">
              Email *
            </label>
            <Input value={user.email} disabled className="!h-9" />
          </div>
          <div>
            <label className="block text-[13px] font-medium mb-1">
              Phone *
            </label>
            <Input value={user.phone || ""} disabled className="!h-9" />
          </div>
          <div>
            <label className="block text-[13px] font-medium mb-1">
              Gender *
            </label>
            <Input
              value={user.gender ? "Male" : "Female"}
              disabled
              className="!h-9"
            />
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-5">
          <Button
            onClick={() => setOpenInfo(true)}
            className="border-indigo-600 text-indigo-600"
          >
            Change Information
          </Button>
          <Button
            onClick={() => setOpenPass(true)}
            className="border-indigo-600 text-indigo-600"
          >
            Change Password
          </Button>
        </div>
      </div>

      {/* Modals*/}
      <ModalChangeInformation
        open={openInfo}
        onClose={() => setOpenInfo(false)}
        user={user}
        onUpdate={(u) => setUser(u)}
      />
      <ModalChangePassword
        open={openPass}
        onClose={() => setOpenPass(false)}
        user={user}
      />
    </div>
  );
}
