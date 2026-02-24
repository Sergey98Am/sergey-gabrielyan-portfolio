import { notFound } from "next/navigation";
import { getPosts } from "@/utils/utils";
import {
  Meta,
  AvatarGroup,
  Column,
  Heading,
  Media,
  Text,
  SmartLink,
  Row,
  Line,
} from "@once-ui-system/core";
import { baseURL, work } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { ScrollToHash, CustomMDX } from "@/components";
import { Metadata } from "next";
import { Projects } from "@/components/work/Projects";

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
    const posts = getPosts(["src", "app", "work", "projects"]);
    return posts.map((post) => ({
        slug: post.slug.split("/"), // <-- ALWAYS array ✔
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const posts = getPosts(["src", "app", "work", "projects"]);
  let post = posts.find((post) => post.slug === slugPath);

  if (!post) return {};

  return Meta.generate({
    title: post.metadata.title,
    description: post.metadata.summary,
    baseURL: baseURL,
    image: post.metadata.image || `/api/og/generate?title=${post.metadata.title}`,
    path: `${work.path}/${post.slug}`,
  });
}

export default async function Project({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  let post = getPosts(["src", "app", "work", "projects"]).find((post) => post.slug === slugPath);

  if (!post) {
    notFound();
  }

  const isNested = slugPath.includes("/");
  const segments = slugPath.split("/");
  const parent = isNested ? segments[0] : null;

    const formatName = (name: string) => name.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

    // const avatars =
  //   post.metadata.team?.map((person) => ({
  //     src: person.avatar,
  //   })) || [];

  return (
    <Column as="section" maxWidth="m" horizontal="center" gap="l">
      <Column maxWidth="s" gap="16" horizontal="center" align="center">
          <Row gap="8" vertical="center">
              <SmartLink href="/work">
                  <Text variant="label-strong-m">Projects</Text>
              </SmartLink>

              {parent && (
                  <>
                      <Text as="span" onBackground="neutral-weak">/</Text>
                      <SmartLink href={`/work/${parent}`}>
                          <Text variant="label-strong-m">
                              {formatName(parent)}
                          </Text>
                      </SmartLink>
                  </>
              )}
          </Row>

        <Heading variant={isNested ? "display-strong-s" : "display-strong-m"}>{post.metadata.title}</Heading>
      </Column>

        {/*<Row marginBottom="32" horizontal="center">*/}
      {/*  <Row gap="16" vertical="center">*/}
      {/*    {post.metadata.team && <AvatarGroup reverse avatars={avatars} size="s" />}*/}
      {/*    <Text variant="label-default-m" onBackground="brand-weak">*/}
      {/*      {post.metadata.team?.map((member, idx) => (*/}
      {/*        <span key={idx}>*/}
      {/*          {idx > 0 && (*/}
      {/*            <Text as="span" onBackground="neutral-weak">*/}
      {/*              ,{" "}*/}
      {/*            </Text>*/}
      {/*          )}*/}
      {/*          <SmartLink href={member.linkedIn}>{member.name}</SmartLink>*/}
      {/*        </span>*/}
      {/*      ))}*/}
      {/*    </Text>*/}
      {/*  </Row>*/}
      {/*</Row>*/}
      {post.metadata.images.length > 0 && (
        <Media priority aspectRatio="16 / 9" radius="m" alt="image" src={post.metadata.images[0]} />
      )}
      <Column style={{ margin: "auto" }} as="article" maxWidth="xs">
        <CustomMDX source={post.content} options={{
            blockJS: false,
        }} />
      </Column>
      <Column fillWidth gap="40" horizontal="center" marginTop="40">
        <Line maxWidth="40" />
        <Heading as="h2" variant="heading-strong-xl" marginBottom="24">
          Related projects
        </Heading>
        <Projects exclude={[post.slug]} range={[2]} />
      </Column>
      <ScrollToHash />
    </Column>
  );
}
