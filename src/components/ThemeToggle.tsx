"use client";

import { ToggleButton, useTheme } from "@once-ui-system/core";
import styles from "./ThemeToggle.module.scss";

// CSS shows the button for the current theme.
export const ThemeToggle = () => {
  const { setTheme } = useTheme();

  const toggle = () => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "light" : "dark");
  };

  return (
    <>
      <ToggleButton
        className={`${styles.toggle} ${styles.toLight}`}
        prefixIcon="light"
        onClick={toggle}
        aria-label="Switch to light mode"
      />
      <ToggleButton
        className={`${styles.toggle} ${styles.toDark}`}
        prefixIcon="dark"
        onClick={toggle}
        aria-label="Switch to dark mode"
      />
    </>
  );
};
