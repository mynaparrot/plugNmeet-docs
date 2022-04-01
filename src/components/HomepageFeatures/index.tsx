import React from 'react';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: '1',
    Svg: require('@site/static/img/features/devices-svgrepo-com.svg').default,
    description: (
      <>
        Compatible with all devices. Browser recommendation: Google Chrome, Firefox. For iOS: Safari.
      </>
    ),
  },
  {
    title: '2',
    Svg: require('@site/static/img/features/webrtc-svgrepo-com.svg').default,
    description: (
      <>
        WebRTC based secured & encrypted communication.
      </>
    ),
  },
  {
    title: '3',
    Svg: require('@site/static/img/features/go-svgrepo-com.svg').default,
    description: (
      <>
        Scalable and high performance system written in Go programming language which made it possible to distributed as a <a href="https://github.com/mynaparrot/plugNmeet-server/releases">single binary</a> file!
      </>
    ),
  },
  {
    title: '4',
    Svg: require('@site/static/img/features/video-call-tv-svgrepo-com.svg').default,
    description: (
      <>
        <strong>Simulcast</strong> and <strong>Dynacast</strong> features will allow you to continue online conferencing even if your internet connection is slow!
      </>
    ),
  },
  {
    title: '5',
    Svg: require('@site/static/img/features/data-integration-hub-svgrepo-com.svg').default,
    description: (
      <>
        Easy integration with any existing website or system.
      </>
    ),
  },
  {
    title: '6',
    Svg: require('@site/static/img/features/component-customization-svgrepo-com.svg').default,
    description: (
      <>
        Easy customization with functionality, URL, logo, and branding colors.
      </>
    ),
  },
  {
    title: '7',
    Svg: require('@site/static/img/features/video-call-svgrepo-com.svg').default,
    description: (
      <>
        HD audio, video call and Screen sharing.
      </>
    ),
  },
  {
    title: '8',
    Svg: require('@site/static/img/features/whiteboard-svgrepo-com.svg').default,
    description: (
      <>
        Shared notepad and Whiteboard for live collaboration.
      </>
    ),
  },
  {
    title: '9',
    Svg: require('@site/static/img/features/webcam-svgrepo-com.svg').default,
    description: (
      <>
        Virtual background for webcams.
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

function Feature({title, Svg, description}: FeatureItem) {
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
        <h1 className='headline'>Core Features</h1>
        <div className="features-wrapper">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
