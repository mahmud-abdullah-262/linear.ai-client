'use client';

import Lenis from 'lenis';
import { ReactNode, useEffect } from 'react';


export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Lenis ইনস্ট্যান্স তৈরি
    const lenis = new Lenis({
      duration: 1.2, // স্ক্রোলিংয়ের স্পিড/ডিউরেশন
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // কাস্টম ইজিং ফাংশন
      smoothWheel: true,
    });

    // অ্যানিমেশন ফ্রেম লুপ
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // ক্লিনআপ ফাংশন (কম্পোনেন্ট অনমাউন্ট হলে মেমোরি লিক রোধ করতে)
    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}