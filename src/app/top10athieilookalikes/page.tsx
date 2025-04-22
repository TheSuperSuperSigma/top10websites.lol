"use client";

import Image from 'next/image';
import styles from './styles.module.css';

const lookalikes = [
  { number: "1", name: "Abraham Clinkscales" },
  { number: "2", name: "Marcasist" },
  { number: "3", name: "Valerie Berlin" },
  { number: "4", name: "Mark Henry" },
  { number: "5", name: "Black Baby Gang" },
  { number: "6", name: "Salva Kiir" },
  { number: "7", name: "Fatass Cow" },
  { number: "8", name: "Wrecking Ball" },
  { number: "9", name: "Brown M&M" },
  { number: "10", name: "Dancing Black Baby" }
];

export default function AthieiLookalikesPage() {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <h1 className={styles.mainTitle}>Top 10 Athiei Lookalikes</h1>
        <h2 className={styles.subtitle}>Athiei Bol Makoi</h2>
        <div className={styles.headerImage}>
          <Image
            src="/ading.png"
            alt="Athiei Bol Makoi"
            width={300}
            height={300}
            className={styles.profileImage}
            priority
          />
        </div>
      </div>
      
      <div className={styles.scrollContainer}>
        {lookalikes.map(({ number, name }) => (
          <div key={number} className={styles.scrollItem}>
            <div className={styles.caption}>
              <div className={styles.number}>#{number}</div>
              <h2 className={styles.name}>{name}</h2>
            </div>
            <div className={styles.imageWrapper}>
              <Image
                src={`/ttal${number}.png`}
                alt={`Athiei Lookalike ${number}`}
                width={800}
                height={600}
                className={styles.image}
                priority={parseInt(number) <= 2}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}





