'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await api.post('/auth/login', { username, password });
            localStorage.setItem('userId', res.data.userId);
            router.push('/');
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="w-full max-w-sm p-8 bg-zinc-900 rounded-lg">
                <h1 className="text-2xl font-semibold text-center mb-6 text-white">Sign In</h1>

                {error && (
                    <p className="text-red-400 text-sm text-center mb-4">{error}</p>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full py-3 bg-white text-black font-medium rounded-lg hover:bg-zinc-200"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-center text-zinc-500 text-sm mt-6">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-white underline">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}
