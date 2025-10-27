import { Modal, Form, Input, Button, message, Select } from "antd";
import axios from "axios";
import type { User } from "../../../types/user.type";

interface Props {
  open: boolean;
  onClose: () => void;
  user: User;
  onUpdate: (user: User) => void;
}

export default function ModalChangeInformation({ open, onClose, user, onUpdate }: Props) {
  const [form] = Form.useForm();

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const updatedUser = { ...user, ...values };

      await axios.put(`${import.meta.env.VITE_API_URL}/users/${user.id}`, updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      onUpdate(updatedUser);
      message.success("Cập nhật thông tin thành công!");
      onClose();
    } catch (err) {
      
    }
  };

  return (
    <Modal
      title="🧾 Cập nhật thông tin cá nhân"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          fullName: user.fullName,
          phone: user.phone,
          gender: user.gender ? "male" : "female",
        }}
        className="mt-2"
      >
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input placeholder="Nhập họ tên" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            { pattern: /^0\d{9}$/, message: "Số điện thoại không hợp lệ!" },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item label="Giới tính" name="gender">
          <Select
            options={[
              { value: "male", label: "Nam" },
              { value: "female", label: "Nữ" },
            ]}
          />
        </Form.Item>

        <div className="flex justify-end gap-3 mt-4">
          <Button onClick={onClose}>Hủy</Button>
          <Button
            type="primary"
            className="bg-indigo-600 hover:bg-indigo-500 rounded-md px-5"
            onClick={handleSave}
          >
            Lưu
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
