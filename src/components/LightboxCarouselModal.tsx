"use client";

import React, { useState, ReactNode } from "react";
import {Dialog, Column, Button, Swiper, Row, RowProps, Text} from "@once-ui-system/core";
import {tr} from "date-fns/locale";

type SwiperItem = {
    slide: ReactNode;
    alt?: string;
};

type LightboxCarouselItem = {
    label?: string;

    title?: string;
    description?: string;

    items?: SwiperItem[];
    content?: ReactNode;
};

type LightboxCarouselModalProps = {
    items: LightboxCarouselItem[];
    inline?: boolean;
    showLabel?: boolean;
    buttonSize?: "s" | "m" | "l";
    marginTop?: RowProps["marginTop"];
    marginBottom?: RowProps["marginBottom"];
};

export function LightboxCarouselModal({items, inline = false, showLabel = true, buttonSize="m", marginTop = "8", marginBottom = "12"}: LightboxCarouselModalProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <>
            <Column marginTop={!inline ? marginTop : undefined} marginBottom={!inline ? marginBottom : undefined} gap="12">
                {showLabel && (
                    <Text
                        variant="label-default-xs"
                        onBackground="neutral-weak">
                        Media
                    </Text>
                )}

                <Row gap="12" wrap>
                    {items.map((item, index) => (
                        <Button
                            key={`trigger-${index}`}
                            data-border="playful"
                            size={buttonSize}
                            label={item.label ?? "View details"}
                            onClick={() => setOpenIndex(index)}
                        />
                    ))}
                </Row>
            </Column>

            {items.map((item, index) => {
                const isOpen = openIndex === index;

                return (
                    <Dialog
                        key={`dialog-${index}`}
                        isOpen={isOpen}
                        onClose={() => setOpenIndex(null)}
                        title={item.title ?? "Details"}
                        description={item.description}
                        style={{ maxWidth: 900 }}
                    >
                        <Column fillWidth gap="16" marginTop="12">
                            {item.items ? (
                                <Swiper
                                    items={item.items}
                                    style={{ maxWidth: 900, margin: "0 auto" }}
                                />
                            ) : (
                                item.content
                            )}

                            <Button
                                label="Close"
                                variant="secondary"
                                onClick={() => setOpenIndex(null)}
                            />
                        </Column>
                    </Dialog>
                );
            })}
        </>
    );
}