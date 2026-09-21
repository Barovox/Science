import {
  Badge,
  Button,
  Center,
  Checkbox,
  Group,
  Select,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import BTCMModal from "./BTCMModal";
import { UserLogin } from "@/models/UserLogin";
import { HoiDongKhoaHocLogin } from "@/models/HoiDongKhoaHocLogin";
import axios from "axios";
import { SERVER_API_URL } from "@/utils/env";
import { formatDatetime } from "@/utils/datetime";
import { useDispatch, useSelector } from "react-redux";
import {
  FILTER_BY_SEARCH_BAI_BAO,
  selectFilteredBaiBao,
} from "@/redux/slice/filterSlice";
import { PaginationComponent } from "@/components";
import { modals } from "@mantine/modals";
import * as ModalTabs from "./ModalTabs";
import { getStatusColor } from "@/utils/color";

const HoiDongXetDuyetDeTaiCBGVNVPage = () => {
  const user: Partial<UserLogin & HoiDongKhoaHocLogin> = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string,
  );

  const [dataLoaded, setDataLoaded] = useState(false);
  const [dmxdSVList, setDmxdSVList] = useState<any>([]);
  const [yearList, setYearList] = useState<any>([]);
  const [timeline, setTimeline] = useState<any>("");

  const [isEnabledSelection, setIsEnabledSelection] = useState<boolean>(false);
  const [selection, setSelection] = useState<any[]>([]);

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

  const searchParams = useMemo(
    () => new URLSearchParams(window.location.search),
    [window.location.search],
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (user.Role === "Quyền cao nhất") {
      getTimeline();
    }
  }, []);

  useEffect(() => {
    if (user.Role === "Quyền cao nhất" && timeline) {
      fetchData();
    }
  }, [timeline]);

  useEffect(() => {
    fetchData();
  }, []);

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
      if (user.Role === "Quyền cao nhất" && !timeline) return;

      setDataLoaded(false);
      setDmxdSVList([]);

      const apiRequestUrl =
        user.Role === "Quyền cao nhất"
          ? `${SERVER_API_URL}/DanhMucXetDuyetSinhVien/Get-all?startTimes=${timeline}&quyen=${user.Role}`
          : `${SERVER_API_URL}/HDXetDuyetDT_CBGVNV/Get-all?startTimes=${timeline}`;

      const res = await axios.get(apiRequestUrl, {
        headers: {
          Authorization: `Bearer ${user.Token}`,
        },
      });

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

  const toggleRow = (dmxdSV: any) => {
    if (selection.some((dm) => dm.idDanhMuc === dmxdSV.idDanhMuc)) {
      setSelection(selection.filter((dm) => dm.idDanhMuc !== dmxdSV.idDanhMuc));
    } else {
      setSelection([...selection, dmxdSV]);
    }
  };
  const toggleAll = () =>
    setSelection((current: number[]) =>
      current.length === dmxdSVList.length ? [] : dmxdSVList,
    );

  const hanldeOpenModalInviteMultiBB = () => {
    modals.open({
      title: "Mời phản biện cho các đề tài được chọn",
      size: "100%",
      closeOnClickOutside: false,
      closeOnEscape: false,
      children: (
        <ModalTabs.MoiHoiDong
          baiBaoData={null}
          onRefresh={async () => {}}
          isMultiBB={true}
          danhSachBaiBao={selection}
        />
      ),
    });
  };

  return (
    <>
      <Title order={2} mb="sm">
        {user.Role === "HoiDongKhoaHoc"
          ? "Các bản thảo cần phản biện"
          : "Điều phối công tác phản biện"}
      </Title>

      <BTCMModal
        opened={opened}
        onClose={() => {
          setIdDanhMuc(0);
          setOpened(false);
        }}
        idDanhMuc={idDanhMuc}
        openTab={openTab}
      />

      <Group justify="space-between" mt="md">
        <div>
          <TextInput
            label={
              <>
                <b>{filteredBaiBao.length}</b> sản phẩm
              </>
            }
            placeholder="Tìm kiếm sản phẩm"
            leftSection={<IconSearch stroke={1.5} />}
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
            variant="default"
          />
        </div>

        <Group justify="space-between">
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

      {user.Role !== "HoiDongKhoaHoc" && (
        <Checkbox
          mt="md"
          label="Chọn nhiều sản phẩm"
          checked={isEnabledSelection}
          onChange={(event) => {
            setIsEnabledSelection(event.currentTarget.checked);
            if (!event.currentTarget.checked) {
              setSelection([]);
            }
          }}
        />
      )}

      {user.Role !== "HoiDongKhoaHoc" &&
        isEnabledSelection &&
        selection.length > 0 && (
          <Button mt="md" onClick={hanldeOpenModalInviteMultiBB}>
            Mời phản biện
          </Button>
        )}

      <Table.ScrollContainer my="md" minWidth={500} type="native">
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              {isEnabledSelection && (
                <Table.Th w={40}>
                  <Checkbox
                    onChange={toggleAll}
                    checked={selection.length === dmxdSVList.length}
                    indeterminate={
                      selection.length > 0 &&
                      selection.length !== dmxdSVList.length
                    }
                  />
                </Table.Th>
              )}
              <Table.Th>ID</Table.Th>
              <Table.Th>Đề tài nghiên cứu</Table.Th>
              <Table.Th>Sản phẩm đăng ký</Table.Th>
              <Table.Th>Ngày nộp</Table.Th>
              {user.Role !== "HoiDongKhoaHoc" && (
                <Table.Th>Tình trạng</Table.Th>
              )}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredBaiBao &&
              currentItems.map((dmxdSV: any) => {
                return (
                  <Table.Tr
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (!isEnabledSelection) {
                        setIdDanhMuc(dmxdSV.idDanhMuc);
                        setOpened(true);
                      }
                    }}
                    key={dmxdSV.idDanhMuc}
                  >
                    {isEnabledSelection && (
                      <Table.Td>
                        <Checkbox
                          checked={selection.some(
                            (selected) =>
                              selected.idDanhMuc === dmxdSV.idDanhMuc,
                          )}
                          onChange={() => toggleRow(dmxdSV)}
                        />
                      </Table.Td>
                    )}
                    <Table.Td>
                      <Text>{dmxdSV.idDanhMuc}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text>{dmxdSV.tenBaiBao}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text>{dmxdSV.category.replace("|~|", " - ")}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text>{formatDatetime(dmxdSV.dateSubmit)}</Text>
                    </Table.Td>
                    {user.Role !== "HoiDongKhoaHoc" && (
                      <Table.Td>
                        <Text>
                          <Badge color={getStatusColor(dmxdSV.status)}>
                            {dmxdSV.status}
                          </Badge>
                        </Text>
                      </Table.Td>
                    )}
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
