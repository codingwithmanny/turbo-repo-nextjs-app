// Imports
// ============================================================
/**
 * Source: https://github.com/HamedBahram/next-middleware-chain
 * Author: https://github.com/HamedBahram
 */
import type { NextMiddlewareResult } from "next/dist/server/web/types";
import type { NextFetchEvent, NextRequest, NextResponse } from "next/server";

// Types
// ============================================================
export type CustomMiddleware = (
  request: NextRequest,
  event: NextFetchEvent,
  response: NextResponse,
) => NextMiddlewareResult | Promise<NextMiddlewareResult>;

type MiddlewareFactory = (middleware: CustomMiddleware) => CustomMiddleware;

// Functions
// ============================================================
export function chainMiddleware(
  functions: MiddlewareFactory[],
  index = 0,
): CustomMiddleware {
  const current = functions[index]

  if (current) {
    const next = chainMiddleware(functions, index + 1)
    return current(next)
  }

  return (
    _request: NextRequest,
    _event: NextFetchEvent,
    response: NextResponse,
  ) => {
    return response
  }
};