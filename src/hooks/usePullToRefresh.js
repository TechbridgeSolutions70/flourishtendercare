import { useEffect, useRef } from 'react';

export default function usePullToRefresh() {
  const startY = useRef(0);
  const isPulling = useRef(false);
  const currentDistance = useRef(0);
  const isEnabled = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  useEffect(() => {
    if (!isEnabled) return undefined;

    const shell = document.querySelector('.page-shell');
    if (!shell) return undefined;

    const threshold = 90;
    const maxPull = 120;

    const resetShell = () => {
      currentDistance.current = 0;
      shell.style.transition = 'transform 0.2s ease';
      shell.style.transform = 'translateY(0px)';
    };

    const onTouchStart = (event) => {
      if (shell.scrollTop !== 0) return;
      const touch = event.touches[0];
      startY.current = touch.clientY;
      isPulling.current = true;
      shell.style.transition = 'none';
    };

    const onTouchMove = (event) => {
      if (!isPulling.current) return;
      const touch = event.touches[0];
      const delta = touch.clientY - startY.current;
      if (delta <= 0) return;

      event.preventDefault();
      const distance = Math.min(delta, maxPull);
      currentDistance.current = distance;
      shell.style.transform = `translateY(${distance}px)`;
    };

    const onTouchEnd = () => {
      if (!isPulling.current) return;
      isPulling.current = false;
      shell.style.transition = 'transform 0.2s ease';

      if (currentDistance.current > threshold) {
        shell.style.transform = 'translateY(0px)';
        setTimeout(() => {
          window.location.reload();
        }, 120);
      } else {
        resetShell();
      }
    };

    shell.addEventListener('touchstart', onTouchStart, { passive: true });
    shell.addEventListener('touchmove', onTouchMove, { passive: false });
    shell.addEventListener('touchend', onTouchEnd, { passive: true });
    shell.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      shell.removeEventListener('touchstart', onTouchStart);
      shell.removeEventListener('touchmove', onTouchMove);
      shell.removeEventListener('touchend', onTouchEnd);
      shell.removeEventListener('touchcancel', onTouchEnd);
      shell.style.transition = '';
      shell.style.transform = '';
    };
  }, [isEnabled]);
}
