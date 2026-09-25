import { useEffect, useState } from 'react';

const nigeriaDateParts = () => Object.fromEntries(new Intl.DateTimeFormat('en-US', {
  timeZone: 'Africa/Lagos',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
}).formatToParts(new Date()).map(({ type, value }) => [type, value]));

export const getNigeriaYear = () => Number(nigeriaDateParts().year);
export const getIndependenceAge = () => getNigeriaYear() - 1960;

export const isIndependenceDayActive = () => {
  const { month, day } = nigeriaDateParts();
  return Number(month) === 10 && Number(day) === 1;
};

export const isIndependenceDayPreview = () => typeof window !== 'undefined'
  && new URLSearchParams(window.location.search).get('independence') === 'preview';

const flags = [
  { left: '4%', top: '18%', delay: '0s', duration: '13s' },
  { left: '17%', top: '67%', delay: '-4s', duration: '16s' },
  { left: '34%', top: '28%', delay: '-8s', duration: '15s' },
  { left: '52%', top: '74%', delay: '-2s', duration: '17s' },
  { left: '68%', top: '20%', delay: '-10s', duration: '14s' },
  { left: '83%', top: '58%', delay: '-6s', duration: '18s' },
];

const bursts = [
  { left: '7%', top: '24%', delay: '-0.2s' },
  { left: '18%', top: '43%', delay: '-1.1s' },
  { left: '29%', top: '18%', delay: '-2s' },
  { left: '40%', top: '58%', delay: '-2.9s' },
  { left: '51%', top: '25%', delay: '-3.8s' },
  { left: '62%', top: '46%', delay: '-4.7s' },
  { left: '73%', top: '17%', delay: '-5.6s' },
  { left: '84%', top: '39%', delay: '-6.5s' },
  { left: '94%', top: '63%', delay: '-7.4s' },
  { left: '12%', top: '78%', delay: '-8.3s' },
  { left: '56%', top: '78%', delay: '-9.2s' },
  { left: '79%', top: '82%', delay: '-10.1s' },
];

function IndependenceDayEffect() {
  const [active, setActive] = useState(() => isIndependenceDayActive() || isIndependenceDayPreview());

  useEffect(() => {
    const updateSchedule = () => setActive(isIndependenceDayActive() || isIndependenceDayPreview());
    updateSchedule();

    const timer = window.setInterval(updateSchedule, 30 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('independence-day', active);
    return () => document.documentElement.classList.remove('independence-day');
  }, [active]);

  if (!active) return null;

  const independenceAge = getIndependenceAge();

  return (
    <div className="independence-day-effects" aria-hidden="true">
      <div className="independence-day-banner">NIGERIA @ {independenceAge}</div>
      {flags.map((flag, index) => (
        <div
          className="independence-flag"
          key={`${flag.left}-${index}`}
          style={{
            '--flag-left': flag.left,
            '--flag-top': flag.top,
            '--flag-delay': flag.delay,
            '--flag-duration': flag.duration,
          }}
        >
          <span className="independence-flag-cloth">NIGERIA <b>@ {independenceAge}</b></span>
          <span className="independence-flag-pole" />
        </div>
      ))}
      {bursts.map((burst, index) => (
        <span
          className={`independence-firework ${index % 2 === 0 ? 'independence-firework-green' : 'independence-firework-white'}`}
          key={`${burst.left}-${index}`}
          style={{ '--burst-left': burst.left, '--burst-top': burst.top, '--burst-delay': burst.delay }}
        />
      ))}
    </div>
  );
}

export default IndependenceDayEffect;
