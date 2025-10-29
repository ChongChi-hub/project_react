import { Layout, Dropdown } from "antd";
import { DownOutlined,InfoCircleOutlined,FolderOutlined,HistoryOutlined } from "@ant-design/icons";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
const { Header, Sider, Content } = Layout;

// màu xám sáng Tailwind: #f3f4f6 (gray-100)
const BG = "#f3f4f6";
const BORDER = "#e5e7eb"; // gray-200

export default function UserLayout() {
  const navigate = useNavigate();

  const pillBase =
  "block w-full select-none flex items-center gap-2 px-4 py-2 rounded-lg border transition text-[14px] font-medium";
const pillIdle =
  "bg-white border-indigo-600 text-gray-900 hover:bg-indigo-50 hover:text-indigo-700";
const pillActive =
  "!bg-indigo-600 !border-indigo-600 !text-white shadow-md";

  return (
    <Layout style={{ minHeight: "100vh", background: BG }}>
      {/* Header */}
      <Header
        style={{ background: "#4f46e5" }} // indigo-600
        className="px-6 flex items-center justify-between shadow"
      >
        <h1 className="text-white font-semibold tracking-wide text-[15px]">
          📒 Tài Chính Cá Nhân K24_Rikkei
        </h1>
        <Dropdown
          menu={{
            items: [
              { key: "profile", label: "Hồ sơ" },
              { type: "divider" },
              {
                key: "logout",
                label: "Đăng xuất",
                onClick: () => {
                  localStorage.removeItem("user");
                  navigate("/");
                },
              },
            ],
          }}
          placement="bottomRight"
          arrow
        >
          <button className="text-white/95 hover:text-white flex items-center gap-2">
            Tài khoản <DownOutlined />
          </button>
        </Dropdown>
      </Header>

      {/* KHÔNG bọc max-w ở ngoài để Sider không bị căn giữa */}
      <Layout style={{ background: BG }}>
        {/* Sidebar sáng */}
        <Sider
          theme="light" // 👈 quan trọng: ép AntD dùng theme sáng
          width={240}
          style={{
            background: BG, // 👈 nền xám sáng
            borderRight: `1px solid ${BORDER}`,
            position: "sticky",
            top: 64,
            height: "calc(100vh - 64px)",
          }}
          className="hidden md:block"
        >
          <div className="pt-6 px-5 flex flex-col gap-3">
            <NavLink
              to="/user/information"
              className={({ isActive }) =>
                `${pillBase} ${isActive ? pillActive : pillIdle}`
              }
            >
              <InfoCircleOutlined className="!text-current" />
              <span>Information</span>
            </NavLink>

            <NavLink
              to="/user/category"
              className={({ isActive }) =>
                `${pillBase} ${isActive ? pillActive : pillIdle}`
              }
            >
              <FolderOutlined className="!text-current" />
              <span>Category</span>
            </NavLink>

            <NavLink
              to="/user/history"
              className={({ isActive }) =>
                `${pillBase} ${isActive ? pillActive : pillIdle}`
              }
            >
              <HistoryOutlined className="!text-current" />
              <span>History</span>
            </NavLink>
          </div>
        </Sider>

        {/* Content chỉ phần này căn giữa */}
        <Content style={{ background: BG }}>
          <div className="max-w-[980px] mx-auto my-4 md:my-8">
            <div className="bg-transparent rounded-xl">
              {/* card trắng bao nội dung */}
              <div className="bg-white rounded-xl shadow-sm px-4 py-6 md:px-10">
                <Outlet />
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
