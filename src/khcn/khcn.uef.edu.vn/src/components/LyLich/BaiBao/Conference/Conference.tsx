import { UserLogin } from "@/models/UserLogin";
import { SERVER_API_URL } from "@/utils/env";
import { Button, Flex, Table, Textarea } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useEffect } from "react";

const initialValues = [
  {
    tenBaiBao: "",
    soTacGia: "",
    chucVu: "",
    tenTapChi: "",
    loaiTapChi: "",
    tapSoTrang: "",
    ngayCongBo: "",
  },
];

const Conference = ({ view }: { view?: string }) => {
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
        }/BaiBao_Conference`,
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
              ? [
                  ...data,
                  {
                    tenBaiBao: "",
                    soTacGia: "",
                    chucVu: "",
                    tenTapChi: "",
                    loaiTapChi: "",
                    tapSoTrang: "",
                    ngayCongBo: "",
                  },
                ]
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
      (updatedRows[index].tenBaiBao ||
        updatedRows[index].soTacGia ||
        updatedRows[index].chucVu ||
        updatedRows[index].tenTapChi ||
        updatedRows[index].loaiTapChi ||
        updatedRows[index].tapSoTrang ||
        updatedRows[index].ngayCongBo) &&
      index === rows.length - 1
    ) {
      updatedRows.push({
        tenBaiBao: "",
        soTacGia: "",
        chucVu: "",
        tenTapChi: "",
        loaiTapChi: "",
        tapSoTrang: "",
        ngayCongBo: "",
      });
    }

    // Loại bỏ các dòng trống ở cuối bảng (không tính dòng cuối cùng trống mới)
    const filteredRows = updatedRows.filter(
      (row: any, i: any) =>
        i === updatedRows.length - 1 || // Giữ dòng cuối cùng
        row.tenBaiBao.trim() !== "" ||
        row.soTacGia.trim() !== "" ||
        row.chucVu.trim() !== "" ||
        row.tenTapChi.trim() !== "" ||
        row.loaiTapChi.trim() !== "" ||
        row.tapSoTrang.trim() !== "" ||
        row.ngayCongBo.trim() !== ""
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
          row.tenBaiBao.trim() !== "" ||
          row.soTacGia.trim() !== "" ||
          row.chucVu.trim() !== "" ||
          row.tenTapChi.trim() !== "" ||
          row.loaiTapChi.trim() !== "" ||
          row.tapSoTrang.trim() !== "" ||
          row.ngayCongBo.trim() !== ""
      );

      const res = await axios.put(
        `${SERVER_API_URL}/LyLich2/Update/info/${user.IDUser}`,
        {
          idLyLich: user.IDUser,
          baiBao_Conference: JSON.stringify(nonEmptyRows),
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
              <Table.Th>Tên bài báo/báo cáo KH</Table.Th>
              <Table.Th>Số tác giả</Table.Th>
              <Table.Th>Là tác giả chính</Table.Th>
              <Table.Th>
                Tên tạp chí hoặc kỷ yếu khoa học (ISSN hoặc ISBN)
              </Table.Th>
              <Table.Th>Loại Tạp chí: WoS, Scopus (IF, Qi), NXB</Table.Th>
              <Table.Th>Tập, số, trang</Table.Th>
              <Table.Th>Tháng, năm công bố</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((row, index) => (
              <Table.Tr key={index}>
                <Table.Td>
                  <Textarea
                    autosize
                    variant="unstyled"
                    placeholder={!viewer ? "Tên bài báo..." : ""}
                    value={row.tenBaiBao}
                    onChange={(e) =>
                      handleInputChange(index, "tenBaiBao", e.target.value)
                    }
                    readOnly={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  <Textarea
                    autosize
                    variant="unstyled"
                    placeholder={!viewer ? "Số tác giả..." : ""}
                    value={row.soTacGia}
                    onChange={(e) =>
                      handleInputChange(index, "soTacGia", e.target.value)
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
                    placeholder={!viewer ? "Tên tạp chí..." : ""}
                    value={row.tenTapChi}
                    onChange={(e) =>
                      handleInputChange(index, "tenTapChi", e.target.value)
                    }
                    readOnly={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  <Textarea
                    autosize
                    variant="unstyled"
                    placeholder={!viewer ? "Loại tạp chí..." : ""}
                    value={row.loaiTapChi}
                    onChange={(e) =>
                      handleInputChange(index, "loaiTapChi", e.target.value)
                    }
                    readOnly={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  <Textarea
                    autosize
                    variant="unstyled"
                    placeholder={!viewer ? "Tập, số, trang..." : ""}
                    value={row.tapSoTrang}
                    onChange={(e) =>
                      handleInputChange(index, "tapSoTrang", e.target.value)
                    }
                    readOnly={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  <Textarea
                    autosize
                    variant="unstyled"
                    placeholder={!viewer ? "Ngày công bố..." : ""}
                    value={row.ngayCongBo}
                    onChange={(e) =>
                      handleInputChange(index, "ngayCongBo", e.target.value)
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

export default Conference;
