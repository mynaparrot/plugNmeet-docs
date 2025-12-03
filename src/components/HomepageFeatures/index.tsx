import React from 'react';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: React.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: '1',
    Svg: require('@site/static/img/features/install-svgrepo-com.svg').default,
    description: (
      <>
        <h3>Easy Installation & Self-Hosting</h3>
        <p>
          Integrate a full-featured video conferencing solution into your
          existing apps and websites in minutes. Keep your data secure with a
          self-hosted, on-premise WebRTC platform.
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
        <h3>Fully Customizable & Brandable</h3>
        <p>
          Personalize every aspect of your meetings with a simple API, no code changes required. Customize URLs, logos, branding colors, and available features to create a truly white-label experience.
        </p>
      </>
    ),
  },
  {
    title: '3',
    Svg: require('@site/static/img/features/video-call-svgrepo-com.svg').default,
    description: (
      <>
        <h3>Recording & Broadcasting</h3>
        <p>
          Capture your sessions in crystal-clear HD quality as portable MP4 files. Or, expand your reach by streaming directly to platforms like YouTube and Facebook with built-in RTMP/WHIP support.
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
        <h3>AI Meeting Agent</h3>
        <p>Turn your meetings into actionable intelligence. Our powerful AI agent provides live spoken translations, generates automated summaries, creates full transcriptions, <strong>and many more...</strong></p>
      </>
    ),
  },
  {
    title: '5',
    Svg: require('@site/static/img/features/whiteboard-svgrepo-com.svg')
      .default,
    description: (
      <>
        <h3>Real-time Collaboration</h3>
        <p>
          Boost productivity during your video conference with powerful collaboration tools. Work together in
          real-time using a shared whiteboard and collaborative notepad.
        </p>
      </>
    ),
  },
  {
    title: '6',
    Svg: require('@site/static/img/features/webrtc-svgrepo-com.svg').default,
    description: (
      <>
        <h3>Private by Design</h3>
        <p>
          For maximum privacy, we add a layer of true End-to-End Encryption (E2EE) on top of default WebRTC security, ensuring not even the server can access your private conversation.
        </p>
      </>
    ),
  },
  {
    title: '7',
    Svg: require('@site/static/img/features/devices-svgrepo-com.svg').default,
    description: (
      <>
        <h3>No Installation Required</h3>
        <p>
          Join meetings instantly with your browser. Our platform means no downloads, no plugins, and no friction for your users on any modern desktop or mobile device.
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
        <h3>A Stable Connection, Anywhere</h3>
        <p>
          Enjoy a smooth video experience, even on weak Wi-Fi or mobile. Our smart technology automatically adjusts video quality to prevent buffering and keep the conversation flowing.
        </p>
      </>
    ),
  },
  {
    title: '9',
    Svg: require('@site/static/img/features/go-svgrepo-com.svg').default,
    description: (
      <>
        <h3>Built to Scale</h3>
        <p>
          Grow your platform with confidence. Our modern backend is built for horizontal scaling using Go, <strong>LiveKit</strong>, and <strong>NATS</strong>. This high-performance stack supports more users with fewer resources and deploys as a simple, single binary.
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
        <h2 className="headline">Core Features</h2>
        <div className="features-wrapper">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
