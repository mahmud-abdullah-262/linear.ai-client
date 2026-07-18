"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, TextField, Label, Input, FieldError, Description, Button, toast } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Eye, EyeClosed } from "@gravity-ui/icons";
import { signUp } from '@/lib/auth-client';

const signup = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string>("");
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
      const { data, error } = await signUp.email({
        name,
        image,
        email,
        password,
      });

      if (error) {
        setAuthError(error.message ?? "Signup failed.");
        toast.warning("Signup Failed!", {
          description: error.message ?? "Signup failed.",
          actionProps: {
            children: "Retry",
            className: "bg-warning text-warning-foreground",
          },
        });
        return;
      }

      toast.success("You have successfully signed up!", {
        description: "You can continue learning with Linear.ai.",
        actionProps: {
          children: "Home",
          className: "bg-success text-success-foreground",
        },
      });
      router.push("/");
    } catch (err) {
      console.error(err);
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    // await authClient.signIn.social({ provider: "google", callbackURL: "/" });
  };

  const validateEmail = (value: string): string | null => {
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const validatePassword = (value: string): string | null => {
    if (value.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(value)) return "Password must contain at least one number";
    return null;
  };

  return (
    <div className="relative min-h-screen flex items-stretch overflow-hidden font-sans select-none">

      {/* ── Animated Background ── */}
      <div className="fixed inset-0 z-0 bg-[#080c14] pointer-events-none">
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-18 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] -top-[150px] -left-[150px] animate-[orbFloat_12s_ease-in-out_infinite_alternate]" />
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-18 bg-gradient-to-r from-[#06b6d4] to-[#0891b2] -bottom-[100px] -right-[100px] animate-[orbFloat_12s_ease-in-out_infinite_alternate] [animation-delay:-4s]" />
        <div className="absolute w-[350px] h-[350px] rounded-full blur-[100px] opacity-18 bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[orbFloat_12s_ease-in-out_infinite_alternate] [animation-delay:-8s]" />
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
          <div className="max-w-[420px] flex flex-col gap-10">

            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-[38px] h-[38px] bg-gradient-to-br from-[#6366f1] to-[#06b6d4] rounded-[10px] text-white shadow-[0_0_24px_rgba(99,102,241,0.5)]">
                <Icon icon="fluent:lightning-bolt-20-filled" width={22} height={22} />
              </span>
              <span className="text-2xl font-bold text-[#f1f5f9] tracking-[-0.5px]">
                Linear<span className="text-[#6366f1]">.ai</span>
              </span>
            </div>

            {/* Brand Copy */}
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight leading-[1.15] text-[#f1f5f9]">
                Learn smarter.<br />
                Grow faster.
              </h2>
              <p className="text-base text-[#94a3b8] leading-relaxed mt-3">
                Join our advanced medical learning platform designed for modern professionals.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-col gap-3">
              {[
                { icon: "fluent:book-pulse-20-filled", label: "Smart medical tracks" },
                { icon: "fluent:clock-alarm-20-filled", label: "Real-time queue tracking" },
                { icon: "fluent:shield-task-20-filled", label: "Verified certifications" },
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
                &ldquo;Linear.ai totally structured my training flow. The best tool to stay ahead without feeling overwhelmed.&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-[#6366f1] to-[#06b6d4] flex items-center justify-center text-[0.7rem] font-bold text-white shrink-0">
                  DR
                </div>
                <div>
                  <p className="text-[0.85rem] font-semibold text-[#f1f5f9]">Dr. Rayan</p>
                  <p className="text-[0.75rem] text-[#64748b] mt-0.5">Resident, DMC</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Right Panel (Form) ── */}
        <div className="flex-1 flex items-center justify-center px-6 py-8 lg:max-w-[540px] lg:mx-auto lg:p-12 overflow-y-auto">
          <div className="w-full max-w-[440px] bg-[rgba(15,20,35,0.75)] border border-[rgba(99,102,241,0.18)] rounded-[20px] p-8 backdrop-blur-[24px] shadow-[0_24px_64px_rgba(0,0,0,0.5),0_0_80px_rgba(99,102,241,0.08)]">

            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-[#f1f5f9] mb-1.5">Create an account</h1>
              <p className="text-sm text-[#64748b]">Get started with your free account today</p>
            </div>

            <Form
              onSubmit={onSubmit}
              className="flex flex-col gap-4"
              validationBehavior="native"
            >
              {/* Name Field */}
              <TextField isRequired name="name" type="text" onChange={setName} className="flex flex-col gap-1.5">
                <Label className="text-[0.8rem] font-medium tracking-wide text-[#94a3b8]">Name</Label>
                <div className="relative flex items-center">
                  <span className={`absolute left-3.5 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === "name" ? "text-[#6366f1]" : "text-[#475569]"}`}>
                    <Icon icon="fluent:person-20-regular" width={18} height={18} />
                  </span>
                  <Input

                    placeholder="John Doe"
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-[42px] pr-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-[10px] text-[#f1f5f9] text-sm outline-none placeholder-[#334155] transition-all duration-200 focus:border-[#6366f1]/60 focus:bg-[#6366f1]/[0.05] focus:ring-3 focus:ring-[#6366f1]/12"
                  />
                </div>
              </TextField>

              {/* Image Field */}
              <TextField name="image" type="text" onChange={setImage} className="flex flex-col gap-1.5">
                <Label className="text-[0.8rem] font-medium tracking-wide text-[#94a3b8]">Image URL</Label>
                <div className="relative flex items-center">
                  <span className={`absolute left-3.5 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === "image" ? "text-[#6366f1]" : "text-[#475569]"}`}>
                    <Icon icon="fluent:image-20-regular" width={18} height={18} />
                  </span>
                  <Input

                    placeholder="Paste your image URL"
                    onFocus={() => setFocusedField("image")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-[42px] pr-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-[10px] text-[#f1f5f9] text-sm outline-none placeholder-[#334155] transition-all duration-200 focus:border-[#6366f1]/60 focus:bg-[#6366f1]/[0.05] focus:ring-3 focus:ring-[#6366f1]/12"
                  />
                </div>
              </TextField>

              {/* Email Field */}
              <TextField isRequired name="email" type="email" onChange={setEmail} validate={validateEmail} className="flex flex-col gap-1.5">
                <Label className="text-[0.8rem] font-medium tracking-wide text-[#94a3b8]">Email address</Label>
                <div className="relative flex items-center">
                  <span className={`absolute left-3.5 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === "email" ? "text-[#6366f1]" : "text-[#475569]"}`}>
                    <Icon icon="fluent:mail-20-regular" width={18} height={18} />
                  </span>
                  <Input

                    placeholder="you@example.com"
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-[42px] pr-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-[10px] text-[#f1f5f9] text-sm outline-none placeholder-[#334155] transition-all duration-200 focus:border-[#6366f1]/60 focus:bg-[#6366f1]/[0.05] focus:ring-3 focus:ring-[#6366f1]/12"
                  />
                </div>
                <FieldError className="text-[0.78rem] text-red-400 mt-1" />
              </TextField>

              {/* Password Field */}
              <TextField isRequired minLength={8} name="password" onChange={setPassword} validate={validatePassword} className="flex flex-col gap-1.5">
                <Label className="text-[0.8rem] font-medium tracking-wide text-[#94a3b8]">Password</Label>
                <div className="relative flex items-center">
                  <span className={`absolute left-3.5 flex items-center pointer-events-none transition-colors duration-200 ${focusedField === "password" ? "text-[#6366f1]" : "text-[#475569]"}`}>
                    <Icon icon="fluent:lock-closed-20-regular" width={18} height={18} />
                  </span>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-[42px] pr-10 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-[10px] text-[#f1f5f9] text-sm outline-none placeholder-[#334155] transition-all duration-200 focus:border-[#6366f1]/60 focus:bg-[#6366f1]/[0.05] focus:ring-3 focus:ring-[#6366f1]/12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 p-1 rounded-md text-[#475569] hover:text-[#94a3b8] hover:bg-white/[0.06] transition-all duration-200 flex items-center"
                  >
                    {showPassword ? <EyeClosed width={16} height={16} /> : <Eye width={16} height={16} />}
                  </button>
                </div>
                <Description className="text-[0.72rem] text-[#64748b] leading-normal mt-0.5">
                  Must be at least 8 characters with 1 uppercase and 1 number
                </Description>
                <FieldError className="text-[0.78rem] text-red-400 mt-1" />
              </TextField>

              {/* Auth Error Banner */}
              {authError && (
                <div className="flex items-center gap-2 px-3.5 py-2.5 bg-red-500/[0.08] border border-red-500/[0.25] rounded-[10px] text-[0.82rem] text-red-400" role="alert">
                  <Icon icon="fluent:error-circle-20-filled" width={16} height={16} className="shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Action Buttons (Submit & Reset) */}
              <div className="flex gap-3 w-full mt-2">
                <Button
                  id="signup-submit"
                  type="submit"
                  isDisabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] rounded-[10px] text-white text-sm font-semibold shadow-[0_4px_20px_rgba(99,102,241,0.35)] cursor-pointer transition-all duration-200 hover:enabled:opacity-92 hover:enabled:-translate-y-0.5 disabled:opacity-55 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                  ) : (
                    <Icon icon="fluent:person-add-20-filled" width={18} height={18} />
                  )}
                  {loading ? "Registering..." : "Sign up"}
                </Button>

                <Button
                  type="reset"
                  className="flex-1 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-[10px] text-[#cbd5e1] text-sm font-medium hover:bg-white/[0.08] transition-all duration-200"
                >
                  Reset
                </Button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-1">
                <span className="flex-1 h-[1px] bg-white/[0.07]" />
                <span className="text-[0.75rem] text-[#475569] whitespace-nowrap">or continue with</span>
                <span className="flex-1 h-[1px] bg-white/[0.07]" />
              </div>

              {/* Google Sign up */}
              <Button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 bg-white/[0.04] border border-white/[0.1] rounded-[10px] text-[#cbd5e1] text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-white/[0.08] hover:border-white/[0.16] hover:-translate-y-0.5"
              >
                <Icon icon="devicon:google" width={16} height={16} />
                Sign up with Google
              </Button>
            </Form>

            <p className="mt-6 text-[0.83rem] text-[#475569] text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-[#6366f1] font-semibold hover:text-[#818cf8] transition-colors duration-200">
                Sign in
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default signup;