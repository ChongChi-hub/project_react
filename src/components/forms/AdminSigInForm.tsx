import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { User } from "../../types/user";

export default function AdminSignInForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [generalMessage, setGeneralMessage] = useState("");
  const [errors, setErrors] = useState({email: "",password: ""});

  // kiểm tra email hợp lệ
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: "", password: "" });
    setGeneralMessage("");
    setIsSuccess(false);

    let hasError = false;
    const newErrors = { email: "", password: "" };

    // kiểm tra trống
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
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users?email=${email}`
      );

      if (res.data.length === 0) {
        setGeneralMessage("Incorrect account or password.");
        return;
      }

      const user: User = res.data[0];

      if (user.role !== "admin") {
        setGeneralMessage("Incorrect account or password.");
        return;
      }

      if (user.status === false) {
        setGeneralMessage("Your account blocked!, Please contact admin");
        return;
      }

      if (user.password !== password) {
        setGeneralMessage("Incorrect account or password.");
        return;
      }

      setIsSuccess(true);
      setGeneralMessage("Login successfully!");
      localStorage.setItem("admin", JSON.stringify(user));

      setEmail("");
      setPassword("");

      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (error) {
      setGeneralMessage("An error occurred, please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white w-[448px] rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-black mb-2">
          Financial <span className="text-indigo-600">Manager</span>
        </h1>
        <p className="text-center text-gray-600 mb-6">Please sign in</p>

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
          {/* Email */}
          <div>
            <input
              type="text"
              placeholder="Please enter your email ..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border rounded-md px-3 py-2 focus:outline-none ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-indigo-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Please enter your password ..."
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

          <div className="flex items-center justify-between text-sm text-gray-500">
            <label className="flex items-center gap-1">
              <input type="checkbox" /> Remember me
            </label>
            <p>
              Don’t have an account?{" "}
              <a href="/sign-up" className="text-indigo-500 hover:underline">
                click here!
              </a>
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-all"
          >
            Sign in
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          © 2025 - Rikkei Education
        </p>
      </div>
    </div>
  );
}
