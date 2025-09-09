import React from 'react';
import Link from '@docusaurus/Link';
import Banner from '../../static/img/slider/BannerOne2-min.png';
import DesktopBack from '../../static/img/slider/DesktopMonitorWithoutScreen.png';
import DesktopCam from '../../static/img/slider/Desktop_version_cam.png';
import DesktopWhiteBoard from '../../static/img/slider/Desktop_version_whiteboard.png';
import DesktopNotePad from '../../static/img/slider/Desktop_version_NotePad.png';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

const HeroBanner = () => {
  return (
    <>
      <div className="landing-banner">
        <div className="text-wrap">
          <div className="container">
            <div className="content">
              <h1>
                Open Source WebRTC Conferencing: Scalable, Customizable, and
                Self-Hosted.
              </h1>
              <h2>Integrate a powerful, high-performance video meeting solution into your website with ease.</h2>
              <Link
                className="button button--secondary button--lg"
                to="/docs/intro"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
        <div className="banner">
          <img src={Banner} alt="Banner" />
        </div>
      </div>
      <section className="features-section slider-section">
        <div className="container">
          <h2 className="headline">Explore Key Features</h2>
          <div className="slider-wrapper">
            <img className="desktop-back" src={DesktopBack} alt="DesktopBack" />
            <Carousel
              autoPlay
              infiniteLoop
              showStatus={false}
              showIndicators={false}
              showThumbs={false}
            >
              <div className="desktop">
                <img src={DesktopCam} alt="DesktopCam" />
              </div>
              <div className="desktop">
                <img src={DesktopWhiteBoard} alt="DesktopWhiteBoard" />
              </div>
              <div className="desktop">
                <img src={DesktopNotePad} alt="DesktopNotePad" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroBanner;
