"use client";

import styles from './about.module.css';
import IndyMowerNavbar from '@/components/IndyMowerNavbar';
import Image from 'next/image';

export default function About() {
  return (
    <main className={styles.main}>
      <IndyMowerNavbar />
      <div className={styles.container}>
        <h1>INDYMOWER</h1>
        
        <section className={styles.storySection}>
          <h2>Our Story</h2>
          <p>
            Founded in Indianapolis with a passion for perfect lawns, we're starting 
            strong in 2025. While we may be new to the scene, we're bringing fresh energy, 
            professional equipment, and an unwavering commitment to excellence. Our goal is 
            simple: transform every yard we touch into the neighborhood's standout lawn. 
            We're here to prove that being new doesn't mean being inexperienced - it means 
            bringing the latest techniques and a dedication to service that's second to none.
          </p>
        </section>

        <section className={styles.valuesSection}>
          <h2>Our Values</h2>
          <div className={styles.valueGrid}>
            <div className={styles.valueCard}>
              <span className={styles.valueIcon}>🎯</span>
              <h3>Precision</h3>
              <p>Every cut is measured, every edge is perfect</p>
            </div>
            <div className={styles.valueCard}>
              <span className={styles.valueIcon}>🤝</span>
              <h3>Reliability</h3>
              <p>Count on us to show up on time, every time</p>
            </div>
            <div className={styles.valueCard}>
              <span className={styles.valueIcon}>♻️</span>
              <h3>Sustainability</h3>
              <p>Eco-friendly practices for a greener tomorrow</p>
            </div>
            <div className={styles.valueCard}>
              <span className={styles.valueIcon}>💪</span>
              <h3>Excellence</h3>
              <p>Never settling for anything less than the best</p>
            </div>
            <div className={styles.valueCard}>
              <span className={styles.valueIcon}>🌟</span>
              <h3>Innovation</h3>
              <p>Embracing new technologies and methods</p>
            </div>
            <div className={styles.valueCard}>
              <span className={styles.valueIcon}>❤️</span>
              <h3>Community</h3>
              <p>Building lasting relationships in Indianapolis</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}


