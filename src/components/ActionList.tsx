"use client";

import {
    List,
    ListItem,
    Row,
    Column,
    SmartLink,
    Text,
} from "@once-ui-system/core";

import { LightboxCarouselModal } from "@/components/LightboxCarouselModal";

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
    modalCarousel: true;
    modalCarouselItems: SwiperItem[];

    label?: string;
    title?: string;
    description?: string;
}
    | {
    modalCarousel?: false;
    content: React.ReactNode;

    label?: string;
    title?: string;
    description?: string;
};

type ActionListItem = {
    label: string;
    text?: string;
    links?: ActionLink[];
    dialogs?: ActionDialog[];
    items?: ActionListItem[];
};

type ActionListProps = {
    items: ActionListItem[];
};

export function ActionList({ items }: ActionListProps) {
    const actions = (item: ActionListItem, index: number) => [
        // 🔹 Links
        ...(item.links?.map((link, linkIndex) => {
            const { href, label } = link;

            if (href.startsWith("/")) {
                return (
                    <SmartLink
                        key={`link-${index}-${linkIndex}`}
                        href={href}
                        suffixIcon="arrowRight"
                        style={{ margin: "0", width: "fit-content" }}
                    >
                        <Text variant="body-default-s">{label}</Text>
                    </SmartLink>
                );
            }

            if (href.startsWith("#")) {
                return (
                    <a
                        key={`link-${index}-${linkIndex}`}
                        href={href}
                        style={{ margin: "0", width: "fit-content" }}
                    >
                        <Text variant="body-default-s">{label}</Text>
                    </a>
                );
            }

            return (
                <SmartLink
                    key={`link-${index}-${linkIndex}`}
                    href={href}
                    suffixIcon="arrowUpRightFromSquare"
                    style={{ margin: "0", width: "fit-content" }}
                >
                    <Text variant="body-default-s">{label}</Text>
                </SmartLink>
            );
        }) ?? []),

        // 🔹 Dialogs → Lightbox
        ...(item.dialogs?.length
            ? [
                <LightboxCarouselModal
                    key={`lightbox-${index}`} // ✅ unique key
                    inline // ✅ removes spacing inside ActionList
                    items={item.dialogs.map((d) => ({
                        label: d.label ?? "View details",
                        title: d.title,
                        description: d.description,
                        items: d.modalCarousel
                            ? d.modalCarouselItems
                            : undefined,
                        content: !d.modalCarousel ? d.content : undefined,
                    }))}
                />,
            ]
            : []),
    ];

    return (
        <List>
            {items.map((item, index) => (
                <ListItem key={index} marginBottom="16">
                    <Column gap="12">
                        {/* 🔹 Content */}
                        <Column gap="8" vertical="center">
                            {item.label && (
                                <Text as="span" variant="label-strong-l">
                                    {item.label}
                                </Text>
                            )}

                            {item.text && (
                                <Text as="p" style={{ lineHeight: "1.6" }}>
                                    {item.text}
                                </Text>
                            )}
                        </Column>

                        {/* 🔹 Actions */}
                        {(item.links?.length || item.dialogs?.length) && (
                            <Row gap="12" wrap>
                                {actions(item, index)}
                            </Row>
                        )}
                    </Column>

                    {/* 🔹 Nested items */}
                    {item.items?.length ? (
                        <Column marginTop="8" style={{ paddingLeft: 16 }}>
                            <ActionList items={item.items} />
                        </Column>
                    ) : null}
                </ListItem>
            ))}
        </List>
    );
}
