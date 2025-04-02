'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function SubmissionDetailsPage({ params }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadUrls, setDownloadUrls] = useState([]);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  
  const submissionId = params.id;
  
  // Check authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  
  // Fetch submission data
  useEffect(() => {
    const fetchSubmission = async () => {
      if (status !== 'authenticated') return;
      
      try {
        const response = await fetch(`/api/submissions/${submissionId}`, {
          method: 'GET',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch submission');
        }
        
        const data = await response.json();
        setSubmission(data.submission);
      } catch (error) {
        setError(error.message || 'Error loading submission');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmission();
  }, [submissionId, status]);
  
  // Handle download request
  const handleDownload = async (format = 'individual') => {
    setDownloadLoading(true);
    setDownloadError('');
    setDownloadUrls([]);
    
    try {
      const response = await fetch(`/api/download?submissionId=${submissionId}&format=${format}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate download');
      }
      
      const data = await response.json();
      
      if (format === 'zip') {
        // Single zip file
        window.open(data.downloadUrl, '_blank');
      } else {
        // Multiple individual files
        setDownloadUrls(data.files);
      }
    } catch (error) {
      setDownloadError(error.message || 'Error generating download links');
    } finally {
      setDownloadLoading(false);
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-500">Loading submission details...</p>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button
            onClick={() => router.push('/submissions')}
            className="mt-2 text-sm font-medium text-red-700 underline"
          >
            Return to submissions
          </button>
        </div>
      </div>
    );
  }
  
  // Render submission details
  if (!submission) return null;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => router.push('/submissions')}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <svg className="mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Submissions
        </button>
      </div>
      
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">{submission.title}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Submitted on {new Date(submission.createdAt).toLocaleString()}
              </p>
            </div>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                submission.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : submission.status === 'processing'
                  ? 'bg-blue-100 text-blue-800'
                  : submission.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          {submission.description && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500">Description</h4>
              <p className="mt-1 text-gray-900">{submission.description}</p>
            </div>
          )}
          
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-500">Status Information</h4>
            
            {submission.status === 'pending' && (
              <div className="mt-2 bg-yellow-50 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Waiting for Processing</h3>
                    <p className="mt-2 text-sm text-yellow-700">
                      Your submission is in the queue and waiting to be processed. Please check back later.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {submission.status === 'processing' && (
              <div className="mt-2 bg-blue-50 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Processing in Progress</h3>
                    <p className="mt-2 text-sm text-blue-700">
                      Your images are currently being processed. This may take several minutes.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {submission.status === 'completed' && (
              <div className="mt-2 bg-green-50 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Processing Complete</h3>
                    <p className="mt-2 text-sm text-green-700">
                      Your images have been successfully processed. You can now download the results.
                    </p>
                    
                    <div className="mt-4">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleDownload('individual')}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          disabled={downloadLoading}
                        >
                          {downloadLoading ? 'Generating Downloads...' : 'Download Files'}
                        </button>
                        
                        <button
                          onClick={() => handleDownload('zip')}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          disabled={downloadLoading}
                        >
                          {downloadLoading ? 'Generating ZIP...' : 'Download as ZIP'}
                        </button>
                      </div>
                      
                      {downloadError && (
                        <div className="mt-3 text-sm text-red-600">
                          {downloadError}
                        </div>
                      )}
                      
                      {downloadUrls.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Download Links</h4>
                          <ul className="border rounded-md divide-y divide-gray-200">
                            {downloadUrls.map((file, index) => (
                              <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                <div className="w-0 flex-1 flex items-center">
                                  <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                                  </svg>
                                  <span className="ml-2 flex-1 w-0 truncate">{file.filename}</span>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-primary-600 hover:text-primary-500"
                                  >
                                    Download
                                  </a>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {submission.status === 'failed' && (
              <div className="mt-2 bg-red-50 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Processing Failed</h3>
                    <p className="mt-2 text-sm text-red-700">
                      We encountered an error while processing your images. Please try submitting them again or contact support for assistance.
                    </p>
                    
                    <div className="mt-4">
                      <button
                        onClick={() => router.push('/dashboard')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Submit New Files
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}