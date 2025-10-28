import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  message,
  Modal,
  Form,
  Upload,
} from "antd";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import type { Category } from "../../types/category.type";
import { uploadToCloudinary } from "../../apis/cloudinary";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // 🟢 Lấy danh sách category
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
      setCategories(res.data);
    } catch (error) {
      message.error("Không thể tải danh mục!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 🔴 Chuyển trạng thái category
  const handleToggleStatus = async (category: Category) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/categories/${category.id}`,
        {
          status: !category.status,
        }
      );
      setCategories((prev) =>
        prev.map((c) =>
          c.id === category.id ? { ...c, status: !category.status } : c
        )
      );
      message.success(
        category.status ? "Đã khóa danh mục" : "Đã mở khóa danh mục"
      );
    } catch {
      message.error("Lỗi khi cập nhật trạng thái!");
    }
  };

  // 🧩 Cột bảng
  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center" as const,
      render: (_: any, __: Category, index: number) =>
        (currentPage - 1) * 8 + index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: Category, b: Category) => a.name.localeCompare(b.name),
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 200,
      align: "center" as const,
      render: (url: string) =>
        url ? (
          <img src={url} alt="category" className="w-15 h-10 mx-auto" />
        ) : (
          <span className="text-gray-400">No Image</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      width: 130,
      render: (status: boolean) => (
        <div className="flex justify-center items-center gap-2 w-[110px]">
          <span
            className={`w-2 h-2 rounded-full ${
              status ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          <span className={status ? "text-green-600" : "text-red-600"}>
            {status ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center" as const,
      width: 160,
      render: (_: any, record: Category) => (
        <Space>
          <Button
            type="primary"
            size="small"
            style={{ background: "#f59e0b" }}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            danger={record.status}
            type="primary"
            size="small"
            style={{
              background: record.status ? "#ef4444" : "#22c55e",
              borderColor: record.status ? "#ef4444" : "#22c55e",
            }}
            onClick={() => handleToggleStatus(record)}
          >
            {record.status ? "Block" : "Unblock"}
          </Button>
        </Space>
      ),
    },
  ];

  // 🟣 Lọc theo tên
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🟩 Khi nhấn Add
  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setFileList([]);
    setIsModalOpen(true);
  };

  // 🟧 Khi nhấn Edit
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue({ name: category.name });
    if (category.imageUrl) {
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          url: category.imageUrl,
        },
      ]);
    } else {
      setFileList([]);
    }
    setIsModalOpen(true);
  };

  // 🟦 Upload lên Cloudinary thật (giữ UI/CSS nguyên)
  const handleUpload = async (file: File) => {
    try {
      if (!file.type.startsWith("image/")) {
        message.error("Chỉ cho phép file ảnh!");
        return false;
      }
      if (file.size / 1024 / 1024 >= 2) {
        message.error("Ảnh phải nhỏ hơn 2MB!");
        return false;
      }

      setUploading(true);
      const imageUrl = await uploadToCloudinary(file as File);

      // 👇 antd cần shape có status/url để hiển thị
      setFileList([
        {
          uid: String(Date.now()),
          name: (file as any).name || "image",
          status: "done",
          url: imageUrl,
        },
      ]);

      message.success("Tải ảnh lên thành công!");
    } catch (e: any) {
      console.error(e);
      message.error(e?.message || "Tải ảnh lên thất bại!");
    } finally {
      setUploading(false);
    }
    return false; // chặn antd tự upload
  };

  // 🟦 Lưu (thêm hoặc cập nhật)
  const handleSaveCategory = async () => {
    try {
      const values = await form.validateFields();
      const imageUrl = fileList[0]?.url || "";

      if (editingCategory) {
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/categories/${editingCategory.id}`,
          {
            name: values.name,
            imageUrl,
          }
        );
        message.success("Cập nhật danh mục thành công!");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/categories`, {
          name: values.name,
          imageUrl,
          status: true,
        });
        message.success("Thêm danh mục thành công!");
      }

      setIsModalOpen(false);
      form.resetFields();
      setFileList([]);
      fetchCategories();
    } catch (error) {
      message.error("Lỗi khi lưu danh mục!");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <Button type="primary" onClick={handleAdd}>
          Add Category
        </Button>

        <Input
          placeholder="Search here..."
          prefix={<SearchOutlined />}
          allowClear
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 250 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredCategories}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 8,
          showSizeChanger: false,
          showTotal: (total) => `Total ${total} categories`,
          onChange: (page) => setCurrentPage(page),
        }}
        bordered
      />

      {/* 🟢 Modal Form */}
      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setFileList([]);
        }}
        footer={null}
        centered
        maskClosable={false}
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
          >
            <Input placeholder="Nhập tên danh mục..." />
          </Form.Item>

          <Upload
            listType="picture"
            accept="image/*"
            fileList={fileList}
            onRemove={() => setFileList([])}
            beforeUpload={(file) => {
              // antd đưa vào RcFile, nhưng dùng như File được
              handleUpload(file as unknown as File);
              return Upload.LIST_IGNORE; // 👈 chặn antd tự thêm, mình tự setFileList
            }}
          >
            {fileList.length === 0 && (
              <Button
                icon={<UploadOutlined />}
                loading={uploading}
                block
                style={{ background: "#ff6600", color: "white" }}
              >
                Upload Image
              </Button>
            )}
          </Upload>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              onClick={handleSaveCategory}
              style={{ background: "#ff6600" }}
            >
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
