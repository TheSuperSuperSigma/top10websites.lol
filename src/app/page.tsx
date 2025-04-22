"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      if (isMobile) {
        router.push("/mobile");
      }
    }
  }, [router]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Top 10 <br /> Websites
      </h1>

      <div className={styles.mainContent}>
        {/* Left column of links */}
        <div className={styles.linkColumn}>
          <Link href="/top10bigblackpeople" className={styles.link}>
            Top 10 Big Black People
          </Link>
          <Link href="/top10athieilookalikes" className={styles.link}>
            Top 10 Athiei Lookalikes
          </Link>
          <Link href="example.com" className={styles.link}>
            Comming Soon
          </Link>
          <Link href="https://example.com" className={styles.link}>
            Coming Soon
          </Link>
          <Link href="https://example.com" className={styles.link}>
            Coming Soon
          </Link>
        </div>

        {/* Yuno Miles in the middle */}
        <div className={styles.imageContainer}>
          <Image
            src="/yunomiles.png"
            alt="Yuno Miles"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Right column of links */}
        <div className={styles.linkColumn}>
          <Link href="https://example.com" className={styles.link}>
            Coming Soon
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
          <Link href="https://example.com" className={styles.link}>
            Coming Soon
          </Link>
        </div>
      </div>

      <Link href="https://unskool.software" className={`${styles.link} ${styles.unskoolLink}`}>
        Unskool
      </Link>
    </div>
  );
}
