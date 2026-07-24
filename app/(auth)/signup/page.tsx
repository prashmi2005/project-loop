'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

const signupSchema = z
  .object({
    workspaceName: z.string().min(2, 'Workspace name is required'),
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>();

  const onSubmit = async (values: SignupValues) => {
    setSubmitting(true);
    try {
      // Simulate account creation, then log in as admin demo user
      await new Promise((r) => setTimeout(r, 800));
      await login('admin@acme.com', 'demo1234');
      toast.success(`Workspace "${values.workspaceName}" created!`);
      router.push('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Create your workspace</h1>
        <p className="mt-1 text-sm text-slate-500">
          Start analyzing customer feedback with AI in minutes.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="workspaceName">Workspace name</Label>
          <Input
            id="workspaceName"
            placeholder="Acme Corp"
            {...register('workspaceName')}
          />
          {errors.workspaceName && (
            <p className="text-xs text-rose-600">{errors.workspaceName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            placeholder="Alex Morgan"
            {...register('fullName')}
          />
          {errors.fullName && (
            <p className="text-xs text-rose-600">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-rose-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs text-rose-600">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-rose-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-sky-600 hover:bg-sky-700"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating workspace...
            </>
          ) : (
            'Create workspace'
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-sky-600 hover:text-sky-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}
