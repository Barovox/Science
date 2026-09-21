import style from "./style.module.css";
import { useEffect, useState } from "react";
import { animate } from "@/utils/animate";
import {
  IoAlbums,
  IoAlbumsOutline,
  IoBook,
  IoBookOutline,
  IoPerson,
  IoPersonOutline,
  IoSchool,
  IoSchoolOutline,
} from "react-icons/io5";
import uef_home_intro_1 from "@/assets/uef_home_intro_1.jpg";
import uef_home_intro_2 from "@/assets/uef_home_intro_2.jpg";
import faqImage from "@/assets/faq-imgage.svg";
import {
  Accordion,
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Image,
  Overlay,
  SimpleGrid,
  Text,
  TextInput,
  Title,
  TypographyStylesProvider,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import {
  IconArrowRight,
  IconChartBar,
  IconCookie,
  IconGauge,
  IconSearch,
  IconUser,
} from "@tabler/icons-react";
import { UserLogin } from "@/models/UserLogin";
import { KEKHAI_SYSTEM_URL, SERVER_API_URL } from "@/utils/env";
import axios from "axios";
import ModalTraCuuXH from "@/components/TraCuuXH/TraCuuXH";

const HomePage = () => {
  const theme = useMantineTheme();

  const user: UserLogin = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string
  );

  const [search, setSearch] = useState("");
  const [faq, setFaq] = useState([]);

  const [openedTraCuuXH, setOpenedTraCuuXH] = useState(false);
  const openModalTraCuuXH = () => setOpenedTraCuuXH(true);
  const closeModalTraCuuXH = () => setOpenedTraCuuXH(false);

  useEffect(() => {
    fetchFaq();
  }, []);

  const navList = [
    {
      title: "Hồ sơ khoa học",
      icon1: <IoPersonOutline />,
      icon2: <IoPerson />,
      link: "/publish-profiles",
    },
    {
      title: "Tra cứu XH Tạp chí",
      icon1: <IconChartBar />,
      icon2: <IconChartBar />,
      link: "#",
      onClick: openModalTraCuuXH,
    },
    {
      title: "Hoạt động KHCN UEF",
      icon1: <IoBookOutline />,
      icon2: <IoBook />,
      link: `${KEKHAI_SYSTEM_URL}`,
      onClick: () =>
        window.open(
          `${KEKHAI_SYSTEM_URL}/NguoiDung/Login?request=${user.Token}`,
          "_blank"
        ),
    },
    {
      title: "Thông báo Đề tài, Dự án",
      icon1: <IoAlbumsOutline />,
      icon2: <IoAlbums />,
      link: "#",
    },
    {
      title: "Liêm chính học thuật",
      icon1: <IoSchoolOutline />,
      icon2: <IoSchool />,
      link: "#",
    },
  ];

  const mockdataFeatured = [
    {
      title: "Extreme performance",
      description:
        "This dust is actually a powerful poison that will even make a pro wrestler sick, Regice cloaks itself with frigid air of -328 degrees Fahrenheit",
      icon: IconGauge,
    },
    {
      title: "Privacy focused",
      description:
        "People say it can run at the same speed as lightning striking, Its icy body is so cold, it will not melt even if it is immersed in magma",
      icon: IconUser,
    },
    {
      title: "No third parties",
      description:
        "They're popular, but they're rare. Trainers who show them off recklessly may be targeted by thieves",
      icon: IconCookie,
    },
  ];

  const features = mockdataFeatured.map((feature) => (
    <Card
      key={feature.title}
      shadow="md"
      radius="md"
      className={style.card}
      padding="xl"
    >
      <feature.icon size={50} stroke={2} color={theme.colors.blue[6]} />
      <Text fz="lg" fw={500} className={style.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" c="dimmed" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ));

  const fetchFaq = async () => {
    try {
      const response = await axios.get(`${SERVER_API_URL}/CauHoi/Get-FAQ`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.Token}`,
        },
      });
      if (response.status === 200) {
        setFaq(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const faqCat = [
    {
      label: "Hỗ trợ kỹ thuật",
      image:
        "https://images.unsplash.com/photo-1508780709619-79562169bc64?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      label: "Hướng dẫn sử dụng",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
    },
    {
      label: "Câu hỏi khác",
      image:
        "https://images.unsplash.com/photo-1543286386-713bdd548da4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
  ];

  const faqCatItems = faqCat.map((category) => (
    <UnstyledButton
      style={{ backgroundImage: `url(${category.image})` }}
      className={style.categoryCard}
      key={category.label}
    >
      <Overlay color="#000" opacity={0.6} zIndex={1} />
      <Text size="xl" ta="center" fw={700} className={style.categoryLabel}>
        {category.label}
      </Text>
    </UnstyledButton>
  ));

  const handleSearch = () => {
    // TODO: xử lý đến trang tìm kiếm (/search?s=...)
    window.location.href = `/publish-profiles?search=${encodeURIComponent(
      search
    )}`;
  };

  return (
    <>
      <ModalTraCuuXH
        opened={openedTraCuuXH}
        onClose={closeModalTraCuuXH}
        user={user}
      />

      <div className={`${style.home} ${style.wrapper}`}>
        <div className={style.inner}>
          <Title className={style.title}>
            Welcome to the UEF Research and Innovation Portal
          </Title>

          <Container size={640}>
            <Text size="lg" className={style.description}>
              Cổng thông tin quản lý nghiên cứu khoa học và tra cứu xếp hạng tạp
              chí.
            </Text>
          </Container>

          <div className={style.controls}>
            <Button
              className={style.control}
              variant="white"
              size="lg"
              rightSection={<IconArrowRight size={18} stroke={1.5} />}
              component="a"
              href="/ly-lich"
            >
              Bắt đầu nghiên cứu
            </Button>
          </div>

          <div className={style["search-box-container"]}>
            <div className={`${style["search-box"]} ${animate("bounceIn", 0)}`}>
              <TextInput
                radius="xl"
                size="md"
                placeholder="Tìm kiếm hồ sơ tác giả, bài báo, dự án NCKH,..."
                rightSectionWidth={42}
                leftSection={<IconSearch size={18} stroke={1.5} />}
                rightSection={
                  <ActionIcon
                    size={32}
                    radius="xl"
                    color="blue"
                    variant="filled"
                    onClick={handleSearch}
                  >
                    <IconArrowRight size={18} stroke={1.5} />
                  </ActionIcon>
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <section
        className={`${style["navigation"]} ${style.sticky} ${animate(
          "fadeInUp",
          0
        )}`}
      >
        <ul className={style.tab}>
          {navList.map((nav: any, index: any) => (
            <li key={index}>
              <a
                href={nav.link}
                onClick={
                  nav.onClick
                    ? (e) => {
                        e.preventDefault();
                        nav.onClick();
                      }
                    : undefined
                }
              >
                <div className={style["nav-icon"]}>
                  {nav.icon1}
                  {nav.icon2}
                </div>
                <div className={style["nav-name"]}>
                  <span data-text={nav.title}>{nav.title}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <Container size="xl" py="xl">
        <Grid align="center">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Title order={2}>
              Chào mừng đến với trang Nghiên cứu và Đổi mới của UEF
            </Title>
            <Text>
              Các nghiên cứu của UEF tập trung vào lĩnh vực kinh tế, tài chính
              và kế toán, quản lý kinh doanh, thương mại, marketing, và các công
              nghệ định hướng phát triển bền vững và hội nhập toàn cầu. UEF cũng
              tiến hành nghiên cứu về các vấn đề liên quan trực tiếp hoặc gián
              tiếp đến luật, ngôn ngữ, quan hệ công chúng - truyền thông, ngôn
              ngữ và văn hóa quốc tế nghệ thuật lãnh đạo. Các nghiên cứu đổi mới
              của UEF giải quyết các vấn đề liên quan chuyển đổi tuần hoàn và
              chuyển đổi số góp phần thúc đẩy tăng trưởng xanh, bền vững, cải
              thiện kinh tế - xã hội. Đối với bất kỳ câu hỏi, hợp tác nào liên
              quan đến Đổi mới nghiên cứu của UEF, hãy gửi thông tin cho chúng
              tôi theo địa chỉ email:{" "}
              <Anchor href="mailto:khcn@uef.edu.vn">khcn@uef.edu.vn</Anchor>.
            </Text>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Image src={uef_home_intro_1} alt="UEF Home Intro 1" />
          </Grid.Col>
        </Grid>

        <Grid mt="xl" align="center">
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Image src={uef_home_intro_2} alt="UEF Home Intro 2" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Title order={2}>SDGs của UEF</Title>
            <Text>
              Mục tiêu phát triển bền vững của Liên hợp quốc (SDGs) là các lĩnh
              vực nghiên cứu cụ thể giúp giải quyết các vấn đề thực tế. UEF luôn
              tận tâm đóng góp cho SDGs thông qua nghiên cứu và đổi mới. UEF
              liên tục tăng cường hỗ trợ và khuyến khích người học, giảng viên,
              nhà nghiên cứu tham gia vào các đề tài, dự án gắn liến với SDGs để
              thúc đẩy các giá trị phát triển xanh, bền vững. UEF cam kết đóng
              góp tích cực để đạt được SDGs như một phần trong mục tiêu thúc đẩy
              sự xuất sắc trong nghiên cứu và giáo dục.
            </Text>
          </Grid.Col>
        </Grid>
      </Container>

      <Container size="xl" py="xl">
        <Group justify="center">
          <Badge variant="filled" size="lg">
            Tốt nhất đến nay
          </Badge>
        </Group>

        <Title order={2} className={style.featuredTitle} ta="center" mt="sm">
          Dễ dàng sử dụng, hiệu quả và bảo mật
        </Title>

        <Text
          c="dimmed"
          className={style.featuredDescription}
          ta="center"
          mt="md"
        >
          Các tính năng nổi bật giúp bạn tìm kiếm, quản lý và theo dõi nghiên
          cứu khoa học một cách dễ dàng và hiệu quả.
        </Text>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
          {features}
        </SimpleGrid>
      </Container>

      <div className={style.faqWrapper}>
        <Container size="xl">
          <Grid id="faq-grid" gutter={50}>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Image src={faqImage} alt="Câu hỏi thường gặp" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Title order={2} ta="left" className={style.faqTitle}>
                Câu hỏi thường gặp
              </Title>

              <Accordion
                chevronPosition="right"
                // defaultValue="0"
                variant="separated"
              >
                {faq.map((item: any, index: number) => (
                  <Accordion.Item
                    className={style.faqItem}
                    key={index}
                    value={index.toString()}
                  >
                    <Accordion.Control>{item.tieuDe}</Accordion.Control>
                    <Accordion.Panel>
                      <TypographyStylesProvider>
                        <div
                          dangerouslySetInnerHTML={{ __html: item.traLoi }}
                        />
                      </TypographyStylesProvider>
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Grid.Col>
          </Grid>

          <SimpleGrid cols={{ base: 1, sm: 3 }} mt="lg">
            {faqCatItems}
          </SimpleGrid>
        </Container>
      </div>
    </>
  );
};

export default HomePage;
