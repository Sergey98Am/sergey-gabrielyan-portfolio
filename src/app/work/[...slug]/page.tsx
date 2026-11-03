import { CustomMDX, ScrollToHash } from "@/components";
import { Projects } from "@/components/work/Projects";
import { baseURL, work } from "@/resources";
import { getPosts, getTopLevelPosts, slugToTitle } from "@/utils/utils";
import { Column, Heading, Line, Media, Meta, Row, SmartLink, Text } from "@once-ui-system/core";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fragment } from "react";

const projectsPath = ["src", "app", "work", "projects"];

type ProjectProps = {
  params: Promise<{ slug: string[] }>;
};

// Every project page is generated at build time, so any other /work/... URL is a real 404
export const dynamicParams = false;

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  return getPosts(projectsPath).map((post) => ({
    slug: post.slug.split("/"),
  }));
}

export async function generateMetadata({ params }: ProjectProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPosts(projectsPath).find((post) => post.slug === slug.join("/"));

  if (!post) return {};

  return Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL: baseURL,
    image:
      post.metadata.image || `/api/og/generate?title=${encodeURIComponent(post.metadata.title)}`,
    path: `${work.path}/${post.slug}`,
  });
}

export default async function Project({ params }: ProjectProps) {
  const { slug } = await params;
  const posts = getPosts(projectsPath);
  const post = posts.find((post) => post.slug === slug.join("/"));

  if (!post) {
    notFound();
  }

  const isNested = slug.length > 1;
  // The top-level project this page belongs to (the page itself when it isn't nested)
  const projectSlug = slug[0];

  // One breadcrumb per parent folder, e.g. "project" for "project/page".
  // A folder without its own .mdx file is shown as plain text instead of a broken link.
  const parents = slug.slice(0, -1).map((segment, index) => {
    const parentSlug = slug.slice(0, index + 1).join("/");
    const parent = posts.find((post) => post.slug === parentSlug);

    return {
      slug: parentSlug,
      title: parent?.metadata.title ?? slugToTitle(segment),
      href: parent && `${work.path}/${parentSlug}`,
    };
  });

  const hasRelatedProjects = getTopLevelPosts(projectsPath).some(
    (project) => project.slug !== projectSlug,
  );

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l">
      <Column maxWidth="s" gap="16" horizontal="center" align="center">
        <Row as="nav" aria-label="Breadcrumb" gap="8" wrap horizontal="center" vertical="center">
          <SmartLink href={work.path}>
            <Text variant="label-strong-m">Projects</Text>
          </SmartLink>
          {parents.map((parent) => (
            <Fragment key={parent.slug}>
              <Text as="span" aria-hidden onBackground="neutral-weak">
                /
              </Text>
              {parent.href ? (
                <SmartLink href={parent.href}>
                  <Text variant="label-strong-m">{parent.title}</Text>
                </SmartLink>
              ) : (
                <Text variant="label-strong-m" onBackground="neutral-weak">
                  {parent.title}
                </Text>
              )}
            </Fragment>
          ))}
        </Row>
        <Heading variant={isNested ? "display-strong-s" : "display-strong-m"}>
          {post.metadata.title}
        </Heading>
      </Column>
      {post.metadata.images.length > 0 && (
        <Media priority aspectRatio="16 / 9" radius="m" alt="image" src={post.metadata.images[0]} />
      )}
      <Column style={{ margin: "auto" }} as="article" maxWidth="xs">
        <CustomMDX source={post.content} options={{ blockJS: false }} />
      </Column>
      {hasRelatedProjects && (
        <Column fillWidth gap="40" horizontal="center" marginTop="40">
          <Line maxWidth="40" />
          <Heading as="h2" variant="heading-strong-xl" marginBottom="24">
            Related projects
          </Heading>
          <Projects exclude={[projectSlug]} />
        </Column>
      )}
      <ScrollToHash />
    </Column>
  );
}
