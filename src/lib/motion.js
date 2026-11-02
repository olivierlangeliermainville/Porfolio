/** The visitor asked for less motion in their OS settings */
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Check it before any JS animation: skip it, or jump straight to the end state
 *
 * @example
 * if (prefersReducedMotion()) return;
 */
export const prefersReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;
