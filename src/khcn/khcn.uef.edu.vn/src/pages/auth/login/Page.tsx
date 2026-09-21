import { PageLoader } from "@/components";
import style from "./style.module.css";
import { useEffect, useState } from "react";

import uef_logo from "@/assets/uef_logo.png";
import axios from "axios";
import { SERVER_API_URL } from "@/utils/env";
import { decodeToken } from "react-jwt";
import { UserLogin } from "@/models/UserLogin";
import { setSessionData } from "@/utils/session";
import { animate } from "@/utils/animate";
import {
  Button,
  Center,
  Image,
  Paper,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { HoiDongKhoaHocLogin } from "@/models/HoiDongKhoaHocLogin";
import { notifications } from "@mantine/notifications";
import { isValidEmail } from "@/utils/email";

const LoginPage = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [outPageAnim, setOutPageAnim] = useState(false);

  const request = new URLSearchParams(window.location.search).get("request");

  useEffect(() => {
    if (request) {
      handleLoginWithToken(request);
    }
  }, [request]);

  const handleSubmit = async () => {
    if (!userId) {
      notifications.show({
        title: "Thông báo",
        message: "Vui lòng nhập tên đăng nhập.",
        color: "yellow",
      });
      return;
    }

    setWaiting(true);

    let accountType = "nguoi-ke-khai";
    // kiểm tra nếu userId nhập vào là email thì là người phản biện
    if (isValidEmail(userId)) {
      accountType = "nguoi-phan-bien";
    }

    try {
      const result = await axios.post(
        `${SERVER_API_URL}${
          accountType == "nguoi-ke-khai"
            ? "/NguoiDung/login"
            : accountType == "nguoi-phan-bien"
            ? "/HoiDongKhoaHoc/login-by-email"
            : ""
        }`,
        {
          ...(accountType == "nguoi-ke-khai" && {
            username: userId,
            password: password,
          }),
          ...(accountType == "nguoi-phan-bien" && {
            email: userId,
            matKhau: password,
          }),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (result.status == 200) {
        if (accountType == "nguoi-ke-khai") {
          // console.log(result);
          // console.log(result.data.expiration);
          // console.log(result.data.token);
          // console.log(new Date(result.data.expiration));
          // console.log(new Date());
          // console.log(new Date(result.data.expiration) < new Date());
          // console.log(new Date(result.data.expiration) > new Date());
          // console.log(new Date(result.data.expiration) == new Date());
          // console.log(decodeToken(result.data.token));
          await handleSaveLogin(result.data.token);
        } else if (accountType == "nguoi-phan-bien") {
          await handleSaveLogin(result.data.token);
        }
      }
    } catch (error: any) {
      console.log(error.response);
      if (error.response.status == 400) {
        notifications.show({
          title: "Thông báo",
          message:
            "Tài khoản không tồn tại, hoặc thông tin đăng nhập không đúng. Vui lòng kiểm tra lại!",
          color: "red",
        });
      } else if (error.response.status == 401) {
        notifications.show({
          title: "Thông báo",
          message: "Tài khoản đăng nhập không chính xác. Vui lòng thử lại!",
          color: "red",
        });
      }
    }

    setWaiting(false);
  };

  const handleLoginWithToken = async (token: string) => {
    try {
      const result = await axios.post(
        `${SERVER_API_URL}/NguoiDung/login2?request=${token}`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (result.status == 200) {
        await handleSaveLogin(result.data.token);
      }
    } catch (error: any) {
      console.log(error.response);
    }
  };

  const handleSaveLogin = async (token: string) => {
    const decoded: any = decodeToken(token);

    const role =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (role === "HoiDongKhoaHoc") {
      const userPhanBienLogin: HoiDongKhoaHocLogin = {
        ID: decoded.ID,
        HoTen: decoded.HoTen,
        Email: decoded.Email,
        ChucDanh: decoded.ChucDanh,
        Role: decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ],
        Token: token,
      };
      await setSessionData("CurrentUser", JSON.stringify(userPhanBienLogin));
    } else {
      const chucDanh: any = decoded.ChucDanh;
      let ngach: string = "GV";

      if (chucDanh.includes("NCV")) {
        ngach = "NCV";
      }
      const userLogin: UserLogin = {
        IDUser: decoded.IDUser,
        HoTen: decoded.HoTen,
        Ngach: ngach,
        Role: decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ],
        Token: token,
      };
      // console.log(userLogin);
      await setSessionData("CurrentUser", JSON.stringify(userLogin));
    }
    setOutPageAnim(true);
    setInterval(() => {
      const urlToContinue = sessionStorage.getItem("urlToContinue");
      console.log(urlToContinue);
      if (urlToContinue) {
        window.history.replaceState(
          {},
          document.title,
          urlToContinue.toString()
        );
      }
      window.location.reload();
    }, 800); // 800ms like animate fast speed
  };

  return (
    <>
      {request ? (
        <PageLoader />
      ) : (
        <>
          <div
            className={`${style.wrapper} ${animate("fadeIn", 0)} ${
              outPageAnim && animate("fadeOut", 0, "fast")
            }`}
          >
            <div className={`${animate("slideInRight")}`}>
              <Paper className={style.form} radius={0}>
                <div className={`${animate("zoomInDown", 1)}`}>
                  <Center>
                    <Image w={250} src={uef_logo} alt="logo" />
                  </Center>
                  <Text fw={600} ta="center" mt="md">
                    Cổng thông tin quản lý nghiên cứu khoa học và tra cứu xếp
                    hạng tạp chí.
                  </Text>
                </div>

                <div
                  className={`${style["login-form-input"]} ${animate(
                    "bounceIn",
                    2
                  )}`}
                >
                  <TextInput
                    mt="md"
                    label="Tên đăng nhập"
                    size="md"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    disabled={waiting}
                    // required
                  />
                  <PasswordInput
                    mt="md"
                    label="Mật khẩu"
                    size="md"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={waiting}
                    // required
                  />
                  <Button
                    fullWidth
                    mt="md"
                    size="md"
                    onClick={handleSubmit}
                    loading={waiting}
                    disabled={waiting} //{!userId || !password}
                  >
                    Đăng nhập
                  </Button>
                </div>
              </Paper>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LoginPage;
