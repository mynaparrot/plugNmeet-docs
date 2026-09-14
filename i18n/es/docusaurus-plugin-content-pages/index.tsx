import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";

import HomepageFeatures from "./components/HomepageFeatures";
import HeroBanner from "./components/HeroBanner";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "plugNmeet",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any (Web browser)",
  isAccessibleForFree: true,
  license: "https://github.com/mynaparrot/plugNmeet-server/blob/main/LICENSE",
  description:
    "Videoconferencia WebRTC de código abierto para su sitio web: reuniones HD autoalojadas y marca blanca con pizarra, salas de grupos, grabación, transmisión RTMP en directo y subtítulos, traducción y resúmenes con IA. Sin instalaciones.",
  url: "https://www.plugnmeet.org/es/",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList:
    "Videorreuniones HD, pantalla compartida, pizarra, salas de grupos, encuestas, grabación, transmisión RTMP en directo, acceso telefónico SIP, subtítulos y traducción con IA, cifrado de extremo a extremo",
};

export default function Home() {
  return (
    <Layout
    title="plugNmeet: Sistema de Videoconferencia Open Source"
    description="Videoconferencia WebRTC autoalojada y marca blanca: reuniones HD con pizarra, salas de grupos, grabación, transmisión RTMP, subtítulos y traducción con IA. Sin instalaciones.">
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
