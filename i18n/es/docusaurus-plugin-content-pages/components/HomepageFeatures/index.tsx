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
        <h3>Fácil instalación y auto-alojamiento</h3>
        <p>
          Integre una solución de videoconferencia con todas las funciones en sus
          aplicaciones y sitios web existentes en minutos. Mantenga sus datos seguros con una
          plataforma WebRTC auto-alojada y local.
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
        <h3>Totalmente personalizable y con marca</h3>
        <p>
          Personalice cada aspecto de sus reuniones con una API sencilla, sin necesidad de cambios en el código. Personalice URLs, logotipos, colores de marca y características disponibles para crear una experiencia verdaderamente de marca blanca.
        </p>
      </>
    ),
  },
  {
    title: '3',
    Svg: require('@site/static/img/features/video-call-svgrepo-com.svg').default,
    description: (
      <>
        <h3>Grabación y transmisión</h3>
        <p>
          Capture sus sesiones en calidad HD cristalina como archivos MP4 portátiles. O bien, amplíe su alcance transmitiendo directamente a plataformas como YouTube y Facebook con soporte integrado para RTMP/WHIP.
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
        <h3>Agente de reuniones con IA</h3>
        <p>Convierta sus reuniones en inteligencia procesable. Nuestro potente agente de IA proporciona traducciones habladas en vivo, genera resúmenes automatizados, crea transcripciones completas, <strong>y mucho más...</strong></p>
      </>
    ),
  },
  {
    title: '5',
    Svg: require('@site/static/img/features/whiteboard-svgrepo-com.svg')
      .default,
    description: (
      <>
        <h3>Colaboración en tiempo real</h3>
        <p>
          Aumente la productividad durante su videoconferencia con potentes herramientas de colaboración. Trabajen juntos en
          tiempo real utilizando una pizarra compartida y un bloc de notas colaborativo.
        </p>
      </>
    ),
  },
  {
    title: '6',
    Svg: require('@site/static/img/features/webrtc-svgrepo-com.svg').default,
    description: (
      <>
        <h3>Privado por diseño</h3>
        <p>
          Para la máxima privacidad, añadimos una capa de cifrado verdadero de extremo a extremo (E2EE) sobre la seguridad WebRTC por defecto, asegurando que ni siquiera el servidor pueda acceder a su conversación privada.
        </p>
      </>
    ),
  },
  {
    title: '7',
    Svg: require('@site/static/img/features/devices-svgrepo-com.svg').default,
    description: (
      <>
        <h3>No requiere instalación</h3>
        <p>
          Únase a las reuniones al instante con su navegador. Nuestra plataforma significa sin descargas, sin complementos y sin fricciones para sus usuarios en cualquier dispositivo móvil o de escritorio moderno.
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
        <h3>Una conexión estable, en cualquier lugar</h3>
        <p>
          Disfrute de una experiencia de video fluida, incluso con Wi-Fi débil o móvil. Nuestra tecnología inteligente ajusta automáticamente la calidad del video para evitar el almacenamiento en búfer y mantener la conversación fluyendo.
        </p>
      </>
    ),
  },
  {
    title: '9',
    Svg: require('@site/static/img/features/go-svgrepo-com.svg').default,
    description: (
      <>
        <h3>Construido para escalar</h3>
        <p>
          Haga crecer su plataforma con confianza. Nuestro backend moderno está construido para el escalado horizontal utilizando Go, <strong>LiveKit</strong> y <strong>NATS</strong>. Este stack de alto rendimiento admite más usuarios con menos recursos y se despliega como un binario único y sencillo.
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
        <h2 className="headline">Características principales</h2>
        <div className="features-wrapper">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
