// components/testimonials-section.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface Testimonial {
    id: string;
    name: string;
    role: string;
    rating: number;
    comment: string;
    highlightedTag: string;
    image: string;
}

const testimonials: Testimonial[] = [
    {
        id: "t-01",
        name: "Sarah Mitchell",
        role: "Engineering Lead at TechFlow",
        rating: 5,
        comment:
            "Linear.ai's AI Auto-Classification saved hours of backlog grooming every single sprint. Tickets get triaged and tagged before our standup even starts.",
        highlightedTag: "Verified Buyer",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    },
    {
        id: "t-02",
        name: "David Carter",
        role: "Senior Product Manager",
        rating: 5,
        comment:
            "The Context-Aware AI Co-Pilot handles project updates effortlessly. It drafts stakeholder summaries from our threads and gets the tone right almost every time.",
        highlightedTag: "Enterprise Lead",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    },
    {
        id: "t-03",
        name: "Emily Rodriguez",
        role: "Full-Stack Developer",
        rating: 5,
        comment:
            "Smart dependency detection catches blockers before they cascade. Our sprint velocity is up and standups are noticeably shorter than before we switched over.",
        highlightedTag: "Agile Manager",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
};

function StarRow({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-1" role="img" aria-label={`${rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className="h-4 w-4"
                    fill={i < rating ? "#06B6D4" : "transparent"}
                    stroke="#06B6D4"
                    strokeWidth={1.5}
                />
            ))}
        </div>
    );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
    return (
        <motion.article
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="flex h-full flex-col justify-between rounded-2xl border border-slate-700/60 bg-[#0F172A] p-8 shadow-lg shadow-black/20 transition-colors duration-300 hover:border-[#06B6D4]"
        >
            <div className="flex flex-col gap-5">
                <StarRow rating={testimonial.rating} />
                <p className="text-[15px] leading-relaxed text-[#F8FAFC]">
                    &ldquo;{testimonial.comment}&rdquo;
                </p>
            </div>

            <div className="mt-8 flex items-center gap-4 border-t border-slate-700/60 pt-6">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-slate-700">
                    <Image
                        src={`${testimonial.image}?auto=format&fit=crop&w=88&h=88&q=80`}
                        alt={`Photo of ${testimonial.name}`}
                        fill
                        sizes="44px"
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[#F8FAFC]">{testimonial.name}</span>
                    <span className="text-xs text-[#94A3B8]">{testimonial.role}</span>
                </div>
                <span className="ml-auto shrink-0 rounded-full border border-[#06B6D4]/40 bg-[#06B6D4]/10 px-3 py-1 text-[11px] font-medium text-[#06B6D4]">
                    {testimonial.highlightedTag}
                </span>
            </div>
        </motion.article>
    );
}

export default function TestimonialsSection() {
    return (
        <section className="bg-[#0B0F19] px-6 py-24 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center text-center"
                >
                    <span className="mb-5 rounded-full border border-[#06B6D4]/40 bg-[#06B6D4]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#06B6D4]">
                        Trusted by Agile Teams
                    </span>
                    <h2 className="max-w-2xl text-3xl font-bold text-[#F8FAFC] sm:text-4xl">
                        Loved by Engineers and Product Leaders
                    </h2>
                    <p className="mt-4 max-w-xl text-base text-[#94A3B8]">
                        See how autonomous AI workflows are transforming team velocity worldwide.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {testimonials.map((testimonial) => (
                        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}