import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import type { User } from "../../types/user.type";

export default function SignInForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // Validate cơ bản
    if (!email.trim()) newErrors.email = "Please enter your email.";
    else if (!isValidEmail(email))
      newErrors.email = "Email format is invalid.";
    if (!password.trim()) newErrors.password = "Please enter your password.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users?email=${email}`
      );

      // Không tìm thấy tài khoản
      if (res.data.length === 0) {
        setErrors({ email: "Account not found." });
        return;
      }

      const user: User = res.data[0];

      // Nếu role là admin → chặn đăng nhập tại đây
      if (user.role === "admin") {
        setErrors({ email: "Admin account cannot sign in here." });
        return;
      }

      // Nếu tài khoản bị khóa (Deactive)
      if (user.status === false) {
        setErrors({
          email: "Your account has been deactivated. Please contact support.",
        });
        return;
      }

      //  Mật khẩu sai
      if (user.password !== password) {
        setErrors({ password: "Incorrect password." });
        return;
      }

      //  Đăng nhập thành công
      localStorage.setItem("user", JSON.stringify(user));
      setSuccess(true);
      setErrors({});


      setTimeout(() => {
        navigate("/user/information");
      }, 2000);
    } catch (err) {
      console.error(err);
      setErrors({ email: "An error occurred. Please try again later." });
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/src/assets/image/background.png')" }}
    >
      <div className="bg-white rounded-[12px] shadow-lg w-[448px] p-6">
        <h2 className="text-center text-xl font-semibold mb-4">Sign In</h2>

        {success && (
          <p className="text-green-600 text-center font-medium mb-3 animate-pulse">
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
