import {
  Badge,
  Center,
  Group,
  Select,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import BBModal from "./BBModal";
import { UserLogin } from "@/models/UserLogin";
import axios from "axios";
import { SERVER_API_URL } from "@/utils/env";
import { useDispatch, useSelector } from "react-redux";
import {
  FILTER_BY_SEARCH_BAI_BAO,
  selectFilteredBaiBao,
} from "@/redux/slice/filterSlice";
import { PaginationComponent } from "@/components";
import { getStatusColor } from "@/utils/color";

const HoiDongXetDuyetDeTaiCBGVNVPage = () => {
  const user: Partial<UserLogin> = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string,
  );

  const [dataLoaded, setDataLoaded] = useState(false);
  const [dmxdSVList, setDmxdSVList] = useState<any>([]);
  const [yearList, setYearList] = useState<any>([]);
  const [timeline, setTimeline] = useState<any>("");

  const [opened, setOpened] = useState(false);
  const [openTab, setOpenTab] = useState<string>("");
  const [idDanhMuc, setIdDanhMuc] = useState<number>(0);

  const filteredBaiBao = useSelector(selectFilteredBaiBao);

  const [search, setSearch] = useState("");
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<string | null>("10");
  // Get Current Items
  const indexOfLastItem = currentPage * Number(itemsPerPage);
  const indexOfFirstItem = indexOfLastItem - Number(itemsPerPage);
  const currentItems = filteredBaiBao.slice(indexOfFirstItem, indexOfLastItem);

  const [chuNhiemMap, setChuNhiemMap] = useState<Record<number, string>>({});

  const searchParams = useMemo(
    () => new URLSearchParams(window.location.search),
    [window.location.search],
  );

  const dispatch = useDispatch();

  useEffect(() => {
    getTimeline();
  }, []);

  useEffect(() => {
    if (!timeline) return;
    fetchData();
  }, [timeline]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const loadChuNhiem = async () => {
      const map: Record<number, string> = {};

      for (const item of dmxdSVList) {
        map[item.idDanhMuc] = await fetchChuNhiemInfo(item.groupUser);
      }

      setChuNhiemMap(map);
    };

    if (dmxdSVList.length > 0) {
      loadChuNhiem();
    }
  }, [dmxdSVList]);

  useEffect(() => {
    if (!dataLoaded) return;

    dispatch(
      FILTER_BY_SEARCH_BAI_BAO({
        baiBao: dmxdSVList,
        search,
      }),
    );
  }, [dispatch, search, dataLoaded]);

  useEffect(() => {
    if (!dataLoaded) return;

    const opened = searchParams.get("opened");
    const idDanhMuc = searchParams.get("idDanhMuc");
    const openTab = searchParams.get("openTab");

    if (idDanhMuc) {
      setIdDanhMuc(Number(idDanhMuc));
    }
    if (openTab) {
      setOpenTab(openTab);
    }
    if (opened == "true") {
      setOpened(true);
    }
  }, [searchParams, dataLoaded]);

  const fetchData = async () => {
    try {
      if (!timeline) return;

      setDataLoaded(false);
      setDmxdSVList([]);

      const res = await axios.get(
        `${SERVER_API_URL}/DanhMucXetDuyetSinhVien/Get-all?startTimes=${timeline}&quyen=${user.Role}`,
        {
          headers: {
            Authorization: `Bearer ${user.Token}`,
          },
        },
      );

      if (res.status === 200) {
        setDmxdSVList(res.data.reverse());
        setDataLoaded(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTimeline = () => {
    const startYear = 2022;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Tạo danh sách năm học
    const years = new Array<any>();
    for (let year = startYear; year <= currentYear; year++) {
      const nextYear = (year + 1).toString();
      // add list
      years.push({
        value: `${year}`,
        label: `${year} - ${nextYear}`,
      });
    }

    // Đảo ngược danh sách
    years.reverse();
    setYearList(years);

    // Xác định năm học hiện tại
    const isNewSchoolYear = currentMonth >= 9;

    const schoolYearStart = isNewSchoolYear ? currentYear : currentYear - 1;
    const currentYearLabel = `${schoolYearStart} - ${schoolYearStart + 1}`;

    setTimeline(
      years.find((y) => y.label === currentYearLabel)?.value ??
        `${schoolYearStart}`,
    );
  };

  const onRefresh = async () => {
    await fetchData();
  };

  const fetchChuNhiemInfo = async (groupUser: string) => {
    const listMaNhanVien = groupUser.split("$").map((tacGia) => {
      const parts = tacGia.split(";");
      const hoTenFull = parts[1];

      // Tách phần sau dấu "-" và loại bỏ khoảng trắng thừa
      const maNV = hoTenFull.split("-")[0]?.trim();

      return maNV;
    });

    const maNVChuNhiem = listMaNhanVien[0];

    const result = (
      await axios.get(
        `${SERVER_API_URL}/NguoiDung/Get-user?input=${maNVChuNhiem}`,
        {
          headers: {
            Authorization: `Bearer ${user.Token}`,
          },
        },
      )
    ).data[0];

    return `${result.hoTen} (${result.donViCongTac})`;
  };

  return (
    <>
      <Title order={2} mb="sm">
        Quản lý hoạt động phản biện
      </Title>

      <BBModal
        opened={opened}
        onClose={() => {
          setIdDanhMuc(0);
          setOpened(false);
        }}
        onRefresh={onRefresh}
        idDanhMuc={idDanhMuc}
        openTab={openTab}
      />

      <Group justify="space-between" mt="md">
        <div>
          <TextInput
            label={
              <>
                <b>{filteredBaiBao.length}</b> bản thảo
              </>
            }
            placeholder="Tìm kiếm bản thảo"
            leftSection={<IconSearch stroke={1.5} />}
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
            variant="default"
          />
        </div>

        <Group justify="space-between" mt="md">
          <Select
            label="Học kỳ"
            placeholder="Chọn giá trị"
            data={yearList}
            value={timeline}
            onChange={setTimeline}
            allowDeselect={false}
          />

          <Select
            label={`Đang hiển thị ${itemsPerPage} mục`}
            placeholder="Chọn giá trị"
            data={["10", "25", "50", "100"]}
            value={itemsPerPage}
            onChange={setItemsPerPage}
            allowDeselect={false}
          />
        </Group>
      </Group>

      <Table.ScrollContainer my="md" minWidth={500}>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Tên nhiệm vụ</Table.Th>
              <Table.Th>Chủ nhiệm</Table.Th>
              <Table.Th ta="center">Số PB tham gia</Table.Th>
              <Table.Th ta="center">Số PB "Đạt"</Table.Th>
              <Table.Th ta="center">Số PB "Không đạt"</Table.Th>
              <Table.Th>Kết luận của HĐ</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredBaiBao &&
              currentItems.map((dmxdSV: any) => {
                return (
                  <Table.Tr
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setIdDanhMuc(dmxdSV.idDanhMuc);
                      setOpened(true);
                    }}
                    key={dmxdSV.idDanhMuc}
                  >
                    <Table.Td>
                      <Text>{dmxdSV.idDanhMuc}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text>{dmxdSV.tenBaiBao}</Text>
                    </Table.Td>
                    <Table.Td>
                      {chuNhiemMap[dmxdSV.idDanhMuc] ?? "Đang tải..."}
                    </Table.Td>
                    <Table.Td ta="center">
                      <Text>
                        {dmxdSV.danhSachHDXetDuyet
                          ? JSON.parse(dmxdSV.danhSachHDXetDuyet).filter(
                              (hd: any) => hd.status == "0" || hd.status == "1",
                            ).length
                          : 0}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Text>
                        {dmxdSV.hoiDongDanhGia
                          ? JSON.parse(dmxdSV.hoiDongDanhGia).filter(
                              (dg: any) =>
                                dg.fromHoiDong && dg.ketLuan == "Đạt",
                            ).length
                          : 0}
                      </Text>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Text>
                        {dmxdSV.hoiDongDanhGia
                          ? JSON.parse(dmxdSV.hoiDongDanhGia).filter(
                              (dg: any) =>
                                dg.fromHoiDong && dg.ketLuan == "Không đạt",
                            ).length
                          : 0}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text>
                        <Tooltip.Floating label={dmxdSV.status} position="left">
                          <Badge color={getStatusColor(dmxdSV.status)}>
                            {dmxdSV.status}
                          </Badge>
                        </Tooltip.Floating>
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      <Center mt="md">
        {filteredBaiBao.length === 0 ? null : (
          <>
            <PaginationComponent
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredBaiBao.length}
            />
          </>
        )}
      </Center>
    </>
  );
};

export default HoiDongXetDuyetDeTaiCBGVNVPage;
