import { SidebarNavItem, SiteConfig } from "@/types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  title: "Learn and Get Super Powers | TruePowers.org",
  name: "TruePowers.org",
  description:
    "Unlock your superpower to solve complex problems simply by asking your computer what you want — no coding required, just pure intuitive creation.",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "https://twitter.com/jcarpio",
    github: "https://github.com/jcarpio/prolog-dream",
  },
  mailSupport: "connect@truepowers.org",
  structuredData: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TruePowers.org",
    "url": site_url,
    "description": "Unlock your superpower to solve complex problems simply by asking your computer what you want — no coding required, just pure intuitive creation.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${site_url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  },
  keywords: [
      "Headshots"
  ],
  authors: [
    {
      name: "Enkire",
    },
  ],
  creator: "Enkire",
  twitterCreator: "@jcarpio",
  icons: "/favicon.ico",
  manifest: `${site_url}/site.webmanifest`,
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "About", href: "/about" },
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Enkire Products",
    items: [
      { title: "DreamBez", href: "https://dreambez.com" },
      { title: "TruePowers", href: "https://truepowers.org" },

    ],
  },
   {
    title: "Resources",
    items: [
      { title: "Pricing", href: "/pricing" },
   ],
  },
];
