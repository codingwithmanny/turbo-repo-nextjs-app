// Imports
// ============================================================
import { chainMiddleware } from "@/middlewares/chainMiddleware";
import { withAuth } from "@/middlewares/auth";
// import { withI18n } from "~/middlewares/i18n"

/**
 * The auth middleware is disabled and provides more a way
 * of "How could it be" - Based on https://pilcrowonpaper.com/blog/middleware-auth/
 * you should think about "how to secure your pages"
 *
 * This example is based on a "node environment" and requires
 * an internal api endpoint to check the session
 */
export default chainMiddleware([/*withI18n*/ withAuth])

export const config = {
  // This regex matches any path EXCEPT:
  // - /api/*         (API routes)
  // - /static/*      (Static files)
  // - .*\\..*        (Files with extensions like .jpg, .css etc)
  // - /_next/*       (Next.js internal files)
  // - /favicon.ico   (Favicon)
  // - /robots.txt    (Robots file)
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};