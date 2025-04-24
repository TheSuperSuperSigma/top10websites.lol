'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './IndyMowerNavbar.module.css';

export default function IndyMowerNavbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <button 
          className={`${styles.menuButton} ${isSidebarOpen ? styles.menuOpen : ''}`}
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#1B5E20"  // Updated from #2E7D32
            strokeWidth="2" 
            strokeLinecap="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className={styles.sidebarLinks}>
          <Link href="/indymower/services" className={styles.navLink}>Services</Link>
          <Link href="/indymower/about" className={styles.navLink}>About Us</Link>
          <Link href="/indymower/contact" className={styles.navLink}>Contact</Link>
          <Link href="/indymower/booking" className={`${styles.navLink} ${styles.ctaButton}`}>
            Book Now
          </Link>
        </div>
      </div>

      <nav className={styles.navbar}>
        <button 
          className={styles.menuButton}
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#1B5E20"  // Updated from #2E7D32
            strokeWidth="2" 
            strokeLinecap="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <Link href="/indymower" className={styles.logo}>
          IndyMower
        </Link>
      </nav>

      <div 
        className={`${styles.overlay} ${isSidebarOpen ? styles.open : ''}`}
        onClick={toggleSidebar}
      />
    </>
  );
}










