import type { Metadata } from "next";
import { BlogPage } from "@/components/blog/blog-page";
import { getBlogPostSummaries, getBlogTags } from "@/lib/blog";
import { assetUrl, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Thoughts on automated software architecture design, interactive layout engineering, and the future of vibe diagramming.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "/blog",
    title: "Blog | OpenDraw",
    description:
      "Thoughts on automated software architecture design, interactive layout engineering, and the future of vibe diagramming.",
    images: [
      {
        url: assetUrl("/brand/mascot.png"),
        alt: "OpenDraw mascot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | OpenDraw",
    description:
      "Thoughts on automated software architecture design, interactive layout engineering, and the future of vibe diagramming.",
    images: [assetUrl("/brand/mascot.png")],
  },
};

const blogStructuredData = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "OpenDraw Blog",
  url: `${SITE_URL.href}blog`,
  description:
    "Thoughts on automated software architecture design, interactive layout engineering, and the future of vibe diagramming.",
  publisher: {
    "@type": "Organization",
    name: "OpenDraw",
    url: SITE_URL.href,
  },
};

export default function BlogRoute() {
  const posts = getBlogPostSummaries();
  const tags = getBlogTags();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      <BlogPage posts={posts} tags={tags} />
    </>
  );
}
