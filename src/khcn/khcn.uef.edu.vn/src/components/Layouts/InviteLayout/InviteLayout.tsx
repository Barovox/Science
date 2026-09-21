import classes from "./style.module.css";
import cx from "clsx";
import { IconMoon, IconSun } from "@tabler/icons-react";
import {
  ActionIcon,
  Box,
  Group,
  Image,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import uef_logo_1 from "@/assets/uef_logo_1.png";

const InviteLayout = ({ children }: { children: React.ReactNode }) => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <>
      <Box pb={60}>
        <header className={classes.header}>
          <Group justify="space-between" h="100%">
            <Image src={uef_logo_1} alt="UEF logo" h={50} />

            <ActionIcon
              onClick={() =>
                setColorScheme(
                  computedColorScheme === "light" ? "dark" : "light"
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
          </Group>
        </header>
      </Box>

      <div className={classes["main-layout"]}>{children}</div>
    </>
  );
};

export default InviteLayout;
