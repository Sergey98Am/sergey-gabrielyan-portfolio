"use client";

import { useState, ReactNode } from "react";
import { Dialog, Column, Button, Swiper, Row } from "@once-ui-system/core";

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
    inline?: boolean; // 👈 controls spacing
};

export function LightboxCarouselModal({items, inline = false}: LightboxCarouselModalProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <>
            {/* 🔹 Buttons (triggers) */}
            <Row
                gap="12"
                wrap
                marginTop={!inline ? "12" : undefined}
                marginBottom={!inline ? "12" : undefined}
            >
                {items.map((item, index) => (
                    <Button
                        key={`trigger-${index}`}
                        size="s"
                        label={item.label ?? "View details"}
                        onClick={() => setOpenIndex(index)}
                    />
                ))}
            </Row>

            {/* 🔹 Modals */}
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
