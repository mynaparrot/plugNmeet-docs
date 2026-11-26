import React, { useState } from 'react';

import ProductDemo from '@site/static/img/ai-agent/ai-agent-product-demo.jpeg';
import SharedNotepad from '@site/static/img/ai-agent/whitebaord_with_shared_notepad.png';
import TimerWhiteboard from '@site/static/img/ai-agent/timer_with_whiteboard.png';
import Poll from '@site/static/img/ai-agent/poll.png';

type Locale = 'en' | 'es';

type Slide = {
  src: string;
  title: string;
  tag: string;
};

const Slides: Record<Locale, Slide[]> = {
  en: [
    {
      src: ProductDemo,
      tag: 'Video Avatar',
      title: 'AI Agent with real-time video avatar presenting on the whiteboard',
    },
    {
      src: SharedNotepad,
      tag: 'Workspace',
      title: 'Interactive whiteboard alongside the shared notepad',
    },
    {
      src: TimerWhiteboard,
      tag: 'Exercises',
      title: 'Timed whiteboard exercise with live countdown timer',
    },
    {
      src: Poll,
      tag: 'Quizzes & Polls',
      title: 'Live quiz and poll assessment during the AI session',
    },
  ],
  es: [
    {
      src: ProductDemo,
      tag: 'Avatar de Video',
      title: 'Agente de IA con avatar de video en tiempo real presentando en la pizarra',
    },
    {
      src: SharedNotepad,
      tag: 'Espacio de Trabajo',
      title: 'Pizarra interactiva junto al bloc de notas compartido',
    },
    {
      src: TimerWhiteboard,
      tag: 'Ejercicios',
      title: 'Ejercicio práctico en la pizarra con temporizador en vivo',
    },
    {
      src: Poll,
      tag: 'Evaluación',
      title: 'Evaluación en vivo con cuestionarios y encuestas durante la sesión',
    },
  ],
};

const Labels: Record<Locale, { prev: string; next: string; gallery: string; bar: string }> = {
  en: {
    prev: 'Previous screenshot',
    next: 'Next screenshot',
    gallery: 'AI Agent screenshots',
    bar: 'AI Agent in action',
  },
  es: {
    prev: 'Captura anterior',
    next: 'Captura siguiente',
    gallery: 'Capturas del Agente de IA',
    bar: 'El Agente de IA en acción',
  },
};

export default function AiAgentShowcase({ locale = 'en' }: { locale?: Locale }) {
  const slides = Slides[locale];
  const labels = Labels[locale];
  const [active, setActive] = useState(0);
  const slide = slides[active];
  const go = (dir: number) =>
    setActive((a) => (a + dir + slides.length) % slides.length);

  return (
    <div className="pnm-shot pnm-shot--doc">
      <div className="pnm-shot-bar">
        <span className="pnm-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="pnm-url">{labels.bar}</span>
        <span className="pnm-count">
          {active + 1} / {slides.length}
        </span>
      </div>
      <div className="pnm-main">
        <img src={slide.src} alt={`plugNmeet AI Agent — ${slide.title}`} />
        <button
          className="pnm-arrow pnm-arrow--prev"
          onClick={() => go(-1)}
          aria-label={labels.prev}
        >
          ‹
        </button>
        <button
          className="pnm-arrow pnm-arrow--next"
          onClick={() => go(1)}
          aria-label={labels.next}
        >
          ›
        </button>
        <p className="pnm-caption">
          <span className="pnm-tag">{slide.tag}</span> {slide.title}
        </p>
      </div>
      <div className="pnm-thumbs pnm-thumbs--4" role="tablist" aria-label={labels.gallery}>
        {slides.map((s, i) => (
          <button
            key={String(s.src)}
            role="tab"
            aria-selected={i === active}
            aria-label={s.title}
            title={s.title}
            className={i === active ? 'pnm-thumb pnm-thumb--active' : 'pnm-thumb'}
            onClick={() => setActive(i)}
          >
            <img src={s.src} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}
