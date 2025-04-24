import styles from './about.module.css';
import IndyMowerNavbar from '@/components/IndyMowerNavbar';

export default function About() {
  return (
    <main className={styles.main}>
      <IndyMowerNavbar />
      <div className={styles.container}>
        <h1>About IndyMower</h1>
        
        <section className={styles.storySection}>
          <h2>Our Story</h2>
          <p>We&apos;re passionate about delivering exceptional lawn care services to Indianapolis residents. Our journey began with a simple mission: to provide professional, reliable, and affordable lawn care services to our community.</p>
          <p>With years of experience in the industry, we understand what it takes to maintain a beautiful lawn. Our team&apos;s dedication to quality and attention to detail sets us apart.</p>
        </section>

        <section className={styles.valuesSection}>
          <h2>Our Values</h2>
          <div className={styles.valueGrid}>
            <div className={styles.valueCard}>
              <span className={styles.valueIcon}>🌿</span>
              <h3>Quality</h3>
              <p>We never compromise on the quality of our service, using professional-grade equipment and proven techniques.</p>
            </div>
            <div className={styles.valueCard}>
              <span className={styles.valueIcon}>⏰</span>
              <h3>Reliability</h3>
              <p>Count on us to show up on time, every time, and complete the job to your satisfaction.</p>
            </div>
            <div className={styles.valueCard}>
              <span className={styles.valueIcon}>🤝</span>
              <h3>Integrity</h3>
              <p>We operate with complete transparency and honesty in all our dealings.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}



