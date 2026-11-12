"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Fade, Flex, Row, ToggleButton } from "@once-ui-system/core";

import { routes, display, person, home, about, work } from "@/resources";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Header.module.scss";

type TimeDisplayProps = {
  timeZone: string;
  locale?: string; // Optionally allow locale, defaulting to 'en-GB'
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeZone, locale = "en-GB" }) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const timeString = new Intl.DateTimeFormat(locale, options).format(now);
      setCurrentTime(timeString);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [timeZone, locale]);

  return <>{currentTime}</>;
};

export default TimeDisplay;

export const Header = () => {
  const pathname = usePathname() ?? "";

  return (
    <>
      <Fade s={{ hide: true }} fillWidth position="fixed" height="80" zIndex={9} />
      <Fade
        hide
        s={{ hide: false }}
        fillWidth
        position="fixed"
        bottom="0"
        to="top"
        height="80"
        zIndex={9}
      />
      <Row
        fitHeight
        className={styles.position}
        position="sticky"
        as="header"
        zIndex={9}
        fillWidth
        padding="8"
        horizontal="center"
        data-border="rounded"
        s={{
          position: "fixed",
        }}
      >
        <Row paddingLeft="12" fillWidth vertical="center" textVariant="body-default-s">
          {display.location && <Row s={{ hide: true }}>{person.location}</Row>}
        </Row>
        <Row fillWidth horizontal="center">
          <Row
            className={styles.menu}
            gap="4"
            vertical="center"
            textVariant="body-default-s"
            zIndex={1}
            suppressHydrationWarning
          >
            {routes["/"] && (
              <Row
                background="page"
                border="neutral-alpha-weak"
                radius="full"
                shadow="l"
                padding="4"
              >
                <ToggleButton
                  prefixIcon="home"
                  href="/"
                  aria-label={home.label}
                  selected={pathname === "/"}
                  aria-current={pathname === "/" ? "page" : undefined}
                />
              </Row>
            )}
            {(routes["/about"] || routes["/work"]) && (
              <Row
                background="page"
                border="neutral-alpha-weak"
                radius="full"
                shadow="l"
                padding="4"
                gap="4"
              >
                {routes["/about"] && (
                  <>
                    <Row s={{ hide: true }}>
                      <ToggleButton
                        prefixIcon="person"
                        href="/about"
                        label={about.label}
                        selected={pathname === "/about"}
                        aria-current={pathname === "/about" ? "page" : undefined}
                      />
                    </Row>
                    <Row hide s={{ hide: false }}>
                      <ToggleButton
                        prefixIcon="person"
                        href="/about"
                        selected={pathname === "/about"}
                        aria-current={pathname === "/about" ? "page" : undefined}
                      />
                    </Row>
                  </>
                )}
                {routes["/work"] && (
                  <>
                    <Row s={{ hide: true }}>
                      <ToggleButton
                        prefixIcon="grid"
                        href="/work"
                        label={work.label}
                        selected={pathname.startsWith("/work")}
                        aria-current={pathname.startsWith("/work") ? "page" : undefined}
                      />
                    </Row>
                    <Row hide s={{ hide: false }}>
                      <ToggleButton
                        prefixIcon="grid"
                        href="/work"
                        selected={pathname.startsWith("/work")}
                        aria-current={pathname.startsWith("/work") ? "page" : undefined}
                      />
                    </Row>
                  </>
                )}
              </Row>
            )}
            {display.themeSwitcher && (
              <Row
                background="page"
                border="neutral-alpha-weak"
                radius="full"
                shadow="l"
                padding="4"
              >
                <ThemeToggle />
              </Row>
            )}
          </Row>
        </Row>
        <Flex fillWidth horizontal="end" vertical="center">
          <Flex
            paddingRight="12"
            horizontal="end"
            vertical="center"
            textVariant="body-default-s"
            gap="20"
          >
            <Flex s={{ hide: true }}>
              {display.time && <TimeDisplay timeZone={person.location} />}
            </Flex>
          </Flex>
        </Flex>
      </Row>
    </>
  );
};
