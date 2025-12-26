'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";

export default function UserMenu() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    if (!session) {
        return (
            <div className="flex items-center gap-3">
                <Link
                    href="/auth/signin"
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                    Sign In
                </Link>
                <Link
                    href="/register"
                    className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                >
                    Register
                </Link>
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 focus:outline-none"
            >
                {session.user?.image ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                        <Image src={session.user.image} alt={session.user.name || "User"} fill className="object-cover" />
                    </div>
                ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <User size={16} />
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-1">
                    <div className="px-4 py-2 border-b border-gray-50">
                        <p className="text-sm font-medium text-gray-900 truncate">{session.user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                    </div>

                    <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <LayoutDashboard size={14} /> Admin Dashboard
                    </Link>

                    <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                    >
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            )}

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
