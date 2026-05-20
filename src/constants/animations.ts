/**
 * Shared animation constants — single source of truth (DRY).
 * Keeps magic numbers out of components and makes tweaking easy.
 */

export const EASE_STANDARD = [0.25, 0.4, 0.25, 1] as [number, number, number, number];
export const EASE_SPRING_STIFF = { type: "spring", stiffness: 300, damping: 30 } as const;
export const EASE_SPRING_SOFT = { type: "spring", stiffness: 200, damping: 20 } as const;

/** Reusable fade-up variant factory */
export const fadeUpVariant = (delay = 0, duration = 0.7) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration, ease: EASE_STANDARD },
  },
});

/** Stagger container variant */
export const staggerContainer = (stagger = 0.08, delayChildren = 0.2) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

/** Card entrance variant */
export const cardVariant = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: EASE_STANDARD },
  },
};

// ─── Typewriter ────────────────────────────────────────────────────────────────
export const TYPEWRITER_TYPING_SPEED = 80;
export const TYPEWRITER_DELETING_SPEED = 50;
export const TYPEWRITER_PAUSE_TIME = 2000;

// ─── Particles ─────────────────────────────────────────────────────────────────
export const PARTICLE_COUNT_DESKTOP = 80;
export const PARTICLE_COUNT_MOBILE = 40;
export const PARTICLE_CONNECTION_DISTANCE = 120;

// ─── Cursor ────────────────────────────────────────────────────────────────────
export const CURSOR_TRAIL_MAX = 8;
export const CURSOR_TRAIL_MIN_DISTANCE = 15;

// ─── Scroll ────────────────────────────────────────────────────────────────────
export const NAVBAR_SCROLL_THRESHOLD = 40;

// ─── Toast ─────────────────────────────────────────────────────────────────────
export const TOAST_LIMIT = 1;
export const TOAST_REMOVE_DELAY = 4000;

// ─── Loading ───────────────────────────────────────────────────────────────────
export const LOADING_DURATION_MS = 1200;
export const LOADING_EXIT_DURATION_MS = 600;
