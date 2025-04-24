import styles from './services.module.css';
import IndyMowerNavbar from '@/components/IndyMowerNavbar';
import Link from 'next/link';

export default function Services() {
  const services = [
    { 
      id: 'standard-mow', 
      name: 'Standard Mowing', 
      description: 'Professional cut at optimal height with complete grass cleanup. Includes blowing of clippings from all hard surfaces.',
      price: 35, 
      icon: '🌿'
    },
    { 
      id: 'edging', 
      name: 'Edge Trimming', 
      description: 'Sharp, clean edges along walkways, driveways, and beds. Perfect add-on to standard mowing.',
      price: 10, 
      icon: '✂️'
    },
    { 
      id: 'weed-removal', 
      name: 'Weed Removal', 
      description: 'Manual removal of visible weeds from your lawn and garden beds to maintain a clean, healthy appearance.',
      price: 10, 
      icon: '🌱'
    },
    { 
      id: 'small-bush-trim', 
      name: 'Small Bush Trimming', 
      description: 'Basic trimming of small bushes and shrubs to maintain shape and size.',
      price: 10, 
      icon: '🪴'
    },
    { 
      id: 'flower-bed-cleanup', 
      name: 'Flower Bed Cleanup', 
      description: 'Remove debris, dead plants, and unwanted growth from flower beds to keep them tidy.',
      price: 10, 
      icon: '🌺'
    },
    { 
      id: 'grass-seeding', 
      name: 'Grass Seeding', 
      description: 'Spread grass seed on bare or thin patches to promote fuller lawn growth.',
      price: 15 , 
      icon: '🌾'
    }
  ];

  return (
    <main className={styles.main}>
      <IndyMowerNavbar />
      <div className={styles.container}>
        <h1>Our Services</h1>
        <p className={styles.subtitle}>Professional lawn care services for your perfect yard</p>
        
        <div className={styles.servicesGrid}>
          {services.map(service => (
            <div key={service.id} className={styles.serviceCard}>
              <span className={styles.serviceIcon}>{service.icon}</span>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <span className={styles.price}>${service.price}</span>
              <Link href="/indymower/booking" className={styles.bookNowButton}>
                Book Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}







