import { UserLogin } from "@/models/UserLogin";
import { ASSETS_KHCN_URL, SERVER_API_URL } from "@/utils/env";
import {
  ActionIcon,
  Anchor,
  Button,
  Checkbox,
  Group,
  Modal,
  NumberInput,
  ScrollArea,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { IconBook, IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useCallback, useState } from "react";

const initialValue = {
  tenBaiBao: "",
  soTacGia: "0",
  soTacGiaChinh: "0",
  laTacGiaChinh: false,
  tenTapChi: "",
  quocGia: "",
  loaiTapChi: "",
  hIndexed: "",
  tapSoTrang: "",
  ngayCongBo: "",
  cttd5nc: false, // Công trình tính điểm 5 năm gần nhất
  cttd1nc: false, // Công trình tính điểm 1 năm gần nhất
  diemToiDaTapChiCongBo: "",
  diemQuyDoi: 0,
  linkBaiBao: "",
  diemGiam: 0,
  diemUngVien: 0,
  ketQuaGiangDay: {
    caseStudy: "",
    minhChung1: "",
    noiDungCapNhat: "",
    minhChung2: "",
    ungDungKhac: "",
    minhChung3: "",
  },
};

const MinhChungUpload = ({
  label,
  index,
  filename,
  loading,
  onUpload,
  onDelete,
}: {
  label: string;
  index: 1 | 2 | 3;
  filename: string;
  loading: boolean;
  onUpload: (index: 1 | 2 | 3, file: File) => void;
  onDelete: (index: 1 | 2 | 3, filename: string) => void;
}) => {
  const displayName = filename ? filename.replace(/^\d+-/, "") : "";
  const fileUrl = filename ? `${ASSETS_KHCN_URL}/uploads/${filename}` : "";

  return (
    <Group mt="xs" align="center" gap="sm" wrap="nowrap">
      <Text fw="bold" size="sm" style={{ whiteSpace: "nowrap" }}>{label}:</Text>
      <Button
        component="label"
        color="blue"
        size="xs"
        loading={loading}
        style={{ cursor: "pointer" }}
      >
        Chọn file
        <input
          type="file"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(index, file);
          }}
        />
      </Button>
      {filename ? (
        <Group gap={4} wrap="nowrap" style={{ flex: 1, overflow: "hidden" }}>
          <Anchor href={fileUrl} target="_blank" size="xs" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {displayName}
          </Anchor>
          <ActionIcon size="xs" color="red" variant="transparent" onClick={() => onDelete(index, filename)} title="Xóa">
            <IconX size={12} />
          </ActionIcon>
        </Group>
      ) : (
        <Text size="xs" c="dimmed">Ví dụ: (pdf, jpg, docx, …)</Text>
      )}
    </Group>
  );
};

const ButtonThemBB = ({
  currentData,
  field,
  handleRefresh,
}: {
  currentData: any;
  field: string;
  handleRefresh: () => Promise<void>;
}) => {
  const user: UserLogin = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string
  );

  const [row, setRow] = useState<any>(initialValue);
  const [opened, setOpened] = useState(false);

  const handleInputChange = useCallback(
    (key: string, value: string | boolean) => {
      setRow({ ...row, [key]: value });
    },
    [setRow, row]
  );

  const handleKetQuaChange = useCallback(
    (subKey: string, value: string) => {
      setRow((prev: any) => ({
        ...prev,
        ketQuaGiangDay: { ...prev.ketQuaGiangDay, [subKey]: value },
      }));
    },
    []
  );

  const [uploadingMC, setUploadingMC] = useState<number | null>(null);

  const handleUploadMinhChung = async (index: 1 | 2 | 3, file: File) => {
    setUploadingMC(index);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${ASSETS_KHCN_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200) {
        handleKetQuaChange(`minhChung${index}`, res.data.file.filename);
        notifications.show({
          color: "teal",
          title: "Thành công",
          message: `Đã tải lên: ${file.name}`,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      notifications.show({
        color: "red",
        title: "Lỗi tải file",
        message: "Không thể tải file lên. Vui lòng kiểm tra kết nối và thử lại.",
        autoClose: 5000,
      });
    } finally {
      setUploadingMC(null);
    }
  };

  const handleDeleteMinhChung = async (index: 1 | 2 | 3, filename: string) => {
    try {
      await axios.delete(`${ASSETS_KHCN_URL}/files/${filename}`);
    } catch (error) {
      console.error(error);
    }
    handleKetQuaChange(`minhChung${index}`, "");
  };

  const handleSaveChanges = async (e: Event) => {
    e.preventDefault();

    const id = notifications.show({
      loading: true,
      title: "Hành động",
      message: "Đang lưu thay đổi...",
      autoClose: false,
      withCloseButton: false,
    });

    const baiBaoData = [
      ...currentData,
      {
        ...row,
        diemQuyDoi:
          row.soTacGiaChinh == 0
            ? 0
            : row.laTacGiaChinh == true
            ? (
                Number(row.diemToiDaTapChiCongBo) /
                  3 /
                  Number(row.soTacGiaChinh) +
                (2 * Number(row.diemToiDaTapChiCongBo)) /
                  3 /
                  Number(row.soTacGia)
              ).toFixed(2)
            : (
                (2 * Number(row.diemToiDaTapChiCongBo)) /
                3 /
                Number(row.soTacGia)
              ).toFixed(2),
        diemGiam: row.diemToiDaTapChiCongBo
          ? (Number(row.diemToiDaTapChiCongBo) * 0.75).toFixed(3)
          : 0,
        diemUngVien: row.diemToiDaTapChiCongBo
          ? row.laTacGiaChinh
            ? (
                Number(row.diemToiDaTapChiCongBo) * 0.75 * (1 / 3) +
                ((2 / 3) * (Number(row.diemToiDaTapChiCongBo) * 0.75)) /
                  Number(row.soTacGia)
              ).toFixed(2)
            : (
                ((2 / 3) * (Number(row.diemToiDaTapChiCongBo) * 0.75)) /
                Number(row.soTacGia)
              ).toFixed(2)
          : 0,
      },
    ];

    try {
      const res = await axios.put(
        `${SERVER_API_URL}/LyLich2/Update/info/${user.IDUser}`,
        {
          idLyLich: user.IDUser,
          [field]: JSON.stringify(baiBaoData),
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

        handleCloseModal();
        await handleRefresh();
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

  const handleCloseModal = () => {
    setRow(initialValue);
    setOpened(false);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleCloseModal}
        title="Thêm bài báo/báo cáo KH"
        size="55rem"
        centered
        scrollAreaComponent={ScrollArea.Autosize}
        closeOnClickOutside={false}
      >
        <form onSubmit={(e: any) => handleSaveChanges(e)}>
          <TextInput
            label="Tên bài báo"
            placeholder="Nhập tên bài báo"
            value={row.tenBaiBao}
            onChange={(e) =>
              handleInputChange("tenBaiBao", e.currentTarget.value)
            }
            required
          />

          <Group mt="md" grow>
            <NumberInput
              label="Số tác giả"
              placeholder="Nhập số tác giả"
              value={row.soTacGia}
              onChange={(value) =>
                handleInputChange("soTacGia", value.toString())
              }
              min={0}
              required
            />

            <NumberInput
              label="Số tác giả chính"
              placeholder="Nhập số tác giả chính"
              value={row.soTacGiaChinh}
              onChange={(value) =>
                handleInputChange("soTacGiaChinh", value.toString())
              }
              min={0}
              required
            />
          </Group>

          <Checkbox
            mt="md"
            label="Là tác giả chính"
            checked={row.laTacGiaChinh}
            onChange={(event) =>
              handleInputChange("laTacGiaChinh", event.currentTarget.checked)
            }
          />

          <Group mt="md" grow>
            <TextInput
              label="Tên tạp chí"
              placeholder="Nhập tên tạp chí"
              value={row.tenTapChi}
              onChange={(e) =>
                handleInputChange("tenTapChi", e.currentTarget.value)
              }
              required
            />
            <TextInput
              label="Quốc gia"
              placeholder="Nhập quốc gia"
              value={row.quocGia}
              onChange={(e) =>
                handleInputChange("quocGia", e.currentTarget.value)
              }
              required
            />
            <TextInput
              label="Loại tạp chí"
              placeholder="Nhập loại tạp chí"
              value={row.loaiTapChi}
              onChange={(e) =>
                handleInputChange("loaiTapChi", e.currentTarget.value)
              }
              required
            />
          </Group>

          <Group mt="md" grow>
            <TextInput
              label="Link hoặc DOI của bài báo (nếu có)"
              placeholder="Link hoặc DOI"
              value={row.linkBaiBao}
              onChange={(e) =>
                handleInputChange("linkBaiBao", e.currentTarget.value)
              }
            />
            <TextInput
              label="Tập, số, trang"
              placeholder="Tập, số, trang"
              value={row.tapSoTrang}
              onChange={(e) =>
                handleInputChange("tapSoTrang", e.currentTarget.value)
              }
              required
            />
            <MonthPickerInput
              label="Tháng, năm công bố"
              placeholder="01/2000"
              valueFormat="MM/YYYY"
              clearable
              value={row.ngayCongBo || null}
              onChange={(value) =>
                handleInputChange("ngayCongBo", value as any)
              }
              required
            />
          </Group>

          <NumberInput
            mt="md"
            label="Điểm tối đa của tạp chí theo công bố HDCDGSNN"
            placeholder="Nhập điểm"
            value={row.diemToiDaTapChiCongBo}
            onChange={(value) =>
              handleInputChange("diemToiDaTapChiCongBo", value.toString())
            }
            min={0}
            required
          />

          <Text mt="md" fw="bold" size="sm" c="blue" td="underline">
            Thầy Cô mô tả thông tin đóng góp của nghiên cứu này vào hoạt động giảng dạy tại UEF:
          </Text>

          <Text mt="sm" fw="bold" size="sm">
            1. Case study/ học liệu/ bài tập/ đồ án được phát triển có tham khảo kết quả nghiên cứu
          </Text>
          <Textarea
            mt={4}
            placeholder="Ví dụ: slide bài giảng học phần … bài số …, slide số …; tài liệu học tập học phần … trang 15-25; …"
            value={row.ketQuaGiangDay.caseStudy}
            onChange={(e) => handleKetQuaChange("caseStudy", e.currentTarget.value)}
            autosize
            minRows={2}
          />
          <MinhChungUpload
            label="Minh chứng đính kèm"
            index={1}
            filename={row.ketQuaGiangDay.minhChung1}
            loading={uploadingMC === 1}
            onUpload={handleUploadMinhChung}
            onDelete={handleDeleteMinhChung}
          />

          <Text mt="sm" fw="bold" size="sm">
            2. Nội dung cập nhật học phần/ cải tiến CTĐT có tham khảo kết quả nghiên cứu
          </Text>
          <Textarea
            mt={4}
            placeholder="Ví dụ: bài 1 bổ sung dữ liệu nghiên cứu vào trang số …, cập nhật cấu trúc bài 3 trong đề cương CTĐT học phần …; tài liệu học tập trang 15-25; …"
            value={row.ketQuaGiangDay.noiDungCapNhat}
            onChange={(e) => handleKetQuaChange("noiDungCapNhat", e.currentTarget.value)}
            autosize
            minRows={2}
          />
          <MinhChungUpload
            label="Minh chứng đính kèm"
            index={2}
            filename={row.ketQuaGiangDay.minhChung2}
            loading={uploadingMC === 2}
            onUpload={handleUploadMinhChung}
            onDelete={handleDeleteMinhChung}
          />

          <Text mt="sm" fw="bold" size="sm">3. Ứng dụng vào hoạt động khác:</Text>
          <Textarea
            mt={4}
            placeholder="Ví dụ: thiết kế cuộc thi sáng tạo sinh viên …"
            value={row.ketQuaGiangDay.ungDungKhac}
            onChange={(e) => handleKetQuaChange("ungDungKhac", e.currentTarget.value)}
            autosize
            minRows={2}
          />
          <MinhChungUpload
            label="Minh chứng đính kèm"
            index={3}
            filename={row.ketQuaGiangDay.minhChung3}
            loading={uploadingMC === 3}
            onUpload={handleUploadMinhChung}
            onDelete={handleDeleteMinhChung}
          />

          <Group mt="md" gap="xl">
            <Checkbox
              label="Chọn công trình tính điểm 5 năm cuối"
              checked={row.cttd5nc}
              onChange={(event) =>
                handleInputChange("cttd5nc", event.currentTarget.checked)
              }
            />
            <Checkbox
              label="Chọn công trình tính điểm 1 năm cuối"
              checked={row.cttd1nc}
              onChange={(event) =>
                handleInputChange("cttd1nc", event.currentTarget.checked)
              }
            />
          </Group>

          <Group mt="md" grow>
            <NumberInput
              label="Điểm quy đổi"
              value={
                Number(row.diemQuyDoi) ||
                (row.soTacGiaChinh == 0
                  ? 0
                  : row.laTacGiaChinh == true
                  ? Number(row.diemToiDaTapChiCongBo) /
                      3 /
                      Number(row.soTacGiaChinh) +
                    (2 * Number(row.diemToiDaTapChiCongBo)) /
                      3 /
                      Number(row.soTacGia)
                  : (2 * Number(row.diemToiDaTapChiCongBo)) /
                    3 /
                    Number(row.soTacGia)) ||
                0
              }
              decimalScale={2}
              onFocus={(e) => e.target.blur()}
            />

            <NumberInput
              label="Điểm giảm"
              value={
                Number(row.diemGiam) ||
                (row.diemToiDaTapChiCongBo
                  ? Number(row.diemToiDaTapChiCongBo) * 0.75
                  : 0) ||
                0
              }
              decimalScale={3}
              onFocus={(e) => e.target.blur()}
            />

            <NumberInput
              label="Điểm ứng viên"
              value={
                Number(row.diemUngVien) ||
                (row.diemToiDaTapChiCongBo
                  ? row.laTacGiaChinh
                    ? Number(row.diemToiDaTapChiCongBo) * 0.75 * (1 / 3) +
                      ((2 / 3) * (Number(row.diemToiDaTapChiCongBo) * 0.75)) /
                        Number(row.soTacGia)
                    : ((2 / 3) * (Number(row.diemToiDaTapChiCongBo) * 0.75)) /
                      Number(row.soTacGia)
                  : 0) ||
                0
              }
              decimalScale={2}
              onFocus={(e) => e.target.blur()}
            />
          </Group>

          <Group mt="md" grow>
            <Button color="green" type="submit">
              Thêm bài báo
            </Button>
            <Button color="red" onClick={handleCloseModal}>
              Đóng
            </Button>
          </Group>
        </form>
      </Modal>

      <Button
        color="green"
        leftSection={<IconBook size={18} stroke={1.8} />}
        onClick={() => setOpened(true)}
      >
        Thêm bài báo
      </Button>
    </>
  );
};

export default ButtonThemBB;
