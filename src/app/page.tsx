"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      if (isMobile) {
        router.push("/mobile");
      }
    }
  }, [router]); // Added router as a dependency

  return (
    <>
      <Head>
        <title>Top 10 Websites</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center justify-center min-h-screen bg-white relative">
        {/* Title */}
        <h1 className="text-[64px] font-bold text-black absolute top-10 text-center">
          Top 10 <br /> Websites
        </h1>

        {/* Centered Image */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Image
            src="/yunomiles.png"
            alt="Yuno Miles"
            width={200}
            height={400}
            className="object-contain"
          />
        </div>

        {/* Website Links */}
        <div className="absolute top-1/2 transform -translate-y-1/2 w-full px-20 flex justify-between text-center">
          {/* Left Column */}
          <div className="flex flex-col space-y-10 text-[36px] font-bold text-black">
            <Link href="https://top10websites.my.canva.site/top-10-big-black-people" className="hover:underline">
              Top 10 Big Black People
            </Link>
            <Link href="https://top10websites.my.canva.site/top-10-athiei-lookalikes" className="hover:underline">
              Top 10 Athiei Lookalikes
            </Link>
            <Link href="https://example.com" className="hover:underline">
              Insert Website
            </Link>
            <Link href="https://example.com" className="hover:underline">
              Insert Website
            </Link>
            <Link href="https://example.com" className="hover:underline">
              Insert Website
            </Link>
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-10 text-[36px] font-bold text-black">
            <Link href="https://example.com" className="hover:underline">
              Insert Website
            </Link>
            <Link href="https://example.com" className="hover:underline">
              Insert Website
            </Link>
            <Link href="https://example.com" className="hover:underline">
              Insert Website
            </Link>
            <Link href="https://example.com" className="hover:underline">
              Insert Website
            </Link>
            <Link href="https://example.com" className="hover:underline">
              Insert Website
            </Link>
          </div>
        </div>

        {/* Uppy Section */}
        <div className="absolute bottom-20 text-center w-full">
          <Link href="https://top10websites.lol/unskool" className="text-[36px] font-bold text-black hover:underline">
            unskool
          </Link>
        </div>
      </div>
    </>
  );
}
