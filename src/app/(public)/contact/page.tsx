"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "support",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.name && formState.email && formState.message) {
      setSubmitted(true);
      setFormState({ name: "", email: "", subject: "support", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div className="pt-32 pb-24 bg-[#0B0F19] text-slate-200 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-12">
        {/* Header Section */}
        <div className="text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none"></div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest px-3.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/50">
            Contact
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mt-6 mb-4">
            Get in <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            Whether you have a question, feedback, feature request, or need technical support, the Linear.ai team is here to help.
          </p>
        </div>

        {/* Two-Column Grid: Form & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start mt-6">
          {/* Left Column: Form (3/5 span) */}
          <div className="lg:col-span-3 rounded-2xl bg-slate-900/40 border border-slate-800/80 p-8 md:p-10 hover:border-cyan-500/10 transition-all duration-300 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6">Send us a message</h2>
            
            {submitted ? (
              <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-xl p-6 text-center flex flex-col items-center gap-3 animate-fade-in">
                <span className="w-10 h-10 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <h3 className="text-lg font-bold text-white">Message Sent Successfully!</h3>
                <p className="text-sm text-slate-400 max-w-sm">
                  Thank you for reaching out. A developer or support specialist will review your request and reply shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="jane@domain.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inquiry Type</label>
                  <select
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm font-medium cursor-pointer"
                  >
                    <option value="support">Technical Support</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="business">Partnership / Enterprise Inquiries</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Describe your request in detail..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm font-medium resize-none leading-relaxed"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 active:scale-98 transition-all duration-200 mt-2 text-sm"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Info Cards (2/5 span) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* General Inquiries */}
            <div className="rounded-xl bg-slate-900/30 border border-slate-800 p-6 flex items-start gap-4 hover:border-cyan-500/20 transition-all duration-300 group">
              <span className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-cyan-400 group-hover:border-cyan-500/40 transition-colors flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-white text-sm">General Inquiries</h3>
                <a href="mailto:hello@linear.ai" className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                  hello@linear.ai
                </a>
              </div>
            </div>

            {/* Support */}
            <div className="rounded-xl bg-slate-900/30 border border-slate-800 p-6 flex items-start gap-4 hover:border-cyan-500/20 transition-all duration-300 group">
              <span className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-indigo-400 group-hover:border-indigo-500/40 transition-colors flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-white text-sm">Support</h3>
                <a href="mailto:support@linear.ai" className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                  support@linear.ai
                </a>
              </div>
            </div>

            {/* Business & Partnerships */}
            <div className="rounded-xl bg-slate-900/30 border border-slate-800 p-6 flex items-start gap-4 hover:border-cyan-500/20 transition-all duration-300 group">
              <span className="p-2.5 rounded-lg bg-teal-950/40 border border-teal-800/40 text-teal-400 group-hover:border-teal-500/40 transition-colors flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-white text-sm">Business & Partnerships</h3>
                <a href="mailto:business@linear.ai" className="text-sm text-teal-400 hover:text-teal-300 font-semibold transition-colors">
                  business@linear.ai
                </a>
              </div>
            </div>

            {/* Response Time Info */}
            <div className="rounded-xl bg-cyan-950/15 border border-cyan-800/40 p-6 flex flex-col gap-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">SLA Notice</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                We value your time. The engineering team aims to review and respond to all tickets and inquiries within <strong className="text-slate-200">24–48 business hours</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}