import { UserLogin } from "@/models/UserLogin";
import { HoiDongKhoaHocLogin } from "@/models/HoiDongKhoaHocLogin";
import { SERVER_API_URL } from "@/utils/env";
import {
  Anchor,
  Button,
  Grid,
  Paper,
  Text,
  TextInput,
  ThemeIcon,
  Timeline,
  Title,
} from "@mantine/core";
import {
  IconCheck,
  IconDots,
  IconDownload,
  // @ts-ignore
  IconRobot,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { RichTextEditor } from "@/components";

const LichSuXuLy = ({ baiBaoData }: { baiBaoData: any }) => {
  const user: Partial<UserLogin & HoiDongKhoaHocLogin> = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string
  );

  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchLichSuXuLy();
  }, []);

  const fetchLichSuXuLy = async () => {
    let lichSuXuLy =
      ((
        await axios.get(
          `${SERVER_API_URL}/HDXetDuyetDT_CBGVNV/Get-lich-su-xu-ly?IDDanhMuc=${baiBaoData.idDanhMuc}`,
          {
            headers: {
              Authorization: `Bearer ${user.Token}`,
            },
          }
        )
      ).data as any[]) || [];

    if (user.Role == "HoiDongKhoaHoc" && lichSuXuLy.length > 0) {
      lichSuXuLy = lichSuXuLy.filter((item: any) =>
        item.By.includes(user.Email)
      );
    }
    setHistory(lichSuXuLy.reverse());
  };

  const getTimelineBullet = (type: string) => {
    switch (type) {
      case "accept-invite":
        return (
          <ThemeIcon size={22} color="green" radius="xl">
            <IconCheck size={12} />
          </ThemeIcon>
        );
      case "decline-invite":
        return (
          <ThemeIcon size={22} color="red" radius="xl">
            <IconX size={12} />
          </ThemeIcon>
        );
      case "submit-review":
        return (
          <ThemeIcon size={22} color="blue" radius="xl">
            <IconUpload size={12} />
          </ThemeIcon>
        );
      case "hdkh-submit-review":
        return (
          <ThemeIcon size={22} color="blue" radius="xl">
            <IconUpload size={12} />
          </ThemeIcon>
        );
      default:
        return <IconDots size={12} />;
    }
  };

  const openReviewModal = async (by: string) => {
    try {
      const res = await axios.get(
        `${SERVER_API_URL}/DanhMucXetDuyetSinhVien/nhan-xet-hoi-dong/${baiBaoData.idDanhMuc}`,
        {
          headers: {
            Authorization: `Bearer ${user.Token}`,
          },
        }
      );

      if (res.status == 200 && res.data.length > 0) {
        const data = res.data.filter((item: any) => {
          // separate to get email from `by`, e.g: Nguyễn Khánh Duy (nkduy.dev@gmail.com)
          const emailMatch = by.match(/\(([^)]+)\)/) || by.match(/<([^>]+)>/);
          const byEmail = emailMatch ? emailMatch[1].trim() : by.trim();
          return item.fromHoiDong.split("|~|")[1] === byEmail;
        });
        modals.open({
          title: "Chi tiết đánh giá",
          size: "lg",
          children: (
            <>
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <RichTextEditor
                    label="Nhận xét cho nhóm đề tài"
                    placeholder="Nhập nhận xét..."
                    value={data[0].commentForGroup}
                    onChange={() => {}}
                    readOnly={true}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <RichTextEditor
                    label="Nhận xét riêng gửi hội đồng"
                    placeholder="Nhập nhận xét..."
                    value={data[0].commentForHoiDong}
                    onChange={() => {}}
                    readOnly={true}
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Anchor href={data[0].phieuDanhGia} target="_blank">
                    <Button
                      variant="outline"
                      color="blue"
                      leftSection={<IconDownload />}
                    >
                      Tải phiếu đánh giá đã gửi
                    </Button>
                  </Anchor>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Kết luận"
                    value={data[0].ketLuan}
                    readOnly={true}
                  />
                </Grid.Col>
              </Grid>
            </>
          ),
        });
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
    }
  };

  return (
    <>
      <Title order={3} mb="lg">
        Lịch sử xử lý
      </Title>

      <Paper shadow="xs" withBorder p="xl">
        <Timeline active={1} bulletSize={24}>
          {history.map((h: any, index: number) => (
            <Timeline.Item
              bullet={getTimelineBullet(h.Type)}
              title={h.By}
              key={index}
              lineVariant={index === 0 ? "dashed" : "solid"}
            >
              <Text c="dimmed" size="sm">
                {h.Content}
                {h.Type == "submit-review" && (
                  <>
                    {" "}
                    (
                    <Anchor onClick={() => openReviewModal(h.By)}>
                      Xem chi tiết
                    </Anchor>
                    )
                  </>
                )}
              </Text>
              <Text size="xs" mt={4}>
                {new Date(h.CreatedAt).toLocaleString("vi-VN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </Text>
            </Timeline.Item>
          ))}
          <Timeline.Item title="Tác giả" bullet={<IconUpload size={12} />}>
            <Text c="dimmed" size="sm">
              Tác giả nộp bản thảo lên hệ thống.
            </Text>
            <Text size="xs" mt={4}>
              {new Date(baiBaoData.dateSubmit).toLocaleString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </Text>
          </Timeline.Item>
        </Timeline>
      </Paper>
    </>
  );
};

export default LichSuXuLy;
