import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import type { User } from "../../types/user";

export default function SignInForm() {
  const navigate = useNavigate();

  // --- State ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // --- Validate email ---
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // Kiểm tra dữ liệu
    if (!email.trim()) newErrors.email = "Please enter your email.";
    else if (!isValidEmail(email))
      newErrors.email = "Email format is invalid.";
    if (!password.trim()) newErrors.password = "Please enter your password.";

    // Nếu có lỗi
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Gửi yêu cầu tìm user theo email
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users?email=${email}`
      );

      if (res.data.length === 0) {
        setErrors({ email: "Email not found." });
        return;
      }

      const user: User = res.data[0];

      // Kiểm tra mật khẩu
      if (user.password !== password) {
        setErrors({ password: "Incorrect password." });
        return;
      }

      // ✅ Đăng nhập thành công
      localStorage.setItem("user", JSON.stringify(user));
      setSuccess(true);
      setErrors({});

      // Chuyển hướng sau 1.5s
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("Error during sign in:", error);
      setErrors({ email: "An error occurred, please try again later." });
    }
  };

  // --- Giao diện ---
  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/src/assets/image/background.png')" }}
    >
      <div className="bg-white rounded-[12px] shadow-lg w-[448px] p-6">
        <h2 className="text-center text-xl font-semibold mb-4">Sign In</h2>

        {success && (
          <p className="text-green-600 text-center font-medium mb-3">
            Login successfully!
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email */}
          <div>
            <input
              type="text"
              placeholder="Email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2 focus:outline-none focus:border-blue-500`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2 focus:outline-none focus:border-blue-500`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm mt-3">
          Don’t have an account?{" "}
          <Link to="/sign-up" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
