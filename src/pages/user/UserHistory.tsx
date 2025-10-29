import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Table,
  Input,
  Select,
  Button,
  Popconfirm,
  message,
  DatePicker,
  Alert,
} from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs, { type Dayjs } from "dayjs";
import type { ColumnsType } from "antd/es/table";
import type { DatePickerProps } from "antd";
import type { Transaction } from "../../types/transaction.type";
import type { Category } from "../../types/category.type";
import type { MonthlyCategory } from "../../types/monthlyData.type";

const API_URL = import.meta.env.VITE_API_URL as string;
const LS_MONTH_KEY = "lastSelectedMonth";
const toYMD = (s: string) => (s ? s.slice(0, 7) : "");

export default function UserHistory() {
  const [user, setUser] = useState<any>(null);

  // Tháng + dữ liệu ngân sách (để hiển thị “Số tiền còn lại” cho đồng bộ 3 trang)
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [monthly, setMonthly] = useState<MonthlyCategory | null>(null);
  const [budgetInput, setBudgetInput] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // Categories để map tên
  const [categories, setCategories] = useState<Category[]>([]);

  // Lịch sử giao dịch
  const [list, setList] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"none" | "asc" | "desc">("none");

  // Phân trang
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // ===== init user + month
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) setUser(JSON.parse(raw));
    const saved = localStorage.getItem(LS_MONTH_KEY);
    setSelectedMonth(saved || new Date().toISOString().slice(0, 7));
  }, []);

  const handleChangeMonth: DatePickerProps["onChange"] = (
    _d: Dayjs | null,
    dateString: string | string[]
  ) => {
    const s = Array.isArray(dateString) ? dateString[0] : dateString;
    const m = String(s);
    setSelectedMonth(m);
    localStorage.setItem(LS_MONTH_KEY, m);
    setPage(1);
  };

  // ===== fetch categories
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get<Category[]>(`${API_URL}/categories`);
        setCategories(data);
      } catch {
        message.error("Không tải được danh mục!");
      }
    })();
  }, []);

  // ===== fetch monthly (để có “Số tiền còn lại” đồng bộ)
  useEffect(() => {
    if (!user || !selectedMonth) return;
    (async () => {
      try {
        const { data } = await axios.get<MonthlyCategory[]>(
          `${API_URL}/monthlyCategories`,
          { params: { userId: String(user.id) } }
        );
        const found = data.find((i) => toYMD(i.month) === selectedMonth) || null;
        setMonthly(found);
        setBudgetInput(found?.balence);
      } catch {
        // không critical
      }
    })();
  }, [user, selectedMonth]);

  // ===== fetch transactions
  const loadTransactions = async (uId: string, m: string) => {
    const { data } = await axios.get<Transaction[]>(
      `${API_URL}/transactions`,
      { params: { userId: uId } }
    );
    // Lọc theo tháng (prefix 'YYYY-MM')
    return data.filter((t) => toYMD(t.month || t.createdAt) === m);
  };

  useEffect(() => {
    if (!user || !selectedMonth) return;
    setLoading(true);
    loadTransactions(String(user.id), selectedMonth)
      .then((tx) => setList(tx))
      .catch(() => message.error("Không tải được lịch sử giao dịch!"))
      .finally(() => setLoading(false));
  }, [user, selectedMonth]);

  // ===== helpers
  const catName = (id: number) =>
    categories.find((c) => String(c.id) === String(id))?.name || `#${id}`;

  const totalAllocated = useMemo(() => {
    if (!monthly?.categories?.length) return 0;
    return monthly.categories.reduce((s, c) => s + (c.budget || 0), 0);
  }, [monthly]);

  const remaining = useMemo(() => {
    const base = budgetInput ?? monthly?.balence ?? 0;
    const r = base - totalAllocated;
    return r > 0 ? r : 0;
  }, [budgetInput, monthly, totalAllocated]);

  // ===== lọc + sắp xếp client
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let data = [...list];
    if (q) {
      data = data.filter(
        (t) =>
          t.note?.toLowerCase().includes(q) ||
          catName(t.categoryId).toLowerCase().includes(q)
      );
    }
    if (sortOrder !== "none") {
      data.sort((a, b) =>
        sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount
      );
    }
    return data;
  }, [list, search, sortOrder, categories]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const total = filtered.length;

  // ===== xóa giao dịch
  const removeTx = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/transactions/${id}`);
      setList((prev) => prev.filter((t) => t.id !== id));
      message.success("Đã xóa giao dịch!");
    } catch {
      message.error("Lỗi khi xóa giao dịch!");
    }
  };

  // ===== columns table
  const columns: ColumnsType<Transaction> = [
    {
      title: "STT",
      width: 70,
      align: "center",
      render: (_v, _r, idx) => (page - 1) * pageSize + idx + 1,
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      render: (v: number) => catName(v),
    },
    {
      title: "Budget",
      dataIndex: "amount",
      align: "right",
      render: (v: number) => `${v.toLocaleString("vi-VN")} VND`,
    },
    {
      title: "Note",
      dataIndex: "note",
      ellipsis: true,
    },
    {
      title: "Actions",
      width: 100,
      align: "center",
      render: (_v, r) => (
        <Popconfirm
          title="Xóa giao dịch?"
          okText="Xóa"
          cancelText="Hủy"
          onConfirm={() => removeTx(r.id)}
        >
          <Button size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="max-w-[880px] mx-auto">
      {/* ===== Header giống 2 trang kia ===== */}
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
            (Đã phân bổ danh mục: {totalAllocated.toLocaleString()} VND)
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

      {/* Filter bar lịch sử */}
      <Card
        className="rounded-xl shadow-sm mt-6"
        title="🧾 Lịch sử giao dịch (theo tháng)"
        extra={
          <div className="flex items-center gap-2">
            <Select
              value={sortOrder}
              className="!w-[170px]"
              onChange={(v) => {
                setSortOrder(v);
                setPage(1);
              }}
              options={[
                { value: "none", label: "Sắp xếp: Mặc định" },
                { value: "asc", label: "Giá tăng dần" },
                { value: "desc", label: "Giá giảm dần" },
              ]}
            />
            <Input
              allowClear
              className="!w-[220px]"
              placeholder="Tìm nội dung"
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        }
      >
        <Table<Transaction>
          rowKey="id"
          columns={columns}
          dataSource={paged}
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: (p) => setPage(p),
            showTotal: (t) => `Total ${t} items`,
          }}
          bordered
        />

        {/* cảnh báo nếu chưa có ngân sách/tháng */}
        {(!selectedMonth || budgetInput === undefined) && (
          <div className="mt-3">
            <Alert
              type="warning"
              showIcon
              message="Chưa nhập đủ thông tin"
              description={
                !selectedMonth
                  ? "Vui lòng chọn tháng để xem lịch sử."
                  : "Bạn chưa đặt ngân sách cho tháng — vẫn xem lịch sử được."
              }
            />
          </div>
        )}
      </Card>
    </div>
  );
}
