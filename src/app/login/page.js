import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import LoginForm from '@/components/auth/LoginForm';

export default async function LoginPage({ searchParams }) {
  const session = await auth();
  const registered = searchParams?.registered === 'true';
  
  // If already logged in, redirect to dashboard
  if (session) {
    redirect('/dashboard');
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {registered && (
        <div className="mb-8 max-w-md mx-auto p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p>Account created successfully! Please log in.</p>
        </div>
      )}
      
      <LoginForm />
    </div>
  );
}