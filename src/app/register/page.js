import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import RegisterForm from '@/components/auth/RegisterForm';

export default async function RegisterPage() {
  const session = await auth();
  
  // If already logged in, redirect to dashboard
  if (session) {
    redirect('/dashboard');
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <RegisterForm />
    </div>
  );
}