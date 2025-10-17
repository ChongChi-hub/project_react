import { useEffect } from "react";
import { useNavigate } from "react-router";


export default function AdminDashboard() {
    const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (!admin) {
      navigate("/admin"); // chưa đăng nhập -> quay lại trang login
    }
  }, [navigate]);
  return (
    <div>AdminDashboard</div>
  )
}
