"use client";

import { ActionList } from "@/components/ActionList";
import { Button, Column, Icon, Line, Row, Text } from "@once-ui-system/core";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import styles from "./SkillSections.module.scss";

type Item = { label: string; text?: string; links?: { href: string; label: string }[] };
type Section = { id: string; title: string; summary?: string; intro?: string; items: Item[] };

// Hides a panel so find-in-page can still reveal it, with a plain hidden fallback.
function hidePanel(el: HTMLElement) {
  el.setAttribute("hidden", "until-found");
  if ((el.hidden as unknown) !== "until-found") el.setAttribute("hidden", "");
}

function SkillSection({
  section,
  open,
  animate,
  onToggle,
}: {
  section: Section;
  open: boolean;
  animate: boolean;
  onToggle: (id: string, v: boolean) => void;
}) {
  const uid = useId();
  const panelId = `${section.id}-panel-${uid.replace(/:/g, "")}`;
  const panelRef = useRef<HTMLElement | null>(null);
  const details = section.items.filter((i) => i.links?.length).length;
  // Animation state, separate from the open state.
  const [expanded, setExpanded] = useState(open);

  useLayoutEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (open) {
      el.removeAttribute("hidden");
      if (!animate || reduce) {
        setExpanded(true);
        return;
      }
      const raf = requestAnimationFrame(() => setExpanded(true));
      return () => cancelAnimationFrame(raf);
    }
    setExpanded(false);
    if (!animate || reduce) {
      hidePanel(el);
      return;
    }
    const timer = setTimeout(() => hidePanel(el), 160);
    return () => clearTimeout(timer);
  }, [open, animate]);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const onMatch = () => onToggle(section.id, true);
    el.addEventListener("beforematch", onMatch);
    return () => el.removeEventListener("beforematch", onMatch);
  }, [onToggle, section.id]);

  return (
    <Column id={section.id} className={styles.section} fillWidth style={{ scrollMarginTop: 96 }}>
      <Line />
      <div className={styles.header}>
        <h2 style={{ margin: 0 }}>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            className={styles.toggle}
            onClick={() => onToggle(section.id, !open)}
            style={{
              all: "unset",
              cursor: "pointer",
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              paddingTop: 16,
            }}
          >
            <Text variant="heading-strong-l">{section.title}</Text>
            <Icon
              className={styles.chevron}
              name="chevronDown"
              size="s"
              onBackground="neutral-weak"
              style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
            />
          </button>
        </h2>
        <Text
          as="p"
          variant="body-default-s"
          onBackground="neutral-weak"
          marginTop="4"
          paddingBottom="16"
          style={{ lineHeight: "1.55" }}
        >
          {section.summary ?? section.items.map((i) => i.label).join(" · ")}
          {details > 0 ? (
            <Text as="span" variant="label-default-s" onBackground="brand-medium">
              {` · ${details} Details ${details === 1 ? "page" : "pages"}`}
            </Text>
          ) : null}
        </Text>
      </div>
      <section
        id={panelId}
        ref={panelRef}
        aria-label={section.title}
        className={`${styles.panel} ${expanded ? styles.open : ""} ${animate ? "" : styles.instant}`}
      >
        <div className={styles.inner}>
          {section.intro ? (
            <Text
              as="p"
              onBackground="neutral-medium"
              style={{ lineHeight: "175%" }}
              marginBottom="8"
            >
              {section.intro}
            </Text>
          ) : null}
          <ActionList
            showLinkGroupLabel={false}
            showModalGroupLabel={false}
            items={section.items}
          />
          <div style={{ height: 16 }} />
        </div>
      </section>
    </Column>
  );
}

// Saves open sections for this tab.
function saveOpen(state: Record<string, boolean>) {
  try {
    sessionStorage.setItem(`skill-sections:${window.location.pathname}`, JSON.stringify(state));
  } catch {
    // Ignore storage errors.
  }
}

export function SkillSections({ sections }: { sections: Section[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  // Animate only after user interaction.
  const [animate, setAnimate] = useState(false);
  const allOpen = sections.every((s) => open[s.id]);

  // Restore open sections and scroll position before the first paint.
  const [restore, setRestore] = useState<{ y: number | null; hash: string } | null>(null);
  useLayoutEffect(() => {
    const key = `skill-sections:${window.location.pathname}`;
    let saved: Record<string, boolean> = {};
    let savedY: number | null = null;
    try {
      saved = JSON.parse(sessionStorage.getItem(key) ?? "{}");
      const y = sessionStorage.getItem(`${key}:y`);
      savedY = y === null ? null : Number(y);
    } catch {
      // Ignore storage errors.
    }
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const fromHash = sections.some((s) => s.id === hash) ? { [hash]: true } : {};
    setOpen({ ...saved, ...fromHash });
    setRestore({
      y: savedY !== null && !Number.isNaN(savedY) ? savedY : null,
      hash: hash in fromHash ? hash : "",
    });
  }, [sections]);

  // Apply the restored scroll position.
  useLayoutEffect(() => {
    if (!restore) return;
    const key = `skill-sections:${window.location.pathname}`;
    const apply = () => {
      if (restore.y !== null) window.scrollTo({ top: restore.y, behavior: "instant" });
      else if (restore.hash)
        document
          .getElementById(restore.hash)
          ?.scrollIntoView({ block: "start", behavior: "instant" });
    };
    apply();
    // Re-apply if the position changed after load.
    const raf = requestAnimationFrame(() => {
      if (restore.y !== null && Math.abs(window.scrollY - restore.y) > 2) apply();
      try {
        sessionStorage.removeItem(`${key}:y`);
      } catch {
        // Ignore storage errors.
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [restore]);

  useEffect(() => {
    const onHashChange = () => {
      const h = decodeURIComponent(window.location.hash.slice(1));
      if (sections.some((s) => s.id === h)) setOpen((o) => ({ ...o, [h]: true }));
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [sections]);

  // Save the scroll position when a link is followed.
  const onLinkClick = (event: React.MouseEvent) => {
    if (!(event.target as HTMLElement).closest("a")) return;
    try {
      sessionStorage.setItem(
        `skill-sections:${window.location.pathname}:y`,
        String(window.scrollY),
      );
    } catch {
      // Ignore storage errors.
    }
  };

  const toggle = useCallback((id: string, value: boolean) => {
    setAnimate(true);
    setOpen((o) => {
      const next = { ...o, [id]: value };
      saveOpen(next);
      return next;
    });
  }, []);

  return (
    <Column fillWidth marginTop="24" onClickCapture={onLinkClick}>
      <Row horizontal="end" paddingBottom="8">
        <Button
          size="s"
          variant="tertiary"
          label={allOpen ? "Hide all sections" : "Show all sections"}
          onClick={() => {
            const next = Object.fromEntries(sections.map((s) => [s.id, !allOpen]));
            saveOpen(next);
            setAnimate(true);
            setOpen(next);
          }}
        />
      </Row>
      {sections.map((s) => (
        <SkillSection
          key={s.id}
          section={s}
          open={!!open[s.id]}
          animate={animate}
          onToggle={toggle}
        />
      ))}
      <Line />
    </Column>
  );
}
