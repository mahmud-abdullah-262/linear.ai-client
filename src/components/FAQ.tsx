"use client";

import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

function FAQAccordionItem({ item, isOpen, onClick }: { item: FAQItem; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-slate-800/80 last:border-0">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group focus:outline-none"
      >
        <span className={`text-base md:text-lg font-bold transition-colors duration-200 ${isOpen ? "text-cyan-400" : "text-slate-100 group-hover:text-cyan-300"}`}>
          {item.question}
        </span>
        <span className={`ml-6 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border bg-slate-900 border-slate-800 text-slate-400 group-hover:text-white transition-all duration-300 ${isOpen ? "rotate-180 border-cyan-500/40 text-cyan-400" : ""}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-60 pb-6 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-sm md:text-base text-slate-400 leading-relaxed pl-1">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "How does Linear.ai connect with our current tools?",
      answer: "We offer native, one-click API integrations with GitHub, GitLab, Slack, and Figma. Our webhooks capture developer updates, comments, and design specs dynamically to maintain a unified sprint context.",
    },
    {
      question: "Is our proprietary codebase secure with Linear.ai?",
      answer: "Absolutely. Security is central to our infrastructure. We do not train base models on your code. All metadata is encrypted at rest and in transit, and we are fully SOC2 Type II compliant.",
    },
    {
      question: "Can we import our historical data from Jira or Linear?",
      answer: "Yes, we support complete migration. Our automated importer lets you bring in history, tickets, sprint logs, epics, and labels from Jira or Linear in less than 5 minutes, without losing context.",
    },
    {
      question: "How does the AI points estimation work?",
      answer: "Our engine analyzes historical task completion velocity, ticket description patterns, and repository changes to dynamically predict point values, helping teams plan sprints with much higher accuracy.",
    },
    {
      question: "Does Linear.ai replace product managers or scrum masters?",
      answer: "No. Linear.ai is built to empower them. By automating administrative tasks—like drafting acceptance criteria, linking issues, and running burndown analytics—your team's leaders can focus entirely on design and product vision.",
    },
  ];

  const handleToggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-[#0B0F19] relative">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-cyan-400 tracking-wider uppercase mb-3 font-mono">Frequently Asked Questions</h2>
          <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Got questions? We have answers.
          </p>
        </div>

        {/* FAQ Accordion list */}
        <div className="rounded-2xl bg-slate-900/30 border border-slate-800/80 px-6 md:px-8 shadow-xl">
          {faqs.map((faq, idx) => (
            <FAQAccordionItem
              key={idx}
              item={faq}
              isOpen={openIdx === idx}
              onClick={() => handleToggle(idx)}
            />
          ))}
        </div>
      </div>
      {/* Decorative Bottom Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
    </section>
  );
}
