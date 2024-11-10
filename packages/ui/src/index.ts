// Imports
// ============================================================
import { cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

// Scripts
// ============================================================
const cn = (...inputs: Parameters<typeof cx>) => twMerge(cx(inputs));

// Exports
// ============================================================
export { cn };
