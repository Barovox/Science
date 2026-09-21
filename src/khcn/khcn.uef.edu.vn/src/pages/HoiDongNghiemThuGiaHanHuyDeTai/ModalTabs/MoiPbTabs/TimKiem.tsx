import { UserLogin } from "@/models/UserLogin";
import {
  FILTER_BY_SEARCH_HOI_DONG_KHOA_HOC,
  selectFilteredHoiDongKhoaHoc,
} from "@/redux/slice/filterSlice";
import { MAILER_API_URL, SERVER_API_URL } from "@/utils/env";
import { getCurrentDomain } from "@/utils/url";
import { Button, Checkbox, Group, Table, Text, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconSearch, IconUserPlus } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
            const danhSach = JSON.parse(
              baiBaoData.danhSachHDNghiemThu
            ) as any[];

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
          `${SERVER_API_URL}/HDNghiemThuDT_CBGVNV/Get-danh-sach-hd-nghiem-thu?IDDanhMuc=${baiBaoDataTemp.idDanhMuc}`,
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
      ACCEPT_API_URL: `${domain}/invite?action=accept&idDanhMuc=${baiBaoDataTemp.idDanhMuc}&request=${hoiDongToken}&from=nghiem-thu`,
      DECLINE_API_URL: `${domain}/invite?action=decline&idDanhMuc=${baiBaoDataTemp.idDanhMuc}&request=${hoiDongToken}&from=nghiem-thu`,
    };

    try {
      const res = await axios.post(
        `${MAILER_API_URL}/send-email/gui-nghiem-thu`,
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

  return (
    <>
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
