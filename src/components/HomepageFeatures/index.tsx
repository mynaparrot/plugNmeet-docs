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
    title: 'No install — join in browser',
    text: 'One link, zero downloads or plugins. Frictionless join on any modern desktop or mobile browser.',
    link: '/docs/user-guide/attendee',
    linkLabel: 'Attendee view',
    Svg: require('@site/static/img/features/devices-svgrepo-com.svg').default,
  },
  {
    icon: '🤝',
    title: 'Real-time collaboration',
    text: 'Shared whiteboard with file annotation, collaborative notepad, synced video playback and embedded web apps.',
    link: '/docs/user-guide/moderator',
    linkLabel: 'Collaborate',
    Svg: require('@site/static/img/features/whiteboard-svgrepo-com.svg').default,
  },
  {
    icon: '🗳️',
    title: 'Breakout rooms, polls & moderation',
    text: 'Split into small groups, run quiz-mode polls, raise hands, waiting room and per-user locks — built for classes, workshops and webinars.',
    link: '/blog/mastering-breakout-rooms',
    linkLabel: 'Breakout guide',
    Svg: require('@site/static/img/features/video-call-tv-svgrepo-com.svg').default,
  },
  {
    icon: '⏺',
    title: 'Recording & broadcasting',
    text: 'Crystal-clear HD MP4 recordings plus RTMP/WHIP live streaming to YouTube, Facebook, or OBS studio input.',
    link: '/docs/user-guide/moderator',
    linkLabel: 'See how',
    Svg: require('@site/static/img/features/video-call-svgrepo-com.svg').default,
  },
  {
    icon: '✨',
    title: 'AI meeting agent',
    text: 'Live captions, spoken translation, transcripts, summaries and chat assistant — powered by your own AI provider.',
    link: '/blog/how-to-add-ai-meeting-assistant-features',
    linkLabel: 'Add AI in 15 min',
    Svg: require('@site/static/img/features/artificial-intelligence-ai-svgrepo-com.svg').default,
  },
  {
    icon: '📞',
    title: 'Phone dial-in (SIP) for everyone',
    text: 'No internet? No problem. Guests join audio-only from any phone via SIP dial-in — ideal for low-bandwidth regions and on-the-go attendees.',
    link: '/blog/sip-dial-in-for-video-conferencing',
    linkLabel: 'SIP dial-in',
    Svg: require('@site/static/img/features/webcam-svgrepo-com.svg').default,
  },
  {
    icon: '📶',
    title: 'Stable connection, anywhere',
    text: 'Adaptive quality keeps calls smooth on weak Wi-Fi or mobile — no buffering, no dropped conversation.',
    link: '/docs/user-guide/overview',
    linkLabel: 'Learn more',
    Svg: require('@site/static/img/features/data-integration-hub-svgrepo-com.svg').default,
  },
  {
    icon: '🔒',
    title: 'Privacy by design',
    text: 'WebRTC security by default, optional true end-to-end encryption — not even the server can read media or chat.',
    link: '/docs/security-overview',
    linkLabel: 'Security model',
    Svg: require('@site/static/img/features/webrtc-svgrepo-com.svg').default,
  },
  {
    icon: '🚀',
    title: 'Easy install & self-hosting',
    text: 'Full video conferencing in your apps in minutes. Single-binary Go server, your data stays on your infrastructure.',
    link: '/docs/installation',
    linkLabel: 'Install guide',
    Svg: require('@site/static/img/features/install-svgrepo-com.svg').default,
  },
  {
    icon: '🎨',
    title: 'Fully customizable & brandable',
    text: 'URLs, logos, colors, features — white-label everything via config. No code forks, no plugNmeet branding.',
    link: '/docs/developer-guide/design-customisation',
    linkLabel: 'Customize UI',
    Svg: require('@site/static/img/features/component-customization-svgrepo-com.svg').default,
  },
  {
    icon: '🧩',
    title: 'Native embed — no iframe trap',
    text: 'Skip the iframe. Use the getClientFiles API to render the full meeting client natively inside your own page — your domain, your layout, always up to date.',
    link: '/docs/api/get-client-files',
    linkLabel: 'Embed natively',
  },
  {
    icon: '📈',
    title: 'Built to scale',
    text: 'Horizontal scaling with Go + LiveKit + NATS. More users on fewer resources, deployed as one binary.',
    link: '/docs/developer-guide/scalable-setup',
    linkLabel: 'Scaling guide',
    Svg: require('@site/static/img/features/go-svgrepo-com.svg').default,
  },
];

// All 12 original product screenshots, bundled via webpack so a missing
// file fails the build instead of rendering an empty gallery.
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
  { src: Whiteboard1, title: 'Interactive whiteboard for online teaching', tag: 'Collaborate' },
  { src: Whiteboard2, title: 'Whiteboard with PDF and Office file annotation', tag: 'Collaborate' },
  { src: SharedNotepad, title: 'Shared notepad for live meeting notes', tag: 'Collaborate' },
  { src: AiChatbot, title: 'AI chat assistant in the video meeting', tag: 'AI' },
  { src: CamGridShot, title: 'HD video grid for large meetings', tag: 'Meet' },
  { src: CamOverlay, title: 'Virtual backgrounds & camera overlay', tag: 'Meet' },
  { src: NotificationsShot, title: 'Raise hand & live notifications', tag: 'Engage' },
  { src: ScreenSharing, title: 'HD screen sharing in video calls', tag: 'Present' },
  { src: ParticipantsShot, title: 'Participant and moderator controls', tag: 'Moderate' },
  { src: ChatRoom, title: 'Public & private chat with file sharing', tag: 'Engage' },
  { src: TranscriptionShot, title: 'Live transcription & translation', tag: 'AI' },
  { src: PollShot, title: 'Live polls with quiz mode', tag: 'Engage' },
];

const UseCases = [
  {
    icon: '🎓',
    title: 'Virtual classroom',
    text: 'Whiteboard, breakout rooms, polls and attendance analytics — right inside Moodle with the plugNmeet plugin, or any LMS via LTI.',
    link: '/docs/user-guide/moodle-integration',
    linkLabel: 'Moodle plugin →',
  },
  {
    icon: '📡',
    title: 'Webinar & live events',
    text: 'Waiting room, moderator controls, RTMP streaming to YouTube/Facebook and OBS studio input — host events the smart way.',
    link: '/blog/open-source-webinar-software-platform',
    linkLabel: 'Webinar guide →',
  },
  {
    icon: '🩺',
    title: 'Telehealth & consulting',
    text: 'Browser-only join, lockable rooms, per-user permissions, optional E2EE where even the server can’t listen.',
    link: '/docs/security-overview',
    linkLabel: 'Explore →',
  },
  {
    icon: '🛠️',
    title: 'Embedded in your product',
    text: 'Render the full meeting client natively in your page with getClientFiles — no iframe. Or go headless with the API + SDKs, SSO and webhooks.',
    link: '/blog/developer-guide-custom-video-chat-ui-headless-api',
    linkLabel: 'Native embed guide →',
  },
];

const Integrations = [
  { name: 'WordPress', desc: 'No-code plugin', link: '/docs/user-guide/wordPress-integration' },
  { name: 'Moodle', desc: 'Courses + grades', link: '/docs/user-guide/moodle-integration' },
  { name: 'Joomla', desc: 'Rooms in CMS', link: '/docs/user-guide/joomla-integration' },
  { name: 'LTI / LMS', desc: 'Canvas, Chamilo…', link: '/docs/user-guide/lti' },
  { name: 'API + SDKs', desc: 'PHP · JS · webhooks', link: '/docs/api/intro' },
  { name: 'BBB API', desc: 'Drop-in migration', link: '/docs/tutorials/migration-from-bbb' },
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
        <span className="pnm-url">live product screenshots</span>
        <span className="pnm-count">
          {active + 1} / {ShowcaseSlides.length}
        </span>
      </div>
      <div className="pnm-main">
        <img
          key={String(slide.src)}
          src={slide.src}
          alt={`plugNmeet open-source video conferencing — ${slide.title}`}
        />
        <button
          className="pnm-arrow pnm-arrow--prev"
          onClick={() => go(-1)}
          aria-label="Previous screenshot"
        >
          ‹
        </button>
        <button
          className="pnm-arrow pnm-arrow--next"
          onClick={() => go(1)}
          aria-label="Next screenshot"
        >
          ›
        </button>
        <p className="pnm-caption">
          <span className="pnm-tag">{slide.tag}</span> {slide.title}
        </p>
      </div>
      <div className="pnm-thumbs" role="tablist" aria-label="Product screenshots">
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
      {/* Integration strip */}
      <section className="pnm-strip">
        <div className="container pnm-strip-inner">
          <span className="pnm-strip-label">WORKS WHERE YOU WORK</span>
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

      {/* Features */}
      <section className="pnm-section">
        <div className="container">
          <SectionHead
            eyebrow="Core features"
            title="Open-source video conferencing features"
            sub="Everything a modern meeting room needs — one self-hosted engine for video calls, virtual classrooms, webinars and embedded meetings."
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

      {/* Showcase */}
      <section className="pnm-section pnm-section--alt">
        <div className="container pnm-showcase-grid">
          <div>
            <SectionHead
              eyebrow="Product tour"
              title="Video conferencing screenshots — see it in action"
              sub="Real screenshots from real rooms — whiteboard, AI chat, live captions, polls, chat and HD video grids. Click any thumbnail."
            />
            <ul className="pnm-checklist">
              <li>✓ Annotate PDFs & Office files live</li>
              <li>✓ AI summaries the moment you end</li>
              <li>✓ Stream to YouTube or bring in OBS</li>
            </ul>
            <div className="pnm-cta-row">
              <a
                className="pnm-btn pnm-btn--primary"
                href="https://demo.plugnmeet.com/landing.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Try live demo
              </a>
              <Link className="pnm-btn pnm-btn--outline" to="/docs/user-guide/overview">
                User guide
              </Link>
            </div>
          </div>
          <Showcase />
        </div>
      </section>

      {/* Use cases */}
      <section className="pnm-section">
        <div className="container">
          <SectionHead
            eyebrow="Use cases"
            title="What will you build with plugNmeet?"
            sub="Virtual classrooms, webinars, telehealth and embedded video chat — same self-hosted engine, just enable the right features."
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

      {/* How it works */}
      <section className="pnm-section pnm-section--navy">
        <div className="container">
          <SectionHead
            eyebrow="How it works"
            title="Launch self-hosted video meetings in 3 steps"
          />
          <div className="pnm-steps">
            <div className="pnm-step">
              <span className="pnm-step-n">1</span>
              <h3>Run the engine</h3>
              <p>Self-host with one install script, or skip ops with plugNmeet Cloud.</p>
              <Link to="/docs/installation">Installation →</Link>
            </div>
            <div className="pnm-step">
              <span className="pnm-step-n">2</span>
              <h3>Meet in your browser — no installs</h3>
              <p>Guests join in one click from any modern desktop or mobile browser. No downloads, plugins, or accounts.</p>
              <Link to="/blog/no-installation-browser-first-philosophy">Why browser-first →</Link>
            </div>
            <div className="pnm-step">
              <span className="pnm-step-n">3</span>
              <h3>Brand & launch</h3>
              <p>Set logo, colors, features in config — ship meetings under your domain.</p>
              <Link to="/docs/developer-guide/design-customisation">Theming →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pnm-section">
        <div className="container">
          <div className="pnm-cta">
            <div>
              <h2>Free open-source video conferencing. Start today, scale when ready.</h2>
              <p>
                Self-hosted, white-label WebRTC meetings with recording,
                streaming and privacy-respecting AI. Deploy on your servers or
                test the cloud in seconds.
              </p>
            </div>
            <div className="pnm-cta-row">
              <Link className="pnm-btn pnm-btn--primary pnm-btn--lg" to="/docs/intro">
                Get started →
              </Link>
              <a
                className="pnm-btn pnm-btn--outline pnm-btn--lg"
                href="https://github.com/mynaparrot/plugNmeet-server"
                target="_blank"
                rel="noopener noreferrer"
              >
                ★ Star on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
