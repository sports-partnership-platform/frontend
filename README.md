# ⚡ Sports Partnership Platform — Frontend Application

Modern, glassmorphic Single Page Application (SPA) for the **Sports Partnership & Multi-Level Commission Management Platform**. Built with **Angular 19** (Standalone Components, RxJS, Signals) and Tailwind CSS / custom design tokens.

---

## 📋 Table of Contents
- [Overview & Core Highlights](#-overview--core-highlights)
- [Key Features & Modules](#-key-features--modules)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Connecting to Backend API](#-connecting-to-backend-api)
- [Application Pages](#-application-pages)
- [Building for Production](#-building-for-production)
- [UI / UX Design System](#-ui--ux-design-system)

---

## 🎯 Overview & Core Highlights

The Sports Partnership Frontend provides an intuitive, high-performance command center for managing complex multi-tier sporting commission distribution networks (Level 1 to Level 5):
- **Live Revenue Share Simulator**: Visual 100% "Cake Distribution" breakdown bar with instant formula computation.
- **Hierarchical Network Visualizer**: Interactive partner tree with level indicators, uplines, and downline metrics.
- **Partnership Matrix**: Granular per-sport percentage control (Received %, Given %, Remaining %).
- **Auditable Transaction Log**: Full transaction ledger with per-level percentage and currency breakdowns.
- **Dark Glassmorphic UI**: Tailored color palette, glowing indicators, responsive layouts, and modern typography (Outfit & Inter).

---

## 🌟 Key Features & Modules

### 1. 📊 Executive Dashboard (`/dashboard`)
- Real-time platform KPI cards: **Total Revenue**, **Distributed Commission**, **Active Partners (L1-L5)**, and **Active Sports**.
- Sport-wise breakdown cards with quick percentages.
- Recent commission transactions with instant formula popovers.
- Quick navigation shortcuts.

### 2. 👥 Partners Management (`/partners`)
- Search, filter by Level (L1 to L5), and paginate partners.
- Add new partners with dynamic parent selection (automatically assigns level $N+1$).
- Detailed partner view modal showing uplines chain, downlines count, and active sports commission splits.
- Edit and delete partner records with real-time refresh.

### 3. 🌳 Visual Hierarchy Tree (`/hierarchy`)
- Visual multi-tier tree rendering from Level 1 (Master / Founder) down to Level 5 (Agents).
- Level badges with tailored gradient themes:
  - 🟡 **L1** (Gold / Amber)
  - 🔵 **L2** (Cyan / Sky)
  - 🟢 **L3** (Emerald / Mint)
  - 🟣 **L4** (Purple / Violet)
  - 🔴 **L5** (Rose / Pink)
- Inspect partner node to view their immediate downlines and commission allocations.

### 4. 🎛 Partnership Configuration Matrix (`/partnership`)
- Dynamic matrix editor for **Cricket**, **Tennis**, and **Football**.
- Interactive sliders / numeric steppers to adjust **Given %** and **Remaining %**.
- Real-time validation preventing over-allocation beyond received percentages.

### 5. 💰 Transactions & Live Commission Calculator (`/transactions`)
- **Interactive Calculator**: Select a Partner, choose Sport, enter Transaction Amount (e.g., ₹10,000) and click **"Calculate Commission"**.
- **Visual 100% Cake Bar**: Visualizes how the total amount is distributed across all upline tiers up to Level 1.
- **Formulas Display**: Displays exact formulas (e.g., `Raj Singh (L3): ₹10,000 × 50% = ₹5,000`).
- **One-Click Record**: Persists the transaction into the backend ledger.
- **History Table**: Search and filter past transactions with exportable audit details.

### 6. 📈 Reports & Analytics (`/reports`)
- Cumulative earnings breakdown per partner across levels.
- Sport performance analytics and revenue contribution graphs.
- Filter by date, sport, or partner level.

---

## 🛠 Tech Stack

- **Framework**: Angular 19 (Standalone Components Architecture)
- **Language**: TypeScript 5.6
- **Routing**: Angular Router (Lazy-loaded standalone routes)
- **HTTP / Async**: Angular `HttpClient`, RxJS
- **Styling**: Tailwind CSS, Custom Glassmorphism CSS utilities, Google Fonts (`Inter` & `Outfit`)
- **Icons**: Inline SVG / Heroicons styling

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── models/
│   │   │   │   ├── partner.model.ts      # TypeScript interfaces for Partners & Trees
│   │   │   │   ├── sport.model.ts        # Sport interface
│   │   │   │   └── transaction.model.ts  # Transaction & Breakdown models
│   │   │   └── services/
│   │   │       └── api.service.ts        # Central HTTP client service
│   │   ├── features/
│   │   │   ├── dashboard/                # Dashboard component & KPIs
│   │   │   ├── hierarchy/                # Visual hierarchy tree component
│   │   │   ├── partners/                 # Partners list, CRUD modals
│   │   │   ├── partnership/              # Percentage matrix config
│   │   │   ├── reports/                  # Analytics & earnings reports
│   │   │   └── transactions/             # Live simulator & transaction ledger
│   │   ├── app.component.html            # Main sidebar layout & topbar
│   │   ├── app.component.ts
│   │   ├── app.component.css
│   │   ├── app.config.ts                 # App-wide providers (HttpClient, Router)
│   │   └── app.routes.ts                 # Lazy-loaded route declarations
│   ├── index.html                        # Google fonts & meta tags
│   ├── main.ts                           # Angular bootstrap entry
│   └── styles.css                        # Glassmorphic design system & tokens
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm start
# or: npx ng serve --open
```

Navigate to **`http://localhost:4200/`**. The app automatically reloads when you change any source files.

---

## 🔌 Connecting to Backend API

The application connects to the backend API via [src/app/core/services/api.service.ts](file:///c:/Users/user/Desktop/Sports%20Partnership%20Platform/frontend/src/app/core/services/api.service.ts):
```typescript
private baseUrl = 'http://localhost:5000/api';
```

Ensure the backend server is running on `http://localhost:5000` (or update `baseUrl` in `api.service.ts` if running on a different port/host).

---

## 📱 Application Pages

| Path | Component | Description |
|---|---|---|
| `/dashboard` | `DashboardComponent` | Platform KPIs, volume, sport split, recent transactions |
| `/partners` | `PartnersComponent` | Partner directory, create/edit modals, downline drawer |
| `/hierarchy` | `HierarchyComponent` | Multi-level tree network visualizer (L1 to L5) |
| `/partnership` | `PartnershipComponent` | Sport-wise percentage allocation matrix |
| `/transactions` | `TransactionsComponent` | Live revenue simulator & transaction history |
| `/reports` | `ReportsComponent` | Partner-wise & Sport-wise earnings analytics |

---

## 📦 Building for Production

To create an optimized production build:
```bash
npm run build
```

The output artifacts will be placed in the `dist/sports-partnership-frontend` directory. The backend Node.js server is preconfigured to serve these static files directly.

---

## 🎨 UI / UX Design System

- **Background**: Deep space obsidian (`#070b14` / `#090d16`)
- **Card Panels**: Translucent slate with 16px backdrop blur (`rgba(15, 23, 42, 0.85)`)
- **Accent Gradients**:
  - Primary Action: Indigo to Violet (`#6366f1` → `#4f46e5`)
  - Success / Active: Emerald to Cyan (`#34d399` → `#06b6d4`)
- **Level Color Matrix**:
  - `L1`: Amber (`#f59e0b`)
  - `L2`: Sky (`#0ea5e9`)
  - `L3`: Emerald (`#10b981`)
  - `L4`: Violet (`#8b5cf6`)
  - `L5`: Rose (`#f43f5e`)
