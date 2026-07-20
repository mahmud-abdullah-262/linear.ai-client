// ---------------------------------------------------------------
//  Profile page – Linear.ai
//  Next.js (App Router) • TypeScript • Tailwind CSS
// ---------------------------------------------------------------
'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { User } from "../../type/AuthUser";


/* ──────────────────────────────────────────────────────────────
   Backend helper — replace with your real update endpoint
   ---------------------------------------------------------------- */
async function updateProfile(updatedFields: Partial<User>) {
    const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
    });

    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || "Profile updated failed.");
    }

    return res.json();
}

/* ──────────────────────────────────────────────────────────────
   Main Page Component
   ---------------------------------------------------------------- */
export default function ProfilePage({ user }: { user: User }) {
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
    });

    const onProfileSave = async () => {
        setError(null);
        setSuccess(false);
        setIsSaving(true);

        try {
            await updateProfile(formData);
            setSuccess(true);
            setIsEditing(false);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Profile updated failed.");
        } finally {
            setIsSaving(false);
        }
    };

    const onCancel = () => {
        setFormData({ name: user.name, email: user.email });
        setError(null);
        setIsEditing(false);
    };

    const onLogout = async () => {
        setIsSigningOut(true);
        try {
            await authClient.signOut();
            router.push("/login");
            router.refresh();
        } catch {
            setError("Sign Out failed. Try again.");
            setIsSigningOut(false);
        }
    };

    return (
        <section className="min-h-screen bg-deep-slate p-6 text-off-white flex items-center justify-center">
            {/* ── PROFILE CARD CONTAINER ────────────────────────────── */}
            <div className="w-full max-w-md bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg flex flex-col items-center">

                {/* Avatar */}
                <img
                    src={user.image || "/avatar.png"}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-vibrant-cyan mb-4"
                />

                <h2 className="text-lg font-semibold mb-1">{user.name}</h2>
                <p className="text-sm text-gray-400 mb-4">{user.email}</p>

                {/* Feedback messages */}
                {error && (
                    <div className="w-full bg-red-900/30 border border-red-600 text-red-400 text-sm rounded px-3 py-2 mb-4">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="w-full bg-emerald-900/30 border border-emerald-600 text-emerald-400 text-sm rounded px-3 py-2 mb-4">
                        Profile updated successfully.
                    </div>
                )}

                {/* User Info Details */}
                <div className="w-full space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            readOnly={!isEditing}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full rounded px-3 py-2 text-off-white transition focus:outline-none ${isEditing
                                    ? "bg-gray-700 border border-vibrant-cyan"
                                    : "bg-gray-900/50 text-gray-300 border border-transparent cursor-default"
                                }`}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            readOnly={!isEditing}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={`w-full rounded px-3 py-2 text-off-white transition focus:outline-none ${isEditing
                                    ? "bg-gray-700 border border-vibrant-cyan"
                                    : "bg-gray-900/50 text-gray-300 border border-transparent cursor-default"
                                }`}
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                            Role
                        </label>
                        <input
                            type="text"
                            readOnly
                            value={user.role}
                            className="w-full bg-gray-900/50 text-gray-400 rounded px-3 py-2 border border-transparent cursor-default"
                        />
                    </div>
                </div>

                {/* Actions / Buttons */}
                <div className="mt-6 flex items-center justify-between w-full gap-3">
                    {isEditing ? (
                        <div className="flex gap-2 w-full">
                            <button
                                onClick={onCancel}
                                disabled={isSaving}
                                className="w-1/2 bg-gray-700 text-off-white font-medium py-2 px-4 rounded-md hover:bg-gray-600 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onProfileSave}
                                disabled={isSaving}
                                className="w-1/2 bg-vibrant-cyan text-deep-slate font-medium py-2 px-4 rounded-md hover:bg-cyan-400 transition disabled:opacity-50"
                            >
                                {isSaving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => {
                                    setSuccess(false);
                                    setIsEditing(true);
                                }}
                                className="w-1/2 bg-vibrant-cyan text-deep-slate font-medium py-2 px-4 rounded-md hover:bg-cyan-400 transition"
                            >
                                Edit Profile
                            </button>

                            <button
                                onClick={onLogout}
                                disabled={isSigningOut}
                                className="w-1/2 bg-red-600 text-white font-medium py-2 px-4 rounded-md hover:bg-red-500 transition disabled:opacity-50"
                            >
                                {isSigningOut ? "Signing out..." : "Sign Out"}
                            </button>
                        </>
                    )}
                </div>

            </div>
        </section>
    );
}