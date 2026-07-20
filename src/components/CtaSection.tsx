"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import type { JSX } from "react";
import { Button } from "@heroui/react";
import { signIn } from "@/lib/auth-client";

/**
 * CtaSection
 * -----------
 * High-conversion, closing CTA block for the Linear.ai landing page.
 *
 * Design tokens (per brief):
 *  - Background: Deep Slate  #1E293B
 *  - Accent:     Vibrant Cyan #06B6D4
 *  - Foreground: Off-White   #F8FAFC
 */

interface TrustIndicator {
    readonly id: string;
    readonly label: string;
}

const TRUST_INDICATORS: readonly TrustIndicator[] = [
    { id: "no-card", label: "No credit card required" },
    { id: "demo-login", label: "Instant 1-Click Demo Login" },
    { id: "free-tier", label: "Free tier access" },
];

export default function CtaSection(): JSX.Element {
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
    return (
        <section
            aria-labelledby="cta-heading"
            className="relative w-full bg-[#0B0F19] px-4 py-20 sm:px-6 sm:py-28 lg:px-8 "
        >
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-[#1E293B] px-6 py-14 shadow-2xl sm:px-12 sm:py-16 lg:px-16"
            >
                {/* Ambient glow ring */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.22),transparent_60%)]"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-px rounded-3xl [box-shadow:inset_0_0_0_1px_rgba(6,182,212,0.15)]"
                />

                <div className="relative flex flex-col items-center text-center">
                    {/* Pill badge */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
                        </span>
                        <span className="text-xs font-semibold tracking-widest text-cyan-300">
                            START BUILDING FASTER
                        </span>
                    </div>

                    {/* Headline */}
                    <h2
                        id="cta-heading"
                        className="max-w-2xl text-balance text-3xl font-bold leading-tight text-[#F8FAFC] sm:text-4xl lg:text-5xl"
                    >
                        Ready to Supercharge Your Agile Workflow with Autonomous AI?
                    </h2>

                    {/* Description */}
                    <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-slate-300 sm:text-lg">
                        Join hundreds of engineering teams using Linear.ai to automate
                        backlog grooming, classify tasks instantly, and ship code faster.
                    </p>

                    {/* Action buttons */}
                    <div className="mt-9 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full sm:w-auto"
                        >
                            <Link
                                href="/signup"
                                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#06B6D4] px-7 py-3.5 text-base font-semibold text-[#1E293B] transition-colors hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 sm:w-auto"
                            >
                                Get Started Free
                                <motion.span
                                    className="inline-flex"
                                    whileHover={{ x: 4 }}
                                    transition={{ type: "tween", duration: 0.15 }}
                                >
                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </motion.span>
                            </Link>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full sm:w-auto"
                        >
                            <Button
                                onClick={handleDemoLogin}
                                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#06B6D4] px-7 py-6.5 text-base font-semibold text-[#1E293B] transition-colors hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 sm:w-auto"
                            >
                                Try Demo Account
                            </Button>
                        </motion.div>
                    </div>

                    {/* Micro-trust indicators */}
                    <ul className="mt-8 flex flex-col flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-300 sm:flex-row">
                        {TRUST_INDICATORS.map((indicator) => (
                            <li key={indicator.id} className="flex items-center gap-2">
                                <Check
                                    className="h-4 w-4 shrink-0 text-cyan-400"
                                    aria-hidden="true"
                                />
                                <span>{indicator.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.div>
        </section>
    );
}