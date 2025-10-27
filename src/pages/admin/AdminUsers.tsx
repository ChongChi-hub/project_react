import { useEffect, useState } from "react";
import { Table, Tag, Button, Input, Space, message } from "antd";
import { LockOutlined, UnlockOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import type { User } from "../../types/user.type";

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
  });

  // 🟢 Lấy danh sách người dùng
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔴 Khóa / Mở khóa tài khoản
  const handleToggleStatus = async (user: User) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/users/${user.id}`, {
        status: !user.status,
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: !user.status } : u))
      );

      message.success(
        user.status ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản"
      );
    } catch (error) {
      console.error(error);
    }
  };

  // 🧩 Lọc theo tên hoặc email
  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // 🟨 Cấu hình cột bảng
  const columns = [
    {
      title: "STT",
      key: "index",
      width: 70,
      align: "center" as const,
      render: (_: any, __: User, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a: User, b: User) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender: boolean) => (gender ? "Male" : "Female"),
      filters: [
        { text: "Male", value: true },
        { text: "Female", value: false },
      ],
      onFilter: (value: any, record: User) => record.gender === value,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      align: "center" as const,
      render: (status: boolean) => (
        <Tag
          color={status ? "green" : "red"}
          className="w-[90px] text-center inline-block"
        >
          {status ? "Active" : "Deactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center" as const,
      width: 100,
      render: (_: any, record: User) => (
        <Button
          type="text"
          icon={
            record.status ? (
              <UnlockOutlined style={{ color: "green" }} />
            ) : (
              <LockOutlined style={{ color: "red" }} />
            )
          }
          onClick={() => handleToggleStatus(record)}
        />
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">User Management</h2>

        <Space>
          <Input
            placeholder="Search here ..."
            prefix={<SearchOutlined />}
            allowClear
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination((prev) => ({ ...prev, current: 1 })); // reset về trang 1 khi tìm kiếm
            }}
            style={{ width: 250 }}
          />
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          total: filteredUsers.length,
          showSizeChanger: false,
          showTotal: (total) => `Total ${total} users`,
          onChange: (page, pageSize) =>
            setPagination({ current: page, pageSize }),
        }}
        bordered
      />
    </div>
  );
}
