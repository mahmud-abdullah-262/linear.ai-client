# ⚡ Linear.ai — Autonomous AI-Powered Agile Management

Linear.ai is a modern, high-performance project management web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **MongoDB**. It leverages AI-driven task auto-classification, context-aware co-pilots, and role-based access control (Admin & Member) to supercharge developer and team velocity.

---

## 🎨 Design System & Aesthetics

Designed with a sleek, minimalist dark-mode developer aesthetic inspired by modern enterprise tooling (Linear, Vercel).

* **Typography:** [Inter](https://rsms.me/inter/) (Google Font) for high-precision readability across data tables, tags, and analytics charts.
* **Color Palette (3-Color System):**
  * **Deep Slate (`#1E293B`):** Base structural container layers & background.
  * **Vibrant Cyan (`#06B6D4`):** Primary action triggers, glows, active states, and AI indicators.
  * **Off-White (`#F8FAFC`):** Primary readable text node and high-contrast labels.
* **Micro-Interactions:** Smooth, non-intrusive UI physics powered by `framer-motion`.

---

## 🚀 Key Features

### 1. Dynamic Role-Based Dashboards (`/dashboard`)

* **Admin Interface:** Global project analytics, Recharts velocity breakdowns, critical blocker alerts, and team workload metrics.
* **Member Interface:** Workload isolation showing strictly assigned tasks, personal active focus items, and personal status distribution.

### 2. Interactive Kanban Workspace (`/items/manage`)

* Core execution hub featuring a split-view layout.
* **4-Column Workflow:** `Backlog` ➔ `Todo` ➔ `In Progress` ➔ `Done`.
* **Context-Aware AI Co-Pilot:** A persistent side-drawer chat assistant reading active MongoDB database context in real time.
* Real-time status shifting, tag/priority filtering, and skeleton loaders.

### 3. AI Task Auto-Classification (`/items/add`)

* Client/Server AI pipeline using Gemini / Groq LLM integration.
* Automatically infers **Priority** (`Low`, `Medium`, `High`, `Critical`) and generates 3–5 technical **Tags** directly from task descriptions.

### 4. Isolated Task Readout & Profile (`/task/[id]` & `/profile`)

* **Task Details Page (`/task/[id]`):** A read-only analytical view with explicit high-visibility redirection triggers pointing back to the main execution Workspace (`/items/manage`).
* **User Profile Page (`/profile`):** User identity metadata, security status, and personal task execution stats.

---

## 📁 System Architecture & Routes

```text
Linear.ai /
├── app/
│   ├── page.tsx            # Landing Page (Hero, Features Grid, Testimonials, CTA)
│   ├── login/              # Authentication & JWT Session Entry
│   ├── dashboard/          # Role-Based Analytics Dashboard (Admin vs Member)
│   ├── items/
│   │   ├── manage/         # Primary Execution Workspace (Kanban + AI Co-pilot)
│   │   └── add/            # Modular Task Creation Form with AI Auto-Tagging
│   ├── task/
│   │   └── [id]/           # Task Details Readout (Redirects to Workspace)
│   └── profile/            # User Profile & Activity Summary
```

---

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router, Server Actions, Client Components)
* **Language:** TypeScript (100% Type-Safe)
* **Styling & UI:** Tailwind CSS, Framer Motion
* **Database:** MongoDB & Mongoose
* **State & Data Fetching:** TanStack Query (React Query)
* **AI Engine:** Google Gemini SDK / Groq Llama 3
* **Charts & Visuals:** Recharts
* **Icons:** Lucide React

---

## 📋 Data Schema Blueprint (Task Model)

```typescript
interface ITask {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl?: string;
  status: 'Backlog' | 'Todo' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  tags: string[];
  assignedTo: {
    _id: string;
    name: string;
    avatar: string;
    role: 'Admin' | 'Member';
  };
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
}
```

---

## ⚙️ Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/linear-ai.git
cd linear-ai
npm install
```

### 2. Environment Variables Configuration

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.