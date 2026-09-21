import { UserLogin } from "@/models/UserLogin";
import { SERVER_API_URL } from "@/utils/env";
import { Button, Checkbox, Modal, ScrollArea } from "@mantine/core";
import { useDisclosure, useListState } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useEffect } from "react";

const initialValues = [
  {
    label: "Xác nhận công khai hồ sơ (bao gồm thông tin cá nhân)",
    checked: false,
    key: "congKhai",
  },
  {
    label: "Quá trình Giảng dạy và Công tác",
    checked: false,
    key: "quaTrinhGiangDayCongTac",
  },
  {
    label: "Dự án đã tham gia: University Fund",
    checked: false,
    key: "duAnThamGia_UniversityFund",
  },
  {
    label: "Dự án đã tham gia: Province Grants",
    checked: false,
    key: "duAnThamGia_ProvinceGrants",
  },
  {
    label: "Dự án đã tham gia: National Grants",
    checked: false,
    key: "duAnThamGia_NationalGrants",
  },
  {
    label: "Dự án đã tham gia: International Grants",
    checked: false,
    key: "duAnThamGia_InternationalGrants",
  },
  {
    label: "Hướng dẫn: Master",
    checked: false,
    key: "huongDan_Master",
  },
  {
    label: "Hướng dẫn: PhD",
    checked: false,
    key: "huongDan_PhD",
  },
  {
    label: "Hướng dẫn: Postdoc",
    checked: false,
    key: "huongDan_Postdoc",
  },
  {
    label: "Bài báo: Thuộc chỉ mục WOS/Scopus",
    checked: false,
    key: "baiBao_ThuocWosScopus",
  },
  {
    label: "Bài báo: Quốc tế không thuộc chỉ mục WoS/Scopus",
    checked: false,
    key: "baiBao_QuocTeKhongThuocWosScopus",
  },
  {
    label: "Bài báo: Thuộc HDCDGSNN",
    checked: false,
    key: "baiBao_HDCDGSNN",
  },
  {
    label: "Bài báo: Conference",
    checked: false,
    key: "baiBao_Conference",
  },
  {
    label: "Bài báo: Book",
    checked: false,
    key: "baiBao_Book",
  },
  {
    label: "Bài báo: BookChapter",
    checked: false,
    key: "baiBao_BookChapter",
  },
  {
    label: "Bài báo: Sáng chế",
    checked: false,
    key: "baiBao_SangChe",
  },
  {
    label: "Giải thưởng: Trong nước",
    checked: false,
    key: "giaiThuong_TrongNuoc",
  },
  {
    label: "Giải thưởng: Quốc tế",
    checked: false,
    key: "giaiThuong_QuocTe",
  },
  {
    label: "Học phần, môn giảng dạy",
    checked: false,
    key: "hocPhanMonGiangDay",
  },
  {
    label: "Nhóm nghiên cứu UEF",
    checked: false,
    key: "nhomNghienCuuUEF",
  },
];

const ThongTinChung = () => {
  const [isModalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  const user: UserLogin = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string
  );

  const [rows, setRows] = useListState(initialValues);

  const allChecked = rows.every((value) => value.checked);
  const indeterminate = rows.some((value) => value.checked) && !allChecked;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${SERVER_API_URL}/LyLich2/GetField/${user.IDUser}/CongKhai`,
        {
          headers: {
            Authorization: `Bearer ${user.Token}`,
          },
        }
      );

      if (res.status === 404) {
        console.log("Not found");
      } else if (res.status === 200) {
        const data = JSON.parse(res.data.value) || [];

        // Chuyển đổi data từ API thành object để tra cứu nhanh
        const apiDataMap = data.reduce((acc: any, item: any) => {
          acc[item.key] = item;
          return acc;
        }, {} as Record<string, { label: string; checked: boolean; key: string }>);

        // Merge initialValues với data từ API
        const mergedData = initialValues.map((item) => {
          return apiDataMap[item.key]
            ? { ...item, checked: apiDataMap[item.key].checked }
            : item;
        });

        setRows.setState(mergedData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const items = rows.map((value, index) => (
    <Checkbox
      mt="xs"
      ml={33}
      label={value.label}
      key={value.key}
      checked={value.checked}
      onChange={(event) =>
        setRows.setItemProp(index, "checked", event.currentTarget.checked)
      }
    />
  ));

  const handleSaveChanges = async () => {
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
          congKhai: JSON.stringify(rows),
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
      <Modal
        opened={isModalOpened}
        onClose={closeModal}
        title="Cài đặt công khai"
        scrollAreaComponent={ScrollArea.Autosize}
        closeOnClickOutside={false}
      >
        <Checkbox
          checked={allChecked}
          indeterminate={indeterminate}
          label="Công khai hồ sơ lý lịch cá nhân"
          onChange={() =>
            setRows.setState((current) =>
              current.map((value) => ({ ...value, checked: !allChecked }))
            )
          }
        />
        {items}

        <Button
          color="green"
          fullWidth
          mt="lg"
          leftSection={<IconDeviceFloppy size={18} stroke={1.8} />}
          onClick={handleSaveChanges}
        >
          Lưu thay đổi
        </Button>
      </Modal>

      <Button variant="default" fullWidth onClick={openModal}>
        Cài đặt công khai
      </Button>
    </>
  );
};

export default ThongTinChung;
