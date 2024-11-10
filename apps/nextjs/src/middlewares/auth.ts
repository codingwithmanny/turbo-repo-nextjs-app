// Imports
// ============================================================
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import type { CustomMiddleware } from "@/middlewares/chainMiddleware";

// Functions
// ============================================================
/*
 * Helper function to create the exclude urls in a "dynamic" way
 * Even with the "rewrite" option in the `i18n` middleware
 * the value of `pathname` is always `/[locale]/[pathname]`
 *
 * @dev Restarts the server when changing this
 */
// @TODO: Add the path for the update post
function getExcludePaths({ currentLanguage }: { currentLanguage: string }) {
  return ["/auth/signin", "/auth/signup", "/api/auth/email", "/api/auth/verify"];
  // return [`/${currentLanguage}/auth`];
}

export function withAuth(middleware: CustomMiddleware) {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse
  ) => {
    const pathname = request.nextUrl.pathname;
    const origin = request.nextUrl.origin;

    if (
      getExcludePaths({
        currentLanguage: request.headers.get("x-next-locale") ?? "en",
      }).includes(pathname)
    ) {
      return middleware(request, event, response);
    }

    const verifyRequest = await fetch(`${origin}/api/auth/verify`, {
      headers: { Cookie: await (cookies()).toString() },
    });

    const verifySession = (await verifyRequest.json()) as {
      valid: boolean;
    };

    if (!verifySession.valid) {
      /*
       * since every site has it's own requirements
       * we do not provide a dedicated auth page
       *
       * But here an example how you could redirect the user
       * in case we weren't able to verify the session
       */
      response = NextResponse.redirect(new URL("/auth/signin", request.nextUrl));
    }

    return middleware(request, event, response);
  };
};
