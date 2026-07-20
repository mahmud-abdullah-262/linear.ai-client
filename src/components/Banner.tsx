"use client";

import React from "react";
import { motion } from "motion/react";
import { MotionButton } from "@/components/shared/MotionWrapper";

export default function Banner() {
    const handleScrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <header className="relative w-full h-[65vh] min-h-[500px] flex items-center justify-center bg-[#0B0F19] overflow-hidden pt-36 md:pt-30 lg:pt-24">
            {/* Glow Effects */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-10 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

                {/* Animated Pill Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-300 mb-6 hover:border-cyan-500/30 transition-colors duration-300"
                >
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]"></span>
                    <span className="text-cyan-400">Introducing Linear v2.0</span>
                    <span className="text-slate-500">|</span>
                    <span>Next-gen AI Project Management</span>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut", delay: 0.12 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 leading-[1.15]"
                >
                    Agile, <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">Accelerated by AI.</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
                    className="max-w-2xl mx-auto text-base md:text-lg text-slate-400 mb-8 leading-relaxed"
                >
                    Linear.ai automatically structures tasks, predicts sprints, and automates backlog grooming so your engineering team can focus on shipping code, not administration.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut", delay: 0.28 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <MotionButton
                        id="banner-cta-primary"
                        onClick={() => handleScrollTo("analytics")}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-200"
                    >
                        Try Linear.ai Free
                    </MotionButton>
                    <MotionButton
                        id="banner-cta-secondary"
                        onClick={() => handleScrollTo("features")}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold border border-slate-800 hover:border-slate-700 transition-all duration-200"
                    >
                        Explore Features
                    </MotionButton>
                </motion.div>
            </div>

            {/* Decorative Bottom Wave/Border */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
        </header>
    );
}