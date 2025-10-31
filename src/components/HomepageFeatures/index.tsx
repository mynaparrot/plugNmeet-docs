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
          Personalize every aspect of your online meetings and video calls. Customize URLs, logos,
          branding colors, and available features to create a seamless user
          experience.
        </p>
      </>
    ),
  },
  {
    title: '3',
    Svg: require('@site/static/img/features/video-call-svgrepo-com.svg')
      .default,
    description: (
      <>
        <h3>HD Video & Rich Media</h3>
        <p>
          Engage your audience with high-definition audio and video during your web conference. Supports virtual backgrounds, file sharing, and MP4/WebM
          recordings.
        </p>
      </>
    ),
  },
  {
    title: '4',
    Svg: require('@site/static/img/features/video-call-tv-svgrepo-com.svg')
      .default,
    description: (
      <>
        <h3>Live Broadcasting</h3>
        <p>
          Expand your reach with RTMP broadcasting. Stream your webinars or online meetings live to
          YouTube, Facebook, or any other platform that supports RTMP ingress.
        </p>
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
        <h3>Secure & Encrypted</h3>
        <p>
          Protect your conversations with end-to-end encryption (E2EE). Our
          WebRTC-based architecture ensures your video conferences are private and secure.
        </p>
      </>
    ),
  },
  {
    title: '7',
    Svg: require('@site/static/img/features/devices-svgrepo-com.svg').default,
    description: (
      <>
        <h3>Cross-Device Compatibility</h3>
        <p>
          Connect from anywhere, on any device. Plug-N-Meet is fully compatible
          with modern desktop and mobile browsers, including Chrome, Firefox, and
          Safari.
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
        <h3>Adaptive Bitrate Streaming</h3>
        <p>
          Deliver a smooth, uninterrupted video chat experience even on slow networks.
          Simulcast and Dynacast automatically adjust video quality to match
          network conditions.
        </p>
      </>
    ),
  },
  {
    title: '9',
    Svg: require('@site/static/img/features/go-svgrepo-com.svg').default,
    description: (
      <>
        <h3>High-Performance Backend</h3>
        <p>
          Built for easy horizontal scaling, our Go-based backend uses{" "}
          <strong>LiveKit</strong> as its media server and <strong>NATS</strong> for
          real-time messaging. This modern stack handles more users with fewer
          resources and deploys as a single binary.
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
