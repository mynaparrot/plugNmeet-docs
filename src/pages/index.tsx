import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";

import HomepageFeatures from "@site/src/components/HomepageFeatures";
import HeroBanner from "../components/HeroBanner";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "plugNmeet",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any (Web browser)",
  isAccessibleForFree: true,
  license: "https://github.com/mynaparrot/plugNmeet-server/blob/main/LICENSE",
  description:
    "Open-source WebRTC video conferencing for your website: self-hosted, white-label HD meetings with whiteboard, breakout rooms, recording, RTMP live streaming and AI captions, translation and summaries. No installs.",
  url: "https://www.plugnmeet.org/",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList:
    "HD video meetings, screen sharing, whiteboard, breakout rooms, polls, recording, RTMP live streaming, SIP dial-in, AI captions and translation, end-to-end encryption",
};

export default function Home() {
  return (
    <Layout
    title="plugNmeet: Open Source Web Conferencing System"
    description="Self-hosted, white-label WebRTC video conferencing: HD meetings with whiteboard, breakout rooms, recording, RTMP streaming, AI captions & translation. No installs.">
      <Head>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>
      <HeroBanner />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
