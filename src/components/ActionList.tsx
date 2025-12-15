"use client";

import {useState} from "react";
import {
    List,
    ListItem,
    Button,
    Row,
    Dialog,
    Column,
    SmartLink,
    Text,
    Swiper,
} from "@once-ui-system/core";

type ActionLink = {
    href: string;
    label: string;
};

type SwiperItem = {
    slide: string | React.ReactNode;
    alt?: string;
};

type ActionDialog =
    | {
    // 🟢 Carousel dialog
    modalCarousel: true;
    modalCarouselItems: SwiperItem[];

    label?: string;
    title?: string;
    description?: string;
    }
    | {
    // 🔵 Regular dialog
    modalCarousel?: false;
    content: React.ReactNode;

    label?: string;
    title?: string;
    description?: string;
};

type ActionListItem = {
    label: string;
    text: string;
    links?: ActionLink[];
    modalDescription?: string;
    dialogs?: ActionDialog[];
    items?: ActionListItem[];
};

type ActionListProps = {
    items: ActionListItem[];
};

export function ActionList({items}: ActionListProps) {
    const [openDialog, setOpenDialog] = useState<{ itemIndex: number; dialogIndex: number } | null>(null);

    const actions = (item: ActionListItem, index: number) => (
        <>
            {item.links?.map((link, linkIndex) => {
                const {href, label} = link;

                // 1️⃣ Internal link
                if (href.startsWith("/")) {
                    return (
                        <SmartLink
                            key={linkIndex}
                            href={href}
                            suffixIcon="arrowRight"
                            style={{margin: "0", width: "fit-content"}}
                        >
                            <Text variant="body-default-s">{label}</Text>
                        </SmartLink>
                    );
                }

                // 2️⃣ Hash link
                if (href.startsWith("#")) {
                    return (
                        <a
                            key={linkIndex}
                            href={href}
                            style={{margin: "0", width: "fit-content"}}
                        >
                            <Text variant="body-default-s">{label}</Text>
                        </a>
                    );
                }

                // 3️⃣ External link
                return (
                    <SmartLink
                        suffixIcon="arrowUpRightFromSquare"
                        style={{margin: "0", width: "fit-content"}}
                        href={href}
                    >
                        <Text variant="body-default-s">View code</Text>
                    </SmartLink>
                );
            })}

            {item.dialogs?.map((d, dialogIndex) => (
                <Button
                    key={dialogIndex}
                    size="s"
                    label={d.label ?? "View details"}
                    onClick={() => setOpenDialog({itemIndex: index, dialogIndex})}
                />
            ))}
        </>
    );

    return (
        <>
            <List>
                {items.map((item, index) => (
                    <ListItem key={index} marginBottom="16">
                        <Column gap="12">
                            <Column gap="8" vertical="center">
                                {item.label && item.text && (
                                    <>
                                        <Text as="span" variant="label-strong-l">
                                            {item.label}
                                        </Text>
                                        <Text as="p" style={{ lineHeight: "1.6" }}>
                                            {item.text}
                                        </Text>
                                    </>
                                )}

                                {item.label && !item.text && (
                                    <Text as="span" variant="label-strong-l">
                                        {item.label}
                                    </Text>
                                )}

                                {!item.label && item.text && (
                                    <Text as="p" style={{ lineHeight: "1.6" }}>
                                        {item.text}
                                    </Text>
                                )}
                            </Column>

                            {!item.links?.length && !item.dialogs?.length ? null : (
                                <Row gap="8">
                                    {actions(item, index)}
                                </Row>
                            )}
                        </Column>

                        {/* ✅ NESTED LIST (added) */}
                        {item.items?.length ? (
                            <Column marginTop="8" style={{paddingLeft: 16}}>
                                <ActionList items={item.items}/>
                            </Column>
                        ) : null}
                    </ListItem>
                ))}
            </List>

            {items.map((item, itemIndex) =>
                item.dialogs?.map((d, dialogIndex) => (
                    <Dialog
                        key={`${itemIndex}-${dialogIndex}`}
                        isOpen={
                            openDialog?.itemIndex === itemIndex &&
                            openDialog?.dialogIndex === dialogIndex
                        }
                        onClose={() => setOpenDialog(null)}
                        title={d.title ?? "Details"}
                        description={d.description}
                        style={{ maxWidth: 900 }}
                    >
                        <Column fillWidth gap="16" marginTop="12">
                            {d.modalCarousel ? (
                                <Swiper items={d.modalCarouselItems} style={{ maxWidth: 900, margin: '0 auto' }} />
                            ) : (
                                d.content
                            )}

                            <Button
                                label="Close"
                                variant="secondary"
                                onClick={() => setOpenDialog(null)}
                            />
                        </Column>
                    </Dialog>
                ))
            )}
        </>
    );
}
