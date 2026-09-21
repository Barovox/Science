import { HoiDongKhoaHocLogin } from "@/models/HoiDongKhoaHocLogin";
import { SERVER_API_URL } from "@/utils/env";
import { Button, Group, PasswordInput, Text, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useState } from "react";

const Required = ({ mId }: { mId: string }) => {
  const user: HoiDongKhoaHocLogin = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string
  );

  const [matKhau, setMatKhau] = useState<string>("");
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState<string>("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (matKhau !== xacNhanMatKhau) {
      notifications.show({
        title: "Thông báo",
        message: "Mật khẩu không khớp",
        color: "red",
      });
      return;
    }

    try {
      const res = await axios.put(
        `${SERVER_API_URL}/HoiDongKhoaHoc/update-password`,
        {
          id: user.ID,
          email: user.Email,
          matKhau: matKhau,
        },
        {
          headers: {
            Authorization: `Bearer ${user.Token}`,
          },
        }
      );

      if (res.status === 200) {
        notifications.show({
          title: "Thông báo",
          message: "Cập nhật mật khẩu thành công",
          color: "green",
        });
        modals.close(mId);
      }
    } catch (error) {
      notifications.show({
        title: "Thông báo",
        message: "Có lỗi xảy ra, vui lòng thử lại sau.",
        color: "red",
      });
      return;
    }
  };

  return (
    <>
      <Text fs="italic" mb="md">
        Để tiếp tục sử dụng hệ thống, vui lòng thêm mật khẩu để bảo mật tài
        khoản của bạn.
      </Text>
      <form onSubmit={(e: any) => handleSubmit(e)}>
        <Group grow>
          <TextInput label="Họ tên" value={user.HoTen} readOnly />
          <TextInput label="Email" value={user.Email} readOnly />
        </Group>
        <Group grow mt="md">
          <PasswordInput
            label="Mật khẩu"
            value={matKhau}
            onChange={(event) => setMatKhau(event.currentTarget.value)}
            required
            withAsterisk
          />
          <PasswordInput
            label="Xác nhận mật khẩu"
            value={xacNhanMatKhau}
            onChange={(event) => setXacNhanMatKhau(event.currentTarget.value)}
            error={matKhau !== xacNhanMatKhau ? "Mật khẩu không khớp" : null}
            required
            withAsterisk
          />
        </Group>
        <Button mt="md" fullWidth color="green" type="submit">
          Cập nhật
        </Button>
      </form>
    </>
  );
};

export default Required;
