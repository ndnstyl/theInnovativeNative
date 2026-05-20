import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}

const AnimatedCounter = ({ value, prefix = '', suffix = '', decimals = 0, duration = 1.5 }: AnimatedCounterProps) => {
  const counterRef = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const obj = { val: displayed };
    gsap.to(obj, {
      val: value,
      duration,
      ease: 'power2.out',
      onUpdate: () => setDisplayed(obj.val),
    });
  }, [value, duration]);

  const formatted = decimals > 0
    ? displayed.toFixed(decimals)
    : Math.round(displayed).toLocaleString();

  return (
    <span ref={counterRef}>
      {prefix}{formatted}{suffix}
    </span>
  );
};

export default AnimatedCounter;
