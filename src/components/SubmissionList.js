import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

// Status badge component
const StatusBadge = ({ status }) => {
  let bgColor;
  let textColor;
  
  switch (status) {
    case 'pending':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    case 'processing':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'completed':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'failed':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
  }
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function SubmissionList({ submissions }) {
  if (!submissions || submissions.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No submissions found</p>
        <Link 
          href="/dashboard" 
          className="mt-4 inline-block text-primary-600 hover:text-primary-800"
        >
          Create your first submission
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-3 px-6 text-left text-gray-700 font-semibold">Title</th>
            <th className="py-3 px-6 text-left text-gray-700 font-semibold">Status</th>
            <th className="py-3 px-6 text-left text-gray-700 font-semibold">Created</th>
            <th className="py-3 px-6 text-left text-gray-700 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id} className="border-b hover:bg-gray-50">
              <td className="py-4 px-6">
                <Link 
                  href={`/submissions/${submission.id}`} 
                  className="text-primary-600 hover:text-primary-800 font-medium"
                >
                  {submission.title}
                </Link>
                {submission.description && (
                  <p className="text-sm text-gray-500 truncate max-w-xs">
                    {submission.description}
                  </p>
                )}
              </td>
              <td className="py-4 px-6">
                <StatusBadge status={submission.status} />
              </td>
              <td className="py-4 px-6 text-gray-500">
                {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
              </td>
              <td className="py-4 px-6">
                <div className="flex space-x-2">
                  <Link 
                    href={`/submissions/${submission.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View
                  </Link>
                  
                  {submission.status === 'completed' && (
                    <Link 
                      href={`/submissions/${submission.id}?download=true`}
                      className="text-green-600 hover:text-green-800"
                    >
                      Download
                    </Link>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}