"use client";

export default function CrazyCattlePage() {
  return (
    <div className="min-h-screen bg-[#2c2f33] flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-white mb-4">CrazyCattle3D</h1>
      
      {/* Game container */}
      <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
        <iframe 
          src="/game/CrazyCattle3D.html"
          className="w-full h-full border-none"
          allow="autoplay; fullscreen *"
          allowFullScreen
        />
      </div>

      {/* Game info */}
      <div className="mt-4 text-white text-center">
        <p>Original game by <a href="https://4nn4t4t.itch.io/" className="text-blue-400 hover:underline">Anna</a></p>
        <p className="text-sm text-gray-400 mt-2">Use WASD to move, SPACE to jump, ESC for menu</p>
      </div>
    </div>
  );
}

