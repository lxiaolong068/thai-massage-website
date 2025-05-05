import Link from 'next/link';

const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      {/* <div className="font-serif font-bold">
        <span className="text-gold text-xl md:text-2xl font-bold leading-none">T</span>
        <span className="text-gold text-xl md:text-2xl font-semibold leading-none">A</span>
      </div> */}
      <div className="ml-2 flex flex-col justify-center">
        <span className="text-sm md:text-base font-medium block leading-tight text-gold">Tara Massage</span>
        <span className="text-xs md:text-sm text-white block leading-tight">Bangkok</span>
      </div>
    </Link>
  );
};

export default Logo; 