'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  
  useEffect(() => {
    const logoutUser = async () => {
      try {
        // Call logout API
        const response = await fetch('/api/admin/logout', {
          method: 'POST',
          credentials: 'include', // Ensure cookies are included
        });
        
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error?.message || 'Logout failed');
        }
        
        // Clear local storage
        localStorage.removeItem('adminToken');
        
        // Redirect to login page
        window.location.href = '/admin/login';
      } catch (err) {
        console.error('Logout error:', err);
        setError(err instanceof Error ? err.message : 'Logout failed, please try again');
        
        // Try to redirect to login page even if there's an error
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 2000);
      }
    };

    logoutUser();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-2 text-red-500">Logout Problem</h1>
          <p className="text-gray-600">{error}</p>
          <p className="mt-2">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-2">Logging Out...</h1>
        <p className="text-gray-600">Please wait while we log you out.</p>
      </div>
    </div>
  );
}
