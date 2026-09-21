import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import {
  HelpCenterPage,
  HoiDongXetDuyetDeTaiCBGVNVPage,
  HoiDongNghiemThuGiaHanHuyDeTaiPage,
  HomePage,
  LoginPage,
  LyLichPage,
  Invite,
  ProfilesPage,
  QPage,
  ThongBaoPage,
  UPage,
  QuanLyXetDuyet,
  QuanLyNghiemThu,
} from "@/pages";
import {
  HelpLayout,
  Layouts,
  LyLich,
  MainLayout,
  PageLoader,
  PhanBien as PhanBienCmp,
} from "./components";
import { isExpired } from "react-jwt";
import { UserLogin } from "./models/UserLogin";
import { AppProvider } from "./AppProvider";
import axios from "axios";
import { SERVER_API_URL } from "./utils/env";
import { modals } from "@mantine/modals";
import {
  Button,
  Center,
  List,
  Modal,
  Space,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { HoiDongKhoaHocLogin } from "./models/HoiDongKhoaHocLogin";
import { getCurrentDomain, getPathnameWithQuery } from "./utils/url";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPhanBien, setIsPhanBien] = useState(false);
  const [phanBienEmail, setPhanBienEmail] = useState<string>("");

  const [openedCommitment, setOpenedCommitment] = useState(false);

  // get current url path include "/invite"
  const currentUrl = window.location.href;
  const isInviteUrl = currentUrl.includes("/invite");

  useEffect(() => {
    if (!isInviteUrl) {
      // Kiểm tra đăng nhập
      const currentUser = sessionStorage.getItem("CurrentUser");
      if (currentUser) {
        const user: Partial<UserLogin & HoiDongKhoaHocLogin> =
          JSON.parse(currentUser);
        if (isExpired(user.Token!)) {
          saveUrlToContinue();
          // toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
          sessionStorage.removeItem("CurrentUser");
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
          setIsPhanBien(user.Role === "HoiDongKhoaHoc");
          if (user.Role !== "HoiDongKhoaHoc") {
            checkUserInfo(user.Token!, user.IDUser!);
          } else {
            checkPhanBienRequired(user);
            handleCheckingCommitment(user.Email!);
          }
        }
      } else {
        saveUrlToContinue();
      }
      setLoading(false);
    } else {
      // Kiểm tra đăng nhập
      const currentUser = sessionStorage.getItem("CurrentUser");
      if (currentUser) {
        const user: HoiDongKhoaHocLogin = JSON.parse(currentUser);
        if (isExpired(user.Token!)) {
          // toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
          sessionStorage.removeItem("CurrentUser");
        }
      }
    }
  }, [isInviteUrl]);

  const saveUrlToContinue = async () => {
    const domain = getCurrentDomain();
    const url = getPathnameWithQuery();
    sessionStorage.setItem("urlToContinue", domain + url);
  };

  const checkUserInfo = async (token: string, idUser: string) => {
    try {
      const res = await axios.get(
        `${SERVER_API_URL}/LyLich2/Get/info/${idUser}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status === 200) {
        // Do nothing
      }
    } catch (error: any) {
      if (error.response.status === 404) {
        modals.open({
          title: "Thông báo",
          withCloseButton: false,
          closeOnClickOutside: false,
          children: (
            <>
              <Text>{error.response.data.message}</Text>
              <Space h="md" />
              <LyLich.ThongTinChung hideCloseButton />
            </>
          ),
        });
      } else if (error.response.status === 400) {
        modals.open({
          title: "Thông báo",
          withCloseButton: false,
          closeOnClickOutside: false,
          children: (
            <>
              <Text>{error.response.data.message}</Text>
              <List
                spacing="xs"
                size="sm"
                center
                icon={
                  <ThemeIcon color="red" size={24} radius="xl">
                    <IconX size={16} />
                  </ThemeIcon>
                }
              >
                {error.response.data.missingFields.map((field: string) => (
                  <List.Item>{field}</List.Item>
                ))}
              </List>
              <Space h="md" />
              <LyLich.ThongTinChung hideCloseButton />
            </>
          ),
        });
      } else {
        console.log(error);
      }
    }
  };

  const checkPhanBienRequired = async (user: HoiDongKhoaHocLogin) => {
    try {
      const res = await axios.get(`${SERVER_API_URL}/HoiDongKhoaHoc/required`, {
        headers: {
          Authorization: `Bearer ${user.Token}`,
        },
      });

      if (res.status === 200) {
        // Do nothing
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 404) {
        const mId = modals.open({
          title: "Yêu cầu",
          withCloseButton: false,
          closeOnClickOutside: false,
          children: null,
        });

        modals.updateModal({
          modalId: mId,
          children: <PhanBienCmp.Required mId={mId} />,
        });
      }
    }
  };

  const handleCheckingCommitment = (email: string) => {
    setPhanBienEmail(email);
    const isCommitted = localStorage.getItem(
      `isCommitted_${email.replaceAll("@", "_at_").replaceAll(".", "_")}`,
    );
    if (!isCommitted) {
      setOpenedCommitment(true);
    }
  };

  const handleConfirmCommitment = () => {
    localStorage.setItem(
      `isCommitted_${phanBienEmail
        .replaceAll("@", "_at_")
        .replaceAll(".", "_")}`,
      "true",
    );
    setOpenedCommitment(false);
  };

  const handleCloseCommitment = () => {
    setOpenedCommitment(false);
  };

  const hoiDongKhoaHocRoutes = [
    <Route
      key="hd_xddt_cbgvnv"
      path="/hoi-dong/hoi-dong-xet-duyet-de-tai-cbgvnv"
      element={
        <Layouts.HoiDongKhoaHocLayout>
          <HoiDongXetDuyetDeTaiCBGVNVPage />
        </Layouts.HoiDongKhoaHocLayout>
      }
    />,
    <Route
      key="hd_ntdt_cbgvnv"
      path="/hoi-dong/hoi-dong-nghiem-thu-gia-han-huy-de-tai"
      element={
        <Layouts.HoiDongKhoaHocLayout>
          <HoiDongNghiemThuGiaHanHuyDeTaiPage />
        </Layouts.HoiDongKhoaHocLayout>
      }
    />,
  ];

  return (
    <>
      <AppProvider>
        <Modal
          opened={openedCommitment}
          onClose={handleCloseCommitment}
          closeOnClickOutside={false}
          withCloseButton={false}
          size="55rem"
          centered
        >
          <Center>
            <Title order={3}>
              CAM KẾT BẢO MẬT THÔNG TIN CỦA NGƯỜI PHẢN BIỆN
            </Title>
          </Center>

          <Text mt="md">
            Người phản biện cam kết chỉ sử dụng thông tin, dữ liệu, và tài liệu
            liên quan đến bản thảo/đề tài được giao cho mục đích đánh giá chuyên
            môn; không tiết lộ, sao chép, trích dẫn hoặc chia sẻ dưới bất kỳ
            hình thức.
          </Text>
          <Text mt="md">
            Người phản biện cam kết không có bất kỳ quyền lợi hay quan hệ cá
            nhân, hay xung đột lợi ích, chuyên môn nào có thể ảnh hưởng đến tính
            khách quan trong phản biện và không tham gia vào hoạt động liên quan
            gây xung đột lợi ích với tác giả hoặc đơn vị chủ trì.
          </Text>
          <Text mt="md">
            Trường hợp vi phạm cam kết, người phản biện phải chịu trách nhiệm
            theo quy định của pháp luật và quy chế bảo mật thông tin của
            Trường/Đơn vị tổ chức.
          </Text>

          <Center mt="lg">
            <Button color="green" onClick={handleConfirmCommitment}>
              Tôi đã đọc và đồng ý cam kết
            </Button>
          </Center>
        </Modal>

        <BrowserRouter>
          {!isInviteUrl ? (
            <>
              {loading ? (
                <PageLoader />
              ) : !isLoggedIn ? (
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
              ) : (
                <Routes>
                  <Route
                    path="/login"
                    element={
                      isPhanBien ? (
                        <Navigate to="/hoi-dong/hoi-dong-xet-duyet-de-tai-cbgvnv" />
                      ) : (
                        <Navigate to="/" />
                      )
                    }
                  />

                  {!isPhanBien ? (
                    <>
                      <Route
                        path="/"
                        element={
                          <MainLayout>
                            <HomePage />
                          </MainLayout>
                        }
                      />
                      <Route
                        path="/publish-profiles"
                        element={
                          <MainLayout>
                            <ProfilesPage />
                          </MainLayout>
                        }
                      />
                      <Route
                        path="/ly-lich"
                        element={
                          <MainLayout>
                            <LyLichPage />
                          </MainLayout>
                        }
                      />
                      <Route
                        path="/u/:idLyLich"
                        element={
                          <MainLayout>
                            <UPage />
                          </MainLayout>
                        }
                      />
                      <Route
                        path="/thong-bao"
                        element={
                          <MainLayout>
                            <ThongBaoPage />
                          </MainLayout>
                        }
                      />

                      {hoiDongKhoaHocRoutes}
                      <Route
                        path="/hoi-dong/quan-ly-xet-duyet"
                        element={
                          <Layouts.HoiDongKhoaHocLayout>
                            <QuanLyXetDuyet />
                          </Layouts.HoiDongKhoaHocLayout>
                        }
                      />
                      <Route
                        path="/hoi-dong/quan-ly-nghiem-thu"
                        element={
                          <Layouts.HoiDongKhoaHocLayout>
                            <QuanLyNghiemThu />
                          </Layouts.HoiDongKhoaHocLayout>
                        }
                      />

                      <Route
                        path="/help-center"
                        element={
                          <HelpLayout>
                            <HelpCenterPage />
                          </HelpLayout>
                        }
                      />
                      <Route
                        path="/q/:idCauHoi"
                        element={
                          <HelpLayout>
                            <QPage />
                          </HelpLayout>
                        }
                      />
                    </>
                  ) : (
                    <>
                      <Route
                        path="/"
                        element={
                          <Navigate to="/hoi-dong/hoi-dong-xet-duyet-de-tai-cbgvnv" />
                        }
                      />

                      {hoiDongKhoaHocRoutes}
                    </>
                  )}
                </Routes>
              )}
            </>
          ) : (
            <Routes>
              <Route
                path="/invite"
                element={
                  <Layouts.InviteLayout>
                    <Invite />
                  </Layouts.InviteLayout>
                }
              />
            </Routes>
          )}
        </BrowserRouter>
      </AppProvider>
    </>
  );
};

export default App;
