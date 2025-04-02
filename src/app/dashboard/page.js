import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import FileUploader from '@/components/FileUploader';

export default async function Dashboard() {
  const session = await auth();
  
  // Check if user is authenticated
  if (!session) {
    redirect('/login');
  }
  
  // Get user's recent submissions
  const recentSubmissions = await db.submission.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload your PNG files for processing
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <FileUploader />
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Recent Submissions</h2>
              
              {recentSubmissions.length > 0 ? (
                <div className="mt-4 space-y-4">
                  {recentSubmissions.map((submission) => (
                    <div key={submission.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-base font-semibold text-gray-800">
                            <a href={`/submissions/${submission.id}`} className="hover:text-primary-600">
                              {submission.title}
                            </a>
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(submission.createdAt).toLocaleString()}
                          </p>
                          {submission.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {submission.description}
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
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
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-gray-500">No submissions yet</p>
              )}
              
              <div className="mt-6">
                <a
                  href="/submissions"
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                >
                  View all submissions →
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Usage Information</h2>
              <p className="mt-1 text-sm text-gray-500">
                Learn how to get the most out of the FluoroCell platform
              </p>
              
              <div className="mt-4 space-y-4">
                <div className="rounded-md bg-primary-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-primary-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-primary-800">Accepted File Types</h3>
                      <p className="text-sm text-primary-700 mt-1">
                        Only PNG image files are currently supported for processing.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md bg-primary-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-primary-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-primary-800">Processing Time</h3>
                      <p className="text-sm text-primary-700 mt-1">
                        Most submissions are processed within 30 minutes, depending on system load.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}