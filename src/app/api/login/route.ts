// app/api/login/route.ts
import { cookies } from "next/headers";
import { httpClient } from "~/api";
import { httpServer } from "~/app/libs/server-http";
import { handleAfterLogin } from "~/lib/session";
import { LoginResponse } from "~/types/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  console.log("POST", email, password);

  // Gửi sang .NET để verify hoặc tự verify ở đây...
  // const token = await loginApi(email, password);

  try {
    const userRes = await (
      await httpServer()
    ).post<LoginResponse>("/api/auth/login", {
      email,
      password,
    });

    console.log("login success", userRes);
    const { token, ...userData } = userRes.data;

    const cookie = await cookies();
    handleAfterLogin(cookie, token, userData);

    return new Response(JSON.stringify(userRes.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    console.log("err");
    return new Response(JSON.stringify(err), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
