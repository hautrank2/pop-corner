// app/api/login/route.ts
import { cookies } from "next/headers";
import { httpClient } from "~/api";
import { handleAfterLogin } from "~/lib/session";
import { LoginResponse } from "~/types/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  // Gửi sang .NET để verify hoặc tự verify ở đây...
  // const token = await loginApi(email, password);

  try {
    const userRes = await httpClient.post<LoginResponse>("/api/auth/login", {
      email,
      password,
    });
    const { token, ...userData } = userRes.data;

    const cookie = await cookies();
    handleAfterLogin(cookie, token, userData);

    return new Response(JSON.stringify(userRes.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    return new Response(JSON.stringify(err), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
