import { UserLogin } from "@/models/UserLogin";
import {
  FILTER_BY_SEARCH_HOI_DONG_KHOA_HOC,
  selectFilteredHoiDongKhoaHoc,
} from "@/redux/slice/filterSlice";
import { MAILER_API_URL, SERVER_API_URL } from "@/utils/env";
import { getCurrentDomain } from "@/utils/url";
import {
  Button,
  Center,
  Checkbox,
  Group,
  Loader,
  Modal,
  Select,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconPencil,
  IconSearch,
  IconUserPlus,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { countries } from "@/utils/countries";
import { modals } from "@mantine/modals";

const TimKiem = ({
  baiBaoData,
  onRefresh,
  isMultiBB = false,
  danhSachBaiBao = [],
}: {
  baiBaoData: any;
  onRefresh: () => Promise<void>;
  isMultiBB?: boolean;
  danhSachBaiBao?: any[];
}) => {
  const user: UserLogin = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string
  );

  const [dataLoaded, setDataLoaded] = useState(false);
  const [userList, setUserList] = useState<any>([]);
  const [selection, setSelection] = useState<any[]>([]);

  const [openedEdit, setOpenedEdit] = useState(false);
  const [loadingFetchInfo, setLoadingFetchInfo] = useState(false);
  const [hdId, setHdId] = useState("");
  const [hdEmail, setHdEmail] = useState("");
  const [hdHoTen, setHdHoTen] = useState("");
  const [hdChucDanh, setHdChucDanh] = useState("");
  const [hdCoQuanCongTac, setHdCoQuanCongTac] = useState("");
  const [hdLinhVucChuyenMon, setHdLinhVucChuyenMon] = useState("");
  const [hdQuocGia, setHdQuocGia] = useState("");
  const [waitUpdatingInfo, setWaitUpdatingInfo] = useState(false);

  const filteredHoiDongKhoaHoc = useSelector(selectFilteredHoiDongKhoaHoc);

  const [search, setSearch] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!dataLoaded) return;

    dispatch(
      FILTER_BY_SEARCH_HOI_DONG_KHOA_HOC({
        hoiDongKhoaHoc: userList,
        search,
      })
    );
  }, [dispatch, search, dataLoaded]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${SERVER_API_URL}/HoiDongKhoaHoc/Get-all-HDKH`,
        {
          headers: {
            Authorization: `Bearer ${user.Token}`,
          },
        }
      );

      if (res.status === 200) {
        let userList: any[] = res.data || [];
        if (userList) {
          if (!isMultiBB) {
            const danhSach = JSON.parse(baiBaoData.danhSachHDXetDuyet) as any[];

            const emailList: string[] = danhSach
              ? danhSach.reduce((acc: string[], user: any) => {
                  const email = user.email;
                  if (email && !acc.includes(email)) {
                    acc.push(email);
                  }
                  return acc;
                }, [])
              : [];

            // Lọc userList để chỉ lấy những người có email nằm trong emailList
            const filteredUsers = userList.filter(
              (user) => !emailList.includes(user.email)
            );

            // Nếu bạn cần dùng filteredUsers thay vì toàn bộ userList:
            setUserList(filteredUsers);
          } else {
            setUserList(userList);
          }
        } else {
          setUserList([]);
        }
        setDataLoaded(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleRow = (user: any) => {
    if (selection.some((u) => u.id === user.id)) {
      setSelection(selection.filter((u) => u.id !== user.id));
    } else {
      setSelection([...selection, user]);
    }
  };
  const toggleAll = () =>
    setSelection((current: number[]) =>
      current.length === userList.length ? [] : userList
    );

  const handleInviteHoiDong = async (hoiDong: any) => {
    await handleAddHoiDongToBaiBao(hoiDong);
  };

  const handleInviteMulti = async (
    hoiDong?: any,
    isMultiUser: boolean = false
  ) => {
    if (!isMultiUser) {
      for (const bbData of danhSachBaiBao) {
        await handleAddHoiDongToBaiBao(hoiDong, bbData);
      }
    } else {
      if (isMultiBB) {
        for (const bbData of danhSachBaiBao) {
          for (const hd of selection) {
            await handleAddHoiDongToBaiBao(hd, bbData);
          }
        }
      } else {
        for (const hd of selection) {
          await handleAddHoiDongToBaiBao(hd);
        }
      }
    }
  };

  const handleAddHoiDongToBaiBao = async (hoiDong: any, bbData?: any) => {
    const baiBaoDataTemp = bbData ? bbData : baiBaoData;

    const danhSachHoiDong =
      ((
        await axios.get(
          `${SERVER_API_URL}/HDXetDuyetDT_CBGVNV/Get-danh-sach-hd-xet-duyet?IDDanhMuc=${baiBaoDataTemp.idDanhMuc}`,
          {
            headers: {
              Authorization: `Bearer ${user.Token}`,
              "Content-Type": "application/json",
            },
          }
        )
      ).data as any[]) || [];

    const emailList: string[] = danhSachHoiDong
      ? danhSachHoiDong.reduce((acc: string[], user: any) => {
          const email = user.email;
          if (email && !acc.includes(email)) {
            acc.push(email);
          }
          return acc;
        }, [])
      : [];

    if (!emailList.includes(hoiDong.email)) {
      danhSachHoiDong.push({
        email: hoiDong.email,
        hoTen: hoiDong.hoTen,
        invitedAt: new Date().toLocaleString(),
        status: "-",
      });

      try {
        const res = await axios.post(
          `${SERVER_API_URL}/HDXetDuyetDT_CBGVNV/Add-hdxd-vao-bai-bao`,
          {
            idDanhMuc: baiBaoDataTemp.idDanhMuc,
            danhSachHDXetDuyet: JSON.stringify(danhSachHoiDong),
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
            message: `Đã thêm phản biện "${hoiDong.hoTen}" vào bài báo "${baiBaoDataTemp.tenBaiBao}".`,
            position: "bottom-left",
            autoClose: 5000,
          });
          handleSendMailToHoiDong(hoiDong, baiBaoDataTemp);
          await onRefresh();
        }
      } catch (error) {
        console.log(error);
        notifications.show({
          color: "red",
          title: "Lỗi",
          message: `Xảy ra lỗi: ${error}`,
          position: "bottom-left",
          autoClose: 5000,
        });
      }
    } else {
      notifications.show({
        color: "yellow",
        title: "Hành động",
        message: `Phản biện "${hoiDong.hoTen}" đã được gửi yêu cầu trước đó. Không thực hiện lại ở bài báo "${baiBaoDataTemp.tenBaiBao}"!`,
        position: "bottom-left",
        autoClose: 5000,
      });
    }
  };

  const handleCreateHoiDongToken = async (hoiDong: any) => {
    const body = {
      email: hoiDong.email,
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

  const handleSendMailToHoiDong = async (hoiDong: any, bbData?: any) => {
    const baiBaoDataTemp = bbData ? bbData : baiBaoData;
    const hoiDongToken = await handleCreateHoiDongToken(hoiDong);
    const domain = getCurrentDomain();

    const mailData = {
      tenBaiBao: baiBaoDataTemp.tenBaiBao,
      chucDanh: hoiDong.chucDanh,
      hoTen: hoiDong.hoTen,
      ACCEPT_API_URL: `${domain}/invite?action=accept&idDanhMuc=${baiBaoDataTemp.idDanhMuc}&request=${hoiDongToken}&from=xet-duyet`,
      DECLINE_API_URL: `${domain}/invite?action=decline&idDanhMuc=${baiBaoDataTemp.idDanhMuc}&request=${hoiDongToken}&from=xet-duyet`,
    };

    try {
      const res = await axios.post(
        `${MAILER_API_URL}/send-email/gui-phan-bien`,
        {
          to: hoiDong.email,
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
          message: `Đã gửi lời mời đến email "${hoiDong.email}".`,
          position: "bottom-left",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenEditModal = async (id: string) => {
    setOpenedEdit(true);
    setLoadingFetchInfo(true);

    const info = (
      await axios.get(`${SERVER_API_URL}/HoiDongKhoaHoc/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.Token}`,
        },
      })
    ).data;

    setHdId(info.id);
    setHdEmail(info.email);
    setHdHoTen(info.hoTen);
    setHdChucDanh(info.chucDanh);
    setHdCoQuanCongTac(info.coQuanCongTac);
    setHdLinhVucChuyenMon(info.linhVucChuyenMon);
    setHdQuocGia(info.QuocGia);

    setLoadingFetchInfo(false);
  };

  const handleUpdatingInfo = async () => {
    if (!hdHoTen) {
      notifications.show({
        color: "yellow",
        message: "Vui lòng nhập đầy đủ họ tên.",
      });
      return;
    }
    if (!hdHoTen) {
      notifications.show({
        color: "yellow",
        message: "Vui lòng nhập cơ quan công tác.",
      });
      return;
    }

    modals.openConfirmModal({
      title: "Xác nhận cập nhật",
      closeOnClickOutside: false,
      children: (
        <Text>
          Hộp thoại hành động này quan trọng rằng bạn được yêu cầu xác nhận các
          thông tin cũ là sai sót và cập nhật lại chính xác. Vui lòng nhấn vào
          một trong các nút bên dưới để tiếp tục.
        </Text>
      ),
      labels: { confirm: "Xác nhận", cancel: "Quay lại" },
      onCancel: () => {},
      onConfirm: async () => {
        setWaitUpdatingInfo(true);

        const id = notifications.show({
          loading: true,
          title: "Hành động",
          message: "Đang cập nhật thông tin phản biện...",
          autoClose: false,
          withCloseButton: false,
        });

        try {
          const res = await axios.put(
            `${SERVER_API_URL}/HoiDongKhoaHoc/update-info`,
            JSON.stringify({
              id: hdId,
              hoTen: hdHoTen,
              chucDanh: hdChucDanh,
              coQuanCongTac: hdCoQuanCongTac,
              linhVucChuyenMon: hdLinhVucChuyenMon,
              quocGia: hdQuocGia,
            }),
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
              message: "Đã cập nhật thông tin phản biện thành công.",
              icon: <IconCheck size={18} />,
              loading: false,
              autoClose: 5000,
            });

            setDataLoaded(false);
            fetchData();
            // handleCloseEditModal();
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
          setWaitUpdatingInfo(false);
        }
      },
    });
  };

  const handleCloseEditModal = () => {
    setOpenedEdit(false);
    setWaitUpdatingInfo(false);
    setHdId("");
    setHdEmail("");
    setHdHoTen("");
    setHdChucDanh("");
    setHdCoQuanCongTac("");
    setHdLinhVucChuyenMon("");
    setHdQuocGia("");
  };

  return (
    <>
      <Modal
        opened={openedEdit}
        onClose={handleCloseEditModal}
        title="Chỉnh sửa thông tin"
        centered
        size="xl"
        closeOnClickOutside={false}
      >
        {loadingFetchInfo ? (
          <Center>
            <Loader color="blue" type="dots" />
          </Center>
        ) : (
          <>
            <Group grow>
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
                value={hdChucDanh}
                onChange={(value) => setHdChucDanh(value || "")}
                searchable
                nothingFoundMessage="Không tìm thấy..."
                clearable
                disabled={waitUpdatingInfo}
              />
              <TextInput
                label="Họ Tên"
                value={hdHoTen}
                onChange={(e) => setHdHoTen(e.currentTarget.value)}
                withAsterisk
                disabled={waitUpdatingInfo}
              />
              <TextInput
                label="Email"
                readOnly
                value={hdEmail}
                disabled={waitUpdatingInfo}
              />
            </Group>

            <Group grow mt="md">
              <TextInput
                label="Cơ quan công tác"
                value={hdCoQuanCongTac}
                onChange={(e) => setHdCoQuanCongTac(e.currentTarget.value)}
                withAsterisk
                disabled={waitUpdatingInfo}
              />
              <Select
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
                value={hdLinhVucChuyenMon}
                onChange={(value) => setHdLinhVucChuyenMon(value || "")}
                searchable
                nothingFoundMessage="Không tìm thấy..."
                clearable
                disabled={waitUpdatingInfo}
              />
              <Select
                label="Quốc gia"
                placeholder="Chọn quốc gia"
                data={["", ...countries]}
                limit={6}
                value={hdQuocGia}
                onChange={(value) => setHdQuocGia(value || "")}
                searchable
                nothingFoundMessage="Không tìm thấy..."
                clearable
                disabled={waitUpdatingInfo}
              />
            </Group>

            <Text fz="sm" c="dimmed" mt="md" fs="italic">
              Lưu ý: Hệ thống không cho phép cập nhật Email, nếu Email sai sót
              vui lòng tạo tài khoản mới cho phản biện. Xin cảm ơn!
            </Text>

            <Group grow mt="md">
              <Button
                color="red"
                onClick={handleCloseEditModal}
                loading={waitUpdatingInfo}
              >
                Đóng
              </Button>
              <Button
                color="green"
                onClick={handleUpdatingInfo}
                loading={waitUpdatingInfo}
              >
                Cập nhật
              </Button>
            </Group>
          </>
        )}
      </Modal>

      <Group justify="space-between">
        <div>
          <TextInput
            label={
              <>
                <b>{filteredHoiDongKhoaHoc.length}</b> người phản biện
              </>
            }
            placeholder="Tìm kiếm phản biện"
            leftSection={<IconSearch stroke={1.5} />}
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
            variant="default"
          />
        </div>
      </Group>

      {selection.length > 0 && (
        <Button mt="md" onClick={() => handleInviteMulti(null, true)}>
          Mời hàng loạt
        </Button>
      )}

      <Table.ScrollContainer my="md" minWidth={500} type="native">
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={40}>
                <Checkbox
                  onChange={toggleAll}
                  checked={
                    selection.length > 0 && selection.length === userList.length
                  }
                  indeterminate={
                    selection.length > 0 && selection.length !== userList.length
                  }
                />
              </Table.Th>
              <Table.Th>ID</Table.Th>
              <Table.Th>Họ tên</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Cơ quan công tác</Table.Th>
              <Table.Th>Lĩnh vực chuyên môn</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredHoiDongKhoaHoc &&
              filteredHoiDongKhoaHoc.map((u: any) => {
                return (
                  <Table.Tr key={u.id}>
                    <Table.Td>
                      <Checkbox
                        checked={selection.some(
                          (selectedUser) => selectedUser.id === u.id
                        )}
                        onChange={() => toggleRow(u)}
                      />
                    </Table.Td>
                    <Table.Td>
                      <Text>{u.id}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text>{u.hoTen}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text>{u.email}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text>{u.coQuanCongTac}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text>{u.linhVucChuyenMon}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Button.Group>
                        <Button
                          color="yellow"
                          onClick={() => handleOpenEditModal(u.id)}
                          leftSection={<IconPencil size={18} stroke={1.5} />}
                        >
                          Sửa
                        </Button>
                        <Button
                          color="blue"
                          onClick={() =>
                            isMultiBB
                              ? handleInviteMulti(u)
                              : handleInviteHoiDong(u)
                          }
                          leftSection={<IconUserPlus size={18} stroke={1.5} />}
                        >
                          Gửi lời mời
                        </Button>
                      </Button.Group>
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

export default TimKiem;
