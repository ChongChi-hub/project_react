import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { User } from "../../types/user.type";

export default function AdminSignInForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generalMessage, setGeneralMessage] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: "", password: "" });
    setGeneralMessage("");
    setIsSuccess(false);

    const newErrors = { email: "", password: "" };
    let hasError = false;

    if (!email.trim()) {
      newErrors.email = "Please enter your email.";
      hasError = true;
    } else if (!isValidEmail(email)) {
      newErrors.email = "Email format is invalid.";
      hasError = true;
    }

    if (!password.trim()) {
      newErrors.password = "Please enter your password.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users?email=${email}`);

      if (res.data.length === 0) {
        setGeneralMessage("Account not found.");
        return;
      }

      const user: User = res.data[0];

      if (user.role !== "admin") {
        setGeneralMessage("This account is not an admin account.");
        return;
      }

      if (!user.status) {
        setGeneralMessage("Your account is blocked. Please contact support.");
        return;
      }

      if (user.password !== password) {
        setGeneralMessage("Incorrect password.");
        return;
      }

      // ✅ Đăng nhập thành công
      localStorage.setItem("admin", JSON.stringify(user));
      setIsSuccess(true);
      setGeneralMessage("Login successfully!");
      setEmail("");
      setPassword("");

      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (error) {
      setGeneralMessage("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white w-[448px] rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-black mb-2">
          Financial <span className="text-indigo-600">Manager</span>
        </h1>
        <p className="text-center text-gray-600 mb-6">Please Sign In</p>

        {generalMessage && (
          <p
            className={`text-center font-medium mb-4 ${
              isSuccess ? "text-green-600" : "text-red-500"
            }`}
          >
            {generalMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Enter admin email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-indigo-500"
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none ${
                errors.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-indigo-500"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-md transition-all text-white ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          © 2025 - Rikkei Education
        </p>
      </div>
    </div>
  );
}
