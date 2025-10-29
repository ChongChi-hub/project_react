import axios from 'axios';

export interface DashboardStats {
  users: {
    total: number;
    change: number;
    changeType: 'increase' | 'decrease';
  };
  categories: {
    total: number;
    change: number;
    changeType: 'increase' | 'decrease';
  };
  spending: {
    total: number;
    change: number;
    changeType: 'increase' | 'decrease';
  };
  totalMoney: {
    total: number;
    change: number;
    changeType: 'increase' | 'decrease';
  };
}

export const DashboardApi = {
  // Lấy thống kê tổng quan
  // Lấy thống kê tổng quan (đúng logic)
getDashboardData: async (): Promise<DashboardStats> => {
  try {
    const [usersRes, categoriesRes, monthlyRes, txRes] = await Promise.all([
      axios.get(`${import.meta.env.VITE_API_URL}/users`),
      axios.get(`${import.meta.env.VITE_API_URL}/categories`),
      axios.get(`${import.meta.env.VITE_API_URL}/monthlyCategories`),
      axios.get(`${import.meta.env.VITE_API_URL}/transactions`).catch(() => ({ data: [] })),
    ]);

    const users = usersRes.data as any[];
    const categories = categoriesRes.data as any[];
    const monthly = monthlyRes.data as any[];
    const transactions = (txRes?.data as any[]) || [];

    // ✅ Tổng ngân sách tháng (Total Money)
    const totalMoney = monthly.reduce((sum, m) => sum + (m.balence || 0), 0);

    // ✅ Tổng chi tiêu thực tế (Spending)
    const totalSpending = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

    return {
      users: {
        total: users.length,
        change: 0,           
        changeType: 'increase'
      },
      categories: {
        total: categories.length,
        change: 0,
        changeType: 'increase'
      },
      spending: {
        total: totalSpending,
        change: 0,
        changeType: 'increase'
      },
      totalMoney: {
        total: totalMoney,
        change: 0,
        changeType: 'increase'
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
},
};
