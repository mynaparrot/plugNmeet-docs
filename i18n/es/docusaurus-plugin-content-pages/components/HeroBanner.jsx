import React from 'react';
import Link from '@docusaurus/Link';
import CamGrid from '../../../../static/img/slider/05-24CamGrid.jpg';

const TrustItems = [
  'Autoalojado — sus datos le pertenecen',
  'Marca blanca real, sin bifurcar código',
  'Cifrado de extremo a extremo opcional',
];

const Stats = [
  { value: '100%', label: 'Código abierto y autoalojable' },
  { value: 'HD', label: 'Grabación en MP4 portable' },
  { value: 'IA', label: 'Resúmenes, subtítulos y traducción' },
  { value: '1 binario', label: 'Stack Go + LiveKit + NATS' },
];

const HeroBanner = () => {
  return (
    <header className="pnm-hero">
      <div className="pnm-hero-bg" aria-hidden="true">
        <span className="pnm-orb pnm-orb--sky" />
        <span className="pnm-orb pnm-orb--navy" />
        <span className="pnm-grid" />
      </div>

      <div className="container pnm-hero-grid">
        <div className="pnm-hero-copy">
          <div className="pnm-badge">
            <span className="pnm-badge-dot" />
            Código abierto · Autoalojado · Con IA
          </div>
          <h1>
            Videoconferencia de código abierto <span className="pnm-gradient-text">para su sitio web — segura, escalable y autoalojada.</span>
          </h1>
          <p className="pnm-lead">
            Añada videorreuniones WebRTC autoalojadas a su sitio web en minutos.
            Audio y video HD, pantalla compartida, pizarra, salas de grupos,
            encuestas, grabación, transmisión en directo RTMP e IA con subtítulos,
            traducción y resúmenes — 100&nbsp;% marca blanca, sin instalaciones,
            en sus servidores y con su marca.
          </p>
          <div className="pnm-cta-row">
            <Link className="pnm-btn pnm-btn--light" to="/docs/intro">
              Comience en minutos →
            </Link>
            <a
              className="pnm-btn pnm-btn--ghost"
              href="https://demo.plugnmeet.com/landing.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              ▶ Demo en vivo
            </a>
          </div>
          <ul className="pnm-trust">
            {TrustItems.map((t) => (
              <li key={t}>
                <span className="pnm-check">✓</span> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="pnm-hero-visual">
          <div className="pnm-browser">
            <div className="pnm-browser-bar">
              <span className="pnm-dots">
                <i />
                <i />
                <i />
              </span>
              <span className="pnm-url">su-dominio.com/reunion</span>
              <span className="pnm-live">
                <span className="pnm-live-dot" /> EN VIVO
              </span>
            </div>
            <img src={CamGrid} alt="Videoconferencia autoalojada de código abierto — cuadrícula HD de una reunión en plugNmeet" fetchPriority="high" />
            <div className="pnm-browser-footer">
              <span>🎙</span>
              <span>🎥</span>
              <span>🖥</span>
              <span>💬</span>
              <span className="pnm-end">Terminar</span>
            </div>
          </div>

          <div className="pnm-float pnm-float--ai">
            <strong>✨ Resumen IA listo</strong>
            <span>Tareas y transcripción en 12 s</span>
          </div>
          <div className="pnm-float pnm-float--lock">
            <strong>🔒 E2EE activado</strong>
            <span>Ni el servidor puede escuchar</span>
          </div>
          <div className="pnm-float pnm-float--rec">
            <span className="pnm-rec-dot" /> <strong>REC 1080p</strong>
            <span>MP4 guardado en su servidor</span>
          </div>
        </div>
      </div>

      <div className="container">
        <dl className="pnm-stats">
          {Stats.map((s) => (
            <div key={s.label} className="pnm-stat">
              <dt>{s.value}</dt>
              <dd>{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
};

export default HeroBanner;
