import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_USER_LOCAL } from "~/lib/session";

export async function GET() {
  try {
    const cookie = await cookies();
    const userJson = cookie.get(SESSION_USER_LOCAL) ?? "";
    if (typeof userJson === "string") {
      const userData = JSON.parse(userJson);
      return NextResponse.json(userData, { status: 200 });
    }
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
  return NextResponse.json("User not found", { status: 404 });
}
