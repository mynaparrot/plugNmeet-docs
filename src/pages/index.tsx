import React from "react";
import Layout from "@theme/Layout";

import HomepageFeatures from "@site/src/components/HomepageFeatures";
import HeroBanner from "../components/HeroBanner";

export default function Home() {
  return (
    <Layout
    title="plugNmeet: Open Source Web Conferencing System"
    description="The free and open-source video conferencing platform for full control and privacy. Host scalable, customizable meetings on your own servers.">
      <HeroBanner />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
