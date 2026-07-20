"use client";

import { useState, FormEvent } from "react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { authClient, signIn } from "@/lib/auth-client";
import { Button, toast } from "@heroui/react";


const demoUser = 'user5@linear.com'
const demoPassord = '123456aA'
const handleDemoLogin = async (e: any) => {
  if (e) e.preventDefault();
  console.log('clicked', demoUser, demoPassord)
  await signIn.email({
    email: demoUser,
    password: demoPassord,
  });
  window.location.href = "/";
}

const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);

    try {
      const { data, error } = await signIn.email({
        email,
        password,
      });

      if (error) {
        setAuthError(error.message ?? "Login failed.");
        toast.danger("user login failed");
        return;
      }

      toast.success("user login successfully");

      // hard navigation: navbar/session state fresh হয়ে dashboard-এ যাবে
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    })
  };

  return (
    <div className="relative min-h-screen flex items-stretch overflow-hidden font-sans select-none">

      {/* ── Animated Background ── */}
      <div className="fixed inset-0 z-0 bg-[#080c14] pointer-events-none">
        {/* Orb 1 */}
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-18 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] -top-[150px] -left-[150px] animate-[orbFloat_12s_ease-in-out_infinite_alternate]" />
        {/* Orb 2 */}
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-18 bg-gradient-to-r from-[#06b6d4] to-[#0891b2] -bottom-[100px] -right-[100px] animate-[orbFloat_12s_ease-in-out_infinite_alternate] [animation-delay:-4s]" />
        {/* Orb 3 */}
        <div className="absolute w-[350px] h-[350px] rounded-full blur-[100px] opacity-18 bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[orbFloat_12s_ease-in-out_infinite_alternate] [animation-delay:-8s]" />
        {/* Custom CSS Grid Overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 flex w-full min-h-screen">

        {/* ── Left Panel (Branding) ── */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[rgba(99,102,241,0.08)] via-[rgba(6,182,212,0.05)] to-[rgba(139,92,246,0.08)] border-r border-[rgba(99,102,241,0.15)] p-12 items-center justify-center">
          <div className="max-w-[420px] flex flex-direction flex-col gap-10">

            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-[38px] h-[38px] bg-gradient-to-br from-[#6366f1] to-[#06b6d4] rounded-nests rounded-[10px] color-white text-white shadow-[0_0_24px_rgba(99,102,241,0.5)]">
                <Icon icon="fluent:lightning-bolt-20-filled" width={22} height={22} />
              </span>
              <span className="text-2xl font-bold text-[#f1f5f9] tracking-[-0.5px]">
                Linear<span className="text-[#6366f1]">.ai</span>
              </span>
            </div>

            {/* Brand Copy */}
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight leading-[1.15] text-[#f1f5f9]">
                Ship faster.<br />
                Think smarter.
              </h2>
              <p className="text-base text-[#94a3b8] leading-relaxed mt-3">
                The AI-native project management platform built for modern engineering teams.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-col gap-3">
              {[
                { icon: "fluent:brain-circuit-20-filled", label: "AI-powered planning" },
                { icon: "fluent:rocket-20-filled", label: "Zero-friction sprints" },
                { icon: "fluent:people-team-20-filled", label: "Real-time collaboration" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-sm text-[#cbd5e1]">
                  <span className="flex items-center justify-center w-[30px] h-[30px] bg-[rgba(99,102,241,0.15)] border border-[rgba(99,102,241,0.25)] rounded-lg text-[#818cf8] shrink-0">
                    <Icon icon={icon} width={16} height={16} />
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="p-5 bg-white/[0.03] border border-white/[0.07] rounded-[14px] backdrop-blur-md">
              <p className="text-[0.9rem] text-[#cbd5e1] leading-relaxed italic">
                &ldquo;Linear.ai cut our planning overhead by 60%. It&rsquo;s the only tool that actually thinks ahead.&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-[#6366f1] to-[#06b6d4] flex items-center justify-center text-[0.7rem] font-bold text-white shrink-0">
                  SL
                </div>
                <div>
                  <p className="text-[0.85rem] font-semibold text-[#f1f5f9]">Sarah Lin</p>
                  <p className="text-[0.75rem] text-[#64748b] mt-0.5">Engineering Lead, Vercel</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Right Panel (Form) ── */}
        <div className="flex-1 flex items-center justify-center px-6 py-8 lg:max-w-[520px] lg:mx-auto lg:p-12">
          <div className="w-full max-w-[420px] bg-[rgba(15,20,35,0.75)] border border-[rgba(99,102,241,0.18)] rounded-[20px] p-9 backdrop-blur-[24px] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_64px_rgba(0,0,0,0.5),0_0_80px_rgba(99,102,241,0.08)]">

            <div className="mb-7">
              <h1 className="text-2xl font-bold tracking-tight text-[#f1f5f9] mb-1.5">Welcome back</h1>
              <p className="text-sm text-[#64748b]">Sign in to continue to Linear.ai</p>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-4.5 space-y-4" noValidate>

              {/* Email Field */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="login-email" className="text-[0.8rem] font-medium tracking-wide text-[#94a3b8]">
                  Email address
                </label>
                <div className="relative flex items-center">
                  <span className={`absolute left-3.5 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === "email" ? "text-[#6366f1]" : "text-[#475569]"}`}>
                    <Icon icon="fluent:mail-20-regular" width={18} height={18} />
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-[42px] pr-3.5 py-3 bg-white/[0.04] border border-white/[0.08] rounded-nests rounded-[10px] text-[#f1f5f9] text-sm outline-none placeholder-[#334155] transition-all duration-200 focus:border-[#6366f1]/60 focus:bg-[#6366f1]/[0.05] focus:ring-3 focus:ring-[#6366f1]/12"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="login-password" className="text-[0.8rem] font-medium tracking-wide text-[#94a3b8]">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-[0.78rem] text-[#6366f1] hover:text-[#818cf8] transition-colors duration-200">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative flex items-center">
                  <span className={`absolute left-3.5 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === "password" ? "text-[#6366f1]" : "text-[#475569]"}`}>
                    <Icon icon="fluent:lock-closed-20-regular" width={18} height={18} />
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-[42px] pr-10 py-3 bg-white/[0.04] border border-white/[0.08] rounded-nests rounded-[10px] text-[#f1f5f9] text-sm outline-none placeholder-[#334155] transition-all duration-200 focus:border-[#6366f1]/60 focus:bg-[#6366f1]/[0.05] focus:ring-3 focus:ring-[#6366f1]/12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 p-1 rounded-md text-[#475569] hover:text-[#94a3b8] hover:bg-white/[0.06] transition-all duration-200 flex items-center"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <Icon
                      icon={showPassword ? "fluent:eye-off-20-regular" : "fluent:eye-20-regular"}
                      width={18}
                      height={18}
                      className="text-inherit"
                    />
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {authError && (
                <div className="flex items-center gap-2 px-3.5 py-2.5 bg-red-500/[0.08] border border-red-500/[0.25] rounded-[10px] text-[0.82rem] text-red-400" role="alert">
                  <Icon icon="fluent:error-circle-20-filled" width={16} height={16} className="shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] rounded-[10px] text-white text-[0.92rem] font-semibold tracking-wide shadow-[0_4px_20px_rgba(99,102,241,0.35)] cursor-pointer transition-all duration-200 hover:enabled:opacity-92 hover:enabled:-translate-y-0.5 hover:enabled:shadow-[0_6px_28px_rgba(99,102,241,0.45)] active:enabled:translate-y-0 disabled:opacity-55 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-top-transparent border-t-white rounded-full animate-spin shrink-0" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <Icon icon="fluent:arrow-right-20-filled" width={18} height={18} />
                  </>
                )}
              </button>
              <Button onClick={handleDemoLogin} className={'w-full bg-[#0B0F19] border  hover:bg-[#1E293B]'}> Demo login</Button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-1">
                <span className="flex-1 h-[1px] bg-white/[0.07]" />
                <span className="text-[0.75rem] text-[#475569] whitespace-nowrap">or continue with</span>
                <span className="flex-1 h-[1px] bg-white/[0.07]" />
              </div>

              {/* Social Login Button */}
              <button
                id="login-google"
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2.5 py-3 bg-white/[0.04] border border-white/[0.1] rounded-[10px] text-[#cbd5e1] text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-white/[0.08] hover:border-white/[0.16] hover:-translate-y-0.5"
              >
                <Icon icon="devicon:google" width={18} height={18} />
                Sign in with Google
              </button>
            </form>

            <p className="mt-6 text-[0.83rem] text-[#475569] text-center">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#6366f1] font-semibold hover:text-[#818cf8] transition-colors duration-200">
                Create one free
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;