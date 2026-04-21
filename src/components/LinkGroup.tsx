"use client";

import React from "react";
import {Row, SmartLink, RowProps, Text, Column} from "@once-ui-system/core";

export type LinkItem = {
    href: string;
    label: string;
};

type LinkGroupProps = {
    items: LinkItem[];
    gap?: RowProps["gap"];           // "8", "12", "16", "20", etc.
    wrap?: boolean;
    marginTop?: RowProps["marginTop"];
    marginBottom?: RowProps["marginBottom"];
} & Omit<RowProps, "children">;

export function LinkGroup({items, gap = "12", wrap = true, marginTop = "8", marginBottom = "12", ...rowProps}: LinkGroupProps) {
    if (!items || items.length === 0) return null;

    return (
        <Column marginTop={marginTop} marginBottom={marginBottom} gap="12">
            <Text
                variant="label-default-xs"
                onBackground="neutral-weak">
                Links
            </Text>

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
        </Column>
    );
}