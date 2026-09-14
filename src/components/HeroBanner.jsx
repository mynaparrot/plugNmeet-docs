import React from 'react';
import Link from '@docusaurus/Link';
import CamGrid from '../../static/img/slider/05-24CamGrid.jpg';

const TrustItems = [
  'Self-hosted — your data stays yours',
  'True white-label, no code forks',
  'Optional end-to-end encryption',
];

const Stats = [
  { value: '100%', label: 'Open source · MIT licensed, free forever' },
  { value: 'HD', label: 'Video calls with MP4 recording' },
  { value: 'AI', label: 'Summaries, captions & translation' },
  { value: '1-binary', label: 'Go + LiveKit + NATS stack' },
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
            Open source · Self-hosted · AI-powered
          </div>
          <h1>
            Open Source Video Conferencing <span className="pnm-gradient-text">for Your Website — Secure, Scalable &amp; Self-Hosted.</span>
          </h1>
          <p className="pnm-lead">
            plugNmeet is a free, open-source WebRTC project you host yourself.
            Read the docs, run one install script, and add HD meetings,
            whiteboard, breakout rooms, polls, recording, RTMP streaming and
            optional AI to your site — no accounts, no installs for guests, no
            vendor lock-in.
          </p>
          <div className="pnm-cta-row">
            <Link className="pnm-btn pnm-btn--light" to="/docs/intro">
              Read the docs →
            </Link>
            <a
              className="pnm-btn pnm-btn--ghost"
              href="https://github.com/mynaparrot/plugNmeet-server"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              className="pnm-btn pnm-btn--ghost"
              href="https://demo.plugnmeet.com/landing.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              ▶ Live demo
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
              <span className="pnm-url">your-domain.com/meeting</span>
              <span className="pnm-live">
                <span className="pnm-live-dot" /> LIVE
              </span>
            </div>
            <img src={CamGrid} alt="Self-hosted open-source video conferencing — HD meeting grid in plugNmeet" fetchPriority="high" />
            <div className="pnm-browser-footer">
              <span>🎙</span>
              <span>🎥</span>
              <span>🖥</span>
              <span>💬</span>
              <span className="pnm-end">End</span>
            </div>
          </div>

          <div className="pnm-float pnm-float--ai">
            <strong>✨ Optional AI</strong>
            <span>Captions & summaries</span>
          </div>
          <div className="pnm-float pnm-float--lock">
            <strong>🔒 E2EE on</strong>
            <span>Even the server can&apos;t listen</span>
          </div>
          <div className="pnm-float pnm-float--rec">
            <span className="pnm-rec-dot" /> <strong>REC 1080p</strong>
            <span>MP4 saved to your storage</span>
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
