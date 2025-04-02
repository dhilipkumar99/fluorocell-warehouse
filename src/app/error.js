'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center max-w-md mx-auto">
        <svg 
          className="h-16 w-16 text-red-500 mx-auto mb-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-6">
          We're sorry, but an unexpected error occurred while processing your request.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={reset}
            variant="primary"
          >
            Try again
          </Button>
          
          <Link href="/" passHref>
            <Button 
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Go back home
            </Button>
          </Link>
        </div>
        
        {process.env.NODE_ENV === 'development' && error?.message && (
          <div className="mt-8 p-4 bg-red-50 rounded-md border border-red-200 text-left">
            <p className="text-sm font-medium text-red-800 mb-1">Error Details (Development Only):</p>
            <p className="text-sm text-red-700 font-mono overflow-auto">{error.message}</p>
            {error.stack && (
              <details className="mt-2">
                <summary className="text-xs text-red-600 cursor-pointer">Stack trace</summary>
                <pre className="mt-2 text-xs text-red-600 overflow-auto p-2 bg-red-100 rounded">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
}