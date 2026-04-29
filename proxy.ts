// export { auth as proxy } from "@/auth"
import { auth } from "@/auth"

// Next.js mengharapkan default export atau fungsi bernama 'proxy'
export default auth

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}