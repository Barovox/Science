import { UserLogin } from "@/models/UserLogin";
import { SERVER_API_URL } from "@/utils/env";
import { Button, Flex, Table, Textarea } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useEffect } from "react";

const emptyKetQua = () => ({ caseStudy: "", noiDungCapNhat: "", ungDungKhac: "" });

const emptyRow = () => ({
  tenNhiemVu: "",
  vaiTro: "",
  maSo: "",
  thoiGianThucHien: "",
  thoiGianNghiemThu: "",
  ketQuaGiangDay: emptyKetQua(),
});

const initialValues = [emptyRow()];

const normalizeRow = (row: any) => ({
  ...row,
  ketQuaGiangDay:
    typeof row.ketQuaGiangDay === "object" && row.ketQuaGiangDay !== null
      ? row.ketQuaGiangDay
      : { caseStudy: row.ketQuaGiangDay || "", noiDungCapNhat: "", ungDungKhac: "" },
});

const hasKetQua = (kq: any) => {
  if (typeof kq === "object" && kq !== null) {
    return !!(kq.caseStudy || kq.noiDungCapNhat || kq.ungDungKhac);
  }
  return !!(kq || "").trim();
};

const ProvinceGrants = ({ view }: { view?: string }) => {
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
        }/DuAnThamGia_ProvinceGrants`,
        {
          headers: {
            Authorization: `Bearer ${user.Token}`,
          },
        }
      );

      if (res.status === 404) {
        console.log("Not found");
      } else if (res.status === 200) {
        const data = JSON.parse(res.data.value).map(normalizeRow);
        const rowsWithEmpty =
          data.length > 0
            ? !viewer
              ? [...data, emptyRow()]
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

    if (
      (updatedRows[index].tenNhiemVu ||
        updatedRows[index].vaiTro ||
        updatedRows[index].maSo ||
        updatedRows[index].thoiGianThucHien ||
        updatedRows[index].thoiGianNghiemThu ||
        hasKetQua(updatedRows[index].ketQuaGiangDay)) &&
      index === rows.length - 1
    ) {
      updatedRows.push(emptyRow());
    }

    const filteredRows = updatedRows.filter(
      (row: any, i: any) =>
        i === updatedRows.length - 1 ||
        row.tenNhiemVu.trim() !== "" ||
        row.vaiTro.trim() !== "" ||
        row.maSo.trim() !== "" ||
        row.thoiGianThucHien.trim() !== "" ||
        row.thoiGianNghiemThu.trim() !== "" ||
        hasKetQua(row.ketQuaGiangDay)
    );

    setRows.setState(filteredRows);
  };

  const handleKetQuaChange = (index: number, subKey: string, value: string) => {
    const updatedRows: any = [...rows];
    const kq = updatedRows[index].ketQuaGiangDay;
    updatedRows[index].ketQuaGiangDay = {
      ...(typeof kq === "object" && kq !== null ? kq : { caseStudy: kq || "", noiDungCapNhat: "", ungDungKhac: "" }),
      [subKey]: value,
    };

    if (
      (updatedRows[index].tenNhiemVu ||
        updatedRows[index].vaiTro ||
        updatedRows[index].maSo ||
        updatedRows[index].thoiGianThucHien ||
        updatedRows[index].thoiGianNghiemThu ||
        hasKetQua(updatedRows[index].ketQuaGiangDay)) &&
      index === rows.length - 1
    ) {
      updatedRows.push(emptyRow());
    }

    const filteredRows = updatedRows.filter(
      (row: any, i: any) =>
        i === updatedRows.length - 1 ||
        row.tenNhiemVu.trim() !== "" ||
        row.vaiTro.trim() !== "" ||
        row.maSo.trim() !== "" ||
        row.thoiGianThucHien.trim() !== "" ||
        row.thoiGianNghiemThu.trim() !== "" ||
        hasKetQua(row.ketQuaGiangDay)
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
          row.tenNhiemVu.trim() !== "" ||
          row.vaiTro.trim() !== "" ||
          row.maSo.trim() !== "" ||
          row.thoiGianThucHien.trim() !== "" ||
          row.thoiGianNghiemThu.trim() !== "" ||
          hasKetQua(row.ketQuaGiangDay)
      );

      const res = await axios.put(
        `${SERVER_API_URL}/LyLich2/Update/info/${user.IDUser}`,
        {
          idLyLich: user.IDUser,
          duAnThamGia_ProvinceGrants: JSON.stringify(nonEmptyRows),
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
              <Table.Th>Tên nhiệm vụ khoa học và công nghệ</Table.Th>
              <Table.Th>Vai trò</Table.Th>
              <Table.Th>Mã số</Table.Th>
              <Table.Th>Thời gian thực hiện</Table.Th>
              <Table.Th>Thời gian nghiệm thu (ngày, tháng, năm)/ Xếp loại KQ</Table.Th>
              <Table.Th>1. Case study/ học liệu/ bài tập/ đồ án được phát triển</Table.Th>
              <Table.Th>2. Nội dung cập nhật học phần/ cải tiến CTĐT</Table.Th>
              <Table.Th>3. Ứng dụng vào hoạt động khác</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((row, index) => {
              const kq = typeof row.ketQuaGiangDay === "object" && row.ketQuaGiangDay !== null
                ? row.ketQuaGiangDay
                : { caseStudy: row.ketQuaGiangDay || "", noiDungCapNhat: "", ungDungKhac: "" };
              return (
                <Table.Tr key={index}>
                  <Table.Td>
                    <Textarea
                      autosize
                      variant="unstyled"
                      placeholder={!viewer ? "Tên nhiệm vụ..." : ""}
                      value={row.tenNhiemVu}
                      onChange={(e) => handleInputChange(index, "tenNhiemVu", e.target.value)}
                      readOnly={viewer}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Textarea
                      autosize
                      variant="unstyled"
                      placeholder={!viewer ? "Vai trò..." : ""}
                      value={row.vaiTro}
                      onChange={(e) => handleInputChange(index, "vaiTro", e.target.value)}
                      readOnly={viewer}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Textarea
                      autosize
                      variant="unstyled"
                      placeholder={!viewer ? "Mã số..." : ""}
                      value={row.maSo}
                      onChange={(e) => handleInputChange(index, "maSo", e.target.value)}
                      readOnly={viewer}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Textarea
                      autosize
                      variant="unstyled"
                      placeholder={!viewer ? "Thời gian thực hiện..." : ""}
                      value={row.thoiGianThucHien}
                      onChange={(e) => handleInputChange(index, "thoiGianThucHien", e.target.value)}
                      readOnly={viewer}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Textarea
                      autosize
                      variant="unstyled"
                      placeholder={!viewer ? "Thời gian nghiệm thu..." : ""}
                      value={row.thoiGianNghiemThu}
                      onChange={(e) => handleInputChange(index, "thoiGianNghiemThu", e.target.value)}
                      readOnly={viewer}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Textarea
                      autosize
                      variant="unstyled"
                      placeholder={!viewer ? "Case study, học liệu, bài tập, đồ án..." : ""}
                      value={kq.caseStudy || ""}
                      onChange={(e) => handleKetQuaChange(index, "caseStudy", e.target.value)}
                      readOnly={viewer}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Textarea
                      autosize
                      variant="unstyled"
                      placeholder={!viewer ? "Nội dung cập nhật học phần, cải tiến CTĐT..." : ""}
                      value={kq.noiDungCapNhat || ""}
                      onChange={(e) => handleKetQuaChange(index, "noiDungCapNhat", e.target.value)}
                      readOnly={viewer}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Textarea
                      autosize
                      variant="unstyled"
                      placeholder={!viewer ? "Ứng dụng vào hoạt động khác..." : ""}
                      value={kq.ungDungKhac || ""}
                      onChange={(e) => handleKetQuaChange(index, "ungDungKhac", e.target.value)}
                      readOnly={viewer}
                    />
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </>
  );
};

export default ProvinceGrants;
