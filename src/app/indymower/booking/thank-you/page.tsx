"use client";

import styles from '../booking.module.css';
import IndyMowerNavbar from '@/components/IndyMowerNavbar';
import Link from 'next/link';

export default function ThankYou() {
  return (
    <main className={styles.main}>
      <IndyMowerNavbar />
      <div className={styles.container}>
        <div className={styles.thankYouCard}>
          <h1>Thank You for Your Booking!</h1>
          <p>We have received your service request and will contact you shortly to confirm the details.</p>
          <p>If you don&apos;t hear from us within 24 hours, please email us at theindymower@gmail.com</p>
          <Link href="/indymower" className={styles.homeButton}>
            Return to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
