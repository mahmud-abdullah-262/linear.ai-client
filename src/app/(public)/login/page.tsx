"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { signIn } from "@/lib/auth-client";

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
        callbackURL: "/",
      });

      if (error) {
        setAuthError(error.message ?? "Login failed.");
        return;
      }

      router.push("/");
    } catch (err) {
      console.error(err);
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    // await signIn.social({ provider: "google", callbackURL: "/" });
  };

  return (
    <div className="login-root">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-bg-orb orb-1" />
        <div className="login-bg-orb orb-2" />
        <div className="login-bg-orb orb-3" />
        <div className="login-grid" />
      </div>

      <div className="login-container">
        {/* Left panel — branding */}
        <div className="login-brand-panel">
          <div className="login-brand-inner">
            <div className="login-logo">
              <span className="login-logo-icon">
                <Icon icon="fluent:lightning-bolt-20-filled" width={22} height={22} />
              </span>
              <span className="login-logo-text">Linear<span className="login-logo-dot">.ai</span></span>
            </div>

            <div className="login-brand-copy">
              <h2 className="login-brand-headline">
                Ship faster.<br />
                Think smarter.
              </h2>
              <p className="login-brand-sub">
                The AI-native project management platform built for modern engineering teams.
              </p>
            </div>

            <div className="login-features">
              {[
                { icon: "fluent:brain-circuit-20-filled", label: "AI-powered planning" },
                { icon: "fluent:rocket-20-filled", label: "Zero-friction sprints" },
                { icon: "fluent:people-team-20-filled", label: "Real-time collaboration" },
              ].map(({ icon, label }) => (
                <div key={label} className="login-feature-item">
                  <span className="login-feature-icon">
                    <Icon icon={icon} width={16} height={16} />
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="login-brand-testimonial">
              <p className="login-testimonial-text">
                &ldquo;Linear.ai cut our planning overhead by 60%. It&rsquo;s the only tool that actually thinks ahead.&rdquo;
              </p>
              <div className="login-testimonial-author">
                <div className="login-testimonial-avatar">SL</div>
                <div>
                  <p className="login-testimonial-name">Sarah Lin</p>
                  <p className="login-testimonial-role">Engineering Lead, Vercel</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="login-form-panel">
          <div className="login-card">
            <div className="login-card-header">
              <h1 className="login-card-title">Welcome back</h1>
              <p className="login-card-subtitle">Sign in to continue to Linear.ai</p>
            </div>

            <form onSubmit={onSubmit} className="login-form" noValidate>
              {/* Email */}
              <div className={`login-field ${focusedField === "email" ? "focused" : ""}`}>
                <label htmlFor="login-email" className="login-label">
                  Email address
                </label>
                <div className="login-input-wrapper">
                  <span className="login-input-icon">
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
                    className="login-input"
                  />
                </div>
              </div>

              {/* Password */}
              <div className={`login-field ${focusedField === "password" ? "focused" : ""}`}>
                <div className="login-label-row">
                  <label htmlFor="login-password" className="login-label">
                    Password
                  </label>
                  <Link href="/forgot-password" className="login-forgot">
                    Forgot password?
                  </Link>
                </div>
                <div className="login-input-wrapper">
                  <span className="login-input-icon">
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
                    className="login-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="login-eye-btn"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <Icon
                      icon={showPassword ? "fluent:eye-off-20-regular" : "fluent:eye-20-regular"}
                      width={18}
                      height={18}
                    />
                  </button>
                </div>
              </div>

              {/* Error */}
              {authError && (
                <div className="login-error" role="alert">
                  <Icon icon="fluent:error-circle-20-filled" width={16} height={16} />
                  <span>{authError}</span>
                </div>
              )}

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="login-submit-btn"
              >
                {loading ? (
                  <>
                    <span className="login-spinner" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <Icon icon="fluent:arrow-right-20-filled" width={18} height={18} />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="login-divider">
                <span className="login-divider-line" />
                <span className="login-divider-label">or continue with</span>
                <span className="login-divider-line" />
              </div>

              {/* Social */}
              <button
                id="login-google"
                type="button"
                onClick={handleGoogleLogin}
                className="login-social-btn"
              >
                <Icon icon="devicon:google" width={18} height={18} />
                Sign in with Google
              </button>
            </form>

            <p className="login-footer-text">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="login-footer-link">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Reset & Root ── */
        .login-root {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: stretch;
          overflow: hidden;
          font-family: var(--font-geist-sans), 'Inter', system-ui, sans-serif;
        }

        /* ── Animated Background ── */
        .login-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          background: #080c14;
          pointer-events: none;
        }
        .login-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.18;
          animation: orbFloat 12s ease-in-out infinite alternate;
        }
        .orb-1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, #6366f1, #4f46e5);
          top: -150px; left: -150px;
          animation-delay: 0s;
        }
        .orb-2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #06b6d4, #0891b2);
          bottom: -100px; right: -100px;
          animation-delay: -4s;
        }
        .orb-3 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, #8b5cf6, #7c3aed);
          top: 40%; left: 40%;
          transform: translate(-50%, -50%);
          animation-delay: -8s;
        }
        @keyframes orbFloat {
          0%   { transform: scale(1) translate(0, 0); }
          50%  { transform: scale(1.08) translate(20px, -20px); }
          100% { transform: scale(0.95) translate(-15px, 15px); }
        }
        .login-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        /* ── Layout ── */
        .login-container {
          position: relative;
          z-index: 1;
          display: flex;
          width: 100%;
          min-height: 100vh;
        }

        /* ── Brand Panel ── */
        .login-brand-panel {
          display: none;
          flex: 1;
          background: linear-gradient(135deg,
            rgba(99,102,241,0.08) 0%,
            rgba(6,182,212,0.05) 50%,
            rgba(139,92,246,0.08) 100%
          );
          border-right: 1px solid rgba(99,102,241,0.15);
          padding: 48px;
          align-items: center;
          justify-content: center;
        }
        @media (min-width: 1024px) {
          .login-brand-panel { display: flex; }
        }
        .login-brand-inner {
          max-width: 420px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        /* Logo */
        .login-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .login-logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px; height: 38px;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          border-radius: 10px;
          color: #fff;
          box-shadow: 0 0 24px rgba(99,102,241,0.5);
        }
        .login-logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -0.5px;
        }
        .login-logo-dot { color: #6366f1; }

        /* Brand copy */
        .login-brand-headline {
          font-size: 2.5rem;
          font-weight: 800;
          line-height: 1.15;
          color: #f1f5f9;
          letter-spacing: -1px;
        }
        .login-brand-sub {
          font-size: 1rem;
          color: #94a3b8;
          line-height: 1.65;
          margin-top: 12px;
        }

        /* Feature pills */
        .login-features {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .login-feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.875rem;
          color: #cbd5e1;
        }
        .login-feature-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px; height: 30px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 8px;
          color: #818cf8;
          flex-shrink: 0;
        }

        /* Testimonial */
        .login-brand-testimonial {
          padding: 20px 24px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          backdrop-filter: blur(8px);
        }
        .login-testimonial-text {
          font-size: 0.9rem;
          color: #cbd5e1;
          line-height: 1.6;
          font-style: italic;
        }
        .login-testimonial-author {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 16px;
        }
        .login-testimonial-avatar {
          width: 34px; height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }
        .login-testimonial-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: #f1f5f9;
        }
        .login-testimonial-role {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 2px;
        }

        /* ── Form Panel ── */
        .login-form-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 24px;
        }
        @media (min-width: 1024px) {
          .login-form-panel { max-width: 520px; margin: 0 auto; padding: 48px; }
        }

        /* Card */
        .login-card {
          width: 100%;
          max-width: 420px;
          background: rgba(15,20,35,0.75);
          border: 1px solid rgba(99,102,241,0.18);
          border-radius: 20px;
          padding: 40px 36px;
          backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.03),
            0 24px 64px rgba(0,0,0,0.5),
            0 0 80px rgba(99,102,241,0.08);
        }

        .login-card-header {
          margin-bottom: 28px;
        }
        .login-card-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -0.5px;
          margin: 0 0 6px;
        }
        .login-card-subtitle {
          font-size: 0.9rem;
          color: #64748b;
          margin: 0;
        }

        /* ── Form Fields ── */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .login-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .login-label {
          font-size: 0.8rem;
          font-weight: 500;
          color: #94a3b8;
          letter-spacing: 0.3px;
        }
        .login-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .login-forgot {
          font-size: 0.78rem;
          color: #6366f1;
          text-decoration: none;
          transition: color 0.2s;
        }
        .login-forgot:hover { color: #818cf8; }

        .login-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .login-input-icon {
          position: absolute;
          left: 14px;
          color: #475569;
          display: flex;
          align-items: center;
          pointer-events: none;
          transition: color 0.2s;
        }
        .login-field.focused .login-input-icon { color: #6366f1; }

        .login-input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: #f1f5f9;
          font-size: 0.9rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .login-input::placeholder { color: #334155; }
        .login-input:focus {
          border-color: rgba(99,102,241,0.6);
          background: rgba(99,102,241,0.05);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }

        .login-eye-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 6px;
          transition: color 0.2s, background 0.2s;
        }
        .login-eye-btn:hover {
          color: #94a3b8;
          background: rgba(255,255,255,0.06);
        }

        /* ── Error ── */
        .login-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 10px;
          font-size: 0.82rem;
          color: #f87171;
        }

        /* ── Submit Button ── */
        .login-submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 20px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 0.92rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(99,102,241,0.35);
        }
        .login-submit-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(99,102,241,0.45);
        }
        .login-submit-btn:active:not(:disabled) { transform: translateY(0); }
        .login-submit-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        /* Spinner */
        .login-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Divider ── */
        .login-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 2px 0;
        }
        .login-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }
        .login-divider-label {
          font-size: 0.75rem;
          color: #475569;
          white-space: nowrap;
        }

        /* ── Social Button ── */
        .login-social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: #cbd5e1;
          font-size: 0.88rem;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
        }
        .login-social-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.16);
          transform: translateY(-1px);
        }

        /* ── Footer ── */
        .login-footer-text {
          margin-top: 24px;
          font-size: 0.83rem;
          color: #475569;
          text-align: center;
        }
        .login-footer-link {
          color: #6366f1;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }
        .login-footer-link:hover { color: #818cf8; }
      `}</style>
    </div>
  );
};

export default LoginPage;