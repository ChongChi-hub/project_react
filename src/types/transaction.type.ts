export interface Transaction {
  id: string;                 // id của json-server
  userId: string;             // id user
  month: string;              // 'YYYY-MM' hoặc 'YYYY-MM-DD'
  categoryId: number;         // id danh mục
  amount: number;             // số tiền (VND)
  note: string;               // ghi chú
  createdAt: string;          // ISO string
}
