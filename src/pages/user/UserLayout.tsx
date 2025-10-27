import { Layout, Menu, Dropdown, message } from "antd";
import {
  InfoCircleOutlined,
  FolderOutlined,
  HistoryOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import type { MenuProps } from "antd";

const { Header, Sider, Content } = Layout;

export default function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = location.pathname.split("/").pop();

  // 🔹 Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("user");
    message.success("👋 Đăng xuất thành công!");
    navigate("/");
  };

  // 🔹 Xử lý chọn item trong dropdown tài khoản
  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") handleLogout();
    else if (key === "profile") navigate("/user/information");
  };

  const menuItems = [
    {
      key: "information",
      label: "Thông tin cá nhân",
      icon: <InfoCircleOutlined />,
    },
    {
      key: "category",
      label: "Danh mục chi tiêu",
      icon: <FolderOutlined />,
    },
    {
      key: "history",
      label: "Lịch sử giao dịch",
      icon: <HistoryOutlined />,
    },
  ];

  const accountMenu: MenuProps = {
    items: [
      { key: "profile", label: "Hồ sơ" },
      { type: "divider" },
      { key: "logout", label: "Đăng xuất" },
    ],
    onClick: handleMenuClick,
  };

  return (
    <Layout className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <Header className="bg-indigo-600 px-8 py-4 shadow-md flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-white text-xl font-bold tracking-wide">
            📒 Tài Chính Cá Nhân K24, Rikkei
          </h1>
        </div>

        <Dropdown menu={accountMenu} placement="bottomRight" arrow>
          <div className="text-white flex items-center gap-2 cursor-pointer hover:opacity-80">
            <span>Tài khoản</span>
            <DownOutlined />
          </div>
        </Dropdown>
      </Header>

      {/* Main layout */}
      <Layout>
        {/* Sidebar */}
        <Sider
          width={220}
          className="bg-white m-4 mr-0 rounded-xl shadow-sm"
          theme="light"
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedKey ?? "information"]}
            items={menuItems}
            onClick={({ key }) => navigate(`/user/${key}`)}
            className="text-base font-medium pt-6"
          />
        </Sider>

        {/* Content */}
        <Layout className="m-4 ml-0 bg-white rounded-xl shadow-md overflow-auto">
          <Content className="p-8 min-h-[calc(100vh-120px)]">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
