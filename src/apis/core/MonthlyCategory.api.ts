
import axios from "axios";
import type { MonthlyCategory } from "../../types/monthlyData.type";


export const MonthlyCategoryApi = {
  // Lấy danh sách tất cả monthlyCategory
  async getAll() {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/monthlyCategories`);
    return res.data as MonthlyCategory[];
  },

  // Lấy monthlyCategory theo userId và month
  async getByUserAndMonth(userId: string, month: string) {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/monthlyCategories?userId=${userId}&month=${month}`
    );
    return res.data.length > 0 ? (res.data[0] as MonthlyCategory) : null;
  },
  getByUserId: async (userId: string): Promise<MonthlyCategory[]> => {
    const res = await axios.get(`/monthlyCategory?userId=${userId}`);
    return res.data;
  },

  // Tạo mới monthlyCategory cho user/tháng
  async create(data: Omit<MonthlyCategory, "id">) {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/monthlyCategories`, data);
    return res.data as MonthlyCategory;
  },
  // Cập nhật ngân sách tháng (balence hoặc categories)
  async update(id: string, data: Partial<MonthlyCategory>) {
    const res = await axios.patch(`${import.meta.env.VITE_API_URL}/monthlyCategories/${id}`, data);
    return res.data as MonthlyCategory;
  },

  // Xóa ngân sách tháng
  async delete(id: string) {
    await axios.delete(`${import.meta.env.VITE_API_URL}/monthlyCategories/${id}`);
  },
};
