import { useEffect, useState } from 'react';

// Simple responsive hook that classifies viewport sizes and updates on resize.
export default function useResponsive() {
  const getSize = () => {
    if (typeof window === 'undefined') return { size: 'lg', width: 1200 };
    const w = window.innerWidth;
    if (w < 480) return { size: 'xs', width: w };
    if (w < 768) return { size: 'sm', width: w };
    if (w < 1024) return { size: 'md', width: w };
    return { size: 'lg', width: w };
  };

  const [state, setState] = useState(getSize);

  useEffect(() => {
    const onResize = () => setState(getSize());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return {
    size: state.size,
    width: state.width,
    isXs: state.size === 'xs',
    isSm: state.size === 'sm',
    isMd: state.size === 'md',
    isLg: state.size === 'lg',
    isMobile: state.size === 'xs' || state.size === 'sm',
  };
}
