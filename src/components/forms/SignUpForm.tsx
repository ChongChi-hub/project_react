import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import type { User } from "../../types/user.type";

export default function SignUpForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // Validate email
    if (!email.trim()) newErrors.email = "Please enter your email.";
    else if (!isValidEmail(email))
      newErrors.email = "Email is not in correct format.";

    // Validate password
    if (!password.trim()) newErrors.password = "Please enter your password.";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    // Validate confirm password
    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Please confirm your password.";
    else if (confirmPassword !== password)
      newErrors.confirmPassword = "Passwords do not match.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Lấy danh sách user hiện có trong local storage
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const storedAdmins = JSON.parse(localStorage.getItem("admins") || "[]");

      // Kiểm tra trùng email (với cả user và admin)
      const isEmailExists =
        storedUsers.some((u: User) => u.email === email.trim()) ||
        storedAdmins.some((a: User) => a.email === email.trim());

      if (isEmailExists) {
        setErrors({ email: "Email already exists." });
        setLoading(false);
        return;
      }

      // Tạo user mới
      const newUser: User = {
        fullName: "",
        email: email.trim(),
        password,
        phone: "",
        gender: true,
        status: true,
        role: "user",
      };

      // Thêm vào danh sách users
      localStorage.setItem("users", JSON.stringify([...storedUsers, newUser]));

      // Reset form
      setSuccess(true);
      setErrors({});
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setLoading(false);

      // Chuyển hướng sau khi đăng ký thành công
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("Error while signing up:", error);
      setErrors({ general: "An unexpected error occurred. Try again later." });
      setLoading(false);
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
          <p className="text-green-600 text-center font-medium mb-3 animate-pulse">
            Register successfully!
          </p>
        )}

        {errors.general && (
          <p className="text-red-500 text-center mb-2">{errors.general}</p>
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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password here..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2 pr-10 focus:outline-none focus:border-blue-500`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm password here..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2 pr-10 focus:outline-none focus:border-blue-500`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 bg-green-600 text-white py-2 rounded-md transition-all ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-700"
            }`}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm mt-3">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
