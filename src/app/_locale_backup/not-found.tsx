import { Link } from '@/i18n/navigation';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">404 - Page Not Found</h1>
        <p className="mb-6 text-lg">The page you are looking for does not exist.</p>
        <Link
          href="/"
          className="bg-primary text-white px-4 py-2 rounded-lg inline-block"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
} 