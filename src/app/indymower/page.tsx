'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './styles.module.css';
import IndyMowerNavbar from '@/components/IndyMowerNavbar';
import Link from 'next/link';

export default function IndyMower() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const progressRef = useRef<number>(0);

  useEffect(() => {
    let startTime: number | null = null;
    const animationDuration = 1000; // 1 second

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      if (containerRef.current) {
        containerRef.current.style.transform = `translateX(${-100 * (1 - progress)}%)`;
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const elementVisible = rect.top < viewportHeight && rect.bottom > 0;

      if (elementVisible) {
        const scrollProgress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
        const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

        if (clampedProgress !== progressRef.current) {
          progressRef.current = clampedProgress;
          
          if (containerRef.current) {
            containerRef.current.style.transform = `translateX(${-100 * (1 - clampedProgress)}%)`;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    requestAnimationFrame(animate); // Add this line to use the animate function

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <main>
      <IndyMowerNavbar />
      <div className={styles.container}>
        <h1>IndyMower</h1>
        
        <div className={styles.contentBox}>
          <h2>Welcome to Indianapolis&apos; Premier Lawn Care Service</h2>
          <div className={styles.welcomeContent}>
            <div className={styles.welcomeSection}>
              <h3>✓ Professional Service</h3>
              <p>Expert lawn care delivered with precision and attention to detail. Every cut, every edge, every time.</p>
            </div>
            <div className={styles.welcomeSection}>
              <h3>✓ Reliable Schedule</h3>
              <p>Consistent, timely service you can count on. We show up when promised, rain or shine.</p>
            </div>
            <div className={styles.welcomeSection}>
              <h3>✓ Competitive Pricing</h3>
              <p>Quality service at fair prices. No hidden fees, no surprises - just honest, transparent pricing.</p>
            </div>
          </div>
          <Link href="/indymower/booking" className={styles.welcomeButton}>
            Get Your Free Quote Today
          </Link>
        </div>

        <div className={styles.lawnmowerSection}>
          <div className={styles.lawnmowerContainer} ref={containerRef}>
            <div className={styles.imageWrapper}>
              <Image
                src="/lawnmower.png"
                alt="Lawnmower"
                width={800}
                height={500}
                className={styles.lawnmowerImage}
                priority
                unoptimized
              />
            </div>
            <div className={styles.diagonalMask} />
            <div className={styles.rightTriangle} />
            <div className={styles.lawnmowerText}>
              <h2>Professional Lawn Care</h2>
              <p>Experience the finest lawn mowing service in Indianapolis. Our expert team ensures your lawn stays healthy and beautiful all year round.</p>
            </div>
            <Link href="/indymower/booking" className={styles.verticalBookButton}>
              B<br/>
              O<br/>
              O<br/>
              K<br/>
              <br/>
              N<br/>
              O<br/>
              W
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

