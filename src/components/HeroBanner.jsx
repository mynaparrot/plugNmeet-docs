import React from 'react';
import Link from '@docusaurus/Link';
import { Carousel } from 'react-responsive-carousel';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Banner2 from '../../static/img/slider/banner-2.0.webp';
import DesktopBack from '../../static/img/slider/DesktopMonitorWithoutScreen.png';
import Whiteboard1 from '../../static/img/slider/01-whiteboard-1.jpg';
import Whiteboard2 from '../../static/img/slider/02-whiteboard2.png';
import SharedNotepad from '../../static/img/slider/03-SharedNotepad2.jpg';
import AiChatbot from '../../static/img/slider/04-AiChatbot2.jpg';
import CamGrid from '../../static/img/slider/05-24CamGrid.jpg';
import CamModal from '../../static/img/slider/06-cam-overlay.png';
import Notifications from '../../static/img/slider/07-notifications2.jpg';
import ScreenSharing from '../../static/img/slider/08-ScreenSharing.jpg';
import Participants from '../../static/img/slider/09-Participants.jpg';
import ChatRoom from '../../static/img/slider/10-ChatRoom.jpg';
import TranscriptionTranslation from '../../static/img/slider/11-TranscriptionTranslation2.jpg';
import Poll from '../../static/img/slider/12-Poll2.jpg';

const SlideItems = [
  {
    imgSrc: Whiteboard1,
    altText: 'plugNmeet interactive whiteboard feature',
  },
  {
    imgSrc: Whiteboard2,
    altText: 'plugNmeet interactive whiteboard feature with files upload',
  },
  {
    imgSrc: SharedNotepad,
    altText: 'plugNmeet shared notepad for collaborative notes',
  },
  {
    imgSrc: AiChatbot,
    altText: 'plugNmeet AI Chatbot integration in video conference',
  },
  {
    imgSrc: CamGrid,
    altText: 'plugNmeet 24 camera grid view in video conference',
  },
  {
    imgSrc: CamModal,
    altText: 'plugNmeet Choose Camera Background',
  },
  {
    imgSrc: Notifications,
    altText: 'plugNmeet Notifications Panel',
  },
  {
    imgSrc: ScreenSharing,
    altText: 'plugNmeet video conference with Screen Sharing feature',
  },
  {
    imgSrc: Participants,
    altText: 'plugNmeet video conference with multiple participants',
  },
  {
    imgSrc: ChatRoom,
    altText: 'plugNmeet video conference with Chat Room feature',
  },
  {
    imgSrc: TranscriptionTranslation,
    altText:
      'plugNmeet video conference with Transcription and Translation feature',
  },
  {
    imgSrc: Poll,
    altText: 'plugNmeet video conference with Poll feature',
  },
];

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
              <h2>
                Integrate a powerful, AI-enhanced video meeting solution into
                your website with ease.
              </h2>
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
          <img
            src={Banner2}
            alt="plugNmeet video conferencing platform banner"
          />
        </div>
      </div>
      <section className="features-section slider-section">
        <div className="container">
          <h2 className="headline">Explore Key Features</h2>
          <div className="slider-wrapper">
            <img
              className="desktop-back"
              src={DesktopBack}
              alt="Desktop monitor frame"
            />
            <Carousel
              autoPlay
              infiniteLoop
              showStatus={false}
              showIndicators={false}
              showThumbs={false}
            >
              {SlideItems.map((props, idx) => (
                <div className="desktop" key={idx}>
                  <img src={props.imgSrc} alt={props.altText} />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroBanner;
