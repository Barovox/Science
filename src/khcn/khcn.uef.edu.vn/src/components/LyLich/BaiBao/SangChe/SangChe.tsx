import EditableCell from "@/components/EditableCell/EditableCell";
import { UserLogin } from "@/models/UserLogin";
import { SERVER_API_URL } from "@/utils/env";
import {
  Button,
  Checkbox,
  Flex,
  NumberFormatter,
  Table,
  Text,
} from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconAlertTriangle,
  IconCheck,
  IconDeviceFloppy,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import { useCallback, useEffect } from "react";

const emptyRow = {
  tenBangDocQuyen: "",
  tenTacGia: "",
  soTacGia: "",
  soTacGiaChinh: "",
  laTacGiaChinh: false,
  tenCoQuanCap: "",
  ngayCap: "",
  "5NamCuoi": false,
  diemCham: "",
  diemQuyDoi: 0,
};

const textFields = [
  "tenBangDocQuyen",
  "tenTacGia",
  "soTacGia",
  "soTacGiaChinh",
  "tenCoQuanCap",
  "ngayCap",
  "diemCham",
];

const SangChe = ({ view }: { view?: string }) => {
  const user: UserLogin = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string
  );

  const [rows, setRows] = useListState<any>([emptyRow]);
  const viewer = Boolean(view);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${SERVER_API_URL}/LyLich2/GetField/${
          view ? view : user.IDUser
        }/BaiBao_SangChe`,
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
          data.length > 0 ? (!viewer ? [...data, emptyRow] : data) : [emptyRow];
        setRows.setState(rowsWithEmpty);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = useCallback(
    (index: number, key: string, value: string | boolean) => {
      setRows.setItem(index, { ...rows[index], [key]: value });

      // Kiểm tra nếu dòng hiện tại có dữ liệu và dòng tiếp theo chưa tồn tại
      if (
        index === rows.length - 1 &&
        textFields.some((field) => (rows[index][field] as string)?.trim())
      ) {
        setRows.append(emptyRow);
      }

      // Xóa các dòng trống dư thừa (trừ dòng cuối)
      setRows.setState((prev) =>
        prev.filter(
          (row, i) =>
            i === prev.length - 1 ||
            textFields.some((field) => (row[field] as string)?.trim()) ||
            row.laTacGiaChinh ||
            row["5NamCuoi"]
        )
      );
    },
    [setRows, rows]
  );

  const handleSaveChanges = async () => {
    const id = notifications.show({
      loading: true,
      title: "Hành động",
      message: "Đang lưu thay đổi...",
      autoClose: false,
      withCloseButton: false,
    });

    const nonEmptyRows = rows.filter((row) =>
      textFields.some((field) => (row[field] as string)?.trim())
    );

    // Kiểm tra nếu không có dữ liệu hợp lệ để lưu
    if (nonEmptyRows.length === 0) {
      notifications.update({
        id,
        color: "yellow",
        title: "Không có thay đổi",
        message: "Không có dữ liệu hợp lệ để lưu.",
        icon: <IconAlertTriangle size={18} />,
        loading: false,
        autoClose: 3000,
      });
      return;
    }

    // Kiểm tra xem có hàng nào thiếu thông tin bắt buộc không
    const invalidIndex = nonEmptyRows.findIndex(
      (row) =>
        !row.soTacGia?.trim() ||
        !row.soTacGiaChinh?.trim() ||
        !row.diemCham?.trim()
    );
    if (invalidIndex !== -1) {
      notifications.update({
        id,
        color: "red",
        title: "Lỗi",
        message: `Vui lòng điền đầy đủ thông tin bắt buộc ở dòng ${
          invalidIndex + 1
        }.`,
        icon: <IconX size={18} />,
        loading: false,
        autoClose: false,
        withCloseButton: true,
      });
      return; // Thoát ngay, không thực hiện tiếp
    }

    const baiBaoData = nonEmptyRows
      .map((row) => {
        if (row.diemCham) {
          return {
            ...row,
            diemQuyDoi:
              row.diemCham == 0
                ? 0
                : row.laTacGiaChinh == true
                ? (
                    Number(row.diemCham) / 3 / Number(row.soTacGiaChinh) +
                    (2 * Number(row.diemCham)) / 3 / Number(row.soTacGia)
                  ).toFixed(2)
                : (
                    (2 * Number(row.diemCham)) /
                    3 /
                    Number(row.soTacGia)
                  ).toFixed(2),
          };
        } else {
          return row;
        }
      })
      .filter(Boolean);

    try {
      const res = await axios.put(
        `${SERVER_API_URL}/LyLich2/Update/info/${user.IDUser}`,
        {
          idLyLich: user.IDUser,
          baiBao_SangChe: JSON.stringify(baiBaoData),
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

      <Table.ScrollContainer minWidth={500}>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>STT</Table.Th>
              {[
                "Tên bằng độc quyền sáng chế, giải pháp hữu ích",
                "Tên tác giả",
                "Số tác giả",
                "Số tác giả chính",
                "Là tác giả chính",
                "Tên cơ quan cấp",
                "Ngày cấp",
                "5 năm cuối",
                "Điểm chấm",
                "Điểm quy đổi",
              ].map((title, i) => (
                <Table.Th
                  key={i}
                  style={{
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    textAlign: "left",
                    minWidth: 150,
                  }}
                >
                  {title}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((row, index) => (
              <Table.Tr key={index}>
                <Table.Td>
                  <Text fw="bold">{index + 1}</Text>
                </Table.Td>
                <Table.Td>
                  <EditableCell
                    placeholder={"Tên bài báo..."}
                    value={row.tenBangDocQuyen}
                    onChange={(value) =>
                      handleInputChange(index, "tenBangDocQuyen", value)
                    }
                    readOnly={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  <EditableCell
                    placeholder={"Tên tác giả..."}
                    value={row.tenTacGia}
                    onChange={(value) =>
                      handleInputChange(index, "tenTacGia", value)
                    }
                    readOnly={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  <EditableCell
                    placeholder={"Số tác giả..."}
                    value={row.soTacGia}
                    onChange={(value) =>
                      handleInputChange(index, "soTacGia", value)
                    }
                    readOnly={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  <EditableCell
                    placeholder={"Số tác giả chính..."}
                    value={row.soTacGiaChinh}
                    onChange={(value) =>
                      handleInputChange(index, "soTacGiaChinh", value)
                    }
                    readOnly={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  <Checkbox
                    checked={row.laTacGiaChinh}
                    onChange={(event) =>
                      handleInputChange(
                        index,
                        "laTacGiaChinh",
                        event.currentTarget.checked
                      )
                    }
                    disabled={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  <EditableCell
                    placeholder={"Cơ quan cấp..."}
                    value={row.tenCoQuanCap}
                    onChange={(value) =>
                      handleInputChange(index, "tenCoQuanCap", value)
                    }
                    readOnly={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  <EditableCell
                    placeholder={"Ngày cấp..."}
                    value={row.ngayCap}
                    onChange={(value) =>
                      handleInputChange(index, "ngayCap", value)
                    }
                    readOnly={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  <Checkbox
                    checked={row["5NamCuoi"]}
                    onChange={(event) =>
                      handleInputChange(
                        index,
                        "5NamCuoi",
                        event.currentTarget.checked
                      )
                    }
                    disabled={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  <EditableCell
                    placeholder={"0.00"}
                    value={row.diemCham}
                    onChange={(value) =>
                      handleInputChange(index, "diemCham", value)
                    }
                    readOnly={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  <NumberFormatter
                    value={
                      Number(row.diemQuyDoi) ||
                      (row.laTacGiaChinh == true
                        ? Number(row.diemCham) / 3 / Number(row.soTacGiaChinh) +
                          (2 * Number(row.diemCham)) / 3 / Number(row.soTacGia)
                        : (2 * Number(row.diemCham)) /
                          3 /
                          Number(row.soTacGia)) ||
                      0
                    }
                    decimalScale={2}
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

export default SangChe;
