import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import SubmissionList from '@/components/SubmissionList';

export default async function SubmissionsPage() {
  const session = await auth();
  
  // Check if user is authenticated
  if (!session) {
    redirect('/login');
  }
  
  // Get all user's submissions
  const submissions = await db.submission.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-2xl font-bold text-gray-900">My Submissions</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage all your submissions
        </p>
      </div>
      
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <SubmissionList submissions={submissions} />
        </div>
        
        {submissions.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Showing {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
              </span>
              <a
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                New Submission
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}