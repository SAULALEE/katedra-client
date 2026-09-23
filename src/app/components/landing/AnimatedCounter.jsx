import { useState, useEffect, useRef } from 'react';

export default function AnimatedCounter({ target, prefix = '', suffix = '' }) {
  const [value, setValue] = useState(0);
  const elementRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let start = null;
    const duration = 1500;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * ease));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [hasStarted, target]);

  return (
    <span ref={elementRef}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}
