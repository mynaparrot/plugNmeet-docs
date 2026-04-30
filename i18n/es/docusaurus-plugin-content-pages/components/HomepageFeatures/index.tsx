import React from 'react';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: React.JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: '1',
    Svg: require('@site/static/img/features/install-svgrepo-com.svg').default,
    description: (
      <>
        <h3>Instalación Sencilla y Autoalojamiento</h3>
        <p>
          Integre una solución completa de videoconferencia en sus aplicaciones y sitios web en cuestión de minutos. Mantenga sus datos seguros con una plataforma WebRTC autoalojada y bajo su control.
        </p>
      </>
    ),
  },
  {
    title: '2',
    Svg: require('@site/static/img/features/component-customization-svgrepo-com.svg')
      .default,
    description: (
      <>
        <h3>Personalización Total y Marca Blanca</h3>
        <p>
          Adapte cada aspecto de sus reuniones con una API sencilla, sin necesidad de modificar el código. Personalice URLs, logotipos, colores de marca y funciones para crear una experiencia completamente suya.
        </p>
      </>
    ),
  },
  {
    title: '3',
    Svg: require('@site/static/img/features/video-call-svgrepo-com.svg').default,
    description: (
      <>
        <h3>Grabación y Transmisión</h3>
        <p>
          Capture sus sesiones con una calidad HD nítida en archivos MP4 portátiles. O bien, amplíe su alcance transmitiendo en directo a plataformas como YouTube y Facebook con soporte integrado para RTMP/WHIP.
        </p>
      </>
    ),
  },
  {
    title: '4',
    Svg: require('@site/static/img/features/artificial-intelligence-ai-svgrepo-com.svg')
      .default,
    description: (
      <>
        <h3>Asistente de Reuniones con IA</h3>
        <p>Convierta sus reuniones en inteligencia procesable. Nuestro potente asistente de IA ofrece traducciones habladas en vivo, genera resúmenes automáticos, crea transcripciones completas, <strong>y mucho más...</strong></p>
      </>
    ),
  },
  {
    title: '5',
    Svg: require('@site/static/img/features/whiteboard-svgrepo-com.svg')
      .default,
    description: (
      <>
        <h3>Colaboración en Tiempo Real</h3>
        <p>
          Aumente la productividad durante sus videoconferencias con potentes herramientas colaborativas. Trabajen en equipo en tiempo real utilizando una pizarra compartida y un bloc de notas colaborativo.
        </p>
      </>
    ),
  },
  {
    title: '6',
    Svg: require('@site/static/img/features/webrtc-svgrepo-com.svg').default,
    description: (
      <>
        <h3>Diseñado para la Privacidad</h3>
        <p>
          Para una máxima privacidad, añadimos una capa de cifrado de extremo a extremo (E2EE) real sobre la seguridad estándar de WebRTC, garantizando que ni siquiera el servidor pueda acceder a sus conversaciones privadas.
        </p>
      </>
    ),
  },
  {
    title: '7',
    Svg: require('@site/static/img/features/devices-svgrepo-com.svg').default,
    description: (
      <>
        <h3>Sin Instalaciones</h3>
        <p>
          Únase a las reuniones al instante desde su navegador. Nuestra plataforma elimina la necesidad de descargas, plugins y cualquier fricción para sus usuarios en cualquier dispositivo moderno, ya sea de escritorio o móvil.
        </p>
      </>
    ),
  },
  {
    title: '8',
    Svg: require('@site/static/img/features/data-integration-hub-svgrepo-com.svg')
      .default,
    description: (
      <>
        <h3>Conexión Estable, Donde Sea</h3>
        <p>
          Disfrute de una experiencia de video fluida, incluso con una conexión Wi-Fi o móvil débil. Nuestra tecnología inteligente ajusta automáticamente la calidad del video para evitar interrupciones y mantener la conversación en marcha.
        </p>
      </>
    ),
  },
  {
    title: '9',
    Svg: require('@site/static/img/features/go-svgrepo-com.svg').default,
    description: (
      <>
        <h3>Diseñado para Escalar</h3>
        <p>
          Haga crecer su plataforma con total confianza. Nuestro moderno backend está construido para escalar horizontalmente usando Go, <strong>LiveKit</strong> y <strong>NATS</strong>. Esta arquitectura de alto rendimiento soporta más usuarios con menos recursos y se despliega como un único y sencillo binario.
        </p>
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className="item">
      <div className="icon-wrap">
        <Svg role="img" aria-label={title} />
        <h3>{title}</h3>
      </div>
      <div className="description">
        {description}
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className="features-section">
      <div className="container">
        <h2 className="headline">Características Principales</h2>
        <div className="features-wrapper">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
