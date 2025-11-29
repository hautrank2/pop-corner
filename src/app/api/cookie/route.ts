import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const keysParam = url.searchParams.get("keys");

    if (!keysParam) {
      return NextResponse.json(
        { error: "Missing query param 'keys'" },
        { status: 400 }
      );
    }

    // Parse keys from comma-separated list
    const keys = keysParam.split(",").map((k) => k.trim());

    const cookieStore = await cookies();
    const results: Record<string, string | null> = {};

    // Fetch each cookie
    keys.forEach((key) => {
      const value = cookieStore.get(key)?.value ?? null;
      results[key] = value;
    });

    return NextResponse.json(results, { status: 200 });
  } catch (err) {
    console.error("Error reading cookies:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
