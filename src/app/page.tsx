import { cookies } from "next/headers";
import { SESSION_USER_LOCAL } from "~/lib/session";

export default async function Home() {
  const cookie = await cookies();
  const userData = cookie.get(SESSION_USER_LOCAL);
  return <div></div>;
}
