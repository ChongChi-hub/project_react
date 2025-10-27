import axios from "axios";

export interface SignUpDTO {
  fullName: string;
  email: string;
  password: string;
  role?: string; // 'user' hoặc 'admin'
}

export interface SignInDTO {
  email: string;
  password: string;
}


export const UserApi = {
  // Đăng ký
  async signUp(data: SignUpDTO) {
    // Kiểm tra email trùng
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/users?email=${data.email}`);
    if (res.data.length > 0) {
      throw new Error("Email đã tồn tại");
    }

    // Thêm người dùng mới
    const newUser = {
      ...data,
      phone: "",
      gender: true,
      status: true,
      role: data.role || "user",
    };

    const createRes = await axios.post(`${import.meta.env.VITE_API_URL}/users`, newUser);
    return createRes.data;
  },

  // Đăng nhập
  async signIn(data: SignInDTO) {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/users?email=${data.email}`);

    if (res.data.length === 0) {
      throw new Error("Không tìm thấy người dùng");
    }

    const user = res.data[0];

    if (user.password !== data.password) {
      throw new Error("Mật khẩu không chính xác");
    }

    return user; // trả về toàn bộ thông tin user
  },

  // Lấy thông tin người dùng đang đăng nhập
  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Đăng xuất
  logout() {
    localStorage.removeItem("user");
  },
};
