"use client";

import Head from "next/head";
import Link from "next/link";

export default function MobilePage() {
  return (
    <>
      <Head>
        <title>Top 10 Websites - Mobile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6 py-10">
        {/* Title */}
        <h1 className="text-[32px] font-bold text-black text-center mb-6">
          Top 10 Websites
        </h1>

        {/* Links (Stacked for Mobile) */}
        <div className="flex flex-col space-y-6 text-[24px] font-bold text-black text-center">
          <Link href="https://top10websites.my.canva.site/top-10-big-black-people" className="hover:underline">
            Top 10 Big Black People
          </Link>
          <Link href="https://example.com" className="hover:underline">
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

        {/* Uppy */}
        <div className="mt-10">
          <Link href="https://example.com" className="text-[24px] font-bold text-black hover:underline">
            Uppy
          </Link>
        </div>
      </div>
    </>
  );
}
