import { LyLich, PageLoader } from "@/components";
import { UserLogin } from "@/models/UserLogin";
import { SERVER_API_URL } from "@/utils/env";
import {
  Anchor,
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
  IconLanguage,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";

const LyLichPage = () => {
  const user: UserLogin = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [tab, setTab] = useState("tong-quan");
  const [u, setU] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    getU();
  }, []);

  const getU = async () => {
    try {
      const res = await axios.get(
        `${SERVER_API_URL}/LyLich2/GetField/${user.IDUser}/ThongTinChung`,
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
                <LyLich.AvatarUploader u={u} />

                <Title order={2} fw={700} mt="md">
                  {u?.hoTen || user.HoTen}
                </Title>
                <Text c="dimmed">
                  {user.IDUser} • {user.Ngach}
                </Text>

                <Text mt="md">
                  <Center inline>
                    <IconGenderBigender size={18} stroke={1.5} /> {u?.gioiTinh}
                  </Center>
                </Text>

                <Text mt="md">
                  <Center inline>
                    <IconMail size={18} stroke={1.5} /> {u?.email}
                  </Center>
                </Text>
                <Text>
                  <Center inline>
                    <IconPhone size={18} stroke={1.5} /> {u?.sdt}
                  </Center>
                </Text>

                <Text mt="md">
                  <Center inline>
                    <IconLanguage size={18} stroke={1.5} /> {u?.ngoaiNgu}
                  </Center>
                </Text>

                <Space h="md" />

                {u?.link_scopus && (
                  <Text>
                    <Anchor href={u.link_scopus} target="_blank">
                      SCOPUS
                    </Anchor>
                  </Text>
                )}
                {u?.link_hIndexed && (
                  <Text>
                    <Anchor href={u.link_hIndexed} target="_blank">
                      H-Indexed SCOPUS
                    </Anchor>
                  </Text>
                )}
                {u?.link_citications && (
                  <Text>
                    <Anchor href={u.link_citications} target="_blank">
                      Citications
                    </Anchor>
                  </Text>
                )}
                {u?.link_orcid && (
                  <Text>
                    <Anchor href={u.link_orcid} target="_blank">
                      ORCID
                    </Anchor>
                  </Text>
                )}
                {u?.link_researchgate && (
                  <Text>
                    <Anchor href={u.link_researchgate} target="_blank">
                      Researchgate
                    </Anchor>
                  </Text>
                )}
                {u?.link_googleScholar && (
                  <Text>
                    <Anchor href={u.link_googleScholar} target="_blank">
                      Google Scholar
                    </Anchor>
                  </Text>
                )}

                <Space h="xl" />

                <Grid>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <LyLich.ThongTinChung />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <LyLich.CongKhai />
                  </Grid.Col>
                </Grid>
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
                    data={[
                      { label: "Tổng quan", value: "tong-quan" },
                      { label: "Giảng dạy và Công tác", value: "gd-ct" },
                      {
                        label: "Dự án đã tham gia",
                        value: "du-an-da-tham-gia",
                      },
                      { label: "Hướng dẫn NCS, HVCH", value: "hd-ncs-hvch" },
                      { label: "Bài báo khoa học", value: "bai-bao-khoa-hoc" },
                      { label: "Khen thưởng", value: "khen-thuong" },
                      { label: "Môn giảng dạy", value: "mon-giang-day" },
                      {
                        label: "Nhóm nghiên cứu UEF",
                        value: "nhom-nghien-cuu-uef",
                      },
                    ]}
                  />
                </ScrollArea>

                <Space h="md" />

                {tab === "tong-quan" ? (
                  <></>
                ) : tab === "gd-ct" ? (
                  <LyLich.GiangDayVaCongTac />
                ) : tab === "du-an-da-tham-gia" ? (
                  <LyLich.DuAnDaThamGia />
                ) : tab === "hd-ncs-hvch" ? (
                  <LyLich.HuongDan />
                ) : tab === "bai-bao-khoa-hoc" ? (
                  <LyLich.BaiBao />
                ) : tab === "khen-thuong" ? (
                  <LyLich.KhenThuong />
                ) : tab === "mon-giang-day" ? (
                  <LyLich.MonGiangDay />
                ) : tab === "nhom-nghien-cuu-uef" ? (
                  <LyLich.NhomNghienCuuUEF />
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

export default LyLichPage;
