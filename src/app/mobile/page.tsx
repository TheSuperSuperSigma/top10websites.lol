import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

export default function MobilePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Top 10 <br /> Websites
      </h1>

      <div className={styles.imageContainer}>
        <Image
          src="/yunomiles.png"
          alt="Yuno Miles"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className={styles.linksContainer}>
        <Link href="/top10bigblackpeople" className={styles.link}>
          Top 10 Big Black People
        </Link>
        <Link href="/top10athieilookalikes" className={styles.link}>
          Top 10 Athiei Lookalikes
        </Link>
        <Link href="https://example.com" className={styles.link}>
          Comming Soon
        </Link>
        <Link href="https://example.com" className={styles.link}>
          Coming Soon
        </Link>
        <Link href="https://example.com" className={styles.link}>
          Coming Soon
        </Link>
        <Link href="https://example.com" className={styles.link}>
          Coming Soon
        </Link>
      </div>

      <Link href="https://top10websites.lol/unskool" className={`${styles.link} ${styles.unskoolLink}`}>
        Unskool
      </Link>
    </div>
  );
}
