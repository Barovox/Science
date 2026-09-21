import { PaginationComponent } from "@/components";
import { UserLogin } from "@/models/UserLogin";
import {
  FILTER_BY_SEARCH_NOTIFICATIONS,
  selectFilteredNotifications,
} from "@/redux/slice/filterSlice";
import { SERVER_API_URL } from "@/utils/env";
import {
  ActionIcon,
  Button,
  Center,
  Checkbox,
  Container,
  Group,
  ScrollArea,
  Select,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconEye, IconSearch, IconStar, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ThongBaoPage = () => {
  const user: UserLogin = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string
  );

  const [thongBaoList, setThongBaoList] = useState([]);
  const filteredNotifications = useSelector(selectFilteredNotifications);
  const [selection, setSelection] = useState<number[]>([]);

  const [search, setSearch] = useState("");
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<string | null>("10");
  // Get Current Items
  const indexOfLastItem = currentPage * Number(itemsPerPage);
  const indexOfFirstItem = indexOfLastItem - Number(itemsPerPage);
  const currentItems = filteredNotifications.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const dispatch = useDispatch();

  useEffect(() => {
    getThongBao();
  }, []);

  useEffect(() => {
    dispatch(
      FILTER_BY_SEARCH_NOTIFICATIONS({ notifications: thongBaoList, search })
    );
    setCurrentPage(1);
  }, [dispatch, thongBaoList, search]);

  const getThongBao = async () => {
    try {
      const res = await axios.get(
        `${SERVER_API_URL}/ThongBao/Get/${user.IDUser}`,
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

  const toggleRow = (id: string) =>
    setSelection((current: any) =>
      current.includes(id)
        ? current.filter((item: any) => item !== id)
        : [...current, id]
    );
  const toggleAll = () =>
    setSelection((current: any) =>
      current.length === thongBaoList.length
        ? []
        : thongBaoList.map((item: any) => item.id)
    );

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

    await getThongBao();
  };

  const handleDelete = async () => {
    modals.openConfirmModal({
      title: "Xóa thông báo",
      children: (
        <Text>
          Bạn có chắc chắn muốn xóa các thông báo này không? Các thông báo sau
          khi xóa sẽ không thể khôi phục lại.
        </Text>
      ),
      labels: { confirm: "Xác nhận Xóa", cancel: "Đóng" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        await Promise.all(
          selection.map(async (id: number) => {
            return axios.delete(`${SERVER_API_URL}/ThongBao/${id}`, {
              headers: {
                Authorization: `Bearer ${user.Token}`,
              },
            });
          })
        );
        await getThongBao();
        setSelection([]);
      },
    });
  };

  const handleMarkAsRead = async () => {
    modals.openConfirmModal({
      title: "Đánh dấu đã đọc",
      children: (
        <Text>Bạn có chắc chắn muốn đánh dấu các thông báo này là đã đọc?</Text>
      ),
      labels: { confirm: "Xác nhận", cancel: "Đóng" },
      confirmProps: { color: "yellow" },
      onConfirm: async () => {
        await Promise.all(
          selection.map(async (id: number) => {
            return axios.put(`${SERVER_API_URL}/ThongBao/${id}/read`, null, {
              headers: {
                Authorization: `Bearer ${user.Token}`,
              },
            });
          })
        );
        await getThongBao();
        setSelection([]);
      },
    });
  };

  const handleMarkAsUnread = async () => {
    modals.openConfirmModal({
      title: "Đánh dấu chưa đọc",
      children: (
        <Text>
          Bạn có chắc chắn muốn đánh dấu các thông báo này là chưa đọc?
        </Text>
      ),
      labels: { confirm: "Xác nhận", cancel: "Đóng" },
      confirmProps: { color: "orange" },
      onConfirm: async () => {
        await Promise.all(
          selection.map(async (id: number) => {
            return axios.put(`${SERVER_API_URL}/ThongBao/${id}/unread`, null, {
              headers: {
                Authorization: `Bearer ${user.Token}`,
              },
            });
          })
        );
        await getThongBao();
        setSelection([]);
      },
    });
  };

  return (
    <Container my="xl">
      <Title>Trung tâm thông báo</Title>

      <Group mt="lg" justify="space-between">
        <div>
          <TextInput
            label={
              <>
                <b>{filteredNotifications.length}</b> thông báo
              </>
            }
            placeholder="Tìm kiếm thông báo"
            leftSection={<IconSearch stroke={1.5} />}
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
            variant="default"
          />
        </div>

        <Select
          label={`Đang hiển thị ${itemsPerPage} mục`}
          placeholder="Chọn giá trị"
          data={["10", "25", "50", "100"]}
          value={itemsPerPage}
          onChange={setItemsPerPage}
          allowDeselect={false}
        />
      </Group>

      <Group mt="md">
        <Button
          leftSection={<IconTrash size={18} stroke={1.5} />}
          color="red"
          onClick={handleDelete}
          disabled={selection.length === 0}
        >
          Xóa
        </Button>
        <Button
          leftSection={<IconStar size={18} stroke={1.5} />}
          color="yellow"
          onClick={handleMarkAsRead}
          disabled={selection.length === 0}
        >
          Đánh dấu đã đọc
        </Button>
        <Button
          leftSection={<IconStar size={18} stroke={1.5} />}
          color="orange"
          onClick={handleMarkAsUnread}
          disabled={selection.length === 0}
        >
          Đánh dấu chưa đọc
        </Button>
      </Group>

      {filteredNotifications.length === 0 ? (
        <Text>Không có thông báo nào.</Text>
      ) : (
        <>
          <Table
            my="md"
            striped
            highlightOnHover
            withTableBorder
            stickyHeader
            stickyHeaderOffset={60}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={40}>
                  <Checkbox
                    onChange={toggleAll}
                    checked={selection.length === thongBaoList.length}
                    indeterminate={
                      selection.length > 0 &&
                      selection.length !== thongBaoList.length
                    }
                  />
                </Table.Th>
                <Table.Th>Thông báo</Table.Th>
                <Table.Th>Ngày</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {/* @ts-ignore */}
              {currentItems.map((notify: any, index: any) => {
                const { id, message, isRead, createdAt } = notify;

                return (
                  <Table.Tr key={id}>
                    <Table.Td>
                      <Checkbox
                        checked={selection.includes(id)}
                        onChange={() => toggleRow(id)}
                      />
                    </Table.Td>
                    <Table.Td>
                      <Text lineClamp={2} fw={isRead ? undefined : 500}>
                        {message}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text>{new Date(createdAt).toLocaleString()}</Text>
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon.Group>
                        <ActionIcon
                          size="lg"
                          color="blue"
                          variant="filled"
                          onClick={() => readThongBao(id, message)}
                        >
                          <IconEye stroke={1.5} />
                        </ActionIcon>
                        <ActionIcon
                          size="lg"
                          color="red"
                          variant="filled"
                          onClick={() => readThongBao(id, message)}
                        >
                          <IconTrash stroke={1.5} />
                        </ActionIcon>
                      </ActionIcon.Group>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>

          <Center mt="md">
            <PaginationComponent
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={Number(itemsPerPage)}
              totalItems={filteredNotifications.length}
            />
          </Center>
        </>
      )}
    </Container>
  );
};

export default ThongBaoPage;
