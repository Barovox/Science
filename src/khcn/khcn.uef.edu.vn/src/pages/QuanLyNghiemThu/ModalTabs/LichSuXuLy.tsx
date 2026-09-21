import { UserLogin } from "@/models/UserLogin";
import { SERVER_API_URL } from "@/utils/env";
import { Paper, Text, ThemeIcon, Timeline, Title } from "@mantine/core";
import { IconCheck, IconDots, IconUpload, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";

const LichSuXuLy = ({ baiBaoData }: { baiBaoData: any }) => {
  const user: Partial<UserLogin> = JSON.parse(
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
