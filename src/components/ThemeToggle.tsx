"use client";

import { ToggleButton, useTheme } from "@once-ui-system/core";
import { useRef } from "react";
import styles from "./ThemeToggle.module.scss";

// CSS shows the button for the current theme.
export const ThemeToggle = () => {
  const { setTheme } = useTheme();
  const toLight = useRef<HTMLElement>(null);
  const toDark = useRef<HTMLElement>(null);

  // Switches the theme and animates the new icon.
  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    const clicked = next === "dark" ? toDark.current : toLight.current;
    const shown = next === "dark" ? toLight.current : toDark.current;
    const hadFocus = document.activeElement === clicked;

    root.classList.add("theme-switching");
    setTheme(next);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => root.classList.remove("theme-switching")),
    );

    if (hadFocus) shown?.focus();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      shown?.querySelector("svg")?.animate(
        [
          { transform: "rotate(-90deg) scale(0.6)", opacity: 0 },
          { transform: "none", opacity: 1 },
        ],
        { duration: 300, easing: "ease-out" },
      );
    }
  };

  return (
    <>
      <ToggleButton
        ref={toLight}
        className={`${styles.toggle} ${styles.toLight}`}
        prefixIcon="light"
        onClick={toggle}
        aria-label="Switch to light mode"
      />
      <ToggleButton
        ref={toDark}
        className={`${styles.toggle} ${styles.toDark}`}
        prefixIcon="dark"
        onClick={toggle}
        aria-label="Switch to dark mode"
      />
    </>
  );
};
