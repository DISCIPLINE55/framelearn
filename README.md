# FrameLearn — Photography Portfolio, Client Service & Learning Platform

> Final-Year BSc Information Technology Education Project  
> **Team Members**: Ismail Ibrahim Mensah, Arafat Nabuku Jansu, Janet Antwi

---

## 1. Project Overview
**FrameLearn** is a web-based photography portfolio, client service booking, private gallery delivery, and educational platform built specifically for an independent professional photographer.

The application serves three core audiences:
1. **Public Visitors**: Explore photography portfolio and service offerings.
2. **Clients**: Book photo sessions, track status, and access private image proofing galleries.
3. **Learners / Aspiring Photographers**: Browse photography tutorials, workshop guides, and educational materials.

---

## 2. Project Status & Incremental Development Strategy
FrameLearn is developed strictly following an **incremental milestone gate process**:

```
REQUIREMENTS → DESIGN → IMPLEMENTATION → TESTING → INTERNAL REVIEW → LECTURER REVIEW → APPROVAL → NEXT MILESTONE
```

**Current Milestone**: **MILESTONE 001 — FOUNDATION, ARCHITECTURE & DESIGN SYSTEM** (Completed & Pending Review).

*Note: In accordance with project governance, no business features (Authentication, Bookings, Galleries, Learning, Payments) are implemented in Milestone 001.*

---

## 3. Approved Brand Identity & Color Palette
- **Primary Navy (`#10212B`)**: Headers, footers, primary headings, key controls.
- **Sage Green (`#8FA464`)**: Brand accents, secondary buttons, badges, highlights.
- **Light Cream (`#EFFBDD`)**: Surface backgrounds, card container fills, visual breathing space.

---

## 4. Recommended Technology Stack
- **Frontend Framework**: React 18 with TypeScript 5
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3 with custom tokens & CSS variables
- **Icons**: Lucide React
- **Backend / Database Client**: Supabase JS Client (`@supabase/supabase-js`)
- **Testing**: Vitest + React Testing Library + jsdom
- **CI / Automation**: GitHub Actions (`.github/workflows/ci.yml`)

---

## 5. Folder Architecture
```
framelearn/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docs/
│   ├── 01-project/
│   ├── 02-requirements/
│   ├── 03-design/
│   ├── 04-reviews/
│   ├── 05-testing/
│   └── 06-project-management/
│
├── public/
│   ├── favicon/
│   ├── icons/
│   └── images/
│
├── src/
│   ├── app/
│   │   ├── layouts/
│   │   ├── providers/
│   │   └── routes/
│   │
│   ├── components/
│   │   ├── forms/
│   │   ├── layout/
│   │   ├── media/
│   │   ├── navigation/
│   │   └── ui/
│   │
│   ├── config/
│   ├── constants/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── bookings/
│   │   ├── clients/
│   │   ├── dashboard/
│   │   ├── galleries/
│   │   ├── learners/
│   │   ├── learning/
│   │   ├── portfolio/
│   │   └── services/
│   │
│   ├── hooks/
│   ├── lib/
│   │   ├── database/
│   │   ├── security/
│   │   ├── storage/
│   │   └── validation/
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── theme.css
│   │
│   ├── types/
│   └── utils/
│
├── supabase/
│   ├── config.toml
│   ├── functions/
│   ├── migrations/
│   └── seed/
│
├── tests/
│   ├── e2e/
│   ├── integration/
│   ├── setup.ts
│   └── unit/
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 6. How to Run Locally

### Prerequisites
- Node.js v18+ (v20+ recommended)
- npm v9+

### Setup Instructions
1. **Clone & Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Run Unit Tests**:
   ```bash
   npm run test
   ```

5. **Type Check & Build**:
   ```bash
   npm run build
   ```

---

## 7. Development Rules & Governance
1. **Separation of Concerns**: Reusable UI primitives live in `src/components/ui/`. Feature code lives in `src/features/<feature>/`.
2. **Strict Typing**: No explicit `any` types; all props and domain data must be typed in `src/types/`.
3. **No Direct Secret Commits**: Environment secrets must be configured via `.env` files.
4. **No Premature Feature Implementation**: Milestone gates must be signed off by the lecturer before starting subsequent milestones.
