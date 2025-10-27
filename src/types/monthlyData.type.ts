// src/types/monthlyData.type.ts
export interface CategoryBudget {
  id: string;
  categoryId: string;
  budget: number;
}

export interface MonthlyCategory {
  id: string;
  month: string;       // ví dụ: "2025-09"
  balence: number;     // số dư còn lại
  userId: string;      // id người dùng
  categories: CategoryBudget[];
}
