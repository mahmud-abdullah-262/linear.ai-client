'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import { postTask } from '@/lib/action/postTask';

interface TaskFormData {
  title: string;
  shortDescription: string;
  fullDescription: string;
  status: string;
}

interface TaskFormProps {
  formData: TaskFormData;
  onChange: (field: keyof TaskFormData, value: string) => void;
  isAIAnalyzing?: boolean; // প্যারেন্ট থেকে কন্ট্রোল করার জন্য
}

export default function TaskForm({
  formData,
  onChange,
  isAIAnalyzing = false,
}: TaskFormProps) {

// AI ট্রিগার হ্যান্ডলার
const handleTriggerAI = async () => {
  try {
    // ১. টাইটেল ও শর্ট ডেসক্রিপশন মিলিয়ে প্রম্পট তৈরি
    const promptText = formData.title + ' ' + formData.shortDescription;
    
    // ২. স্ট্রিং এর বদলে অবজেক্ট পেলোড হিসেবে পাঠান
    const response = await postTask('/api/getFullDescription', { text: promptText }, 'POST');
    
    // ৩. ব্যাকএন্ড থেকে আসা ফুল ডেসক্রিপশন স্টেট-এ সেট করুন
    // (ধরে নিচ্ছি ব্যাকএন্ড { success: true, fullDescription: "..." } ফরম্যাটে পাঠাবে)
    if (response && response.fullDescription) {
      onChange('fullDescription', response.fullDescription);
    }
  } catch (error) {
    console.error("AI Generation failed:", error);
  }
};

  // বাটন তখনই এনাবল হবে যখন Title এবং Short Description দুটোই থাকবে
  const isButtonEnabled = formData.title.trim() && formData.shortDescription.trim();

  return (
    <div className="space-y-6 bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-slate-800/80 shadow-xl">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
          <Icon icon="lucide:file-text" className="text-cyan-500 w-5 h-5" />
          Task Details
        </h2>
        <p className="text-sm text-slate-400 mt-1">Provide the essential information for this task.</p>
      </div>

      <div className="space-y-4">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
            Task Title <span className="text-cyan-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            required
            placeholder="e.g. Implement OAuth2 authentication flow"
            value={formData.title}
            onChange={(e) => onChange('title', e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
          />
        </div>

        {/* Short Description Input */}
        <div>
          <label htmlFor="shortDescription" className="block text-sm font-medium text-slate-300 mb-2">
            Short Description <span className="text-cyan-500">*</span>
          </label>
          <input
            id="shortDescription"
            type="text"
            required
            placeholder="A brief one-line overview of the task"
            value={formData.shortDescription}
            onChange={(e) => onChange('shortDescription', e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
          />
        </div>

        {/* Full Description & AI Trigger */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="fullDescription" className="block text-sm font-medium text-slate-300">
              Full Description <span className="text-cyan-500">*</span>
            </label>

            <button
              type="button"
              onClick={handleTriggerAI}
              disabled={!isButtonEnabled || isAIAnalyzing}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-300 ${!isButtonEnabled
                  ? 'border-slate-800 bg-slate-900/30 text-slate-500 cursor-not-allowed'
                  : isAIAnalyzing
                    ? 'border-cyan-500/30 bg-cyan-950/20 text-cyan-400 cursor-wait'
                    : 'border-cyan-500/30 bg-cyan-950/30 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                }`}
            >
              {isAIAnalyzing ? (
                <>
                  <Icon icon="lucide:loader-2" className="animate-spin w-3.5 h-3.5" />
                  Generating Description...
                </>
              ) : (
                <>
                  <Icon icon="lucide:sparkles" className="w-3.5 h-3.5" />
                  Trigger AI Intelligence
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <textarea
              id="fullDescription"
              required
              rows={6}
              placeholder="Provide a comprehensive description or click 'Trigger AI Intelligence' to auto-generate."
              value={formData.fullDescription}
              onChange={(e) => onChange('fullDescription', e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 resize-none font-sans"
            />
          </div>
          {!isButtonEnabled && (
            <p className="text-[11px] text-slate-500 mt-1">
              * Enter both Title and Short Description to enable AI generation.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}