import { RichTextEditor } from "@/components";
import { HoiDongKhoaHocLogin } from "@/models/HoiDongKhoaHocLogin";
import { UserLogin } from "@/models/UserLogin";
import {
  ASSETS_KHCN_URL,
  KEKHAI_SYSTEM_URL,
  SERVER_API_URL,
} from "@/utils/env";
import { formatNumberWithCommas } from "@/utils/number";
import {
  Accordion,
  Anchor,
  Button,
  Center,
  FileInput,
  Grid,
  Group,
  Mark,
  Paper,
  Select,
  Table,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDownload } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";

const ThongTinDeTai = ({ baiBaoData }: { baiBaoData: any }) => {
  const user: Partial<UserLogin & HoiDongKhoaHocLogin> = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string,
  );

  const [accor, setAccor] = useState<string[]>([]);

  const [awaitFetching, setAwaitFetching] = useState<boolean>(true);
  const [commentForGroup, setCommentForGroup] = useState<string>("");
  const [commentForHoiDong, setCommentForHoiDong] = useState<string>("");
  const [phieuDanhGia, setPhieuDanhGia] = useState<File | null>(null);
  const [ketLuan, setKetLuan] = useState<string | null>("");
  const [awaitSubmitting, setAwaitSubmitting] = useState<boolean>(false);
  const [daPhanBien, setDaPhanBien] = useState<boolean>(false);
  const [phieuDanhGiaUrl, setPhieuDanhGiaUrl] = useState<string>("");

  useEffect(() => {
    if (user.Role === "HoiDongKhoaHoc") {
      fetchThongTinNhanXet();
    }
  }, []);

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

  const fetchThongTinNhanXet = async () => {
    setAwaitFetching(true);
    try {
      const res = await axios.get(
        `${SERVER_API_URL}/DanhMucXetDuyetSinhVien/nhan-xet-hoi-dong/${baiBaoData.idDanhMuc}`,
        {
          headers: {
            Authorization: `Bearer ${user.Token}`,
          },
        },
      );

      if (res.status == 200 && res.data.length > 0) {
        const data = res.data.find((item: any) => {
          return item.fromHoiDong?.split("|~|")[1] == user.Email;
        });
        if (data) {
          setDaPhanBien(true);
          setCommentForGroup(data.commentForGroup);
          setCommentForHoiDong(data.commentForHoiDong);
          setPhieuDanhGiaUrl(data.phieuDanhGia);
          setKetLuan(data.ketLuan);
        } else {
          setDaPhanBien(false);
        }
      }
    } catch (error) {
      console.log(error);
      notifications.show({
        color: "red",
        title: "Lỗi",
        message: `Xảy ra lỗi khi lấy thông tin đánh giá: ${error}`,
        position: "bottom-left",
        autoClose: 5000,
      });
    } finally {
      setAwaitFetching(false);
    }
  };

  const submitNhanXet = async () => {
    if (!commentForGroup) {
      notifications.show({
        color: "yellow",
        title: "Hành động",
        message: `Vui lòng thêm nhận xét cho nhóm đề tài!`,
        position: "bottom-left",
        autoClose: 5000,
      });
      return;
    }
    if (!phieuDanhGia) {
      notifications.show({
        color: "yellow",
        title: "Hành động",
        message: `Vui lòng thêm phiếu đánh giá!`,
        position: "bottom-left",
        autoClose: 5000,
      });
      return;
    }
    if (!ketLuan) {
      notifications.show({
        color: "yellow",
        title: "Hành động",
        message: `Vui lòng thêm kết luận!`,
        position: "bottom-left",
        autoClose: 5000,
      });
      return;
    }

    setAwaitSubmitting(true);

    // upload file đánh giá
    let fileUrl = "";
    const formData = new FormData();
    formData.append("file", phieuDanhGia);

    try {
      const res = await axios.post(`${ASSETS_KHCN_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        fileUrl = res.data.file.filename;
      }
    } catch (error) {
      console.log(error);
      notifications.show({
        color: "red",
        title: "Lỗi",
        message: `Xảy ra lỗi khi gửi phiếu đánh giá: ${error}`,
        position: "bottom-left",
        autoClose: 5000,
      });
    }

    // gửi nhận xét
    if (fileUrl != "") {
      try {
        const res = await axios.post(
          `${SERVER_API_URL}/DanhMucXetDuyetSinhVien/them-nhan-xet-hoi-dong`,
          {
            id: baiBaoData.idDanhMuc,
            fromHoiDong: `${user.HoTen}|~|${user.Email}`,
            commentForGroup,
            commentForHoiDong,
            phieuDanhGia: `${ASSETS_KHCN_URL}/uploads/${fileUrl}`,
            ketLuan,
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
            message: `Đã gửi nhận xét thành công.`,
            position: "bottom-left",
            autoClose: 5000,
          });

          await axios.post(
            `${SERVER_API_URL}/DanhMucXetDuyetSinhVien/Add-lich-su-xu-ly?idDanhMuc=${baiBaoData.idDanhMuc}`,
            {
              by: `${user.HoTen} (${user.Email})`,
              content: "Phản biện đã gửi phiếu phản biện.",
              type: "submit-review",
            },
            {
              headers: {
                Authorization: `Bearer ${user.Token}`,
                "Content-Type": "application/json",
              },
            },
          );

          clearNhanXet();
          await fetchThongTinNhanXet();
        }
      } catch (error) {
        console.log(error);
        notifications.show({
          color: "red",
          title: "Lỗi",
          message: `Xảy ra lỗi: ${error}`,
          position: "bottom-left",
          autoClose: 5000,
        });
      }
    }

    setAwaitSubmitting(false);
  };

  const clearNhanXet = () => {
    setCommentForGroup("");
    setCommentForHoiDong("");
    setPhieuDanhGia(null);
    setKetLuan("");
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

            {user.Role != "HoiDongKhoaHoc" && (
              <TextInput
                mt="xs"
                size="md"
                label="Kinh phí"
                value={`${formatNumberWithCommas(baiBaoData.kinhPhi)} VNĐ`}
                readOnly
              />
            )}
          </Grid.Col>
        </Grid>
      </Paper>

      {user.Role == "HoiDongKhoaHoc" ? (
        <>
          {awaitFetching ? (
            <></>
          ) : (
            <Paper shadow="xs" withBorder p="xl" mt="md">
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <RichTextEditor
                    label="Nhận xét cho nhóm đề tài"
                    placeholder="Nhập nhận xét..."
                    value={commentForGroup}
                    onChange={setCommentForGroup}
                    readOnly={daPhanBien}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <RichTextEditor
                    label="Nhận xét riêng gửi hội đồng"
                    placeholder="Nhập nhận xét..."
                    value={commentForHoiDong}
                    onChange={setCommentForHoiDong}
                    readOnly={daPhanBien}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  {daPhanBien ? (
                    <Anchor href={phieuDanhGiaUrl} target="_blank">
                      <Button
                        variant="outline"
                        color="blue"
                        leftSection={<IconDownload />}
                      >
                        Tải phiếu đánh giá đã gửi
                      </Button>
                    </Anchor>
                  ) : (
                    <>
                      <FileInput
                        label="Phiếu đánh giá"
                        placeholder="Đính kèm phiếu đánh giá"
                        value={phieuDanhGia}
                        onChange={setPhieuDanhGia}
                        withAsterisk
                      />
                      <Text>
                        👉{" "}
                        <Anchor
                          href="https://drive.google.com/drive/folders/118q_xn7lmjbsTotm3T3LHH310-jqtq3b?usp=drive_link"
                          target="_blank"
                        >
                          Biểu mẫu phiếu đánh giá
                        </Anchor>
                      </Text>
                    </>
                  )}
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Kết luận"
                    placeholder="Đạt / Không đạt"
                    data={["Đạt", "Không đạt"]}
                    value={ketLuan}
                    onChange={setKetLuan}
                    readOnly={daPhanBien}
                    withAsterisk={!daPhanBien}
                  />
                </Grid.Col>
              </Grid>

              {!daPhanBien && (
                <Group mt="md">
                  <Button
                    color="green"
                    onClick={submitNhanXet}
                    loading={awaitSubmitting}
                  >
                    Gửi
                  </Button>
                </Group>
              )}
            </Paper>
          )}
        </>
      ) : (
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
                            (dg: any) => dg.ketLuan == "Đạt",
                          ).length
                        : 0}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Số phản biện KHÔNG ĐẠT</Table.Td>
                    <Table.Td>
                      {baiBaoData.hoiDongDanhGia
                        ? JSON.parse(baiBaoData.hoiDongDanhGia).filter(
                            (dg: any) => dg.ketLuan == "Không đạt",
                          ).length
                        : 0}
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Text mt="md" fw="bold">
                <Mark color="red" p="xs">
                  KẾT QUẢ CUỐI CÙNG:
                </Mark>{" "}
                {baiBaoData.status == "Đồng ý tài trợ" ||
                baiBaoData.status == "Không tài trợ"
                  ? baiBaoData.status.toUpperCase()
                  : "....."}
              </Text>
            </Grid.Col>
          </Grid>
        </Paper>
      )}
    </>
  );
};

export default ThongTinDeTai;
