import React from "react";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import HeroBanner from "../components/HeroBanner";

export default function Home(): JSX.Element {
  return (
    <Layout 
    description="WebRTC based Scalable, High Performance, Open source web conferencing that is simple to use and customizable">
      <HeroBanner />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
