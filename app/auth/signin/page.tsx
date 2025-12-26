'use client';

import { useState, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function SignInForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const res = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                setError('Invalid email or password');
            } else {
                router.push('/');
                router.refresh();
            }
        } catch (err) {
            setError('Something went wrong.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Welcome Back
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Sign in to your account
                </p>
            </div>

            {registered && (
                <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm text-center">
                    Account created! You can now sign in.
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                    {error}
                </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4 rounded-md shadow-sm">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="relative block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="name@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="relative block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 transition-all"
                    >
                        {loading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
                        Sign in
                    </button>
                </div>
            </form>

            <div className="text-center text-sm">
                <span className="text-gray-500">Don't have an account? </span>
                <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Sign up
                </Link>
            </div>
        </div>
    );
}

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <Suspense fallback={<Loader2 className="animate-spin" />}>
                    <SignInForm />
                </Suspense>
            </div>
        </div>
    );
}
