import React from "react";
import Layout from "@theme/Layout";

import HomepageFeatures from "./components/HomepageFeatures";
import HeroBanner from "./components/HeroBanner";

export default function Home() {
  return (
    <Layout
    title="plugNmeet: Sistema de Videoconferencia de Código Abierto"
    description="El software de videoconferencia gratuito y de código abierto que le brinda control y privacidad total. Organice reuniones seguras, escalables y personalizables con IA, alojadas en sus propios servidores.">
      <HeroBanner />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
