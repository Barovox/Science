import { UserLogin } from "@/models/UserLogin";
import { KEKHAI_SYSTEM_URL, SERVER_API_URL } from "@/utils/env";
import { formatNumberWithCommas } from "@/utils/number";
import {
  Accordion,
  Anchor,
  Button,
  Center,
  Grid,
  Mark,
  Paper,
  Select,
  Table,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconDownload } from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";

const ThongTinDeTai = ({
  baiBaoData,
  onRefresh,
}: {
  baiBaoData: any;
  onRefresh: () => Promise<void>;
}) => {
  const user: Partial<UserLogin> = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string,
  );

  let isSent =
    baiBaoData.status == "Đồng ý tài trợ" ||
    baiBaoData.status == "Không tài trợ";

  const [accor, setAccor] = useState<string[]>([]);
  const [selectStatus, setSelectStatus] = useState<string | null>(
    isSent ? baiBaoData.status : null,
  );
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fileBaiBao = [
    {
      title: "File đăng ký",
      fileUrl: baiBaoData.fileDangKy,
    },
    {
      title: "File thuyết minh",
      fileUrl: baiBaoData.fileThuyetMinh,
    },
    {
      title: "File đính kèm lý lịch",
      fileUrl: baiBaoData.fileDinhKemLyLich,
    },
  ];

  const extractGroupTacGia = (groupUser: string) => {
    const listTacGia = groupUser.split("$").map((tacGia) => {
      const parts = tacGia.split(";");
      const STT = parseInt(parts[0]);
      const hoTenFull = parts[1];
      const vaiTro = parts[3];

      // Tách phần sau dấu "-" và loại bỏ khoảng trắng thừa
      const hoTen = hoTenFull.split("-")[1]?.trim() || hoTenFull;

      return { stt: STT, hoTen: hoTen, vaiTro: vaiTro };
    });

    return listTacGia.map((tacGia: any, index: number) => {
      return (
        <Table.Tr key={index}>
          <Table.Td>{tacGia.stt}</Table.Td>
          <Table.Td>{tacGia.hoTen}</Table.Td>
          <Table.Td>{tacGia.vaiTro}</Table.Td>
        </Table.Tr>
      );
    });
  };

  const handleSubmit = async () => {
    if (selectStatus) {
      setSubmitting(true);

      modals.openConfirmModal({
        title: `Xác nhận ${isSent ? "cập nhật" : "gửi"}`,
        closeOnClickOutside: false,
        children: (
          <>
            <Text>
              Xác nhận {isSent ? "cập nhật" : "gửi"} kết quả cho đề tài này là{" "}
              <strong>"{selectStatus}"</strong>.
            </Text>
          </>
        ),
        labels: {
          confirm: `${isSent ? "Cập nhật" : "Gửi"} kết quả`,
          cancel: "Chọn lại",
        },
        onCancel: () => setSubmitting(false),
        onConfirm: async () => {
          try {
            const res = await axios.put(
              `${SERVER_API_URL}/DanhMucXetDuyetSinhVien/${baiBaoData.idDanhMuc}`,
              JSON.stringify(selectStatus),
              {
                headers: {
                  Authorization: `Bearer ${user.Token}`,
                  "Content-Type": "application/json",
                },
              },
            );

            if (res.status == 200) {
              notifications.show({
                message: `Đã ${
                  isSent ? "cập nhật" : "gửi"
                } kết luận cho đề tài này thành công.`,
                color: "green",
                position: "bottom-left",
              });

              await axios.post(
                `${SERVER_API_URL}/DanhMucXetDuyetSinhVien/Add-lich-su-xu-ly?idDanhMuc=${baiBaoData.idDanhMuc}`,
                {
                  by: "Hội đồng khoa học",
                  content: `Hội đồng đã ${
                    isSent ? "cập nhật" : "gửi"
                  } kết luận "${selectStatus.toUpperCase()}" cho đề tài. Vui lòng xem chi tiết tại trang kê khai.`,
                  type: "hdkh-submit-review",
                },
                {
                  headers: {
                    Authorization: `Bearer ${user.Token}`,
                    "Content-Type": "application/json",
                  },
                },
              );

              isSent = true;

              await onRefresh();
            }
          } catch (error: any) {
            notifications.show({
              title: `Lỗi ${isSent ? "cập nhật" : "gửi"} kết luận`,
              message: error,
              color: "red",
              position: "bottom-left",
            });
          } finally {
            setSubmitting(false);
          }
        },
      });
    } else {
      notifications.show({
        title: "Thông báo",
        message: `Vui lòng chọn kết luận cho đề tài trước khi ${
          isSent ? "cập nhật" : "gửi"
        }!`,
        color: "yellow",
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Paper shadow="xs" withBorder p="xl">
        <Title order={3} mb="md">
          Thông tin đề tài
        </Title>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Textarea
              label="Tên đề tài"
              value={baiBaoData.tenBaiBao}
              autosize
              minRows={1}
              maxRows={4}
              size="md"
              readOnly
            />
            <Textarea
              mt="md"
              label="Mô tả nghiên cứu"
              value={baiBaoData.moTaBaiBao}
              autosize
              minRows={1}
              maxRows={4}
              size="md"
              readOnly
            />
            <TextInput
              mt="md"
              label="Thời gian thực hiện"
              value={`${baiBaoData.thoiGianThucHien} tháng`}
              size="md"
              readOnly
            />

            <Title order={4} mt="md">
              Tác giả
            </Title>
            <Table striped withTableBorder highlightOnHover mt="xs">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>STT</Table.Th>
                  <Table.Th>Họ tên</Table.Th>
                  <Table.Th>Vai trò</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {extractGroupTacGia(baiBaoData.groupUser)}
              </Table.Tbody>
            </Table>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Title order={4}>File bản thảo</Title>
            <Accordion
              variant="contained"
              radius="md"
              multiple
              mt="xs"
              value={accor}
              onChange={setAccor}
            >
              {fileBaiBao.map((item) => (
                <Accordion.Item key={item.title} value={item.title}>
                  <Accordion.Control>{item.title}</Accordion.Control>
                  <Accordion.Panel>
                    <Center inline>
                      <IconDownload size={22} stroke={1.5} />
                      <Anchor
                        href={`${KEKHAI_SYSTEM_URL}${item.fileUrl}`}
                        download={true}
                        target="_blank"
                        ml={5}
                      >
                        {item.fileUrl.split("/").pop()}
                      </Anchor>
                    </Center>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>

            <Textarea
              mt="md"
              label="Sản phẩm đăng ký"
              value={`${baiBaoData.category.split("|~|")[0]}${
                baiBaoData.category.split("|~|")[1] &&
                ` - ${baiBaoData.category.split("|~|")[1]}`
              }`}
              autosize
              minRows={1}
              maxRows={3}
              size="md"
              readOnly
            />

            <TextInput
              mt="xs"
              size="md"
              label="Kinh phí"
              value={`${formatNumberWithCommas(baiBaoData.kinhPhi)} VNĐ`}
              readOnly
            />
          </Grid.Col>
        </Grid>
      </Paper>

      <Paper shadow="xs" withBorder p="xl" mt="md">
        <Title order={3} mb="md">
          Kết luận Hội đồng
        </Title>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Table striped withTableBorder highlightOnHover mt="xs">
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>Số phản biện đã mời</Table.Td>
                  <Table.Td>
                    {baiBaoData.danhSachHDXetDuyet
                      ? JSON.parse(baiBaoData.danhSachHDXetDuyet).length
                      : 0}
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Số phản biện đã nhận lời mời</Table.Td>
                  <Table.Td>
                    {baiBaoData.danhSachHDXetDuyet
                      ? JSON.parse(baiBaoData.danhSachHDXetDuyet).filter(
                          (hd: any) => hd.status == "0" || hd.status == "1",
                        ).length
                      : 0}
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Số phản biện ĐẠT</Table.Td>
                  <Table.Td>
                    {baiBaoData.hoiDongDanhGia
                      ? JSON.parse(baiBaoData.hoiDongDanhGia).filter(
                          (dg: any) => dg.fromHoiDong && dg.ketLuan == "Đạt",
                        ).length
                      : 0}
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Số phản biện KHÔNG ĐẠT</Table.Td>
                  <Table.Td>
                    {baiBaoData.hoiDongDanhGia
                      ? JSON.parse(baiBaoData.hoiDongDanhGia).filter(
                          (dg: any) =>
                            dg.fromHoiDong && dg.ketLuan == "Không đạt",
                        ).length
                      : 0}
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            {isSent && (
              <Text mt="md" mb="md" fw="bold">
                <Mark color="red" p="xs">
                  KẾT QUẢ CUỐI CÙNG:
                </Mark>{" "}
                {baiBaoData.status == "Đồng ý tài trợ" ||
                baiBaoData.status == "Không tài trợ"
                  ? baiBaoData.status.toUpperCase()
                  : "....."}
              </Text>
            )}

            <Select
              label="Kết luận"
              data={["Đồng ý tài trợ", "Không tài trợ"]}
              value={selectStatus}
              onChange={setSelectStatus}
            />

            <Button
              onClick={handleSubmit}
              mt="xs"
              loading={submitting}
              loaderProps={{ type: "dots" }}
            >
              {isSent ? "Cập nhật" : "Gửi"} kết quả
            </Button>
          </Grid.Col>
        </Grid>
      </Paper>
    </>
  );
};

export default ThongTinDeTai;
