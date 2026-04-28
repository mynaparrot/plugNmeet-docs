import React from "react";
import Layout from "@theme/Layout";

import HomepageFeatures from "./components/HomepageFeatures";
import HeroBanner from "./components/HeroBanner";

export default function Home() {
  return (
    <Layout
    title="plugNmeet: Sistema de videoconferencia de código abierto"
    description="El software de videoconferencia gratuito y de código abierto para un control y privacidad totales. Organice reuniones seguras, escalables y personalizables potenciadas por IA en sus propios servidores.">
      <HeroBanner />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
