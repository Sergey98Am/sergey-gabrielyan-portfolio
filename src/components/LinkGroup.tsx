"use client";

import React from "react";
import {Row, SmartLink, RowProps, Text} from "@once-ui-system/core";

export type LinkItem = {
    href: string;
    label: string;
};

type LinkGroupProps = {
    items: LinkItem[];
    gap?: RowProps["gap"];           // "8", "12", "16", "20", etc.
    wrap?: boolean;
} & Omit<RowProps, "children">;

export function LinkGroup({items, gap = "20", wrap = true, ...rowProps}: LinkGroupProps) {
    if (!items || items.length === 0) return null;

    return (
        <Row gap={gap} wrap={wrap} {...rowProps}>
            {items.map((link, index) => {
                const {href, label} = link;

                if (href.startsWith("/")) {
                    // Internal link
                    return (
                        <SmartLink
                            key={index}
                            href={href}
                            suffixIcon="arrowRight"
                            style={{margin: "0", width: "fit-content"}}
                        >
                            <Text variant="body-default-s">{label}</Text>
                        </SmartLink>
                    );
                }

                if (href.startsWith("#")) {
                    // Anchor link
                    return (
                        <a
                            key={index}
                            href={href}
                            style={{margin: "0", width: "fit-content"}}
                        >
                            <Text variant="body-default-s">{label}</Text>
                        </a>
                    );
                }

                // External link
                return (
                    <SmartLink
                        key={index}
                        href={href}
                        suffixIcon="arrowUpRightFromSquare"
                        style={{margin: "0", width: "fit-content"}}
                    >
                        <Text variant="body-default-s">{label}</Text>
                    </SmartLink>
                );
            })}
        </Row>
    );
}