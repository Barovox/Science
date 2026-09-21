import EditableCell from "@/components/EditableCell/EditableCell";
import { UserLogin } from "@/models/UserLogin";
import { SERVER_API_URL } from "@/utils/env";
import {
  Button,
  Checkbox,
  Flex,
  NumberFormatter,
  Select,
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
  tenSach: "",
  tenTacGia: "",
  loaiSach: "",
  kyhieuLoaiSach: "",
  nxb: "",
  soTacGia: "",
  soChuBien: "",
  laChuBien: false,
  phanBienSoan: "",
  xacNhanCuaCoSoGDDH: "",
  "3NamCuoi": false,
  chuyenKhaoUyTin: false,
  diemToiDaCuaNXB: "",
  diemQuyDoi: 0,
  ghiChu: "",
};
const textFields = [
  "tenSach",
  "tenTacGia",
  "loaiSach",
  "kyhieuLoaiSach",
  "nxb",
  "soTacGia",
  "soChuBien",
  "phanBienSoan",
  "xacNhanCuaCoSoGDDH",
  "diemToiDaCuaNXB",
  "ghiChu",
];

const BookChapter = ({ view }: { view?: string }) => {
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
        }/BaiBao_BookChapter`,
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
        textFields.some((field) => (rows[index][field] as string).trim())
      ) {
        setRows.append(emptyRow);
      }

      // Xóa các dòng trống dư thừa (trừ dòng cuối)
      setRows.setState((prev) =>
        prev.filter(
          (row, i) =>
            i === prev.length - 1 ||
            textFields.some((field) => (row[field] as string)?.trim()) ||
            row.laChuBien ||
            row["3NamCuoi"] ||
            row.chuyenKhaoUyTin
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
      (row) => !row.diemToiDaCuaNXB?.trim()
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
        if (row.diemQuyDoi == 0) {
          return {
            ...row,
            diemQuyDoi:
              row.diemToiDaCuaNXB == 0
                ? 0
                : row.laChuBien == true
                ? (
                    Number(row.diemToiDaCuaNXB) / 3 / Number(row.soChuBien) +
                    (2 * Number(row.diemToiDaCuaNXB)) / 3 / row.soTacGia
                  ).toFixed(2)
                : (
                    (2 * Number(row.diemToiDaCuaNXB)) /
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
          baiBao_BookChapter: JSON.stringify(baiBaoData),
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
              {[
                "Tên sách",
                "Tên tác giả",
                "Loại sách (CK, GT, TK, HD)",
                "Nhà xuất bản và năm xuất bản",
                "Số tác giả",
                "Số người chủ biên",
                "Là chủ biên",
                "Phần biên soạn (từ trang ... đến trang)",
                "Xác nhận của cơ sở GDĐH (số văn bản xác nhận sử dụng sách)",
                "3 năm cuối",
                "Chuyên khảo uy tín trong nước/Thế giới sau TS/PGS",
                "Điểm tối đa của NXB theo công bố HDCDGSNN",
                "Điểm quy đổi",
                "Ghi chú",
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
                  <EditableCell
                    placeholder="Tên sách..."
                    value={row.tenSach}
                    onChange={(value) =>
                      handleInputChange(index, "tenSach", value)
                    }
                    readOnly={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  <EditableCell
                    placeholder="Tên tác giả..."
                    value={row.tenTacGia}
                    onChange={(value) =>
                      handleInputChange(index, "tenTacGia", value)
                    }
                    readOnly={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  {viewer ? (
                    <Text>{row.loaiSach}</Text>
                  ) : (
                    <Select
                      variant="unstyled"
                      placeholder="Loại sách..."
                      data={[
                        "Sách chuyên khảo_Viết một mình",
                        "Sách chuyên khảo_Chủ biên",
                        "Sách chuyên khảo_Viết chung",
                        "Chương sách do NXB uy tín thế giới xuất bản_Viết một mình",
                        "Chương sách do NXB uy tín thế giới xuất bản_Viết chung",
                        "Giáo trình_Viết một mình",
                        "Giáo trình_Chủ biên",
                        "Sách tham khảo",
                        "Sách hướng dẫn",
                      ]}
                      value={row.loaiSach}
                      onChange={(value, _) =>
                        handleInputChange(
                          index,
                          "loaiSach",
                          value?.toString() || ""
                        )
                      }
                    />
                  )}
                </Table.Td>
                <Table.Td>
                  <EditableCell
                    placeholder="NXB..."
                    value={row.nxb}
                    onChange={(value) => handleInputChange(index, "nxb", value)}
                    readOnly={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  <EditableCell
                    placeholder="Số tác giả..."
                    value={row.soTacGia}
                    onChange={(value) =>
                      handleInputChange(index, "soTacGia", value)
                    }
                    readOnly={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  <EditableCell
                    placeholder="Số chủ biên..."
                    value={row.soChuBien}
                    onChange={(value) =>
                      handleInputChange(index, "soChuBien", value)
                    }
                    readOnly={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  <Checkbox
                    checked={row.laChuBien}
                    onChange={(event) =>
                      handleInputChange(
                        index,
                        "laChuBien",
                        event.currentTarget.checked
                      )
                    }
                    disabled={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  <EditableCell
                    placeholder="Phân biên soạn..."
                    value={row.phanBienSoan}
                    onChange={(value) =>
                      handleInputChange(index, "phanBienSoan", value)
                    }
                    readOnly={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  <EditableCell
                    placeholder="Xác nhận..."
                    value={row.xacNhanCuaCoSoGDDH}
                    onChange={(value) =>
                      handleInputChange(index, "xacNhanCuaCoSoGDDH", value)
                    }
                    readOnly={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  <Checkbox
                    checked={row["3NamCuoi"]}
                    onChange={(event) =>
                      handleInputChange(
                        index,
                        "3NamCuoi",
                        event.currentTarget.checked
                      )
                    }
                    disabled={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  <Checkbox
                    checked={row.chuyenKhaoUyTin}
                    onChange={(event) =>
                      handleInputChange(
                        index,
                        "chuyenKhaoUyTin",
                        event.currentTarget.checked
                      )
                    }
                    disabled={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  <EditableCell
                    placeholder="Điểm tối đa..."
                    value={row.diemToiDaCuaNXB}
                    onChange={(value) =>
                      handleInputChange(index, "diemToiDaCuaNXB", value)
                    }
                    readOnly={viewer}
                  />
                </Table.Td>
                <Table.Td>
                  <NumberFormatter
                    value={
                      Number(row.diemQuyDoi) ||
                      (row.diemToiDaCuaNXB == 0
                        ? 0
                        : row.laChuBien == true
                        ? Number(row.diemToiDaCuaNXB) /
                            3 /
                            Number(row.soChuBien) +
                          (2 * Number(row.diemToiDaCuaNXB)) / 3 / row.soTacGia
                        : (2 * Number(row.diemToiDaCuaNXB)) /
                          3 /
                          Number(row.soTacGia)) ||
                      0
                    }
                    decimalScale={2}
                  />
                </Table.Td>
                <Table.Td>
                  <EditableCell
                    placeholder="Ghi chú..."
                    value={row.ghiChu}
                    onChange={(value) =>
                      handleInputChange(index, "ghiChu", value)
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

export default BookChapter;
