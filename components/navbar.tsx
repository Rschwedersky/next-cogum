"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./auth-provider";
import { useState } from "react";

export default function NavBar() {
    const [error, setError] = useState<string | null>(null);
    const pathname = usePathname();
    const auth = useAuth();

    const isAdminPage = pathname?.includes("/admin");
    const isProPage = pathname?.includes("/pro");
    const isUserPage = pathname?.includes("/user");

    const loginGoogle = async () => {
        if (!auth) {
            setError("Authentication not initialized");
            console.error("Auth provider is undefined");
            return;
        }
        try {
            await auth.loginGoogle();
            console.log("Logged in!");
            setError(null);
            window.location.href = "/admin";
        } catch (error: any) {
            const errorMessage = `Failed to sign in: ${error.message} (${error.code})`;
            console.error("Google Login error:", errorMessage);
            setError(errorMessage);
        }
    };

    const logout = async () => {
        if (!auth) {
            setError("Authentication not initialized");
            console.error("Auth provider is undefined");
            return;
        }
        try {
            await auth.logout();
            console.log("Logged out!");
            setError(null);
        } catch (error: any) {
            const errorMessage = `Failed to sign out: ${error.message} (${error.code})`;
            console.error("Logout error:", errorMessage);
            setError(errorMessage);
        }
    };

    const handleNavigation = () => {
        auth.loading || setError(null); // Clear error on navigation
    };

    return (
        <div className="fixed top-12 left-0 w-full flex items-center justify-center">
            <div className="flex items-center bg-slate-200/10 gap-2 py-1 px-2 rounded-lg border border-slate-300/10 shadow mb-12">
                {auth.loading && (
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                )}
                {!auth.loading && auth.currentUser && !auth.isPro && !auth.isAdmin && (
                    <div className="bg-pink-600 text-white text-sm font-semibold px-2 py-1 rounded-full">
                        User
                    </div>
                )}
                {!auth.loading && auth.currentUser && auth.isPro && !auth.isAdmin && (
                    <div className="bg-emerald-600 text-white text-sm font-semibold px-2 py-1 rounded-full">
                        Pro
                    </div>
                )}
                {!auth.loading && auth.currentUser && auth.isAdmin && (
                    <div className="bg-orange-400 text-white text-sm font-semibold px-2 py-1 rounded-full">
                        Admin
                    </div>
                )}
                {!auth.loading && !auth.currentUser && (
                    <button
                        className="text-white text-sm font-semibold bg-orange-700 p-2 border-white/10 shadow rounded-md hover:bg-orange-900 transition mr-12"
                        onClick={loginGoogle}
                        disabled={auth.loading}
                    >
                        Sign in with Google
                    </button>
                )}
                {!auth.loading && auth.currentUser && (
                    <button
                        className="text-white text-sm font-semibold bg-gray-800 p-2 border-white/10 shadow rounded-md hover:bg-gray-900 transition"
                        onClick={logout}
                        disabled={auth.loading}
                    >
                        Log out
                    </button>
                )}
                {!auth.loading && auth.currentUser && (
                    <div className="mr-12">
                        <p className="text-white text-sm font-semibold">
                            {auth.currentUser.displayName}
                        </p>
                        <p className="text-gray-400 text-xs font-semibold">
                            {auth.currentUser.email}
                        </p>
                    </div>
                )}
                {(isUserPage || isAdminPage || isProPage) && (
                    <Link
                        href={"/"}
                        onClick={handleNavigation}
                        className="text-white text-sm font-semibold p-2 hover:bg-slate-900 rounded-md transition"
                    >
                        Go to Home page
                    </Link>
                )}
                {!isUserPage && (
                    <Link
                        href={"user"}
                        onClick={handleNavigation}
                        className="text-white text-sm font-semibold p-2 hover:bg-slate-900 rounded-md transition"
                        prefetch
                    >
                        Go to User page
                    </Link>
                )}
                {!isProPage && (
                    <Link
                        href={"charts"}
                        onClick={handleNavigation}
                        className="text-white text-sm font-semibold p-2 hover:bg-slate-900 rounded-md transition"
                        prefetch
                    >
                        Go to Charts page
                    </Link>
                )}
                {!isAdminPage && (
                    <Link
                        href={"admin"}
                        onClick={handleNavigation}
                        className="text-white text-sm font-semibold p-2 hover:bg-slate-900 rounded-md transition"
                        prefetch
                    >
                        Go to Admin page
                    </Link>
                )}
                {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
            </div>
        </div>
    );
}