import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          href="/" 
          className="text-white text-xl font-bold"
        >
          Top10Websites
        </Link>
        
        <div className="space-x-4">
          {/* Add navigation links here */}
        </div>
      </div>
    </nav>
  );
}

