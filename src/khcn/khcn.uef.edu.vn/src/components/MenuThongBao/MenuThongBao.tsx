import { UserLogin } from "@/models/UserLogin";
import { SERVER_API_URL } from "@/utils/env";
import { ActionIcon, Indicator, Menu, ScrollArea, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconBell } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";

const MenuThongBao = () => {
  const user: UserLogin = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string
  );

  // @ts-ignore
  const [thongBaoMenuOpened, setThongBaoMenuOpened] = useState(false);
  const [thongBaoList, setThongBaoList] = useState([]);

  useEffect(() => {
    getThongBaoChuaDoc();
  }, []);

  const getThongBaoChuaDoc = async () => {
    try {
      const res = await axios.get(
        `${SERVER_API_URL}/ThongBao/Get/${user.IDUser}/unread`,
        {
          headers: {
            Authorization: `Bearer ${user.Token}`,
          },
        }
      );

      if (res.status === 200) {
        setThongBaoList(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const markAllAsRead = async () => {
    thongBaoList.forEach(async (item: any) => {
      await axios.put(`${SERVER_API_URL}/ThongBao/${item.id}/read`, null, {
        headers: {
          Authorization: `Bearer ${user.Token}`,
        },
      });
    });
    setThongBaoList([]);
  };

  const readThongBao = async (id: number, message: string) => {
    modals.open({
      title: "Thông báo",
      withCloseButton: true,
      closeOnClickOutside: false,
      scrollAreaComponent: ScrollArea.Autosize,
      children: (
        <>
          <Text>{message}</Text>
        </>
      ),
    });

    await axios.put(`${SERVER_API_URL}/ThongBao/${id}/read`, null, {
      headers: {
        Authorization: `Bearer ${user.Token}`,
      },
    });

    await getThongBaoChuaDoc();
  };

  return (
    <Menu
      width={260}
      withArrow
      position="bottom-end"
      transitionProps={{ transition: "pop-top-right" }}
      onClose={() => setThongBaoMenuOpened(false)}
      onOpen={() => setThongBaoMenuOpened(true)}
      withinPortal
    >
      <Menu.Target>
        <Indicator
          inline
          label={thongBaoList.length}
          size={16}
          withBorder
          processing
          disabled={thongBaoList.length === 0}
        >
          <ActionIcon variant="default" size="md">
            <IconBell stroke={1.2} />
          </ActionIcon>
        </Indicator>
      </Menu.Target>
      <Menu.Dropdown>
        {thongBaoList.length > 0 ? (
          <>
            <Menu.Item color="blue" onClick={markAllAsRead}>
              Đánh dấu tất cả đã đọc
            </Menu.Item>

            <Menu.Divider />

            <ScrollArea h={200}>
              {thongBaoList.map((item: any, index: any) => (
                <Menu.Item
                  key={index}
                  onClick={() => readThongBao(item.id, item.message)}
                >
                  <Text size="sm" lineClamp={2} fw={500}>
                    {item.message}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {new Date(item.createdAt).toLocaleString()}
                  </Text>
                </Menu.Item>
              ))}
            </ScrollArea>
          </>
        ) : (
          <Text size="sm" c="dimmed">
            Hiện tại không có thông báo mới nào.
          </Text>
        )}

        <Menu.Divider />

        <Menu.Item component="a" href="/thong-bao">
          Xem toàn bộ thông báo
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default MenuThongBao;
