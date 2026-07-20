'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import { postTask } from '@/lib/action/postTask';

interface TaskFormData {
  title: string;
  shortDescription: string;
  fullDescription: string;
  characterCount: number | string;
  status: string;
  priority: string;
}

interface TaskFormProps {
  formData: TaskFormData;
  onChange: (field: keyof TaskFormData, value: string | number) => void;
  isAIAnalyzing?: boolean;
}

const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];

export default function TaskForm({
  formData,
  onChange,
  isAIAnalyzing = false,
}: TaskFormProps) {

  // AI ট্রিগার হ্যান্ডলার
  const handleTriggerAI = async () => {
    try {
      // ১. টাইটেল ও শর্ট ডেসক্রিপশন মিলিয়ে প্রম্পট তৈরি
      const promptText = `${formData.title} ${formData.shortDescription}`;

      // ২. টাইটেল, শর্ট ডেসক্রিপশন এবং ক্যারেক্টার কাউন্ট একসাথে পাঠানো হচ্ছে
      const payload = {
        text: promptText,
        characterCount: Number(formData.characterCount) || 0,
      };

      const response = await postTask('/api/getFullDescription', payload, 'POST');

      // ৩. ব্যাকএন্ড থেকে আসা ফুল ডেসক্রিপশন স্টেটে সেট করা
      if (response && response.fullDescription) {
        onChange('fullDescription', response.fullDescription);
      }
    } catch (error) {
      console.error("AI Generation failed:", error);
    }
  };

  // বাটন তখনই এনাবল হবে যখন Title এবং Short Description দুটোই থাকবে
  const isButtonEnabled = Boolean(formData.title.trim() && formData.shortDescription.trim());

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
            <div className="flex justify-center items-center gap-2">
              <input
                id="resultSize"
                type="number"
                placeholder="Char count"
                value={formData.characterCount || ''}
                onChange={(e) => onChange('characterCount', e.target.value)}
                className="w-28 bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
              />
              <button
                type="button"
                onClick={handleTriggerAI}
                disabled={!isButtonEnabled || isAIAnalyzing}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-300 ${
                  !isButtonEnabled
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

        {/* Priority Select */}
        <div className="flex flex-col gap-1">
          <label htmlFor="priority" className="block text-sm font-medium text-slate-300 mb-1">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={(e) => onChange('priority', e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
          >
            <option value="" disabled className="bg-slate-900 text-slate-400">
              Select priority
            </option>
            {priorityOptions.map((p) => (
              <option key={p} value={p} className="bg-slate-900 text-slate-200">
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}