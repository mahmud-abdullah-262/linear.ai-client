"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "@heroui/react";


export interface NavbarProps {
    // যদি আপনি চান প্যারেন্ট থেকে সেশন কন্ট্রোল করতে, তবে এগুলোর দরকার আছে। 
    // অন্যথায় সরাসরি এই কম্পোনেন্ট নিজেই এখন অথ সেশন রিড করবে।
    userRole?: "Admin" | "Member" | "user";
}

export default function Navbar({
    userRole: propUserRole,
}: NavbarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // সেশন ও ইউজারের ডেটা রাখার জন্য স্টেট
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // সেশন ডেটা ফেচ করার ইফেক্ট
    useEffect(() => {
        async function fetchSession() {
            try {
                const { data: session } = await authClient.getSession();
                if (session?.user) {
                    setUser(session.user);
                    console.log(session.user, 'user')
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Session fetch error:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchSession();
    }, []);

    // স্ক্রোল ইফেক্ট লিসেনার
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // সাইন আউট হ্যান্ডেলার
    const handleSignOut = async () => {
        setIsOpen(false);

        try {
            await authClient.signOut();
            setUser(null);
            toast.success("Successfully signed out!");
            router.push("/login");
        } catch (error) {
            console.error("Sign out failed:", error);
            toast.danger("Failed to sign out. Try again.");
        }
    };

    // নেভিগেশন লিংক স্টাইল হেল্পার
    const getLinkClass = (href: string) => {
        const isActive = pathname === href;
        return `text-sm font-semibold transition-all duration-300 relative py-1 ${isActive ? "text-cyan-400 font-bold" : "text-slate-300 hover:text-cyan-300"
            }`;
    };

    const getMobileLinkClass = (href: string) => {
        const isActive = pathname === href;
        return `block px-4 py-2.5 rounded-lg text-base font-semibold transition-all duration-200 ${isActive
            ? "bg-cyan-950/40 text-cyan-400 border-l-2 border-cyan-400"
            : "text-slate-300 hover:bg-slate-900/60 hover:text-white"
            }`;
    };

    // ইউজার রোল ডিটারমাইন করা (আপনার অবজেক্টে role: "user" আছে)
    const displayRole = user?.role || propUserRole || "Guest";

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled
                ? "bg-[#0B0F19]/90 backdrop-blur-md border-slate-800/80 shadow-lg shadow-cyan-950/10"
                : "bg-transparent border-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5 select-none group">
                            <span>Linear</span>
                            <span className="text-cyan-400 font-black relative">
                                .ai
                                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-cyan-400 rounded shadow-[0_0_8px_#22d3ee] scale-x-100 group-hover:scale-x-110 transition-transform duration-300"></span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center space-x-8">
                        <Link href="/" className={getLinkClass("/")}>
                            Home
                            {pathname === "/" && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 rounded shadow-[0_0_8px_#22d3ee]"></span>}
                        </Link>
                        <Link href="/about" className={getLinkClass("/about")}>
                            About
                            {pathname === "/about" && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 rounded shadow-[0_0_8px_#22d3ee]"></span>}
                        </Link>
                        <Link href="/contact" className={getLinkClass("/contact")}>
                            Contact
                            {pathname === "/contact" && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 rounded shadow-[0_0_8px_#22d3ee]"></span>}
                        </Link>

                        {/* লগইন থাকা অবস্থায় অতিরিক্ত লিংক দেখাতে চাইলে এখানে অ্যাড করতে পারেন */}
                        {user && (
                            <>
                                <Link href="/dashboard" className={getLinkClass("/dashboard")}>
                                    Dashboard
                                    {pathname === "/dashboard" && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 rounded shadow-[0_0_8px_#22d3ee]"></span>}
                                </Link>
                                <Link href="/task/manage" className={getLinkClass("/task/manage")}>
                                    Workspace
                                    {pathname === "/task/manage" && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 rounded shadow-[0_0_8px_#22d3ee]"></span>}
                                </Link>
                                <Link href="/task/add" className={getLinkClass("/task/add")}>
                                    Add Task
                                    {pathname === "/task/add" && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 rounded shadow-[0_0_8px_#22d3ee]"></span>}
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Desktop Auth Button & Profile status */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {loading ? (
                            <span className="text-xs text-slate-500 animate-pulse">Loading...</span>
                        ) : !user ? (
                            // লগআউট অবস্থা: Login এবং Signup বাটন
                            <>
                                <Link
                                    href="/login"
                                    className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm transition-all duration-300 shadow-md hover:shadow-cyan-500/20 active:scale-95"
                                >
                                    Signup
                                </Link>
                            </>
                        ) : (
                            // লগইন অবস্থা: Profile Avatar এবং Sign Out বাটন
                            <div className="flex items-center space-x-6">
                                <Link href="/profile" className="flex items-center gap-3 group focus:outline-none">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${displayRole === "Admin"
                                        ? "bg-cyan-950/40 border-cyan-500/30 text-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.15)]"
                                        : "bg-slate-900 border-slate-800 text-slate-400"
                                        }`}>
                                        {displayRole}
                                    </span>

                                    {/* ইউজার ইমেজ থাকলে তা দেখাবে, না থাকলে নামের প্রথম অক্ষর */}
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1.5px] group-hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all duration-300 overflow-hidden">
                                        {user.image ? (
                                            <img src={user.image} alt={user.name} className="w-full h-full object-cover rounded-full" />
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-white font-bold text-xs uppercase">
                                                {user.name ? user.name.substring(0, 2) : "US"}
                                            </div>
                                        )}
                                    </div>
                                </Link>

                                <button
                                    onClick={handleSignOut}
                                    className="text-sm font-semibold text-slate-400 hover:text-red-400 transition-colors duration-200 cursor-pointer"
                                >
                                    Signout
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger menu button */}
                    <div className="lg:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800/80 focus:outline-none transition-all duration-200"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg className="block h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer Dropdown Menu */}
            <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[#0B0F19] border-t border-slate-900 ${isOpen ? "max-h-[450px] shadow-2xl border-b border-slate-850" : "max-h-0"}`}>
                <div className="px-4 py-4 space-y-2">
                    <Link href="/" onClick={() => setIsOpen(false)} className={getMobileLinkClass("/")}>
                        Home
                    </Link>
                    <Link href="/about" onClick={() => setIsOpen(false)} className={getMobileLinkClass("/about")}>
                        About
                    </Link>
                    <Link href="/contact" onClick={() => setIsOpen(false)} className={getMobileLinkClass("/contact")}>
                        Contact
                    </Link>

                    {loading ? (
                        <div className="text-center text-xs text-slate-600 py-2">Loading...</div>
                    ) : !user ? (
                        // মোবাইল ভিউ - লগআউট অবস্থা: Login এবং Signup
                        <div className="pt-3 border-t border-slate-900 space-y-2">
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="block w-full py-2.5 text-center rounded-lg border border-slate-800 text-slate-300 font-semibold text-sm transition-colors hover:bg-slate-900"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                onClick={() => setIsOpen(false)}
                                className="block w-full py-2.5 text-center rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-md transition-colors"
                            >
                                Signup
                            </Link>
                        </div>
                    ) : (
                        // মোবাইল ভিউ - লগইন অবস্থা: Profile লিংক এবং Signout
                        <>
                            <Link href="/dashboard" onClick={() => setIsOpen(false)} className={getMobileLinkClass("/dashboard")}>
                                Dashboard
                            </Link>
                            <Link href="/task/manage" onClick={() => setIsOpen(false)} className={getMobileLinkClass("/task/manage")}>
                                Workplace
                            </Link>
                            <Link href="/task/add" onClick={() => setIsOpen(false)} className={getMobileLinkClass("/task/add")}>
                                Add Task
                            </Link>
                            <Link href="/profile" onClick={() => setIsOpen(false)} className={getMobileLinkClass("/profile")}>
                                Profile
                            </Link>

                            <div className="pt-4 mt-2 border-t border-slate-900 flex items-center justify-between px-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] overflow-hidden">
                                        {user.image ? (
                                            <img src={user.image} alt={user.name} className="w-full h-full object-cover rounded-full" />
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-white font-bold text-xs uppercase">
                                                {user.name ? user.name.substring(0, 2) : "US"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-white capitalize">{user.name}</span>
                                        <span className="text-[10px] text-cyan-400 font-semibold uppercase">{displayRole} Role</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSignOut}
                                    className="px-3.5 py-1.5 rounded-md bg-slate-900 border border-slate-800 hover:border-red-500/30 text-xs font-bold text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                                >
                                    Signout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}