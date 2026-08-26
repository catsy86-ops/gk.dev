# Agent Skills Project Instructions (`skills.md`)

This is the primary project-level instruction file for working with Agent Skills in the **GK.dev** codebase. It defines how Gemini CLI and AI coding agents must utilize, select, and combine the skills located in `.agents/skills/`.

---

## 1. Core Principles & Skill Workflow

1. **Pre-Task Skill Inspection**:
   - Always inspect available skills in `.agents/skills/` before starting any development, refactoring, or audit task.
   - Do not ignore an applicable skill. If a skill matches the user's intent or domain, you **MUST** read its `SKILL.md` and follow its prescribed procedures.

2. **Skill Selection & Combination**:
   - Use the most relevant skill for the specific domain (UI/UX, testing, i18n, SEO, quality gate).
   - If multiple skills apply (e.g., building a new UI component requiring accessibility, i18n, and testing), combine their workflows systematically:
     - `frontend-design` + `component-architect` for UI layout, aesthetics, and component architecture.
     - `i18n-synchronizer` for dictionary key symmetry.
     - `quality-gate` for final verification.
   - Prefer project-specific skills (e.g., `component-architect`, `quality-gate`) over generic default patterns.

3. **Codebase Understanding Before Modification**:
   - Inspect the current codebase architecture (`AGENTS.md`, `src/App.tsx`, `src/index.css`, component hierarchy) before making modifications.
   - Never blindly overwrite existing code. Always view target files and check existing conventions.
   - Keep modifications minimal, surgical, and strictly focused on the user's request.
   - Avoid creating unnecessary files, redundant dependencies, unneeded wrappers, or bloated configuration.

4. **Production Engineering Quality**:
   - **TypeScript & Linting**: Enforce strict zero-warning policy (`noUnusedLocals: true`, `noUnusedParameters: true`).
   - **Animation Library**: Import animations strictly from `motion/react` (never `framer-motion`).
   - **UI & Frontend**: For all frontend tasks, activate `frontend-design` and prioritize visual hierarchy, typography scaling (`clamp()`), token-based HSL theming, responsive behavior, touch targets (min. 44x44px), and polished tactile interactions (sound + haptics).
   - **Accessibility (A11y)**: Adhere to WCAG 2.1 AA standards (color contrast min 4.5:1, `:focus-visible` rings, `role="dialog"`, `aria-invalid`, `aria-describedby`, `aria-modal`).

5. **Post-Implementation Verification**:
   - After completing code changes, run the `quality-gate` verification suite (`npx tsc --noEmit`, `npm run lint`, `npm run test`, `npm run build`). Fix any regressions immediately.

---

## 2. Skill Decision Matrix

Use the following decision flow to choose the right skill for each task:

| Task Domain | Primary Skill | Supporting Skill(s) | Key Actions & Focus |
|---|---|---|---|
| **New UI Component / Redesign** | `component-architect` | `frontend-design`, `i18n-synchronizer` | Create HSL token-based, animated (`motion/react`), bilingual, accessible components with sound/haptics. |
| **Visual Styling / Aesthetics** | `frontend-design` | `component-architect` | Refine typography, spacing, depth, glassmorphism, micro-interactions, dark/light contrast. |
| **Code Verification & CI/CD** | `quality-gate` | `e2e-playwright-tester` | Run `npm run lint`, `tsc --noEmit`, Vitest unit tests, and production build check. |
| **End-to-End Testing** | `e2e-playwright-tester` | `quality-gate` | Automate user journeys in Chromium (forms, modal dismissal, command palette, theme toggle). |
| **Translations & Bilingual Support** | `i18n-synchronizer` | `component-architect` | Verify 100% symmetry between PL and EN dictionaries in `i18n-dictionary.ts`. |
| **SEO, Metadata & Schema** | `seo-and-schema-optimizer` | `quality-gate` | Optimize OpenGraph, JSON-LD structured data, Twitter Cards, semantic HTML5 tags. |
| **Performance & Security** | `performance-and-security-audit` | `quality-gate` | Audit Core Web Vitals, sub-second TTFB, CSP headers, Clerk Auth session management. |
| **Vercel Deployments & Routing** | `vercel-deployment-manager` | `quality-gate` | Configure vercel.json, SPA rewrites, security headers, caching and build diagnostics. |
| **3D Graphics & WebGL Optimization** | `threejs-webgl-optimizer` | `performance-and-security-audit` | GPU memory management (dispose), 60 FPS lock, pixelRatio limits, mobile fallbacks in StatsSection. |
| **PWA & Offline Functionality** | `pwa-and-offline-guardian` | `quality-gate` | Service Worker caching strategies, webmanifest standards, install prompt, Lighthouse compliance. |
| **AI Assistant & Knowledge Base** | `ai-rag-architect` | `supabase` | AI estimation engine, RAG knowledge retrieval, pgvector semantic search, prompt engineering. |
| **Browser Interaction & Scraping** | `browser-use` | `e2e-playwright-tester` | Automated CDP browser testing, UI visual inspection, screenshot validation. |

---

## 3. Implementation Guidelines for GK.dev

- **Path Aliases**: Always use `@/*` for `src/*` imports (e.g. `import { Button } from "@/components/ui/button"`).
- **Theme Variables**: Use HSL variables defined in `src/index.css` (e.g. `bg-card`, `text-primary`, `border-border`).
- **Modals & Overlays**: Always mount via `createPortal(..., document.body)` with `useScrollLock(isOpen)` and `Escape` key listener.
- **Form Security**: Use `sanitizeInput()` and `validateForm()` from `@/lib/validation` with strict RFC 5322 regex checks.
