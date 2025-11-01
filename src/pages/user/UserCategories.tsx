// src/pages/user/UserCategories.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Select,
  InputNumber,
  Button,
  Card,
  Modal,
  Popconfirm,
  message,
  Empty,
  DatePicker,
  Alert,
  type DatePickerProps,
} from "antd";
import {
  EditOutlined,
  CloseOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs, { type Dayjs } from "dayjs";

import type { Category } from "../../types/category.type";
import type {
  MonthlyCategory,
  CategoryBudget,
} from "../../types/monthlyData.type";

const API_URL = import.meta.env.VITE_API_URL as string;
const LS_MONTH_KEY = "lastSelectedMonth";
const toYMD = (s: string) => (s ? s.slice(0, 7) : "");

export default function UserCategories() {
  const [user, setUser] = useState<any>(null);

  // ======= tháng + dữ liệu tháng =======
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [monthly, setMonthly] = useState<MonthlyCategory | null>(null);
  const [budgetInput, setBudgetInput] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // ======= data danh mục gốc =======
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  // ======= form thêm mới =======
  const [pickCategoryId, setPickCategoryId] = useState<string | undefined>();
  const [pickBudget, setPickBudget] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // ======= modal sửa =======
  const [editOpen, setEditOpen] = useState(false);
  const [editRow, setEditRow] = useState<CategoryBudget | null>(null);
  const [editBudget, setEditBudget] = useState<number | null>(null);
  const [updating, setUpdating] = useState(false);

  // user + tháng (đọc lại từ localStorage mà trang Information đã lưu)
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) setUser(JSON.parse(raw));
    const saved = localStorage.getItem(LS_MONTH_KEY);
    setSelectedMonth(saved || new Date().toISOString().slice(0, 7));
  }, []);

  // đổi tháng (controlled DatePicker)
  const handleChangeMonth: DatePickerProps["onChange"] = (
    _d: Dayjs | null,
    dateString: string | string[]
  ) => {
    const s = Array.isArray(dateString) ? dateString[0] : dateString;
    const m = String(s);
    setSelectedMonth(m);
    localStorage.setItem(LS_MONTH_KEY, m);
  };


  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get<Category[]>(`${API_URL}/categories`);
        setAllCategories(data.filter((c) => c.status));
      } catch {
        message.error("Không tải được danh mục!");
      }
    })();
  }, []);


  const loadMonthly = async (uId: string, month: string) => {
    const { data } = await axios.get<MonthlyCategory[]>(
      `${API_URL}/monthlyCategories`,
      { params: { userId: uId } }
    );
    const found = data.find((i) => toYMD(i.month) === month) || null;
    setMonthly(found);
    setBudgetInput(found?.balence);
  };

  useEffect(() => {
    if (!user || !selectedMonth) return;
    setLoading(true);
    loadMonthly(String(user.id), selectedMonth)
      .catch(() => message.error("Không tải được dữ liệu tháng!"))
      .finally(() => setLoading(false));
  }, [user, selectedMonth]);


  const nameOf = (categoryId: number | string) => {
    const found = allCategories.find((c) => String(c.id) === String(categoryId));
    return found?.name || `Danh mục #${categoryId}`;
  };
  const items = useMemo(() => monthly?.categories || [], [monthly]);

  const totalCategoryBudget = useMemo(() => {
    if (!monthly?.categories?.length) return 0;
    return monthly.categories.reduce((sum, c) => sum + (c.budget || 0), 0);
  }, [monthly]);

  const remaining = useMemo(() => {
    const base = budgetInput ?? monthly?.balence ?? 0;
    const r = base - totalCategoryBudget;
    return r > 0 ? r : 0;
  }, [budgetInput, monthly, totalCategoryBudget]);

  // ======= lưu ngân sách tháng=======
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
      localStorage.setItem(LS_MONTH_KEY, selectedMonth);
      if (monthly) {
        const { data } = await axios.patch<MonthlyCategory>(
          `${API_URL}/monthlyCategories/${monthly.id}`,
          { balence: budgetInput, month: selectedMonth }
        );
        setMonthly(data);
      } else {
        const { data } = await axios.post<MonthlyCategory>(
          `${API_URL}/monthlyCategories`,
          {
            month: selectedMonth,
            balence: budgetInput,
            userId: String(user.id),
            categories: [],
          }
        );
        setMonthly(data);
      }
      message.success("Đã lưu ngân sách tháng!");
    } catch {
      message.error("Lỗi khi lưu ngân sách!");
    } finally {
      setLoading(false);
    }
  };

  // ======= thêm / cập nhật nếu trùng =======
  const handleAdd = async () => {
    if (!user) return;
    if (!pickCategoryId) {
      message.warning("Vui lòng chọn danh mục!");
      return;
    }
    if (!pickBudget || pickBudget <= 0) {
      message.warning("Vui lòng nhập mức chi (VND) > 0!");
      return;
    }

    const entry: CategoryBudget = {
      id: Number(Date.now().toString().slice(-6)),
      categoryId: Number(pickCategoryId),
      budget: pickBudget,
    };

    try {
      setSaving(true);
      if (monthly) {
        const existedIdx = monthly.categories.findIndex(
          (x) => String(x.categoryId) === String(entry.categoryId)
        );
        const nextCats =
          existedIdx >= 0
            ? monthly.categories.map((x, idx) =>
                idx === existedIdx ? { ...x, budget: entry.budget } : x
              )
            : [...monthly.categories, entry];

        const { data } = await axios.patch<MonthlyCategory>(
          `${API_URL}/monthlyCategories/${monthly.id}`,
          { categories: nextCats }
        );
        setMonthly(data);
      } else {
        const { data } = await axios.post<MonthlyCategory>(
          `${API_URL}/monthlyCategories`,
          {
            id: Math.random().toString(36).slice(2, 6),
            month: selectedMonth,
            balence: 0,
            userId: String(user.id),
            categories: [entry],
          }
        );
        setMonthly(data);
      }

      setPickCategoryId(undefined);
      setPickBudget(null);
      message.success("Đã lưu danh mục!");
    } catch {
      message.error("Lỗi khi lưu danh mục!");
    } finally {
      setSaving(false);
    }
  };

  // ======= mở modal sửa / lưu sửa / xóa =======
  const openEdit = (row: CategoryBudget) => {
    setEditRow(row);
    setEditBudget(row.budget);
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!monthly || !editRow) return;
    if (!editBudget || editBudget <= 0) {
      message.warning("Vui lòng nhập mức chi hợp lệ!");
      return;
    }
    try {
      setUpdating(true);
      const next = monthly.categories.map((x) =>
        x.id === editRow.id ? { ...x, budget: editBudget } : x
      );
      const { data } = await axios.patch<MonthlyCategory>(
        `${API_URL}/monthlyCategories/${monthly.id}`,
        { categories: next }
      );
      setMonthly(data);
      setEditOpen(false);
      message.success("Đã cập nhật danh mục!");
    } catch {
      message.error("Lỗi khi cập nhật!");
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (row: CategoryBudget) => {
    if (!monthly) return;
    try {
      const next = monthly.categories.filter((x) => x.id !== row.id);
      const { data } = await axios.patch<MonthlyCategory>(
        `${API_URL}/monthlyCategories/${monthly.id}`,
        { categories: next }
      );
      setMonthly(data);
      message.success("Đã xóa danh mục!");
    } catch {
      message.error("Lỗi khi xóa danh mục!");
    }
  };

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

      <h2 className="text-center text-indigo-700 mt-6 mb-3 font-semibold text-lg md:text-xl">
        📊 Quản Lý Tài Chính Cá Nhân
      </h2>

      {/* Số tiền còn lại */}
      <div className="bg-white rounded-[10px] border border-gray-200 shadow-sm px-6 py-5 text-center">
        <p className="text-gray-500 text-sm">Số tiền còn lại</p>
        <p className="text-green-600 text-[18px] font-semibold">
          {remaining.toLocaleString()} VND
        </p>
        {monthly?.categories?.length ? (
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

      {/* Ngân sách tháng */}
      <div className="bg-white rounded-[10px] border border-gray-200 shadow-sm px-6 py-5 mt-3">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3">
          <span className="text-gray-600 text-[13px]">💰 Ngân sách tháng:</span>
          <InputNumber
            className="!w-56"
            placeholder="VD: 5,000,000"
            value={budgetInput ?? undefined}
            onChange={(v) => setBudgetInput(Number(v))}
            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(v) => Number((v || "0").replace(/,/g, ""))}
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
      <Card
        className="rounded-xl shadow-sm mt-6"
        title={
          <div className="flex items-center gap-2">
            <span className="text-gray-700">👜 Quản lý danh mục (Theo tháng)</span>
            <span className="text-xs text-gray-400">
              {dayjs(selectedMonth).format("MM/YYYY")}
            </span>
          </div>
        }
      >
        {/* Thanh nhập trên cùng */}
        <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
          <Select
            placeholder="Tên danh mục"
            className="!w-[260px]"
            value={pickCategoryId}
            onChange={(v) => setPickCategoryId(String(v))}
            options={allCategories.map((c) => ({
              value: String(c.id),
              label: c.name,
            }))}
            showSearch
            optionFilterProp="label"
          />
          <InputNumber
            className="!w-64"
            placeholder="Giới hạn (VND)"
            value={pickBudget ?? undefined}
            min={0}
            step={1000}
            onChange={(v) => setPickBudget(Number(v))}
            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(v) => Number((v || "0").replace(/,/g, ""))}
          />
          <Button
            type="primary"
            className="!bg-indigo-600"
            onClick={handleAdd}
            loading={saving}
          >
            Thêm danh mục
          </Button>
        </div>

        {/* Danh sách thẻ danh mục */}
        {items.length === 0 ? (
          <Empty description="Chưa có danh mục cho tháng này" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((it) => (
              <div
                key={it.id}
                className="rounded-lg border border-gray-300 bg-white p-3 relative"
              >
                <div className="flex gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md border border-gray-300">
                    <DollarCircleOutlined className="text-xl" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">
                      {nameOf(it.categoryId)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {it.budget.toLocaleString("vi-VN")} VND
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => openEdit(it)}
                    />
                    <Popconfirm
                      title="Xóa danh mục?"
                      okText="Xóa"
                      cancelText="Hủy"
                      onConfirm={() => removeItem(it)}
                    >
                      <Button size="small" danger icon={<CloseOutlined />} />
                    </Popconfirm>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal sửa danh mục */}
      <Modal
        open={editOpen}
        title={`Sửa danh mục: ${nameOf(editRow?.categoryId ?? "")}`}
        onCancel={() => setEditOpen(false)}
        onOk={saveEdit}
        okButtonProps={{ loading: updating, className: "!bg-indigo-600" }}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose
      >
        <div className="space-y-2">
          <div className="text-sm text-gray-500">Mức chi (VND)</div>
          <InputNumber
            className="!w-full"
            min={0}
            step={1000}
            value={editBudget ?? undefined}
            onChange={(v) => setEditBudget(Number(v))}
            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(v) => Number((v || "0").replace(/,/g, ""))}
          />
        </div>
      </Modal>
    </div>
  );
}
