import Link from 'next/link';

const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <div className="text-primary font-serif font-bold">
        <span className="text-2xl md:text-3xl">V</span>
        <span className="text-xl md:text-2xl">&apos;s</span>
      </div>
      <div className="ml-1 text-white">
        <span className="text-sm md:text-base font-medium block leading-tight">The Victoria&apos;s</span>
        <span className="text-xs md:text-sm block leading-tight">Bangkok</span>
      </div>
    </Link>
  );
};

export default Logo; 