import { UserLogin } from "@/models/UserLogin";
import { getStatusNghiemThuColor } from "@/utils/color";
import { formatDatetime } from "@/utils/datetime";
import { MAILER_API_URL, SERVER_API_URL } from "@/utils/env";
import { getCurrentDomain } from "@/utils/url";
import {
  Badge,
  Button,
  Center,
  Paper,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconListCheck } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";

const PhanBienChuyenMon = ({
  baiBaoData,
  onRefresh,
}: {
  baiBaoData: any;
  onRefresh: () => Promise<void>;
}) => {
  const user: UserLogin = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string,
  );

  const [people, setPeople] = useState<any[]>([]);

  useEffect(() => {
    fetchDanhSachHoiDong();
  }, []);

  const fetchDanhSachHoiDong = async () => {
    const danhSachNguoiHoiDong =
      (
        await axios.get(
          `${SERVER_API_URL}/HDNghiemThuDT_CBGVNV/Get-danh-sach-hd-nghiem-thu?IDDanhMuc=${baiBaoData.idDanhMuc}`,
          {
            headers: {
              Authorization: `Bearer ${user.Token}`,
            },
          },
        )
      ).data || [];
    setPeople(danhSachNguoiHoiDong);
  };

  const handleSendReminder = async () => {
    const danhSachNguoiHoiDong = people.filter((p) => p.status === "0");
    if (danhSachNguoiHoiDong.length === 0) {
      notifications.show({
        color: "yellow",
        title: "Hành động",
        message: "Hiện không có hội đồng khả dụng nào cần nhắc nhở.",
        autoClose: 3000,
      });
      return;
    }

    const domain = getCurrentDomain();
    const mailList = danhSachNguoiHoiDong.map((p) => p.email);
    const mailData = {
      tenBaiBao: baiBaoData.tenBaiBao,
      APP_URL: `${domain}/hoi-dong/hoi-dong-nghiem-thu-gia-han-huy-de-tai?opened=true&idDanhMuc=${baiBaoData.idDanhMuc}&openTab=thong-tin-de-tai`,
    };

    try {
      const res = await axios.post(
        `${MAILER_API_URL}/send-email/nhac-nho-nghiem-thu`,
        {
          mailList,
          mailData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (res.status === 200) {
        notifications.show({
          color: "teal",
          title: "Hành động",
          message: "Đã gửi lời nhắc nhở hội đồng thành công.",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleXoaHoiDongFromBaiBao = async (hoiDong: any) => {
    const danhSachHoiDong =
      ((
        await axios.get(
          `${SERVER_API_URL}/HDNghiemThuDT_CBGVNV/Get-danh-sach-hd-nghiem-thu?IDDanhMuc=${baiBaoData.idDanhMuc}`,
          {
            headers: {
              Authorization: `Bearer ${user.Token}`,
              "Content-Type": "application/json",
            },
          },
        )
      ).data as any[]) || [];

    const danhSachMoi = danhSachHoiDong.filter(
      (item) => item.email !== hoiDong.email,
    );

    try {
      const res = await axios.post(
        `${SERVER_API_URL}/HDNghiemThuDT_CBGVNV/Add-hdnt-vao-bai-bao`,
        {
          idDanhMuc: baiBaoData.idDanhMuc,
          danhSachHDNghiemThu: JSON.stringify(danhSachMoi),
        },
        {
          headers: {
            Authorization: `Bearer ${user.Token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (res.status === 200) {
        notifications.show({
          color: "teal",
          title: "Hành động",
          message: `Đã xóa hội đồng "${hoiDong.hoTen}" khỏi bài báo.`,
          autoClose: 5000,
        });
        await onRefresh();
      }
    } catch (error) {
      console.log(error);
      notifications.show({
        color: "red",
        title: "Lỗi",
        message: `Xảy ra lỗi: ${error}`,
        autoClose: 5000,
      });
    }
  };

  const handleSendMailCamOnNghiemThu = async (pb: any) => {
    const tenChuNhiem = baiBaoData.groupUser.split("$").map((tacGia: any) => {
      const parts = tacGia.split(";");
      const hoTenFull = parts[1];

      // Tách phần sau dấu "-" và loại bỏ khoảng trắng thừa
      const tenNV = hoTenFull.split("-")[1]?.trim();

      return tenNV;
    })[0];

    const mailData = {
      tenBaiBao: baiBaoData.tenBaiBao,
      hoTenChuNhiem: tenChuNhiem,
      hoTenPhanBien: pb.hoTen,
    };

    try {
      const res = await axios.post(
        `${MAILER_API_URL}/send-email/cam-on-nghiem-thu`,
        {
          to: pb.email,
          mailData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (res.status === 200) {
        notifications.show({
          color: "teal",
          title: "Hành động",
          message: `Đã gửi thư cảm ơn đến "${pb.hoTen} (${pb.email})" thành công.`,
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.log(error);
      notifications.show({
        color: "red",
        title: "Hành động",
        message: `Lỗi gửi thư cảm ơn: ${error}`,
        autoClose: 5000,
      });
    }
  };

  const rows = people.map((p, index) => (
    <Table.Tr key={index}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{p.hoTen}</Table.Td>
      <Table.Td>{p.email}</Table.Td>
      <Table.Td>{p.invitedAt}</Table.Td>
      <Table.Td>
        {p.status === "-1" ? (
          <Badge color="red">Từ chối</Badge>
        ) : p.status === "1" ? (
          <Badge color="green">Đã nghiệm thu</Badge>
        ) : p.status === "0" ? (
          <Badge color="yellow">Đang nghiệm thu</Badge>
        ) : (
          <Badge color="blue">Chờ phản hồi</Badge>
        )}
      </Table.Td>
      <Table.Td>
        {(p.status === "-" || p.status === "0") && (
          <Button color="red" onClick={() => handleXoaHoiDongFromBaiBao(p)}>
            Hủy nghiệm thu
          </Button>
        )}
        {p.status === "1" && (
          <Button color="green" onClick={() => handleSendMailCamOnNghiemThu(p)}>
            Gửi email cảm ơn
          </Button>
        )}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Paper shadow="xs" withBorder p="xl">
        <Center inline>
          <IconListCheck size={24} stroke={1.5} />
          <Title order={3} ml="xs">
            Tình trạng đánh giá nghiệm thu
          </Title>
        </Center>

        <Text mt="md">
          Tình trạng:{" "}
          <Badge
            color={getStatusNghiemThuColor(
              baiBaoData.status_nghiemThu || "Đang thực hiện",
            )}
          >
            {baiBaoData.status_nghiemThu || "Đang thực hiện"}
          </Badge>
        </Text>
        <Text>Thời gian nộp: {formatDatetime(baiBaoData.dateSubmit)}</Text>

        <Center inline mt="md">
          <IconListCheck size={24} stroke={1.5} />
          <Title order={3} ml="xs">
            Nghiệm thu
          </Title>
        </Center>

        <Table striped withTableBorder highlightOnHover mt="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>STT</Table.Th>
              <Table.Th>Họ tên</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Thời gian mời</Table.Th>
              <Table.Th></Table.Th>
              <Table.Th>Tác vụ</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>

        <Button mt="md" onClick={handleSendReminder}>
          Nhắc nhở nghiệm thu
        </Button>
      </Paper>
    </>
  );
};

export default PhanBienChuyenMon;
