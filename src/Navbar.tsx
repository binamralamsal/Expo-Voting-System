import {
  createStyles,
  Header,
  Group,
  Anchor,
  Divider,
  Box,
  Burger,
  Drawer,
  ScrollArea,
  rem,
  Container,
  Switch,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan("sm")]: {
      height: rem(42),
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    }),
  },

  subLink: {
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
    }),

    "&:active": theme.activeStyles,
  },

  hiddenMobile: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
}));

export const Navbar = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { classes, theme } = useStyles();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Box mb={"md"} pos={"sticky"} top={0} sx={{ zIndex: 999 }}>
      <Header height={60} px="md">
        <Container size="xl">
          <Group position="apart" sx={{ height: 60 }}>
            <Anchor>Club Portal</Anchor>
            <Group
              sx={{ height: "100%" }}
              spacing={0}
              className={classes.hiddenMobile}
            >
              <Link href="/projects" className={classes.link}>
                Projects
              </Link>
              <Link href="/peoples" className={classes.link}>
                Peoples
              </Link>
              <Link href="/contact" className={classes.link}>
                Contact
              </Link>
            </Group>
            <Group className={classes.hiddenMobile}>
              <Switch
                checked={colorScheme === "dark"}
                onChange={() => toggleColorScheme()}
                size="md"
                onLabel={
                  <IconSun color={theme.white} size="1.15rem" stroke={1.5} />
                }
                offLabel={
                  <IconMoonStars
                    color={theme.colors.gray[6]}
                    size="1.15rem"
                    stroke={1.5}
                  />
                }
              />
            </Group>
            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              className={classes.hiddenDesktop}
            />
          </Group>
        </Container>
      </Header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />

          <Link onClick={closeDrawer} href="/" className={classes.link}>
            Home
          </Link>
          <Link onClick={closeDrawer} href="/about" className={classes.link}>
            About
          </Link>
          <Link onClick={closeDrawer} href="/contact" className={classes.link}>
            Contact
          </Link>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};
