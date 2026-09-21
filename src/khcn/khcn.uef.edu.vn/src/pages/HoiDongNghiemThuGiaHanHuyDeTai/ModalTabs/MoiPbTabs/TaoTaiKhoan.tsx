import { UserLogin } from "@/models/UserLogin";
import { countries } from "@/utils/countries";
import { MAILER_API_URL, SERVER_API_URL } from "@/utils/env";
import { getCurrentDomain } from "@/utils/url";
import {
  Button,
  Checkbox,
  Fieldset,
  Grid,
  Select,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useCallback, useState } from "react";

const inputValue = {
  chucDanh: "",
  hoTen: "",
  email: "",
  linhVucChuyenMon: "",
  coQuanCongTac: "",
  quocGia: "",
};

const TaoTaiKhoan = ({
  baiBaoData,
  isMultiBB = false,
  danhSachBaiBao = [],
}: {
  baiBaoData: any;
  isMultiBB?: boolean;
  danhSachBaiBao?: any[];
}) => {
  const user: UserLogin = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string
  );

  const [createForm, setCreateForm] = useState<any>(inputValue);
  const [message, setMessage] = useState("");
  const [sendMailAndInvite, setSendMailAndInvite] = useState(false);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  const handleInputChange = useCallback(
    (key: string, value: string) => {
      setCreateForm({ ...createForm, [key]: value });
    },
    [setCreateForm, createForm]
  );

  const handleCreateAccount = async (e: Event) => {
    e.preventDefault();

    setIsWaiting(true);

    const id = notifications.show({
      loading: true,
      title: "Hành động",
      message: "Đang tạo tài khoản nghiệm thu...",
      autoClose: false,
      withCloseButton: false,
    });

    try {
      const res = await axios.post(
        `${SERVER_API_URL}/HoiDongKhoaHoc/Send`,
        JSON.stringify(createForm),
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
          message: `Đã tạo tài khoản nghiệm thu thành công.${
            sendMailAndInvite
              ? ` Đang gửi lời mời nghiệm thu đến email "${createForm.email}".`
              : ""
          }`,
          icon: <IconCheck size={18} />,
          loading: false,
          autoClose: 5000,
        });
        if (sendMailAndInvite) {
          if (!isMultiBB) {
            await handleAddHoiDongToBaiBao();
            await handleSendMailToHoiDong();
          } else {
            for (const bbData of danhSachBaiBao) {
              await handleAddHoiDongToBaiBao(bbData);
              await handleSendMailToHoiDong(bbData);
            }
          }
        }
        handleClearForm();
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
    } finally {
      setIsWaiting(false);
    }
  };

  const handleAddHoiDongToBaiBao = async (bbData?: any) => {
    const baiBaoDataTemp = bbData ? bbData : baiBaoData;

    const danhSachHoiDong =
      ((
        await axios.get(
          `${SERVER_API_URL}/HDNghiemThuDT_CBGVNV/Get-danh-sach-hd-nghiem-thu?IDDanhMuc=${baiBaoDataTemp.idDanhMuc}`,
          {
            headers: {
              Authorization: `Bearer ${user.Token}`,
              "Content-Type": "application/json",
            },
          }
        )
      ).data as any[]) || [];
    danhSachHoiDong.push({
      email: createForm.email,
      hoTen: createForm.hoTen,
      invitedAt: new Date().toLocaleString(),
      status: "-",
    });

    try {
      const res = await axios.post(
        `${SERVER_API_URL}/HDNghiemThuDT_CBGVNV/Add-hdnt-vao-bai-bao`,
        {
          idDanhMuc: baiBaoDataTemp.idDanhMuc,
          danhSachHDNghiemThu: JSON.stringify(danhSachHoiDong),
        },
        {
          headers: {
            Authorization: `Bearer ${user.Token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        notifications.show({
          color: "teal",
          title: "Hành động",
          message: `Đã thêm "${createForm.hoTen}" vào bài báo.`,
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.log(error);
      notifications.show({
        color: "red",
        title: "Lỗi",
        message: `Xảy ra lỗi: ${error}`,
        autoClose: 5000,
      });
    }
  };

  const handleCreateHoiDongToken = async () => {
    const body = {
      email: createForm.email,
      isMoiHDKH: true,
    };
    const hoiDongToken = await axios.post(
      `${SERVER_API_URL}/HoiDongKhoaHoc/login-by-email`,
      body,
      {
        headers: {
          Authorization: `Bearer ${user.Token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return hoiDongToken.data.token;
  };

  const handleSendMailToHoiDong = async (bbData?: any) => {
    const baiBaoDataTemp = bbData ? bbData : baiBaoData;
    const hoiDongToken = await handleCreateHoiDongToken();
    const domain = getCurrentDomain();

    const mailData = {
      tenBaiBao: baiBaoDataTemp.tenBaiBao,
      chucDanh: createForm.chucDanh,
      hoTen: createForm.hoTen,
      ...(message && { messageFromAuthor: message }), // Chỉ thêm nếu message khác rỗng
      ACCEPT_API_URL: `${domain}/invite?action=accept&idDanhMuc=${baiBaoDataTemp.idDanhMuc}&request=${hoiDongToken}&from=nghiem-thu`,
      DECLINE_API_URL: `${domain}/invite?action=decline&idDanhMuc=${baiBaoDataTemp.idDanhMuc}&request=${hoiDongToken}&from=nghiem-thu`,
    };

    try {
      const res = await axios.post(
        `${MAILER_API_URL}/send-email/${
          message ? "gui-nghiem-thu-kem-tin-nhan" : "gui-nghiem-thu"
        }`,
        {
          to: createForm.email,
          mailData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        notifications.show({
          color: "teal",
          title: "Hành động",
          message: `Đã gửi lời mời ${message && "kèm lời nhắn"} đến email "${
            createForm.email
          }".`,
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearForm = () => {
    setCreateForm(inputValue);
    setMessage("");
    setSendMailAndInvite(false);
  };

  return (
    <>
      <form onSubmit={(e: any) => handleCreateAccount(e)}>
        <Grid>
          <Grid.Col span={6}>
            <Fieldset legend="Thông tin cá nhân">
              <Select
                label="Chức danh"
                placeholder="Chọn chức danh"
                data={[
                  "",
                  "Ông",
                  "Bà",
                  "CN.",
                  "KS.",
                  "ThS.",
                  "TS.",
                  "PGS. TS.",
                  "GS. TS.",
                ]}
                value={createForm.chucDanh}
                onChange={(value) => handleInputChange("chucDanh", value || "")}
                searchable
                nothingFoundMessage="Không tìm thấy..."
                clearable
                disabled={isWaiting}
              />
              <TextInput
                label="Họ tên"
                placeholder="Nguyễn Văn A"
                mt="md"
                value={createForm.hoTen}
                onChange={(e) => handleInputChange("hoTen", e.target.value)}
                required
                withAsterisk
                disabled={isWaiting}
              />
              <TextInput
                label="Email"
                placeholder="example@domain.com"
                mt="md"
                value={createForm.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                withAsterisk
                disabled={isWaiting}
              />
              <Select
                mt="md"
                label="Lĩnh vực chuyên môn"
                placeholder="Chọn lĩnh vực chuyên môn"
                data={[
                  "",
                  "Tài chính - Ngân hàng",
                  "Kinh doanh & Quản lý",
                  "Công nghệ & Kỹ thuật",
                  "Khoa học Xã hội",
                  "Kế toán - Kiểm toán",
                ]}
                value={createForm.linhVucChuyenMon}
                onChange={(value) =>
                  handleInputChange("linhVucChuyenMon", value || "")
                }
                searchable
                nothingFoundMessage="Không tìm thấy..."
                clearable
                disabled={isWaiting}
              />
              <TextInput
                label="Cơ quan công tác"
                placeholder="Đại học Kinh tế - Tài chính TP.HCM (UEF)..."
                mt="md"
                value={createForm.coQuanCongTac}
                onChange={(e) =>
                  handleInputChange("coQuanCongTac", e.target.value)
                }
                required
                withAsterisk
                disabled={isWaiting}
              />
              <Select
                mt="md"
                label="Quốc gia"
                placeholder="Chọn quốc gia"
                description="Mẹo: gõ từ khóa Quốc gia bằng tiếng Việt để tìm kiếm"
                data={["", ...countries]}
                limit={6}
                value={createForm.quocGia}
                onChange={(value) => handleInputChange("quocGia", value || "")}
                searchable
                nothingFoundMessage="Không tìm thấy..."
                clearable
                required
                withAsterisk
                disabled={isWaiting}
              />
            </Fieldset>
          </Grid.Col>

          <Grid.Col span={6}>
            <Fieldset legend="Tùy chọn">
              <Checkbox
                checked={sendMailAndInvite}
                onChange={(event) =>
                  setSendMailAndInvite(event.currentTarget.checked)
                }
                label="Gửi lời mời nghiệm thu qua email tài khoản đăng ký sau khi tạo."
                disabled={isWaiting}
              />

              <Tooltip
                label={
                  !sendMailAndInvite
                    ? "Vui lòng tick chọn gửi email ở trên để có thể viết kèm lời nhắn"
                    : "Lời nhắn sẽ gửi kèm trong email"
                }
              >
                <Textarea
                  mt="md"
                  label="Lời nhắn"
                  placeholder="Nhập lời nhắn..."
                  value={message}
                  onChange={(event) => setMessage(event.currentTarget.value)}
                  disabled={isWaiting || !sendMailAndInvite}
                />
              </Tooltip>
            </Fieldset>

            <Button mt="md" fullWidth type="submit" loading={isWaiting}>
              {!sendMailAndInvite
                ? "Tạo tài khoản"
                : sendMailAndInvite &&
                  `Tạo và gửi lời mời${isMultiBB ? " hàng loạt" : ""} đến ${
                    message ? " (kèm lời nhắn)" : ""
                  }`}
            </Button>
          </Grid.Col>
        </Grid>
      </form>
    </>
  );
};

export default TaoTaiKhoan;
