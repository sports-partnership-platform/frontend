# ⚡ Sports Partnership Platform — Frontend Application

Modern, enterprise Single Page Application (SPA) for the **Sports Partnership & Multi-Level Commission Management Platform**. Built with **Angular 19** (Standalone Components, RxJS, Signals) and Tailwind CSS / bespoke FinTech design system tokens.

---

## 📋 Table of Contents
- [Overview & Core Highlights](#-overview--core-highlights)
- [Key Features & Modules](#-key-features--modules)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Application Pages](#-application-pages)
- [UI / UX Design System](#-ui--ux-design-system)

---

## 🎯 Overview & Core Highlights

The Sports Partnership Frontend provides an intuitive command center for managing complex multi-tier revenue waterfall distribution networks starting from the **Platform Owner (Level 0)** down through **Level 1 to Level 5**:
- **Everything Starts from Owner**: The Platform Owner holds the 100% root sports pool and delegates shares to Level 1 Senior Partners down to Level 5 Sub-Agents.
- **Live Revenue Waterfall Simulator**: Visual 100% "Cake Distribution" breakdown bar with instant mathematical formula computation and preset trading scenarios.
- **Hierarchical Network Topology Visualizer**: Interactive partner tree showing Owner at the root with collapsible branches, upline chains, and downline metrics.
- **Partnership Matrix**: Granular per-sport percentage control (Received %, Given %, Remaining %) with automatic recursive downline cascading.
- **Real-Time Toast Alerts**: Live feedback when transactions settle or percentage limits update.

---

## 🌟 Key Features & Modules

### 1. 📊 Command Center Dashboard (`/dashboard`)
- Real-time platform KPI cards: **Total Turnover Volume**, **Active Partners**, **Configured Sports**, and **Hierarchy Depth**.
- 6-Tier distribution breakdown: **👑 Owner (Root)**, **L1**, **L2**, **L3**, **L4**, **L5**.
- Recent transactions ledger with instant breakdown popovers.

### 2. 👥 Partner Directory (`/partners`)
- Search, filter by Tier (Owner to L5), and paginate partners.
- Add new partners with dynamic parent selection (automatically assigns level $N+1$).
- Detailed partner view modal showing upline chain up to Owner and immediate downlines.

### 3. 🌳 Visual Hierarchy Tree (`/hierarchy`)
- Visual multi-tier tree rendering from **Platform Owner (Level 0)** down to **Level 5**.
- Level badges with tailored high-contrast themes:
  - 👑 **Owner** (Gold / Platinum Crown)
  - 🟡 **L1** (Senior Partner)
  - 🔵 **L2** (Sub-Partner)
  - 🟢 **L3** (Master Agent)
  - 🟣 **L4** (Agent)
  - 🔴 **L5** (Sub-Agent)

### 4. 🎛 Partnership Configuration Matrix (`/partnership`)
- Dynamic matrix editor for **Cricket**, **Tennis**, and **Football**.
- Interactive sliders to adjust **Given %** and **Remaining %**.
- Real-time validation and recursive downline cascading.

### 5. 💰 Transactions & Live Revenue Simulator (`/transactions`)
- **Quick Presets**: 1-click preset simulation buttons for IPL Cricket, Wimbledon Tennis, and Champions League Football.
- **Interactive Waterfall Simulator**: Computes exact mathematical formulas (e.g. `Raj Singh (L3): ₹10,000 × 20% = ₹2,000` up to `Platform Owner: ₹10,000 × 20% = ₹2,000`).
- **Visual 100% Cake Bar**: Visualizes the total revenue distribution across all active tiers.

### 6. 📈 Reports & Analytics (`/reports`)
- Cumulative earnings breakdown per partner across all levels (including Owner pool).
- Net earnings ledger by sport.

---

## ⚙️ Getting Started

```bash
npm install
npm start
```

Navigate to **`http://localhost:4200/`**.
