"use client";

import {
    List,
    ListItem,
    Row,
    Column,
    Text, Line,
} from "@once-ui-system/core";

import { LightboxCarouselModal } from "@/components/LightboxCarouselModal";
import { LinkGroup, LinkItem } from "@/components/LinkGroup";

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
    return (
        <List>
            {items.map((item, index) => (
                <ListItem key={index}>
                    <Column>
                        {/* 🔹 Content */}
                        <Column vertical="center">
                            {item.label && (
                                <Text as="span" variant="label-strong-l" marginTop="4" marginBottom="8">
                                    {item.label}
                                </Text>
                            )}

                            {item.text && (
                                <Text as="p" style={{ lineHeight: "1.6" }} marginTop="4" marginBottom="8">
                                    {item.text}
                                </Text>
                            )}
                        </Column>

                        {/* 🔹 Actions */}
                        {(item.links?.length || item.dialogs?.length) && (
                            <Column>
                                {/* Links → LinkGroup */}
                                {item.links?.length ? (
                                    <LinkGroup
                                        items={item.links as LinkItem[]}
                                        marginTop="4"
                                        marginBottom="8"
                                        wrap
                                    />
                                ) : null}

                                {/* Dialogs */}
                                {item.dialogs?.length ? (
                                    <LightboxCarouselModal
                                        marginTop="4"
                                        marginBottom="8"
                                        buttonSize="s"
                                        items={item.dialogs.map((d) => ({
                                            label: d.label ?? "View details",
                                            title: d.title,
                                            description: d.description,
                                            items: d.modalCarousel
                                                ? d.modalCarouselItems
                                                : undefined,
                                            content: !d.modalCarousel
                                                ? d.content
                                                : undefined,
                                        }))}
                                    />
                                ) : null}
                            </Column>
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