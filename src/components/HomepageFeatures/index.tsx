import React from 'react';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: '1',
    Svg: require('@site/static/img/features/install-svgrepo-com.svg').default,
    description: (
      <>
        Simple to install and quickly integrate with any existing website, apps,
        and software. Your privacy is in your hands with a self-hosted WebRTC solution.
      </>
    ),
  },
  {
    title: '2',
    Svg: require('@site/static/img/features/component-customization-svgrepo-com.svg')
      .default,
    description: (
      <>
        You can personalize everything, from URLs to logos and branding colors,
        as well as features with ease.
      </>
    ),
  },
  {
    title: '3',
    Svg: require('@site/static/img/features/video-call-svgrepo-com.svg')
      .default,
    description: (
      <>
        It supports all the functions of a video call, including High-Definition
        Audio/Video/Screen Sharing; Virtual background; file-sharing, and MP4
        Recordings.
      </>
    ),
  },
  {
    title: '4',
    Svg: require('@site/static/img/features/video-call-tv-svgrepo-com.svg')
      .default,
    description: (
      <>
        Extended Functions, RTMP Broadcasting, which can enable users to
        broadcast their meetings to YouTube, Facebook, or any other third-party
        RTMP-supported live streaming platform.
      </>
    ),
  },
  {
    title: '5',
    Svg: require('@site/static/img/features/whiteboard-svgrepo-com.svg')
      .default,
    description: (
      <>
        Collaboration was made easy with the use of a shared notepad and
        whiteboard for real-time collaboration.
      </>
    ),
  },
  {
    title: '6',
    Svg: require('@site/static/img/features/webrtc-svgrepo-com.svg').default,
    description: (
      <>
        WebRTC-based, secured, and encrypted communication can make your online
        meeting private and safe at the top level.
      </>
    ),
  },
  {
    title: '7',
    Svg: require('@site/static/img/features/devices-svgrepo-com.svg').default,
    description: (
      <>
        Compatible with all devices. For browsers, Google Chrome and Firefox are
        recommended. For iOS, Safari is recommended.
      </>
    ),
  },
  {
    title: '8',
    Svg: require('@site/static/img/features/data-integration-hub-svgrepo-com.svg')
      .default,
    description: (
      <>
        Simulcast and Dynacast features will allow you to continue online
        conferencing even if your internet connection is slow!
      </>
    ),
  },
  {
    title: '9',
    Svg: require('@site/static/img/features/go-svgrepo-com.svg').default,
    description: (
      <>
        Scalable and high-performance system written in the Go programming
        language which made it possible to distribute as a single binary file!
      </>
    ),
  },
  // {
  //   title: '10',
  //   Svg: require('@site/static/img/features/undraw_docusaurus_react.svg').default,
  //   description: (
  //     <>
  //       Lock settings.
  //     </>
  //   ),
  // },
  // {
  //   title: '11',
  //   Svg: require('@site/static/img/features/undraw_docusaurus_react.svg').default,
  //   description: (
  //     <>
  //       Raise hand.
  //     </>
  //   ),
  // },
  // {
  //   title: '12',
  //   Svg: require('@site/static/img/features/undraw_docusaurus_react.svg').default,
  //   description: (
  //     <>
  //       Chatting with File sharing.
  //     </>
  //   ),
  // },
  // {
  //   title: '13',
  //   Svg: require('@site/static/img/features/undraw_docusaurus_react.svg').default,
  //   description: (
  //     <>
  //       MP4 Recordings.
  //     </>
  //   ),
  // },
  // {
  //   title: '14',
  //   Svg: require('@site/static/img/features/undraw_docusaurus_react.svg').default,
  //   description: (
  //     <>
  //       RTMP Broadcasting
  //     </>
  //   ),
  // },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className="item">
      <div className="icon-wrap">
        <Svg role="img" />
        <h3>{title}</h3>
      </div>
      <div className="description">
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className="features-section">
      <div className="container">
        <h1 className="headline">Core Features</h1>
        <div className="features-wrapper">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
