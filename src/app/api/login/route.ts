// app/api/login/route.ts
import { cookies } from "next/headers";
import { httpClient } from "~/api";
import {
  SESSION_MAX_AGE,
  SESSION_TOKEN_LOCAL,
  SESSION_USER_LOCAL,
} from "~/lib/session";
import { LoginResponse } from "~/types/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  // Gửi sang .NET để verify hoặc tự verify ở đây...
  // const token = await loginApi(email, password);

  const userRes = await httpClient.post<LoginResponse>("/api/auth/login", {
    email,
    password,
  });
  const { token, ...userData } = userRes.data;

  const cookie = await cookies();
  cookie.set(SESSION_TOKEN_LOCAL, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE, // 1 ngày
  });

  cookie.set(SESSION_USER_LOCAL, JSON.stringify(userData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE, // 1 ngày
  });

  return new Response(JSON.stringify(userRes.data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
