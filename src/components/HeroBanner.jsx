import React from 'react';
import Link from '@docusaurus/Link';
import MobilePortrait from '../../static/img/slider/MobilePortrait.png';
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
        <div className="container">
          <div className="content">
            <p>
              WebRTC based Scalable, High Performance, Open source web
              conferencing that is simple to use and customizable
            </p>
            <Link
              className="button button--secondary button--lg"
              to="/docs/intro"
            >
              Get Started
            </Link>
          </div>
          <div className="logo">
            <img src={MobilePortrait} alt="MobilePortrait" />
          </div>
        </div>
      </div>
      <section className="features-section slider-section">
        <div className="container">
          <h2 className="headline">Features Preview</h2>
          <div className="slider-wrapper">
            <img className="desktop-back" src={DesktopBack} alt="DesktopBack" />
            <Carousel
              autoPlay
              infiniteLoop
              showArrows={false}
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
