import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import type { User } from "../../types/user";

export default function SignUp() {
  const navigate = useNavigate();

  // --- State quản lý form ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // --- Hàm kiểm tra định dạng email ---
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // --- Xử lý khi nhấn Đăng ký ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    // kiểm tra rỗng và định dạng email
    if (!email.trim()) newErrors.email = "Please enter your email.";
    else if (!isValidEmail(email))
      newErrors.email = "Email is not in correct format.";

    if (!password.trim()) newErrors.password = "Please enter your password.";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Please confirm your password.";
    else if (confirmPassword !== password)
      newErrors.confirmPassword = "Passwords do not match.";

    // nếu có lỗi,dừng lại
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // kiểm tra email đã tồn tại chưa
      const check = await axios.get(`${import.meta.env.VITE_API_URL}/users?email=${email}`);

      if (check.data.length > 0) {
        setErrors({ email: "Email already exists." });
        return;
      }

      // nếu chưa tồn tại thì thêm mới
      const newUser:User = {
        fullName: "",
        email,
        password,
        phone: "",
        gender: true,
        status: true,
        role: "user",
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/users`, newUser);

      // thông báo thành công
      setSuccess(true);
      setErrors({});
      setEmail("");
      setPassword("");
      setConfirmPassword("");


      

      // chuyển sang trang đăng nhập sau 1.5s
      setTimeout(() => navigate("/sign-in"), 1500);
    } catch (error) {
      console.error("Error while signing up:", error);
      setErrors({ email: "An error occurred, please try again later." });
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/src/assets/image/background.png')" }}
    >
      <div className="bg-white rounded-[12px] shadow-lg w-[448px] p-6">
        <h2 className="text-center text-xl font-semibold mb-4">Sign Up</h2>

        {success && (
          <p className="text-green-600 text-center font-medium mb-3">
            Register successfully!
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email */}
          <div>
            <input
              type="text"
              placeholder="Email here..."
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
              placeholder="Password here..."
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

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              placeholder="Confirm password here..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2 focus:outline-none focus:border-blue-500`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-all"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm mt-3">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
