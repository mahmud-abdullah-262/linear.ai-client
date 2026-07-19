@AGENTS.md
# Project Context & Rules: Linear.ai

You are an expert full-stack engineer and AI coding agent. Your goal is to build **Linear.ai**, an autonomous Agile Project Management tool with a context-aware AI Co-Pilot.

---

## 1. System Architecture & Tech Stack

### Frontend (App Router Setup)
- **Framework:** Next.js (TypeScript) + Tailwind CSS.
- **State & Data Fetching:** TanStack Query (React Query) for caching and server-state sync.
- **Charts:** Recharts (for project velocity and analytics).
- **Design Restrictions:** Max 3 primary colors (Deep Slate `#1E293B`, Vibrant Cyan `#06B6D4`, Neutral Off-White `#F8FAFC`). Absolute layout consistency, uniform card heights, and identical border radiuses. Fully responsive. No placeholder content.

### Feature 1: Landing Page & Global UI
Requirements: Sticky top navbar (3 links logged-out, 5 links logged-in). Hero section limited to 65% height with a dynamic visual layout and a CTA. 7 meaningful sections: Hero, Core Value Prop, Interactive Feature Metrics (Recharts teaser), AI Architecture Diagram, Testimonials, FAQ, and Footer. Maximum of 3 primary colors (e.g., Deep Slate, Cyan Accents, Off-White).

### Feature 2: Smart Task Creation (/items/add) with AI Auto-Tagging
Requirements: A protected form accepting Title, Short Description, and Full Description. Upon typing or submitting, the raw text is intercepted and sent to the backend. The AI analyzes the fullDescription, automatically determines the task's structural severity (priority), and generates relevant contextual tags (e.g., Frontend, Database, Bug, Security). The user can review and edit these tags before saving.

### Feature 3: Live Kanban Board & Core Explorer (/items/manage)
Requirements: Secure grid/board interface displaying tasks in columns based on status (Backlog, Todo, In Progress, Done). Desktop view shows 4 clean cards per row/column. Includes a skeleton loader state during TanStack Query data fetching. Features search functionality and active filtering by priority and tags.

### Feature 4: Context-Aware AI Chat Assistant (AI Co-Pilot)
Requirements: A collapsible sidebar chatbot available within protected views. It provides streaming responses and maintains conversation history. Instead of handling generic user queries, the backend injects the sanitized active task database state into the LLM context wrapper. This allows the agent to reason directly over live team performance.
