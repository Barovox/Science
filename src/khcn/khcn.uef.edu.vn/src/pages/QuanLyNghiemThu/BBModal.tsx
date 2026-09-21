import { useEffect, useState } from "react";
import * as ModalTabs from "./ModalTabs";
import { Modal, ScrollArea, SegmentedControl } from "@mantine/core";
import { UserLogin } from "@/models/UserLogin";
import { PageLoader } from "@/components";
import axios from "axios";
import { SERVER_API_URL } from "@/utils/env";

const allTabs = [
  {
    label: "Thông tin đề tài / Duyệt của Hội đồng KH Trường",
    value: "thong-tin-de-tai",
  },
  { label: "Phản biện đánh giá", value: "phan-bien-danh-gia" },
  {
    label: "Lịch sử xử lý",
    value: "lich-su-xu-ly",
  },
];

const BTCMModal = ({
  opened,
  onClose,
  idDanhMuc,
  onRefresh,
  openTab,
}: {
  opened: boolean;
  onClose: (opened: boolean) => void;
  idDanhMuc: number;
  onRefresh: () => Promise<void>;
  openTab?: string;
}) => {
  const user: Partial<UserLogin> = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string,
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

  const onRefreshModal = async () => {
    setLoading(true);
    await fetchData();
    await onRefresh();
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${SERVER_API_URL}/DanhMucXetDuyetSinhVien/Get-id?IDDanhMuc=${idDanhMuc}`,
        {
          headers: {
            Authorization: `Bearer ${user.Token}`,
          },
        },
      );

      if (res.status === 200) {
        setBaiBaoData(res.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setLoading(false);
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

  const getTabs = async () => {
    setTabs(allTabs);
  };

  return (
    <Modal
      opened={opened}
      onClose={() => handleCloseModal()}
      title="QUẢN LÝ KẾT QUẢ NGHIỆM THU, THANH LÝ ĐỀ TÀI"
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

          {tab === "thong-tin-de-tai" && (
            <ModalTabs.ThongTinDeTai
              baiBaoData={baiBaoData}
              onRefresh={onRefreshModal}
            />
          )}
          {tab === "phan-bien-danh-gia" && (
            <ModalTabs.PhanBienDanhGia baiBaoData={baiBaoData} />
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
