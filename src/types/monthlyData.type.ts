export interface CategoryBudget {
  id: number;
  categoryId: number;
  budget: number;
}

export interface MonthlyCategory {
  id: string;
  month: string; // YYYY-MM hoặc YYYY-MM-DD
  balence: number;
  userId: string;
  categories: CategoryBudget[];
}
