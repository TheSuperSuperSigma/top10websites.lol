"use client";

import styles from './contact.module.css';
import IndyMowerNavbar from '@/components/IndyMowerNavbar';

export default function Contact() {
  return (
    <main className={styles.main}>
      <IndyMowerNavbar />
      <div className={styles.container}>
        <h1>CONTACT US</h1>
        
        <div className={styles.contactGrid}>
          <div className={styles.contactCard}>
            <span className={styles.contactIcon}>📧</span>
            <h3>Email</h3>
            <a href="mailto:theindymower@gmail.com" className={styles.contactInfo}>
              theindymower@gmail.com
            </a>
          </div>

          <div className={styles.contactCard}>
            <span className={styles.contactIcon}>📞</span>
            <h3>Phone</h3>
            <p className={styles.contactInfo}>Currently Unavailable</p>
          </div>

          <div className={styles.contactCard}>
            <span className={styles.contactIcon}>📍</span>
            <h3>Location</h3>
            <p className={styles.contactInfo}>Indianapolis, Indiana</p>
          </div>
        </div>

        <section className={styles.businessHours}>
          <h2>Business Hours</h2>
          <div className={styles.hoursGrid}>
            <div className={styles.hourRow}>
              <span>Monday - Friday</span>
              <span>7:00 AM - 7:00 PM</span>
            </div>
            <div className={styles.hourRow}>
              <span>Saturday</span>
              <span>8:00 AM - 5:00 PM</span>
            </div>
            <div className={styles.hourRow}>
              <span>Sunday</span>
              <span>Closed</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
