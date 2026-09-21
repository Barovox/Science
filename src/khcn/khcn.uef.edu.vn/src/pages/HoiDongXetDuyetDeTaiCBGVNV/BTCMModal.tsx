import { useEffect, useState } from "react";
import * as ModalTabs from "./ModalTabs";
import { Modal, ScrollArea, SegmentedControl } from "@mantine/core";
import { UserLogin } from "@/models/UserLogin";
import { HoiDongKhoaHocLogin } from "@/models/HoiDongKhoaHocLogin";
import { PageLoader } from "@/components";
import axios from "axios";
import { SERVER_API_URL } from "@/utils/env";

const allTabs = [
  {
    label: "Phản biện chuyên môn",
    value: "phan-bien-chuyen-mon",
    onlyRole: ["Người dùng", "Quyền cao nhất"],
  },
  {
    label: "Thông tin đề tài",
    value: "thong-tin-de-tai",
  },
  {
    label: "Mời phản biện",
    value: "moi-phan-bien",
    onlyRole: ["Quyền cao nhất"],
  },
  {
    label: "Lịch sử xử lý",
    value: "lich-su-xu-ly",
    onlyRole: ["Người dùng", "Quyền cao nhất"],
  },
];

const BTCMModal = ({
  opened,
  onClose,
  idDanhMuc,
  openTab,
}: {
  opened: boolean;
  onClose: (opened: boolean) => void;
  idDanhMuc: number;
  openTab?: string;
}) => {
  const user: Partial<UserLogin & HoiDongKhoaHocLogin> = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [baiBaoData, setBaiBaoData] = useState<any>(null);
  const [tab, setTab] = useState(openTab || "thong-tin-de-tai");
  const [tabs, setTabs] = useState<any>(null);

  useEffect(() => {
    if (idDanhMuc != 0) {
      setLoading(true);
      getTabs();
      fetchData();
    }
  }, [idDanhMuc]);

  const fetchData = async () => {
    const apiRequestUrl =
      user.Role === "Quyền cao nhất"
        ? `${SERVER_API_URL}/DanhMucXetDuyetSinhVien/Get-id?IDDanhMuc=${idDanhMuc}`
        : `${SERVER_API_URL}/HDXetDuyetDT_CBGVNV/Get-by-id?idDanhMuc=${idDanhMuc}`;

    try {
      const res = await axios.get(apiRequestUrl, {
        headers: {
          Authorization: `Bearer ${user.Token}`,
        },
      });

      if (res.status === 200) {
        setBaiBaoData(res.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setLoading(false);
  };

  const onRefresh = async () => {
    setLoading(true);
    await fetchData();
  };

  const handleCloseModal = () => {
    onClose(false);
    setTab(tabs[0].value);

    // clear "opened", "idDanhMuc" and "openTab" from URL params
    const url = new URL(window.location.href);
    url.searchParams.delete("opened");
    url.searchParams.delete("idDanhMuc");
    url.searchParams.delete("openTab");
    window.history.replaceState({}, "", url.toString());
  };

  const getTabs = () => {
    const filtered = allTabs.filter((tab) => {
      // 1. Không có onlyRole => hiển thị
      if (!tab.onlyRole || tab.onlyRole.length === 0) return true;

      // 2. Còn lại: kiểm tra user.Role nằm trong onlyRole
      return tab.onlyRole.includes(user.Role!);
    });

    setTabs(filtered);

    if (filtered.length > 0) {
      setTab(filtered[0].value); // Mặc định chọn tab đầu tiên
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => handleCloseModal()}
      title="PHẢN BIỆN ĐỀ TÀI"
      closeButtonProps={{
        bg: "red",
        size: "lg",
        iconSize: 18,
        style: {
          width: "fit-content",
          padding: "0 0.5rem",
          color: "white",
        },
      }}
      size="100%"
      // fullScreen
      closeOnClickOutside={false}
      closeOnEscape={false}
      scrollAreaComponent={ScrollArea.Autosize}
    >
      {loading ? (
        <PageLoader />
      ) : (
        <>
          <SegmentedControl
            value={tab}
            onChange={setTab}
            data={tabs.map((tab: any) => ({
              label: tab.label,
              value: tab.value,
            }))}
            fullWidth
            color="blue"
            mb="md"
            style={{ position: "sticky", top: 66, zIndex: 999 }}
          />

          {tab === "phan-bien-chuyen-mon" && (
            <ModalTabs.PhanBienChuyenMon
              baiBaoData={baiBaoData}
              onRefresh={onRefresh}
            />
          )}
          {tab === "thong-tin-de-tai" && (
            <ModalTabs.ThongTinDeTai baiBaoData={baiBaoData} />
          )}
          {tab === "moi-phan-bien" && (
            <ModalTabs.MoiHoiDong
              baiBaoData={baiBaoData}
              onRefresh={onRefresh}
            />
          )}
          {tab === "lich-su-xu-ly" && (
            <ModalTabs.LichSuXuLy baiBaoData={baiBaoData} />
          )}
        </>
      )}
    </Modal>
  );
};

export default BTCMModal;
