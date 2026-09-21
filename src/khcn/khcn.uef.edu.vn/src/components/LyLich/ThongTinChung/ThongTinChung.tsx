import { UserLogin } from "@/models/UserLogin";
import { SERVER_API_URL } from "@/utils/env";
import {
  Button,
  Fieldset,
  Group,
  ScrollArea,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";

const FormContent = () => {
  const user: UserLogin = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string
  );

  const [donViCongTacList, setDonViCongTacList] = useState<string[]>([]);

  const [row, setRow] = useState({
    hoTen: user.HoTen || "",
    gioiTinh: "",
    namSinh: "",
    noiSinh: "",
    queQuan: "",
    diaChi: "",
    sdt: "",
    email: "",
    totNghiepCN: "",
    donViCongTac: "",
    chucVu: "",
    hocHam: "",
    linhVucNghienCuu: "",
    ngoaiNgu: "",
    link_scopus: "",
    link_hIndexed: "",
    link_citications: "",
    link_orcid: "",
    link_researchgate: "",
    link_googleScholar: "",
  });

  useEffect(() => {
    fetchData();
    fetchDonViCongTac();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${SERVER_API_URL}/LyLich2/GetField/${user.IDUser}/ThongTinChung`,
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
        const rowsWithEmpty = data
          ? data
          : {
              hoTen: user.HoTen || "",
              gioiTinh: "",
              namSinh: "",
              noiSinh: "",
              queQuan: "",
              diaChi: "",
              sdt: "",
              email: "",
              totNghiepCN: "",
              donViCongTac: "",
              chucVu: "",
              hocHam: "",
              linhVucNghienCuu: "",
              ngoaiNgu: "",
              link_scopus: "",
              link_hIndexed: "",
              link_citications: "",
              link_orcid: "",
              link_researchgate: "",
              link_googleScholar: "",
            };
        setRow(rowsWithEmpty);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDonViCongTac = async () => {
    try {
      const res = await axios.get(
        `${SERVER_API_URL}/DanhMucXetDuyet/GetAll-DonViCongTac`,
        {
          headers: {
            Authorization: `Bearer ${user.Token}`,
          },
        }
      );

      if (res.status === 200) {
        const arrayData: string[] = res.data;

        const uniqueDonViCongTac: string[] = Array.from(
          new Set(
            arrayData
              .filter(
                (item: string): item is string =>
                  item != null && !item.startsWith("NCM")
              )
              .map((item: string) => item.split(",")[0])
          )
        );

        setDonViCongTacList(uniqueDonViCongTac);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setRow({
      ...row,
      [key]: value,
    });
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

    try {
      const res = await axios.put(
        `${SERVER_API_URL}/LyLich2/Update/info/${user.IDUser}`,
        {
          idLyLich: user.IDUser,
          thongTinChung: JSON.stringify(row),
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
        modals.closeAll();
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
      <Text c="gray" mb="sm" fs="italic">
        Các trường <span style={{ color: "red" }}>*</span> là bắt buộc
      </Text>
      <form onSubmit={(e: any) => handleSaveChanges(e)}>
        <Fieldset legend="Thông tin cá nhân">
          <Group grow>
            <TextInput
              label="Họ tên"
              value={row.hoTen}
              onChange={(e) => handleInputChange("hoTen", e.target.value)}
              required
            />
            <Select
              label="Giới tính"
              data={["Nam", "Nữ"]}
              value={row.gioiTinh}
              onChange={(_value) =>
                handleInputChange("gioiTinh", _value as string)
              }
              required
            />
            <TextInput
              label="Năm sinh"
              value={row.namSinh}
              onChange={(e) => handleInputChange("namSinh", e.target.value)}
              required
            />
          </Group>
          <Group grow mt="md">
            <TextInput
              label="Nơi sinh"
              value={row.noiSinh}
              onChange={(e) => handleInputChange("noiSinh", e.target.value)}
            />
            <TextInput
              label="Quê quán"
              value={row.queQuan}
              onChange={(e) => handleInputChange("queQuan", e.target.value)}
            />
          </Group>
          <Group grow mt="md">
            <TextInput
              label="Địa chỉ"
              value={row.diaChi}
              onChange={(e) => handleInputChange("diaChi", e.target.value)}
            />
            <TextInput
              label="SĐT / Zalo"
              value={row.sdt}
              onChange={(e) => handleInputChange("sdt", e.target.value)}
              required
            />
            <TextInput
              label="Email"
              value={row.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </Group>
        </Fieldset>
        <TextInput
          mt="md"
          label="Tốt nghiệp ĐH chuyên ngành"
          placeholder="Ngành...; Tại: Trường Đại học ..."
          value={row.totNghiepCN}
          onChange={(e) => handleInputChange("totNghiepCN", e.target.value)}
        />
        <Group grow mt="md">
          <Select
            label="Đơn vị công tác"
            data={donViCongTacList}
            value={row.donViCongTac}
            onChange={(_value) =>
              handleInputChange("donViCongTac", _value as string)
            }
            searchable
            allowDeselect
            nothingFoundMessage="Không tìm thấy đơn vị này..."
            required
          />
          <TextInput
            label="Chức vụ"
            value={row.chucVu}
            onChange={(e) => handleInputChange("chucVu", e.target.value)}
            required
          />
        </Group>
        <TextInput
          mt="md"
          label="Học hàm, Học vị"
          placeholder="Thạc sĩ/Tiến sĩ; năm: -2023; Chuyên ngành: …; Tại: Trường Đại học …"
          value={row.hocHam}
          onChange={(e) => handleInputChange("hocHam", e.target.value)}
        />
        <Group grow mt="md">
          <TextInput
            label="Lĩnh vực nghiên cứu"
            value={row.linhVucNghienCuu}
            onChange={(e) =>
              handleInputChange("linhVucNghienCuu", e.target.value)
            }
          />
          <TextInput
            label="Ngoại ngữ"
            placeholder="Tiếng Anh, Tiếng Pháp"
            value={row.ngoaiNgu}
            onChange={(e) => handleInputChange("ngoaiNgu", e.target.value)}
          />
        </Group>

        <Fieldset legend="Liên kết ngoài" mt="md">
          <Group grow>
            <TextInput
              label="Link Scopus"
              value={row.link_scopus}
              onChange={(e) => handleInputChange("link_scopus", e.target.value)}
            />
            <TextInput
              mt="md"
              label="H-INDEXED (SCOPUS)"
              value={row.link_hIndexed}
              onChange={(e) =>
                handleInputChange("link_hIndexed", e.target.value)
              }
            />
            <TextInput
              mt="md"
              label="CITATIONS (SCOPUS)"
              value={row.link_citications}
              onChange={(e) =>
                handleInputChange("link_citications", e.target.value)
              }
            />
          </Group>
          <Group grow mt="md">
            <TextInput
              label="ORCID"
              value={row.link_orcid}
              onChange={(e) => handleInputChange("link_orcid", e.target.value)}
            />
            <TextInput
              label="Researchgate"
              value={row.link_researchgate}
              onChange={(e) =>
                handleInputChange("link_researchgate", e.target.value)
              }
            />
            <TextInput
              label="Google Scholar"
              value={row.link_googleScholar}
              onChange={(e) =>
                handleInputChange("link_googleScholar", e.target.value)
              }
            />
          </Group>
        </Fieldset>

        <Button
          color="green"
          fullWidth
          mt="lg"
          leftSection={<IconDeviceFloppy size={18} stroke={1.8} />}
          type="submit"
        >
          Lưu thay đổi
        </Button>
      </form>
    </>
  );
};

const ThongTinChung = ({ hideCloseButton }: { hideCloseButton?: boolean }) => {
  // @ts-ignore
  const [isModalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  const handleOpenModal = () => {
    modals.open({
      title: "Chỉnh sửa hồ sơ",
      withCloseButton: hideCloseButton ? false : true,
      closeOnClickOutside: false,
      scrollAreaComponent: ScrollArea.Autosize,
      size: "55rem",
      onClose: closeModal,
      children: <FormContent />,
    });
  };

  return (
    <>
      <Button variant="default" fullWidth onClick={handleOpenModal}>
        Chỉnh sửa hồ sơ
      </Button>
    </>
  );
};

export default ThongTinChung;
