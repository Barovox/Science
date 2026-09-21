import { useState } from "react";
import style from "./style.module.css";
import cx from "clsx";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArticle,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandYoutube,
  IconBuildings,
  IconChevronDown,
  IconLogout,
  IconMoon,
  IconNews,
  IconSchool,
  IconSun,
  IconUser,
} from "@tabler/icons-react";
import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Burger,
  Button,
  Center,
  Collapse,
  Container,
  Divider,
  Drawer,
  Group,
  HoverCard,
  Image,
  Menu,
  ScrollArea,
  SimpleGrid,
  Text,
  ThemeIcon,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import uef_logo_1 from "@/assets/uef_logo_1.png";
import { UserLogin } from "@/models/UserLogin";
import { removeSessionData } from "@/utils/session";
import { modals } from "@mantine/modals";
import { MenuThongBao } from "@/components";
import { ASSETS_KHCN_URL, KEKHAI_SYSTEM_URL } from "@/utils/env";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const [hoiDongKhoaHocLinksOpened, { toggle: toggleHoiDongKhoaHocLinks }] =
    useDisclosure(false);
  const theme = useMantineTheme();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const user: UserLogin = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string,
  );

  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const mockdata = [
    {
      link: `${KEKHAI_SYSTEM_URL}`,
      icon: IconNews,
      title: "Kê Khai NCKH",
      description: "Các bài báo nghiên cứu khoa học",
      onClick: () =>
        window.open(
          `${KEKHAI_SYSTEM_URL}/NguoiDung/Login?request=${user.Token}`,
          "_blank",
        ),
    },
    {
      link: "#",
      icon: IconBuildings,
      title: "NCKH GV-UEF",
      description: "Các dự án nghiên cứu khoa học của UEF",
    },
    {
      link: "#",
      icon: IconSchool,
      title: "NCKH SV-UEF",
      description: "Các dự án nghiên cứu khoa học của sinh viên",
    },
  ];

  const hoiDongKhoaHocLinksData = [
    {
      link: "/hoi-dong/hoi-dong-xet-duyet-de-tai-cbgvnv",
      icon: IconArticle,
      title: "Hội đồng xét duyệt đề tài CB-GV-NV",
    },
    {
      link: "/hoi-dong/hoi-dong-nghiem-thu-gia-han-huy-de-tai",
      icon: IconArticle,
      title: "Hội đồng nghiệm thu đề tài CB-GV-NV",
    },
    {
      link: "#",
      icon: IconArticle,
      title: "Hội đồng xét duyệt đề tài NCKH-SV",
    },
    {
      link: "#",
      icon: IconArticle,
      title: "Hội đồng nghiệm thu đề tài NCKH-SV",
    },
    {
      link: "#",
      icon: IconArticle,
      title: "Hội đồng xét duyệt Sáng kiến",
    },
    {
      link: "#",
      icon: IconArticle,
      title: "Hội đồng xét duyệt bài báo hội thảo",
    },
  ];

  const footerData = [
    {
      title: "Giới thiệu",
      links: [
        { label: "Chính sách bảo mật", link: "#" },
        { label: "Điều khoản sử dụng", link: "#" },
      ],
    },
    {
      title: "Bài báo & Dự án",
      links: [
        {
          label: "Kê Khai NCKH",
          link: `${KEKHAI_SYSTEM_URL}`,
          onClick: () =>
            window.open(
              `${KEKHAI_SYSTEM_URL}/NguoiDung/Login?request=${user.Token}`,
              "_blank",
            ),
        },
        { label: "NCKH GV-UEF", link: "#" },
        { label: "NCKH SV-UEF", link: "#" },
      ],
    },
    {
      title: "Hỗ trợ",
      links: [
        { label: "Trung tâm trợ giúp", link: "/help-center" },
        { label: "Liên hệ", link: "#" },
      ],
    },
  ];

  const groups = footerData.map((group) => {
    const links = group.links.map((link, index) => (
      <Text<"a">
        key={index}
        className={style.footerLink}
        component="a"
        href={link.link}
        onClick={
          link.onClick
            ? (e) => {
                e.preventDefault();
                link.onClick();
              }
            : undefined
        }
      >
        {link.label}
      </Text>
    ));

    return (
      <div className={style.footerWrapper} key={group.title}>
        <Text className={style.footerTitle}>{group.title}</Text>
        {links}
      </div>
    );
  });

  const handleLogout = () => {
    modals.openConfirmModal({
      title: "Đăng xuất",
      centered: true,
      children: (
        <Text size="sm">
          Điều này sẽ đăng xuất bạn khỏi hệ thống. Bạn có chắc chắn muốn tiếp
          tục không?
        </Text>
      ),
      labels: { confirm: "Đăng xuất", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onCancel: () => {},
      onConfirm: async () => {
        await removeSessionData("CurrentUser");
        window.location.href = "/login";
      },
    });
  };

  const hoiDongKhoaHocLinks = hoiDongKhoaHocLinksData.map((item) => (
    <UnstyledButton
      className={style.subLink}
      key={item.title}
      onClick={() => window.open(item.link, "_self")?.focus()}
    >
      <Group wrap="nowrap" align="center">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={22} color={theme.colors.blue[6]} />
        </ThemeIcon>
        <Text size="sm" fw={500}>
          {item.title}
        </Text>
      </Group>
    </UnstyledButton>
  ));

  const links = mockdata.map((item) => (
    <UnstyledButton
      className={style.subLink}
      key={item.title}
      onClick={
        item.onClick
          ? (e) => {
              e.preventDefault();
              item.onClick();
            }
          : () => window.open(item.link, "_self")?.focus()
      }
    >
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={22} color={theme.colors.blue[6]} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <>
      <Box pb={60}>
        <header className={style.header}>
          <Group justify="space-between" h="100%">
            <Image src={uef_logo_1} alt="UEF logo" h={50} />

            <Group h="100%" gap={0} visibleFrom="sm">
              <a href="/" className={style.link}>
                Trang chủ
              </a>
              <a href="/publish-profiles" className={style.link}>
                Hồ sơ khoa học
              </a>
              <HoverCard
                width={600}
                position="bottom"
                radius="md"
                shadow="md"
                withinPortal
              >
                <HoverCard.Target>
                  <a href="#" className={style.link}>
                    <Center inline>
                      <Box component="span" mr={5}>
                        Bài báo & Dự án
                      </Box>
                      <IconChevronDown size={16} color={theme.colors.blue[6]} />
                    </Center>
                  </a>
                </HoverCard.Target>

                <HoverCard.Dropdown style={{ overflow: "hidden" }}>
                  <Group justify="space-between" px="md">
                    <Text fw={500}>Bài báo & Dự án</Text>
                    <Anchor href="#" fz="xs">
                      Xem tất cả
                    </Anchor>
                  </Group>

                  <Divider my="sm" />

                  <SimpleGrid cols={2} spacing={0}>
                    {links}
                  </SimpleGrid>

                  <div className={style.dropdownFooter}>
                    <Group justify="space-between">
                      <div>
                        <Text fw={500} fz="sm">
                          Bắt đầu nghiên cứu
                        </Text>
                        <Text size="xs" c="dimmed">
                          Tìm hiểu thêm về các dự án nghiên cứu khoa học tại UEF
                        </Text>
                      </div>
                      <Button
                        variant="default"
                        component="a"
                        href={`${KEKHAI_SYSTEM_URL}`}
                        onClick={(e: any) => {
                          e.preventDefault();
                          window.open(
                            `${KEKHAI_SYSTEM_URL}/NguoiDung/Login?request=${user.Token}`,
                            "_blank",
                          );
                        }}
                      >
                        Bắt đầu
                      </Button>
                    </Group>
                  </div>
                </HoverCard.Dropdown>
              </HoverCard>
              {/* <a href="/phan-bien" className={style.link}>
                Phản biện
              </a> */}
              <HoverCard
                width={600}
                position="bottom"
                radius="md"
                shadow="md"
                withinPortal
              >
                <HoverCard.Target>
                  <a href="#" className={style.link}>
                    <Center inline>
                      <Box component="span" mr={5}>
                        Hội đồng khoa học
                      </Box>
                      <IconChevronDown size={16} color={theme.colors.blue[6]} />
                    </Center>
                  </a>
                </HoverCard.Target>

                <HoverCard.Dropdown style={{ overflow: "hidden" }}>
                  <Group justify="space-between" px="md">
                    <Text fw={500}>Hội đồng khoa học</Text>
                  </Group>

                  <Divider my="sm" />

                  <SimpleGrid cols={2} spacing={0}>
                    {hoiDongKhoaHocLinks}
                  </SimpleGrid>
                </HoverCard.Dropdown>
              </HoverCard>
              <a href="/help-center" className={style.link}>
                Hỗ trợ
              </a>
            </Group>

            <Group h="100%" gap="md">
              <MenuThongBao />

              <Menu
                width={260}
                position="bottom-end"
                transitionProps={{ transition: "pop-top-right" }}
                onClose={() => setUserMenuOpened(false)}
                onOpen={() => setUserMenuOpened(true)}
                withinPortal
              >
                <Menu.Target>
                  <UnstyledButton
                    className={cx(style.user, {
                      [style.userActive]: userMenuOpened,
                    })}
                  >
                    <Group gap={7}>
                      <Avatar
                        src={`${ASSETS_KHCN_URL}/avatars/${
                          user.IDUser
                        }.png?t=${Date.now()}`}
                        name={user.HoTen}
                        radius="xl"
                        size={20}
                        color="initials"
                      />
                      <Text fw={500} size="sm" lh={1} mr={3}>
                        {user.HoTen}
                      </Text>
                      <IconChevronDown size={12} stroke={1.5} />
                    </Group>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Cài đặt</Menu.Label>
                  <Menu.Item
                    leftSection={
                      computedColorScheme === "light" ? (
                        <IconMoon size={16} stroke={1.5} />
                      ) : (
                        <IconSun size={16} stroke={1.5} />
                      )
                    }
                    onClick={() =>
                      setColorScheme(
                        computedColorScheme === "light" ? "dark" : "light",
                      )
                    }
                  >
                    Chuyển chủ đề{" "}
                    {computedColorScheme === "light" ? "tối" : "sáng"}
                  </Menu.Item>

                  <Menu.Divider />

                  <Menu.Label>Tài khoản</Menu.Label>
                  <Menu.Item
                    component="a"
                    leftSection={<IconUser size={16} stroke={1.5} />}
                    href="/ly-lich"
                  >
                    Lý lịch cá nhân
                  </Menu.Item>
                  <Menu.Item
                    color="red"
                    leftSection={<IconLogout size={16} stroke={1.5} />}
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>

            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              hiddenFrom="sm"
            />
          </Group>
        </header>

        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          size="100%"
          padding="md"
          title="Navigation"
          hiddenFrom="sm"
          zIndex={1000000}
        >
          <ScrollArea h="calc(100vh - 80px" mx="-md">
            <Divider my="sm" />

            <a href="/" className={style.link}>
              Trang chủ
            </a>
            <a href="/publish-profiles" className={style.link}>
              Hồ sơ khoa học
            </a>
            <UnstyledButton className={style.link} onClick={toggleLinks}>
              <Center inline>
                <Box component="span" mr={5}>
                  Bài báo & Dự án
                </Box>
                <IconChevronDown size={16} color={theme.colors.blue[6]} />
              </Center>
            </UnstyledButton>
            <Collapse in={linksOpened}>{links}</Collapse>
            {/* <a href="/phan-bien" className={style.link}>
              Phản biện
            </a> */}
            <UnstyledButton
              className={style.link}
              onClick={toggleHoiDongKhoaHocLinks}
            >
              <Center inline>
                <Box component="span" mr={5}>
                  Hội đồng khoa học
                </Box>
                <IconChevronDown size={16} color={theme.colors.blue[6]} />
              </Center>
            </UnstyledButton>
            <Collapse in={hoiDongKhoaHocLinksOpened}>
              {hoiDongKhoaHocLinks}
            </Collapse>
            <a href="/help-center" className={style.link}>
              Trung tâm hỗ trợ
            </a>

            <Divider my="sm" />

            <Group px="md">
              <Avatar
                src={`${ASSETS_KHCN_URL}/avatars/${
                  user.IDUser
                }.png?t=${Date.now()}`}
                name={user.HoTen}
                radius="xl"
                color="initials"
              />
              <div>
                <Text fw={500}>{user.HoTen}</Text>
                <Text size="xs" c="dimmed">
                  {user.IDUser}
                </Text>
              </div>
            </Group>

            <Divider my="sm" />

            <a
              className={style.link}
              onClick={() =>
                setColorScheme(
                  computedColorScheme === "light" ? "dark" : "light",
                )
              }
            >
              Chuyển chủ đề {computedColorScheme === "light" ? "tối" : "sáng"}
            </a>

            <Divider my="sm" />

            <a href="/ly-lich" className={style.link}>
              Lý lịch cá nhân
            </a>

            <Divider my="sm" />

            <Group justify="center" grow pb="xl" px="md">
              <Button color="red" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </Group>
          </ScrollArea>
        </Drawer>
      </Box>

      <div className={style["main-layout"]}>{children}</div>

      <footer className={style.fFooter}>
        <Container className={style.fInner}>
          <div className={style.fLogo}>
            <Image src={uef_logo_1} alt="UEF logo" h={50} />
            <Text size="xs" c="dimmed" className={style.fDescription}>
              Cổng thông tin quản lý nghiên cứu khoa học và tra cứu xếp hạng tạp
              chí.
            </Text>
          </div>
          <div className={style.fGroups}>{groups}</div>
        </Container>
        <Container className={style.fAfterFooter}>
          <Text c="dimmed" size="sm">
            © 2025 - Bản quyền bởi UEF
          </Text>

          <Group
            gap={0}
            className={style.fSocial}
            justify="flex-end"
            wrap="nowrap"
          >
            <ActionIcon
              size="lg"
              color="gray"
              variant="subtle"
              component="a"
              href="https://www.facebook.com/uef.edu.vn"
            >
              <IconBrandFacebook size={18} stroke={1.5} />
            </ActionIcon>
            <ActionIcon
              size="lg"
              color="gray"
              variant="subtle"
              component="a"
              href="https://www.instagram.com/uef.edu.vn/"
            >
              <IconBrandInstagram size={18} stroke={1.5} />
            </ActionIcon>
            <ActionIcon
              size="lg"
              color="gray"
              variant="subtle"
              component="a"
              href="https://www.linkedin.com/school/university-of-economics-and-finance/"
            >
              <IconBrandLinkedin size={18} stroke={1.5} />
            </ActionIcon>
            <ActionIcon
              size="lg"
              color="gray"
              variant="subtle"
              component="a"
              href="https://www.youtube.com/@daihocuef"
            >
              <IconBrandYoutube size={18} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Container>
      </footer>
    </>
  );
};

export default MainLayout;
