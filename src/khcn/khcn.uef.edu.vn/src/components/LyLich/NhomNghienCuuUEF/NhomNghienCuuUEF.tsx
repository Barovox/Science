import { UserLogin } from "@/models/UserLogin";
import { SERVER_API_URL } from "@/utils/env";
import { Button, Card, Grid, Input, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";

const NhomNghienCuuUEF = ({ view }: { view?: string }) => {
  const user: UserLogin = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string
  );

  const [row, setRow] = useState({ tenNhom: "", vaiTro: "", donVi: "" });
  const viewer = view != null;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${SERVER_API_URL}/LyLich2/GetField/${
          view ? view : user.IDUser
        }/NhomNghienCuuUEF`,
        {
          headers: {
            Authorization: `Bearer ${user.Token}`,
          },
        }
      );

      if (res.status === 404) {
        console.log("Not found");
      } else if (res.status === 200) {
        const data = JSON.parse(res.data.value);
        const rowsWithEmpty = data
          ? data
          : { tenNhom: "", vaiTro: "", donVi: "" };
        setRow(rowsWithEmpty);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setRow({
      ...row,
      [key]: value,
    });
  };

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
          nhomNghienCuuUEF: JSON.stringify(row),
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
      <Text>Nhóm nghiên cứu UEF đang tham gia</Text>

      <Card shadow="sm" padding="lg" radius="md" withBorder mt="md">
        <Grid>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Text fw={500}>Tên nhóm:</Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 9 }}>
            <Input
              variant="unstyled"
              placeholder={!viewer ? "Tên nhóm NC..." : ""}
              value={row.tenNhom}
              onChange={(e) => handleInputChange("tenNhom", e.target.value)}
              readOnly={viewer}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Text fw={500}>Vai trò:</Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 9 }}>
            <Input
              variant="unstyled"
              placeholder={!viewer ? "Vai trò trong nhóm..." : ""}
              value={row.vaiTro}
              onChange={(e) => handleInputChange("vaiTro", e.target.value)}
              readOnly={viewer}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Text fw={500}>Đơn vị chủ trì:</Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 9 }}>
            <Input
              variant="unstyled"
              placeholder={!viewer ? "Đơn vị chủ trì nhóm NC..." : ""}
              value={row.donVi}
              onChange={(e) => handleInputChange("donVi", e.target.value)}
              readOnly={viewer}
            />
          </Grid.Col>
        </Grid>

        {!viewer && (
          <Button
            color="green"
            fullWidth
            mt="md"
            radius="md"
            leftSection={<IconDeviceFloppy size={18} stroke={1.8} />}
            onClick={handleSaveChanges}
          >
            Lưu thay đổi
          </Button>
        )}
      </Card>
    </>
  );
};

export default NhomNghienCuuUEF;
