import axios from "axios";
import type { Category } from "../../types/category.type";

const BASE_URL = import.meta.env.VITE_API_URL;

// ====================== USERS ======================
export const getUsers = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/users`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách user:", error);
    throw error;
  }
};

// ====================== CATEGORIES ======================
export const getCategories = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/categories`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách category:", error);
    throw error;
  }
};

// ➕ Thêm danh mục
export const addCategory = async (data: Partial<Category>) => {
  try {
    const res = await axios.post(`${BASE_URL}/categories`, data);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi thêm danh mục:", error);
    throw error;
  }
};

// 📝 Cập nhật danh mục
export const updateCategory = async (id: number, data: Partial<Category>) => {
  try {
    const res = await axios.patch(`${BASE_URL}/categories/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);
    throw error;
  }
};

// 🔁 Đổi trạng thái (Active / Inactive)
export const toggleCategoryStatus = async (id: number, status: boolean) => {
  try {
    const res = await axios.patch(`${BASE_URL}/categories/${id}`, { status: !status });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi đổi trạng thái danh mục:", error);
    throw error;
  }
};

// ❌ Xóa danh mục
export const deleteCategory = async (id: number) => {
  try {
    const res = await axios.delete(`${BASE_URL}/categories/${id}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);
    throw error;
  }
};

// ====================== DASHBOARD ======================
export const getDashboardData = async () => {
  try {
    const [users, categories] = await Promise.all([getUsers(), getCategories()]);
    return {
      userCount: users.length,
      categoryCount: categories.length,
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu dashboard:", error);
    throw error;
  }
};
