import { useEffect, useRef } from 'react';

const TECH = [
  'React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'Next.js',
  'Tailwind', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'OpenAI',
  'Vite', 'GraphQL', 'Prisma', 'Socket.io', 'Cloudinary', 'Stripe',
];

function buildTrack(items) {
  return [...items, ...items];
}

export default function Marquee() {
  return (
    <div id="marquee">
      <div className="mrow">
        <div className="mtrack" id="mtrack1">
          {buildTrack(TECH).map((t, i) => (
            <span className="mi" key={i}>⬡ {t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
