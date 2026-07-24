import type { TaskPriority } from '@/types/dashboard';

/**
 * কলামের ভেতরে স্ক্রল হ্যান্ডল করে — কলাম স্ক্রলযোগ্য থাকলে বাইরের পেজ স্ক্রল
 * বন্ধ রাখে, শীর্ষ/নিচে পৌঁছালে normal page scroll কে override করে না।
 */
export const columnScrollRef = (node: HTMLDivElement | null) => {
  if (!node) return;

  const handleWheel = (e: WheelEvent) => {
    const { scrollTop, scrollHeight, clientHeight } = node;
    const isScrollable = scrollHeight > clientHeight;

    if (!isScrollable) return;

    const isScrollingDown = e.deltaY > 0;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
    const isAtTop = scrollTop <= 0;

    if ((isScrollingDown && !isAtBottom) || (!isScrollingDown && !isAtTop)) {
      e.stopPropagation();
    } else {
      e.preventDefault();
    }
  };

  node.addEventListener('wheel', handleWheel, { passive: false });
};

export const getPriorityStyles = (p: TaskPriority) => {
  switch (p) {
    case 'Critical':
      return 'bg-red-950/80 text-red-400 border-red-800/80';
    case 'High':
      return 'bg-orange-950/80 text-orange-400 border-orange-850/80';
    case 'Medium':
      return 'bg-yellow-950/80 text-yellow-400 border-yellow-800/80';
    case 'Low':
      return 'bg-slate-800/80 text-slate-400 border-slate-700/80';
    default:
      return 'bg-slate-800/80 text-slate-400 border-slate-700/80';
  }
};