import { LyLich, PageLoader } from "@/components";
import { UserLogin } from "@/models/UserLogin";
import { ASSETS_KHCN_URL, SERVER_API_URL } from "@/utils/env";
import {
  Anchor,
  Avatar,
  Button,
  Center,
  Container,
  Grid,
  Paper,
  ScrollArea,
  SegmentedControl,
  Space,
  Text,
  Title,
} from "@mantine/core";
import {
  IconGenderBigender,
  IconHome,
  IconLanguage,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const allTabs = [
  { label: "Tổng quan", value: "tong-quan", keyMatch: null }, // Luôn hiển thị
  {
    label: "Giảng dạy và Công tác",
    value: "gd-ct",
    keyMatch: "quaTrinhGiangDayCongTac",
  },
  {
    label: "Dự án đã tham gia",
    value: "du-an-da-tham-gia",
    keyMatch: /^duAnThamGia_/,
  },
  {
    label: "Hướng dẫn NCS, HVCH",
    value: "hd-ncs-hvch",
    keyMatch: /^huongDan_/,
  },
  {
    label: "Bài báo khoa học",
    value: "bai-bao-khoa-hoc",
    keyMatch: /^baiBao_/,
  },
  { label: "Khen thưởng", value: "khen-thuong", keyMatch: /^giaiThuong_/ },
  {
    label: "Môn giảng dạy",
    value: "mon-giang-day",
    keyMatch: "hocPhanMonGiangDay",
  },
  {
    label: "Nhóm nghiên cứu UEF",
    value: "nhom-nghien-cuu-uef",
    keyMatch: "nhomNghienCuuUEF",
  },
];

const UPage = () => {
  const user: UserLogin = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string
  );

  const { idLyLich } = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [tab, setTab] = useState<string>("tong-quan");
  const [tabs, setTabs] = useState<any>(null);
  const [fields, setFields] = useState<any>(null);
  const [u, setU] = useState<any>(null);
  const [nonProfile, setNonProfile] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    getTabs();
    getU();
  }, []);

  const getTabs = async () => {
    try {
      const res = await axios.get(
        `${SERVER_API_URL}/LyLich2/GetUserPublicFields/${idLyLich}`,
        {
          headers: {
            Authorization: `Bearer ${user.Token}`,
          },
        }
      );

      if (res.status === 200) {
        // console.log(res.data.publicFields);
        const filteredTabs = filterTabs(res.data.publicFields);
        setTabs(filteredTabs);
        setTab(filteredTabs[0].value); // TODO: bỏ đoạn này sau khi thiết kế trang Tổng quan
        setFields(res.data.publicFields.map((field: any) => field.key));
      }
    } catch (error) {
      console.log(error);
      setNonProfile(true);
    }
  };

  const filterTabs = (publicFields: { key: string }[]) => {
    const filteredTabs = allTabs.filter((tab) => {
      if (!tab.keyMatch) return false; // Loại bỏ tab "Tổng quan" khỏi lọc
      return publicFields.some((field) => {
        if (typeof tab.keyMatch === "string") {
          return field.key === tab.keyMatch;
        } else if (tab.keyMatch instanceof RegExp) {
          return tab.keyMatch.test(field.key);
        }
        return false;
      });
    });

    // Luôn thêm tab "Tổng quan" vào danh sách đã lọc
    // return [{ label: "Tổng quan", value: "tong-quan" }, ...filteredTabs]; // TODO: sử dụng đoạn này sau khi thiết kế trang Tổng quan
    return filteredTabs;
  };

  const getU = async () => {
    if (nonProfile) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(
        `${SERVER_API_URL}/LyLich2/GetField/${idLyLich}/ThongTinChung`,
        {
          headers: {
            Authorization: `Bearer ${user.Token}`,
          },
        }
      );

      if (res.status === 200) {
        setU(JSON.parse(res.data.value));
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : nonProfile ? (
        <>
          <Container fluid my="xl">
            <Title order={2}>Hồ sơ không tồn tại, hoặc không công khai.</Title>
            <Button
              mt="md"
              variant="light"
              component="a"
              href="/"
              leftSection={<IconHome size={18} stroke={1.5} />}
            >
              Về trang chủ
            </Button>
          </Container>
        </>
      ) : (
        <Container fluid my="xl">
          <Grid>
            <Grid.Col span={{ base: 12, xs: 4 }}>
              <Paper
                radius="md"
                withBorder
                p="lg"
                bg="var(--mantine-color-body)"
              >
                <Avatar
                  src={`${ASSETS_KHCN_URL}/avatars/${idLyLich}.png?t=${Date.now()}`} // sử dụng timestamp để tránh cache
                  size={250}
                  radius={250}
                  mx="auto"
                  name={u.hoTen}
                  color="initials"
                />

                <Title order={2} fw={700} mt="md">
                  {u.hoTen}
                </Title>
                <Text c="dimmed">
                  {idLyLich} • {u.hocHam} • {u.chucVu}
                </Text>

                <Text mt="md">
                  <Center inline>
                    <IconGenderBigender size={18} stroke={1.5} /> {u.gioiTinh}
                  </Center>
                </Text>

                <Text mt="md">
                  <Center inline>
                    <IconMail size={18} stroke={1.5} /> {u.email}
                  </Center>
                </Text>
                <Text>
                  <Center inline>
                    <IconPhone size={18} stroke={1.5} /> {u.sdt}
                  </Center>
                </Text>

                <Text mt="md">
                  <Center inline>
                    <IconLanguage size={18} stroke={1.5} /> {u.ngoaiNgu}
                  </Center>
                </Text>

                <Space h="md" />

                {u.link_scopus && (
                  <Text>
                    <Anchor href={u.link_scopus} target="_blank">
                      SCOPUS
                    </Anchor>
                  </Text>
                )}
                {u.link_hIndexed && (
                  <Text>
                    <Anchor href={u.link_hIndexed} target="_blank">
                      H-Indexed SCOPUS
                    </Anchor>
                  </Text>
                )}
                {u.link_citications && (
                  <Text>
                    <Anchor href={u.link_citications} target="_blank">
                      Citications
                    </Anchor>
                  </Text>
                )}
                {u.link_orcid && (
                  <Text>
                    <Anchor href={u.link_orcid} target="_blank">
                      ORCID
                    </Anchor>
                  </Text>
                )}
                {u.link_researchgate && (
                  <Text>
                    <Anchor href={u.link_researchgate} target="_blank">
                      Researchgate
                    </Anchor>
                  </Text>
                )}
                {u.link_googleScholar && (
                  <Text>
                    <Anchor href={u.link_googleScholar} target="_blank">
                      Google Scholar
                    </Anchor>
                  </Text>
                )}
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, xs: 8 }}>
              <Paper
                radius="md"
                withBorder
                p="lg"
                bg="var(--mantine-color-body)"
              >
                <ScrollArea pb="xs">
                  <SegmentedControl
                    value={tab}
                    onChange={setTab}
                    data={tabs.map((tab: any) => ({
                      label: tab.label,
                      value: tab.value,
                    }))}
                  />
                </ScrollArea>

                <Space h="md" />

                {tab === "tong-quan" ? (
                  <></>
                ) : tab === "gd-ct" ? (
                  <LyLich.GiangDayVaCongTac view={idLyLich} />
                ) : tab === "du-an-da-tham-gia" ? (
                  <LyLich.DuAnDaThamGia
                    type={fields.filter((field: any) =>
                      /^duAnThamGia_/.test(field)
                    )}
                    view={idLyLich}
                  />
                ) : tab === "hd-ncs-hvch" ? (
                  <LyLich.HuongDan
                    type={fields.filter((field: any) =>
                      /^huongDan_/.test(field)
                    )}
                    view={idLyLich}
                  />
                ) : tab === "bai-bao-khoa-hoc" ? (
                  <LyLich.BaiBao
                    type={fields.filter((field: any) => /^baiBao_/.test(field))}
                    view={idLyLich}
                  />
                ) : tab === "khen-thuong" ? (
                  <LyLich.KhenThuong
                    type={fields.filter((field: any) =>
                      /^giaiThuong_/.test(field)
                    )}
                    view={idLyLich}
                  />
                ) : tab === "mon-giang-day" ? (
                  <LyLich.MonGiangDay view={idLyLich} />
                ) : tab === "nhom-nghien-cuu-uef" ? (
                  <LyLich.NhomNghienCuuUEF view={idLyLich} />
                ) : (
                  <></>
                )}
              </Paper>
            </Grid.Col>
          </Grid>
        </Container>
      )}
    </>
  );
};

export default UPage;
