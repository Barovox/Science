import { UserLogin } from "@/models/UserLogin";
import { SERVER_API_URL } from "@/utils/env";
import { Button, Flex, Table, Textarea } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useEffect } from "react";

const initialValues = [{ thoiGian: "", chucVu: "", donVi: "" }];

const GiangDayVaCongTac = ({ view }: { view?: string }) => {
  const user: UserLogin = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string
  );

  const [rows, setRows] = useListState(initialValues);
  const viewer = view != null;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${SERVER_API_URL}/LyLich2/GetField/${
          view ? view : user.IDUser
        }/QuaTrinhGiangDayCongTac`,
        {
          headers: {
            Authorization: `Bearer ${user.Token}`,
          },
        }
      );

      if (res.status === 404) {
        console.log("Not found");
      } else if (res.status === 200) {
        const data = JSON.parse(res.data.value);
        // Đảm bảo luôn có ít nhất một dòng trống
        const rowsWithEmpty =
          data.length > 0
            ? !viewer
              ? [...data, { thoiGian: "", chucVu: "", donVi: "" }]
              : data
            : initialValues;
        setRows.setState(rowsWithEmpty);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (index: number, key: string, value: string) => {
    const updatedRows: any = [...rows];
    updatedRows[index][key] = value;

    // Kiểm tra nếu dòng hiện tại có dữ liệu và dòng tiếp theo chưa tồn tại
    if (
      (updatedRows[index].thoiGian ||
        updatedRows[index].chucVu ||
        updatedRows[index].donVi) &&
      index === rows.length - 1
    ) {
      updatedRows.push({ thoiGian: "", chucVu: "", donVi: "" });
    }

    // Loại bỏ các dòng trống ở cuối bảng (không tính dòng cuối cùng trống mới)
    const filteredRows = updatedRows.filter(
      (row: any, i: any) =>
        i === updatedRows.length - 1 || // Giữ dòng cuối cùng
        row.thoiGian.trim() !== "" ||
        row.chucVu.trim() !== "" ||
        row.donVi.trim() !== ""
    );

    setRows.setState(filteredRows);
  };

  const handleSaveChanges = async () => {
    const id = notifications.show({
      loading: true,
      title: "Hành động",
      message: "Đang lưu thay đổi...",
      autoClose: false,
      withCloseButton: false,
    });

    try {
      const nonEmptyRows = rows.filter(
        (row) =>
          row.thoiGian.trim() !== "" ||
          row.chucVu.trim() !== "" ||
          row.donVi.trim() !== ""
      );

      const res = await axios.put(
        `${SERVER_API_URL}/LyLich2/Update/info/${user.IDUser}`,
        {
          idLyLich: user.IDUser,
          quaTrinhGiangDayCongTac: JSON.stringify(nonEmptyRows),
        },
        {
          headers: {
            Authorization: `Bearer ${user.Token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        notifications.update({
          id,
          color: "teal",
          title: "Hành động",
          message: "Lưu thay đổi thành công.",
          icon: <IconCheck size={18} />,
          loading: false,
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.log(error);
      notifications.update({
        id,
        color: "red",
        title: "Lỗi",
        message: `Xảy ra lỗi: ${error}`,
        icon: <IconX size={18} />,
        loading: false,
        autoClose: false,
        withCloseButton: true,
      });
    }
  };

  return (
    <>
      {!viewer && (
        <Flex gap="md" justify="flex-end" align="center" mb="md">
          <Button
            color="green"
            leftSection={<IconDeviceFloppy size={18} stroke={1.8} />}
            onClick={handleSaveChanges}
          >
            Lưu thay đổi
          </Button>
        </Flex>
      )}

      <Table.ScrollContainer minWidth={500} type="native">
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Thời gian</Table.Th>
              <Table.Th>Chức vụ</Table.Th>
              <Table.Th>Đơn vị</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((row, index) => (
              <Table.Tr key={index}>
                <Table.Td>
                  <Textarea
                    autosize
                    variant="unstyled"
                    placeholder={!viewer ? "Thời gian..." : ""}
                    value={row.thoiGian}
                    onChange={(e) =>
                      handleInputChange(index, "thoiGian", e.target.value)
                    }
                    readOnly={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  <Textarea
                    autosize
                    variant="unstyled"
                    placeholder={!viewer ? "Chức vụ..." : ""}
                    value={row.chucVu}
                    onChange={(e) =>
                      handleInputChange(index, "chucVu", e.target.value)
                    }
                    readOnly={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  <Textarea
                    autosize
                    variant="unstyled"
                    placeholder={!viewer ? "Đơn vị..." : ""}
                    value={row.donVi}
                    onChange={(e) =>
                      handleInputChange(index, "donVi", e.target.value)
                    }
                    readOnly={viewer}
                  />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </>
  );
};

export default GiangDayVaCongTac;
