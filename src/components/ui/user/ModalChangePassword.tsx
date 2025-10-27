import { Modal, Form, Input, Button, message } from "antd";
import { useState } from "react";
import axios from "axios";
import type { User } from "../../../types/user.type";

interface Props {
  open: boolean;
  onClose: () => void;
  user: User;
}

export default function ModalChangePassword({ open, onClose, user }: Props) {
  const [form] = Form.useForm();
  const [errorOldPass, setErrorOldPass] = useState("");

  const handleChange = async (values: any) => {
    const { oldPass, newPass, confirm } = values;

    // Kiểm tra mật khẩu cũ
    if (oldPass !== user.password) {
      setErrorOldPass("Mật khẩu hiện tại không chính xác!");
      return;
    } else {
      setErrorOldPass("");
    }

    // Kiểm tra xác nhận mật khẩu
    if (newPass !== confirm) {
      message.error("Mật khẩu mới không khớp!");
      return;
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/users/${user.id}`, {
        ...user,
        password: newPass,
      });
      message.success("Đổi mật khẩu thành công!");
      onClose();
      form.resetFields();
    } catch {
      message.error("Lỗi khi đổi mật khẩu!");
    }
  };

  return (
    <Modal
      title="🔐 Đổi mật khẩu"
      open={open}
      onCancel={() => {
        onClose();
        setErrorOldPass("");
        form.resetFields();
      }}
      footer={null}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleChange}
        className="space-y-3"
      >
        {/* Mật khẩu hiện tại */}
        <Form.Item
          label="Mật khẩu hiện tại"
          name="oldPass"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại!" }]}
          validateStatus={errorOldPass ? "error" : ""}
          help={errorOldPass}
        >
          <Input.Password placeholder="Nhập mật khẩu hiện tại" />
        </Form.Item>

        {/* Mật khẩu mới */}
        <Form.Item
          label="Mật khẩu mới"
          name="newPass"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới!" },
            { min: 6, message: "Mật khẩu phải ít nhất 6 ký tự!" },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu mới" />
        </Form.Item>

        {/* Xác nhận mật khẩu */}
        <Form.Item
          label="Xác nhận mật khẩu mới"
          name="confirm"
          dependencies={["newPass"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPass") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập lại mật khẩu mới" />
        </Form.Item>

        <div className="flex justify-end gap-3 mt-4">
          <Button onClick={onClose}>Hủy</Button>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Lưu thay đổi
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
