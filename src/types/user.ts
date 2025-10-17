export interface User {
  id?: number; // id có thể undefined khi tạo mới
  fullName: string;
  email: string;
  password: string;
  phone: string;
  gender: boolean; // true = nam, false = nữ
  status: boolean; // true = hoạt động, false = khóa
  role: "user" | "admin";
}
