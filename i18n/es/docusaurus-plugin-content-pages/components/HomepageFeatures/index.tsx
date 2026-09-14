import React, { useState } from 'react';
import Link from '@docusaurus/Link';

type FeatureItem = {
  icon: string;
  title: string;
  text: string;
  link: string;
  linkLabel: string;
  Svg?: React.ComponentType<React.ComponentProps<'svg'>>;
};

const FeatureList: FeatureItem[] = [
  {
    icon: '🌐',
    title: 'Sin instalación — únase desde el navegador',
    text: 'Con un enlace basta: sin descargas ni complementos. Acceso inmediato desde cualquier navegador moderno, en escritorio o móvil.',
    link: '/docs/user-guide/attendee',
    linkLabel: 'Guía del participante',
    Svg: require('@site/static/img/features/devices-svgrepo-com.svg').default,
  },
  {
    icon: '🤝',
    title: 'Colaboración en tiempo real',
    text: 'Pizarra compartida con anotación de archivos, bloc de notas colaborativo, reproducción sincronizada de video y aplicaciones web integradas.',
    link: '/docs/user-guide/moderator',
    linkLabel: 'Colaborar',
    Svg: require('@site/static/img/features/whiteboard-svgrepo-com.svg').default,
  },
  {
    icon: '🗳️',
    title: 'Salas de grupos, encuestas y moderación',
    text: 'Divida en grupos pequeños, realice encuestas con modo cuestionario, gestione mano levantada, sala de espera y permisos por participante. Ideal para clases, talleres y webinars.',
    link: '/docs/user-guide/moderator',
    linkLabel: 'Guía de moderación',
    Svg: require('@site/static/img/features/video-call-tv-svgrepo-com.svg').default,
  },
  {
    icon: '⏺',
    title: 'Grabación y transmisión',
    text: 'Grabaciones nítidas en HD como MP4 portátil, además de transmisión en directo RTMP/WHIP a YouTube, Facebook o entrada de estudio OBS.',
    link: '/docs/user-guide/moderator',
    linkLabel: 'Ver cómo funciona',
    Svg: require('@site/static/img/features/video-call-svgrepo-com.svg').default,
  },
  {
    icon: '✨',
    title: 'Agente de reuniones con IA',
    text: 'Subtítulos en vivo, traducción hablada, transcripciones, resúmenes y asistente de chat — con el proveedor de IA de su elección.',
    link: '/blog/how-to-add-ai-meeting-assistant-features',
    linkLabel: 'Añadir IA en 15 minutos',
    Svg: require('@site/static/img/features/artificial-intelligence-ai-svgrepo-com.svg').default,
  },
  {
    icon: '📞',
    title: 'Acceso telefónico (SIP) para todos',
    text: '¿Sin internet? Sin problema. Sus invitados pueden unirse solo por audio desde cualquier teléfono mediante marcación SIP — perfecto para zonas con poco ancho de banda.',
    link: '/blog/sip-dial-in-for-video-conferencing',
    linkLabel: 'Marcación SIP',
    Svg: require('@site/static/img/features/webcam-svgrepo-com.svg').default,
  },
  {
    icon: '📶',
    title: 'Conexión estable en cualquier lugar',
    text: 'Calidad adaptativa que mantiene la llamada fluida con Wi-Fi débil o en móvil — sin cortes ni conversaciones interrumpidas.',
    link: '/docs/user-guide/overview',
    linkLabel: 'Más información',
    Svg: require('@site/static/img/features/data-integration-hub-svgrepo-com.svg').default,
  },
  {
    icon: '🔒',
    title: 'Privacidad desde el diseño',
    text: 'Seguridad WebRTC por defecto y cifrado de extremo a extremo opcional — ni siquiera el servidor puede leer el audio ni el chat.',
    link: '/docs/security-overview',
    linkLabel: 'Modelo de seguridad',
    Svg: require('@site/static/img/features/webrtc-svgrepo-com.svg').default,
  },
  {
    icon: '🚀',
    title: 'Instalación sencilla y autoalojamiento',
    text: 'Videoconferencia completa en sus aplicaciones en minutos. Servidor Go de un solo binario: sus datos permanecen en su infraestructura.',
    link: '/docs/installation',
    linkLabel: 'Guía de instalación',
    Svg: require('@site/static/img/features/install-svgrepo-com.svg').default,
  },
  {
    icon: '🎨',
    title: 'Personalizable y marca blanca',
    text: 'URL, logotipos, colores y funciones — personalice todo con marca blanca mediante configuración. Sin bifurcar código ni marca de plugNmeet.',
    link: '/docs/developer-guide/design-customisation',
    linkLabel: 'Personalizar la interfaz',
    Svg: require('@site/static/img/features/component-customization-svgrepo-com.svg').default,
  },
  {
    icon: '🧩',
    title: 'Integración nativa — sin iframe',
    text: 'Olvide el iframe. Con la API getClientFiles, el cliente de reuniones se integra de forma nativa en su propia página — su dominio, su diseño, siempre actualizado.',
    link: '/docs/api/get-client-files',
    linkLabel: 'Integración nativa',
  },
  {
    icon: '📈',
    title: 'Diseñado para escalar',
    text: 'Escalado horizontal con Go + LiveKit + NATS. Más usuarios con menos recursos, desplegado como un único binario.',
    link: '/docs/developer-guide/scalable-setup',
    linkLabel: 'Guía de escalado',
    Svg: require('@site/static/img/features/go-svgrepo-com.svg').default,
  },
];

// Las 12 capturas originales, empaquetadas vía webpack para que un
// archivo ausente falle la compilación en lugar de mostrar una galería vacía.
import Whiteboard1 from '@site/static/img/slider/01-whiteboard-1.jpg';
import Whiteboard2 from '@site/static/img/slider/02-whiteboard2.png';
import SharedNotepad from '@site/static/img/slider/03-SharedNotepad2.jpg';
import AiChatbot from '@site/static/img/slider/04-AiChatbot2.jpg';
import CamGridShot from '@site/static/img/slider/05-24CamGrid.jpg';
import CamOverlay from '@site/static/img/slider/06-cam-overlay.png';
import NotificationsShot from '@site/static/img/slider/07-notifications2.jpg';
import ScreenSharing from '@site/static/img/slider/08-ScreenSharing.jpg';
import ParticipantsShot from '@site/static/img/slider/09-Participants.jpg';
import ChatRoom from '@site/static/img/slider/10-ChatRoom.jpg';
import TranscriptionShot from '@site/static/img/slider/11-TranscriptionTranslation2.jpg';
import PollShot from '@site/static/img/slider/12-Poll2.jpg';

const ShowcaseSlides = [
  { src: Whiteboard1, title: 'Pizarra interactiva para la enseñanza en línea', tag: 'Colaborar' },
  { src: Whiteboard2, title: 'Pizarra con anotación de PDF y Office', tag: 'Colaborar' },
  { src: SharedNotepad, title: 'Bloc de notas compartido para actas en vivo', tag: 'Colaborar' },
  { src: AiChatbot, title: 'Asistente de IA en la videorreunión', tag: 'IA' },
  { src: CamGridShot, title: 'Cuadrícula HD para reuniones grandes', tag: 'Reunirse' },
  { src: CamOverlay, title: 'Fondos virtuales de cámara', tag: 'Reunirse' },
  { src: NotificationsShot, title: 'Mano levantada y notificaciones', tag: 'Participar' },
  { src: ScreenSharing, title: 'Pantalla compartida HD en videollamadas', tag: 'Presentar' },
  { src: ParticipantsShot, title: 'Controles de participantes y moderación', tag: 'Moderar' },
  { src: ChatRoom, title: 'Chat público y privado con archivos', tag: 'Participar' },
  { src: TranscriptionShot, title: 'Transcripción y traducción en vivo', tag: 'IA' },
  { src: PollShot, title: 'Encuestas en vivo con modo cuestionario', tag: 'Participar' },
];

const UseCases = [
  {
    icon: '🎓',
    title: 'Aula virtual',
    text: 'Pizarra, salas de grupos, encuestas y analíticas de asistencia — dentro de Moodle con el plugin de plugNmeet, o en cualquier LMS vía LTI.',
    link: '/docs/user-guide/moodle-integration',
    linkLabel: 'Plugin Moodle →',
  },
  {
    icon: '📡',
    title: 'Webinars y eventos en vivo',
    text: 'Sala de espera, controles de moderación, transmisión RTMP a YouTube/Facebook y entrada de estudio OBS — organice eventos de forma inteligente.',
    link: '/blog/open-source-webinar-software-platform',
    linkLabel: 'Guía de webinars →',
  },
  {
    icon: '🩺',
    title: 'Telemedicina y consultoría',
    text: 'Acceso solo con navegador, salas bloqueables, permisos por usuario y E2EE opcional donde ni el servidor puede escuchar.',
    link: '/docs/security-overview',
    linkLabel: 'Explorar →',
  },
  {
    icon: '🛠️',
    title: 'Integrado en su producto',
    text: 'Integre el cliente completo de forma nativa en su página con getClientFiles — sin iframe. O utilice API + SDK, SSO y webhooks.',
    link: '/docs/api/get-client-files',
    linkLabel: 'Integración nativa →',
  },
];

const Integrations = [
  { name: 'WordPress', desc: 'Plugin sin código', link: '/docs/user-guide/wordPress-integration' },
  { name: 'Moodle', desc: 'Cursos y calificaciones', link: '/docs/user-guide/moodle-integration' },
  { name: 'Joomla', desc: 'Salas en su CMS', link: '/docs/user-guide/joomla-integration' },
  { name: 'LTI / LMS', desc: 'Canvas, Chamilo…', link: '/docs/user-guide/lti' },
  { name: 'API + SDK', desc: 'PHP · JS · webhooks', link: '/docs/api/intro' },
  { name: 'API BBB', desc: 'Migración directa', link: '/docs/tutorials/migration-from-bbb' },
];

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="pnm-sec-head">
      <span className="pnm-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
  );
}

function Showcase() {
  const [active, setActive] = useState(0);
  const slide = ShowcaseSlides[active];
  const go = (dir: number) =>
    setActive((a) => (a + dir + ShowcaseSlides.length) % ShowcaseSlides.length);

  return (
    <div className="pnm-shot">
      <div className="pnm-shot-bar">
        <span className="pnm-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="pnm-url">capturas reales del producto</span>
        <span className="pnm-count">
          {active + 1} / {ShowcaseSlides.length}
        </span>
      </div>
      <div className="pnm-main">
        <img
          key={String(slide.src)}
          src={slide.src}
          alt={`plugNmeet, videoconferencia de código abierto — ${slide.title}`}
        />
        <button
          className="pnm-arrow pnm-arrow--prev"
          onClick={() => go(-1)}
          aria-label="Captura anterior"
        >
          ‹
        </button>
        <button
          className="pnm-arrow pnm-arrow--next"
          onClick={() => go(1)}
          aria-label="Captura siguiente"
        >
          ›
        </button>
        <p className="pnm-caption">
          <span className="pnm-tag">{slide.tag}</span> {slide.title}
        </p>
      </div>
      <div className="pnm-thumbs" role="tablist" aria-label="Capturas del producto">
        {ShowcaseSlides.map((s, i) => (
          <button
            key={String(s.src)}
            role="tab"
            aria-selected={i === active}
            aria-label={s.title}
            title={s.title}
            className={i === active ? 'pnm-thumb pnm-thumb--active' : 'pnm-thumb'}
            onClick={() => setActive(i)}
          >
            <img src={s.src} alt={`plugNmeet — ${s.title}`} loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <>
      <section className="pnm-strip">
        <div className="container pnm-strip-inner">
          <span className="pnm-strip-label">FUNCIONA DONDE USTED TRABAJA</span>
          <div className="pnm-pills">
            {Integrations.map((i) => (
              <Link key={i.name} to={i.link} className="pnm-pill">
                <strong>{i.name}</strong>
                <span>{i.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pnm-section">
        <div className="container">
          <SectionHead
            eyebrow="Funciones principales"
            title="Funciones de videoconferencia de código abierto"
            sub="Todo lo que una sala de reuniones moderna necesita — un único motor autoalojado para videollamadas, aulas virtuales, webinars y reuniones integradas."
          />
          <div className="pnm-cards">
            {FeatureList.map((f) => (
              <article key={f.title} className="pnm-card">
                <div className="pnm-card-top">
                  <span className="pnm-emoji">{f.icon}</span>
                  {f.Svg && (
                    <span className="pnm-card-svg">
                      <f.Svg role="img" aria-label={f.title} />
                    </span>
                  )}
                </div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
                <Link to={f.link} className="pnm-card-link">
                  {f.linkLabel} →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pnm-section pnm-section--alt">
        <div className="container pnm-showcase-grid">
          <div>
            <SectionHead
              eyebrow="Demostración"
              title="Capturas de videoconferencia — véalo en acción"
              sub="Capturas reales de salas reales — pizarra, chat con IA, subtítulos en vivo, encuestas, chat y cuadrículas de video HD. Pulse cualquier miniatura."
            />
            <ul className="pnm-checklist">
              <li>✓ Anote PDF y archivos de Office en vivo</li>
              <li>✓ Resúmenes con IA al finalizar la reunión</li>
              <li>✓ Transmita a YouTube o integre OBS</li>
            </ul>
            <div className="pnm-cta-row">
              <a
                className="pnm-btn pnm-btn--primary"
                href="https://demo.plugnmeet.com/landing.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Probar la demo en vivo
              </a>
              <Link className="pnm-btn pnm-btn--outline" to="/docs/user-guide/overview">
                Guía de usuario
              </Link>
            </div>
          </div>
          <Showcase />
        </div>
      </section>

      <section className="pnm-section">
        <div className="container">
          <SectionHead
            eyebrow="Casos de uso"
            title="¿Qué va a crear usted con plugNmeet?"
            sub="Aulas virtuales, webinars, telemedicina y videochat integrado — el mismo motor autoalojado, solo active las funciones adecuadas."
          />
          <div className="pnm-use-grid">
            {UseCases.map((u) => (
              <Link key={u.title} to={u.link} className="pnm-use">
                <span className="pnm-emoji">{u.icon}</span>
                <h3>{u.title}</h3>
                <p>{u.text}</p>
                <span className="pnm-card-link">{u.linkLabel}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pnm-section pnm-section--navy">
        <div className="container">
          <SectionHead
            eyebrow="Cómo funciona"
            title="Lance videorreuniones autoalojadas en 3 pasos"
          />
          <div className="pnm-steps">
            <div className="pnm-step">
              <span className="pnm-step-n">1</span>
              <h3>Instale el motor</h3>
              <p>Autoalójelo con un script de instalación, u omita la gestión técnica con plugNmeet Cloud.</p>
              <Link to="/docs/installation">Instalación →</Link>
            </div>
            <div className="pnm-step">
              <span className="pnm-step-n">2</span>
              <h3>Reúnase en el navegador, sin instalar nada</h3>
              <p>Sus invitados se unen en un clic desde cualquier navegador moderno, en escritorio o móvil. Sin descargas, complementos ni cuentas.</p>
              <Link to="/blog/no-installation-browser-first-philosophy">Por qué el navegador primero →</Link>
            </div>
            <div className="pnm-step">
              <span className="pnm-step-n">3</span>
              <h3>Personalice y lance</h3>
              <p>Defina logotipo, colores y funciones en la configuración — publique reuniones bajo su propio dominio.</p>
              <Link to="/docs/developer-guide/design-customisation">Temas →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="pnm-section">
        <div className="container">
          <div className="pnm-cta">
            <div>
              <h2>Videoconferencia gratuita de código abierto. Comience hoy y escale cuando lo necesite.</h2>
              <p>
                Reuniones WebRTC autoalojadas y marca blanca con grabación,
                transmisión e IA que respeta su privacidad. Despliegue en sus
                servidores o pruebe la nube en segundos.
              </p>
            </div>
            <div className="pnm-cta-row">
              <Link className="pnm-btn pnm-btn--primary pnm-btn--lg" to="/docs/intro">
                Comenzar →
              </Link>
              <a
                className="pnm-btn pnm-btn--outline pnm-btn--lg"
                href="https://github.com/mynaparrot/plugNmeet-server"
                target="_blank"
                rel="noopener noreferrer"
              >
                ★ Marcar en GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
