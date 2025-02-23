import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white relative">
      {/* Title - Moved Higher */}
      <h1 className="text-[64px] font-bold text-black absolute top-10 text-center">
        Top 10 <br /> Websites
      </h1>

      {/* Center Image (Yuno Miles) - Perfectly Centered */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Image
          src="/yunomiles.png"
          alt="Yuno Miles"
          width={500} // Perfect size
          height={700} // Perfect size
          className="object-contain"
        />
      </div>

      {/* Website Links - Closer to the Sides */}
      <div className="absolute top-1/2 transform -translate-y-1/2 w-full px-20 flex justify-between text-center">
        {/* Left Column */}
        <div className="flex flex-col space-y-10 text-[36px] font-bold text-black">
          <p>Top 10 Black People</p>
          <p>Top 10 Atihei Lookalikes</p>
          <p>Insert Website</p>
          <p>Insert Website</p>
          <p>Insert Website</p>
        </div>

        {/* Right Column */}
        <div className="flex flex-col space-y-10 text-[36px] font-bold text-black">
          <p>DParty</p>
          <p>Insert Website</p>
          <p>Insert Website</p>
          <p>Insert Website</p>
          <p>Insert Website</p>
        </div>
      </div>

      {/* Uppy - Position Kept Same */}
      <div className="absolute bottom-20 text-center w-full">
        <p className="text-[36px] font-bold text-black">Uppy</p>
      </div>
    </div>
  );
}
