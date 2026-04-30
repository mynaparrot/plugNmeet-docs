import React from 'react';
import Link from '@docusaurus/Link';
import { Carousel } from 'react-responsive-carousel';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Banner2 from '../../../../static/img/slider/banner.webp';
import DesktopBack from '../../../../static/img/slider/DesktopMonitorWithoutScreen.png';
import Whiteboard1 from '../../../../static/img/slider/01-whiteboard-1.jpg';
import Whiteboard2 from '../../../../static/img/slider/02-whiteboard2.png';
import SharedNotepad from '../../../../static/img/slider/03-SharedNotepad2.jpg';
import AiChatbot from '../../../../static/img/slider/04-AiChatbot2.jpg';
import CamGrid from '../../../../static/img/slider/05-24CamGrid.jpg';
import CamModal from '../../../../static/img/slider/06-cam-overlay.png';
import Notifications from '../../../../static/img/slider/07-notifications2.jpg';
import ScreenSharing from '../../../../static/img/slider/08-ScreenSharing.jpg';
import Participants from '../../../../static/img/slider/09-Participants.jpg';
import ChatRoom from '../../../../static/img/slider/10-ChatRoom.jpg';
import TranscriptionTranslation from '../../../../static/img/slider/11-TranscriptionTranslation2.jpg';
import Poll from '../../../../static/img/slider/12-Poll2.jpg';

const SlideItems = [
  {
    imgSrc: Whiteboard1,
    altText: 'Función de pizarra interactiva de plugNmeet',
  },
  {
    imgSrc: Whiteboard2,
    altText: 'Función de pizarra interactiva de plugNmeet con carga de archivos',
  },
  {
    imgSrc: SharedNotepad,
    altText: 'Bloc de notas compartido de plugNmeet para notas colaborativas',
  },
  {
    imgSrc: AiChatbot,
    altText: 'Integración del chatbot de IA de plugNmeet en videoconferencia',
  },
  {
    imgSrc: CamGrid,
    altText: 'Vista de cuadrícula de 24 cámaras de plugNmeet en videoconferencia',
  },
  {
    imgSrc: CamModal,
    altText: 'plugNmeet Elegir fondo de cámara',
  },
  {
    imgSrc: Notifications,
    altText: 'Panel de notificaciones de plugNmeet',
  },
  {
    imgSrc: ScreenSharing,
    altText: 'Videoconferencia de plugNmeet con función de compartir pantalla',
  },
  {
    imgSrc: Participants,
    altText: 'Videoconferencia de plugNmeet con múltiples participantes',
  },
  {
    imgSrc: ChatRoom,
    altText: 'Videoconferencia de plugNmeet con función de sala de chat',
  },
  {
    imgSrc: TranscriptionTranslation,
    altText:
      'Videoconferencia de plugNmeet con función de transcripción y traducción',
  },
  {
    imgSrc: Poll,
    altText: 'Videoconferencia de plugNmeet con función de encuesta',
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
                Conferencias WebRTC de Código Abierto: Seguras, Escalables, Personalizables y Autoalojadas.
              </h1>
              <h2>
                Integre fácilmente una solución potente de videoconferencia, mejorada con IA, en su sitio web.
              </h2>
              <Link
                className="button button--secondary button--lg"
                to="/docs/intro"
              >
                Comenzar
              </Link>
            </div>
          </div>
        </div>
        <div className="banner">
          <img
            src={Banner2}
            alt="Banner de la plataforma de videoconferencia plugNmeet"
          />
        </div>
      </div>
      <section className="features-section slider-section">
        <div className="container">
          <h2 className="headline">Explore las Características Claves</h2>
          <div className="slider-wrapper">
            <img
              className="desktop-back"
              src={DesktopBack}
              alt="Marco de monitor de escritorio"
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
