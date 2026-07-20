'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Spinner, toast } from '@heroui/react';
import TaskForm from '@/components/task/TaskForm';


import { postTask } from '@/lib/action/postTask';
import { authClient } from '@/lib/auth-client';
import { redirect } from 'next/navigation';
import { array } from 'better-auth';

interface TaskFormData {
  title: string;
  shortDescription: string;
  fullDescription: string;
  characterCount: number;
  status: string;
  priority: string;
}




export default  function TaskAddPage() {
  const { data: session, isPending, error } = authClient.useSession();
    const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    shortDescription: '',
    characterCount: 0,
    fullDescription: '',
    status: 'Todo',
    priority: ''
  });

 

  const [isAIAnalyzing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);



  if (isPending) return ( <div className='h-screen w-full flex items-center justify-center'><Spinner /> </div>);
  if (error) return (<div>Error: {error.message}</div>) ;
  if (!session) return (redirect('/login')) ;




  // Handle standard form changes
  const handleFormChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.shortDescription.trim() || !formData.fullDescription.trim()) {
      toast.danger('Missing Fields', {
        description: 'Please fill in all required fields.',
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      ...formData,
      createdAt: new Date().toISOString(),
    };

    // Central Log Handler requirement
    console.log('SUBMIT_NEW_TASK_PAYLOAD:', JSON.stringify(payload, null, 2));

    const result = await postTask('/api/addTask', payload, 'POST');
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Task Created Successfully!', {
        description: 'The task payload was logged to the console.',
      });

      // Clear Form on success
      setFormData({
        title: '',
        shortDescription: '',
        characterCount: 0,
        fullDescription: '',
        status: 'Todo',
        priority: ''
      });
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative gradient background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto space-y-8 relative z-10">
        {/* Header Breadcrumbs / Title */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-1">
              <span>Workspace</span>
              <Icon icon="lucide:chevron-right" className="w-3 h-3 text-slate-600" />
              <span>Tasks</span>
              <Icon icon="lucide:chevron-right" className="w-3 h-3 text-slate-600" />
              <span className="text-slate-400">Create Task</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Create New Task
            </h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">
              Establish a new sprint task with intelligent classification tags.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  title: '',
                  shortDescription: '',
                  characterCount: 0,
                  fullDescription: '',
                  status: 'Todo',
                  priority: ''
                })
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-300 text-sm font-semibold hover:bg-slate-900 hover:text-white transition-all duration-200"
            >
              Reset Form
            </button>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Core Fields */}
          <div className="lg:col-span-2 space-y-6">
            <TaskForm
              formData={formData}
              onChange={handleFormChange}
             
              isAIAnalyzing={isAIAnalyzing}
            />

            {/* Task Preview Card (Dynamic Visual Feedback) */}
            <div className="bg-slate-900/20 backdrop-blur-sm p-6 rounded-2xl border border-slate-800/40">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Live Task Card Preview</h3>
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-4 shadow-2xl relative overflow-hidden group">

                <div className="flex justify-between items-start gap-4">
                  <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-2.5 py-1 rounded-md uppercase tracking-wider">
                    Task Draft
                  </span>
                  
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-100 line-clamp-1">
                    {formData.title || 'Untitled Task'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {formData.shortDescription || 'Short description will be shown here...'}
                  </p>
                </div>

             
              </div>
            </div>
          </div>

          {/* Right Column: AI Suggestions & Submit */}
          <div className="space-y-6">
            

            {/* Sticky/Bottom Actions */}
            <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-slate-800/80 shadow-xl space-y-4">
              <button
                type="submit"
                disabled={isSubmitting || !formData.title.trim() || !formData.shortDescription.trim()}
                className={`w-full py-4.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${isSubmitting || !formData.title.trim() || !formData.shortDescription.trim()
                  ? 'bg-slate-800 text-slate-500 border border-slate-800 cursor-not-allowed'
                  : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-extrabold shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:shadow-[0_0_35px_rgba(6,182,212,0.45)] hover:scale-[1.01]'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <Icon icon="lucide:loader-2" className="animate-spin w-4 h-4" />
                    Creating Task...
                  </>
                ) : (
                  <>
                    <Icon icon="lucide:plus-circle" className="w-4 h-4" />
                    Create Task
                  </>
                )}
              </button>
              <p className="text-center text-[10px] text-slate-500">
                Created task metadata payload is exported directly to developer console.
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}