import { PageLoader } from "@/components";
import { HoiDongKhoaHocLogin } from "@/models/HoiDongKhoaHocLogin";
import { SERVER_API_URL } from "@/utils/env";
import { setSessionData } from "@/utils/session";
import { Button, Container, Text, Title } from "@mantine/core";
import { IconArrowRight, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { decodeToken } from "react-jwt";

const Invite = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const request = searchParams.get("request") as string;
  const action = searchParams.get("action") as string;
  const from = searchParams.get("from") as string;
  const idDanhMuc =
    (searchParams.get("idDanhMuc") as string) ||
    (sessionStorage.getItem("idDanhMuc") as string);

  const [loading, setLoading] = useState(true);
  const [acceptSuccess, setAcceptSuccess] = useState(
    action === "accept-success" || false,
  );
  const [declineSuccess, setDeclineSuccess] = useState(
    action === "decline-success" || false,
  );
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (request) {
      handleSaveLogin();
    } else {
      if (action === "accept-success" || action === "decline-success") {
        setLoading(false);
      } else if (action && idDanhMuc && !request) {
        handleInvite();
      }
    }
  }, [request]);

  const handleSaveLogin = async () => {
    const decoded: any = decodeToken(request);

    const userPhanBienLogin: HoiDongKhoaHocLogin = {
      ID: decoded.ID,
      HoTen: decoded.HoTen,
      Email: decoded.Email,
      ChucDanh: decoded.ChucDanh,
      Role: decoded[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ],
      Token: request,
    };
    await setSessionData("CurrentUser", JSON.stringify(userPhanBienLogin)).then(
      () => {
        setInterval(() => {
          // reload page without `request` parameter
          const url = new URL(window.location.href);
          url.searchParams.delete("request");
          window.history.replaceState({}, document.title, url.toString());
          window.location.reload();
        }, 1000);
      },
    );
  };

  const handleInvite = async () => {
    const user: HoiDongKhoaHocLogin = JSON.parse(
      sessionStorage.getItem("CurrentUser") as string,
    );

    if (!user) {
      setError(true);
      setErrorMessage(
        "Phiên người dùng không hợp lệ hoặc hết hạn. Vui lòng liên hệ P.KHCN UEF.",
      );
    } else {
      try {
        const data = {
          action: action,
          idDanhMuc: idDanhMuc,
          request: user.Token,
          from: from,
        };
        const res = await axios.post(
          `${SERVER_API_URL}/HoiDongKhoaHoc/${
            action === "accept"
              ? "accept-invite"
              : action === "decline"
                ? "decline-invite"
                : ""
          }`,
          data,
          {
            headers: {
              Authorization: `Bearer ${user.Token}`,
            },
          },
        );

        if (res.status === 200) {
          if (action === "accept") {
            await axios.post(
              `${SERVER_API_URL}/DanhMucXetDuyetSinhVien/Add-lich-su-xu-ly?idDanhMuc=${idDanhMuc}`,
              {
                by: `${user.HoTen} (${user.Email})`,
                content: `Hội đồng đã chấp nhận lời mời${
                  from == "xet-duyet" && " phản biện"
                }.`,
                type: "accept-invite",
              },
              {
                headers: {
                  Authorization: `Bearer ${user.Token}`,
                  "Content-Type": "application/json",
                },
              },
            );
            await handleSendNotifyToGroupAuthor();
            setAcceptSuccess(true);
          } else if (action === "decline") {
            await axios.post(
              `${SERVER_API_URL}/DanhMucXetDuyetSinhVien/Add-lich-su-xu-ly?idDanhMuc=${idDanhMuc}`,
              {
                by: `${user.HoTen} (${user.Email})`,
                content: `Hội đồng đã từ chối lời mời${
                  from == "xet-duyet" && " phản biện"
                }.`,
                type: "decline-invite",
              },
              {
                headers: {
                  Authorization: `Bearer ${user.Token}`,
                  "Content-Type": "application/json",
                },
              },
            );
            await handleSendNotifyToGroupAuthor();
            setDeclineSuccess(true);
          }
          // remove `action` and `idDanhMuc` from url
          const url = new URL(window.location.href);
          sessionStorage.setItem("idDanhMuc", idDanhMuc);
          url.searchParams.set(
            "action",
            action === "accept" ? "accept-success" : "decline-success",
          );
          url.searchParams.delete("idDanhMuc");
          window.history.replaceState({}, document.title, url.toString());
          window.location.reload();
        } else {
          setError(true);
          setErrorMessage(res.data.message);
        }
      } catch (error: any) {
        if (error.response) {
          setError(true);
          setErrorMessage(error.response.data.message);
        } else {
          setError(true);
          setErrorMessage("Có lỗi xảy ra, vui lòng thử lại sau.");
        }
      }
    }

    setLoading(false);
  };

  const handleSendNotifyToGroupAuthor = async () => {
    const user: HoiDongKhoaHocLogin = JSON.parse(
      sessionStorage.getItem("CurrentUser") as string,
    );

    const baiBaoData = (
      await axios.get(
        `${SERVER_API_URL}/${
          from == "xet-duyet" ? "HDXetDuyetDT_CBGVNV" : "HDNghiemThuDT_CBGVNV"
        }/Get-by-id${
          action === "decline" ? "-for-decline" : ""
        }?idDanhMuc=${idDanhMuc}`,
        {
          headers: {
            Authorization: `Bearer ${user.Token}`,
          },
        },
      )
    ).data;

    const listTacGia = baiBaoData.groupUser
      .split("$")
      .reduce((acc: string[], tacGia: string) => {
        const parts = tacGia.split(";");
        const hoTenFull = parts[1];

        if (hoTenFull?.includes("-")) {
          acc.push(hoTenFull.split("-")[0].trim());
        }

        return acc;
      }, []);

    for (const idAuthor of listTacGia) {
      const notifyData = {
        userId: idAuthor,
        message:
          (action === "accept" || action === "decline") &&
          `Hội đồng ${user.HoTen} (${user.Email}) đã ${
            action === "accept" ? "chấp nhận" : "từ chối"
          } lời mời tham gia${from == "xet-duyet" && " phản biện"} bài báo "${
            baiBaoData.tenBaiBao
          }" của bạn.`,
      };
      await axios.post(`${SERVER_API_URL}/ThongBao/`, notifyData, {
        headers: {
          Authorization: `Bearer ${user.Token}`,
          "Content-Type": "application/json",
        },
      });
    }
  };

  if (loading) {
    return <PageLoader />;
  } else if (acceptSuccess) {
    return (
      <Container my="xl">
        <Title order={2}>
          Chấp nhận lời mời{from == "xet-duyet" && " phản biện"} thành công
        </Title>

        <Text mt="md">
          Cảm ơn bạn đã chấp nhận lời mời{from == "xet-duyet" && " phản biện"}{" "}
          bản thảo này. Chúng tôi rất mong đợi sự đóng góp của bạn.
        </Text>

        <Button
          onClick={() => {
            window.location.href = `/hoi-dong/${
              from == "xet-duyet"
                ? "hoi-dong-xet-duyet-de-tai-cbgvnv"
                : "hoi-dong-nghiem-thu-gia-han-huy-de-tai"
            }?opened=true&idDanhMuc=${idDanhMuc}&openTab=thong-tin-de-tai`;
          }}
          color="green"
          mt="md"
          rightSection={<IconArrowRight size={18} stroke={1.5} />}
        >
          Đi đến{from == "xet-duyet" ? " phản biện" : " nghiệm thu"}
        </Button>
      </Container>
    );
  } else if (declineSuccess) {
    return (
      <Container my="xl">
        <Title order={2}>
          Từ chối lời mời{from == "xet-duyet" && " phản biện"} thành công
        </Title>

        <Text mt="md">
          Chúng tôi rất tiếc khi bạn không thể tham gia
          {from == "xet-duyet" && " phản biện"} bản thảo này. Hy vọng chúng ta
          sẽ có cơ hội hợp tác trong tương lai.
        </Text>

        <Button
          onClick={() => {
            // close this browser tab
            window.close();
          }}
          color="red"
          mt="md"
          leftSection={<IconX size={18} stroke={1.5} />}
        >
          Thoát
        </Button>
      </Container>
    );
  } else if (error) {
    return (
      <Container my="xl">
        <Title order={2}>Có lỗi xảy ra</Title>

        <Text mt="md">{errorMessage}</Text>

        <Button
          onClick={() => {
            // close this browser tab
            window.close();
          }}
          color="red"
          mt="md"
          leftSection={<IconX size={18} stroke={1.5} />}
        >
          Thoát
        </Button>
      </Container>
    );
  } else {
    return <></>;
  }
};

export default Invite;
