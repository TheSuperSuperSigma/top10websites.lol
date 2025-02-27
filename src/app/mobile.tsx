import Head from "next/head";
import Link from "next/link";

export default function MobilePage() {
  return (
    <>
      <Head>
        <title>Top 10 Websites - Mobile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 py-10 text-center">
        <h1 className="text-[36px] font-bold text-black mb-6">
          Top 10 Websites
        </h1>

        <p className="text-[24px] text-black mb-4">You're on mobile!</p>

        <div className="flex flex-col space-y-4 text-[24px] font-bold text-black">
          <Link href="https://example.com" className="hover:underline">
            Mobile Link 1
          </Link>
          <Link href="https://example.com" className="hover:underline">
            Mobile Link 2
          </Link>
          <Link href="/">Go to Desktop Site</Link>
        </div>
      </div>
    </>
  );
}
