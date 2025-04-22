"use client";

import Image from 'next/image';
import styles from './styles.module.css';

const bigBlackPeople = [
  { number: "1", name: "Eye of Rah" },
  { number: "2", name: "Jidion" },
  { number: "3", name: "LeBron James" },
  { number: "4", name: "Kai Cenat" },
  { number: "5", name: "Barrack Obama" },
  { number: "6", name: "Yuno Miles" },
  { number: "7", name: "P. Diddy" },
  { number: "8", name: "Salva Kiir" },
  { number: "9", name: "Flight" },
  { number: "10", name: "EDP445" }
];

export default function BigBlackPeoplePage() {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <h1 className={styles.mainTitle}>Top 10 Big Black People</h1>
      </div>
      
      <div className={styles.scrollContainer}>
        {bigBlackPeople.map(({ number, name }) => (
          <div key={number} className={styles.scrollItem}>
            <div className={styles.caption}>
              <div className={styles.number}>#{number}</div>
              <h2 className={styles.name}>{name}</h2>
            </div>
            <div className={styles.imageWrapper}>
              <Image
                src={`/ttbbp${number}.png`}
                alt={`Big Black Person ${number}`}
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
