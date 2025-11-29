import { NextResponse } from "next/server";
import { SESSION_TOKEN_LOCAL, SESSION_USER_LOCAL } from "~/lib/session";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });

  // remove multiple cookies
  res.cookies.set(SESSION_TOKEN_LOCAL, "", { expires: new Date(0), path: "/" });
  res.cookies.set(SESSION_USER_LOCAL, "", { expires: new Date(0), path: "/" });

  return res;
}
