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

export interface ChartDataPoint {
  month: string;
  value: number;
  year: string;
}

export interface ReportMoneyData {
  data: ChartDataPoint[];
  timeRange: '7days' | '30days' | '6months' | '12months';
}

export interface RecentCustomer {
  id: string;
  name: string;
  email: string;
  amount: number;
  location: string;
  avatar?: string;
}

export const DashboardApi = {
  // Lấy thống kê tổng quan
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const [usersRes, categoriesRes, monthlyCategoriesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/users`),
        axios.get(`${import.meta.env.VITE_API_URL}/categories`),
        axios.get(`${import.meta.env.VITE_API_URL}/monthlyCategories`)
      ]);

      const users = usersRes.data;
      const categories = categoriesRes.data;
      const monthlyCategories = monthlyCategoriesRes.data;

      // Tính toán spending từ monthlyCategories
      const totalSpending = monthlyCategories.reduce((sum: number, month: any) => {
        return sum + (month.balence || 0);
      }, 0);

      // Tính toán total money (giả sử là tổng budget của tất cả categories)
      const totalMoney = monthlyCategories.reduce((sum: number, month: any) => {
        const monthTotal = month.categories?.reduce((catSum: number, cat: any) => {
          return catSum + (cat.budget || 0);
        }, 0) || 0;
        return sum + monthTotal;
      }, 0);

      return {
        users: {
          total: users.length,
          change: 36, // Giả sử tăng 36%
          changeType: 'increase'
        },
        categories: {
          total: categories.length,
          change: 14, // Giả sử giảm 14%
          changeType: 'decrease'
        },
        spending: {
          total: totalSpending,
          change: 36, // Giả sử tăng 36%
          changeType: 'increase'
        },
        totalMoney: {
          total: totalMoney,
          change: 36, // Giả sử tăng 36%
          changeType: 'increase'
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Lấy dữ liệu biểu đồ báo cáo tiền
  getReportMoneyData: async (timeRange: '7days' | '30days' | '6months' | '12months' = '12months'): Promise<ReportMoneyData> => {
    try {
      // Tạo dữ liệu giả cho biểu đồ
      const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
      const data: ChartDataPoint[] = months.map((month) => ({
        month,
        value: Math.floor(Math.random() * 50000) + 20000, // Giá trị ngẫu nhiên
        year: '2025'
      }));

      return {
        data,
        timeRange
      };
    } catch (error) {
      console.error('Error fetching report money data:', error);
      throw error;
    }
  },

  // Lấy danh sách khách hàng gần đây
  getRecentCustomers: async (): Promise<RecentCustomer[]> => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
      const users = response.data;

      // Tạo dữ liệu khách hàng gần đây từ users
      const recentCustomers: RecentCustomer[] = users.slice(0, 4).map((user: any, index: number) => ({
        id: user.id,
        name: user.fullName || `Customer ${index + 1}`,
        email: user.email,
        amount: Math.floor(Math.random() * 20000) + 5000, // Số tiền ngẫu nhiên
        location: ['Austin', 'New York', 'Los Angeles', 'Chicago'][index] || 'Unknown',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=6366f1&color=fff`
      }));

      return recentCustomers;
    } catch (error) {
      console.error('Error fetching recent customers:', error);
      throw error;
    }
  }
};
