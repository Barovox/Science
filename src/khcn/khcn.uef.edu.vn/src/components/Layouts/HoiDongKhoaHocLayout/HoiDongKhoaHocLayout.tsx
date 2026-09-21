import { UserLogin } from "@/models/UserLogin";
import { HoiDongKhoaHocLogin } from "@/models/HoiDongKhoaHocLogin";
import { ASSETS_KHCN_URL } from "@/utils/env";
import { removeSessionData } from "@/utils/session";
import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Button,
  Center,
  Divider,
  Group,
  Menu,
  ScrollArea,
  Text,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import {
  IconArrowLeft,
  IconLogout,
  IconMoon,
  IconNotebook,
  IconSun,
  IconVocabulary,
} from "@tabler/icons-react";
import { useState } from "react";
import cx from "clsx";
import classes from "./style.module.css";
import { NavLink } from "@/props";

const HoiDongXetDuyetDeTaiCBGVNV = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const user: Partial<UserLogin & HoiDongKhoaHocLogin> = JSON.parse(
    sessionStorage.getItem("CurrentUser") as string,
  );

  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const mainData = [
    {
      path: "hoi-dong-xet-duyet-de-tai-cbgvnv",
      label: "Xét duyệt Đề tài CB-GV-NV",
      icon: IconNotebook,
    },
    {
      path: "quan-ly-xet-duyet",
      label: "Quản lý kết quả xét duyệt đề cương",
      icon: IconVocabulary,
      onlyRole: "Quyền cao nhất",
    },
    {
      path: "hoi-dong-nghiem-thu-gia-han-huy-de-tai",
      label: "Nghiệm thu / gia hạn / hủy đề tài",
      icon: IconNotebook,
    },
    {
      path: "quan-ly-nghiem-thu",
      label: "Quản lý kết quả nghiệm thu, thanh lý, hủy đề tài",
      icon: IconVocabulary,
      onlyRole: "Quyền cao nhất",
    },
  ];

  const getPath = (): string => {
    return window.location.href.split("/")[4]?.split("?")[0];
  };

  const [path, setPath] = useState<string>(getPath());

  const handleLogout = () => {
    modals.openConfirmModal({
      title: "Đăng xuất",
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

  const Links = ({ path: link, label, icon: Icon, onlyRole }: NavLink) => {
    if (onlyRole && user.Role !== onlyRole) {
      return null;
    }

    return (
      <a
        className={classes.link}
        data-active={link === path || undefined}
        href={`/hoi-dong/${link}`}
        key={label}
        onClick={() => setPath(link)}
      >
        <Icon className={classes.linkIcon} stroke={1.5} />
        <span>{label}</span>
      </a>
    );
  };

  const mainLinks = mainData.map((link) => (
    <Links {...link} key={link.label} />
  ));

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
            <Burger
              opened={desktopOpened}
              onClick={toggleDesktop}
              visibleFrom="sm"
              size="sm"
            />
            <Text fw={700} size="xl">
              Hội đồng khoa học
            </Text>
          </Group>
          <Group>
            <ActionIcon
              onClick={() =>
                setColorScheme(
                  computedColorScheme === "light" ? "dark" : "light",
                )
              }
              variant="default"
              size="xl"
              aria-label="Toggle color scheme"
            >
              <IconSun
                className={cx(classes.icon, classes.light)}
                stroke={1.5}
              />
              <IconMoon
                className={cx(classes.icon, classes.dark)}
                stroke={1.5}
              />
            </ActionIcon>

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
                  className={cx(classes.user, {
                    [classes.userActive]: userMenuOpened,
                  })}
                >
                  <Avatar
                    src={`${ASSETS_KHCN_URL}/avatars/${
                      user.IDUser
                    }.png?t=${Date.now()}`}
                    name={user.HoTen}
                    radius="xl"
                    color="initials"
                  />
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>
                  <Group>
                    <Avatar
                      radius="xl"
                      src={`${ASSETS_KHCN_URL}/avatars/${
                        user.IDUser
                      }.png?t=${Date.now()}`}
                      name={user.HoTen}
                      color="initials"
                    />

                    <div>
                      <Text fw={500}>{user.HoTen}</Text>
                      <Text size="xs" c="dimmed">
                        {user.IDUser}
                      </Text>
                    </div>
                  </Group>
                </Menu.Item>

                <Menu.Divider />

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
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        {user.Role !== "HoiDongKhoaHoc" && (
          <AppShell.Section>
            <Button
              component="a"
              href="/"
              color="red"
              leftSection={<IconArrowLeft stroke={1.5} />}
            >
              Về trang chủ
            </Button>
            <Divider mt="sm" />
          </AppShell.Section>
        )}
        <AppShell.Section grow my="md" component={ScrollArea}>
          {mainLinks}
        </AppShell.Section>
        <AppShell.Section>
          <Divider mb="sm" />
          <Center>&copy; {new Date().getFullYear()} - Bản quyền bởi UEF</Center>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default HoiDongXetDuyetDeTaiCBGVNV;
