import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { SESSION_TOKEN_LOCAL } from "~/lib/session";

async function getBackendToken() {
  const cookieStore = await cookies();
  // Lấy token từ cookie đã được set khi login
  return cookieStore.get(SESSION_TOKEN_LOCAL)?.value;
}

// GET /api/movie/[id]/comment
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Promise and direct params (for Next.js 14/15 compatibility)
    let movieId: string;
    if (params && typeof params === 'object' && 'then' in params) {
      const resolved = await params;
      movieId = resolved.id;
    } else {
      movieId = (params as { id: string }).id;
    }
    // Gọi thẳng đến backend, không cần token cho việc xem comment
    const backendUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || process.env.API_ENDPOINT;
    const result = await axios.get(`${backendUrl}/api/movie/${movieId}/comment`);
    return NextResponse.json(result.data);
  } catch (err: any) {
    console.error("[API GET COMMENT] Error:", err.response?.data || err.message);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: err.response?.status || 500 }
    );
  }
}

// POST /api/movie/[id]/comment
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    console.log("[API POST COMMENT] Starting...");
    
    const token = await getBackendToken();
    console.log("[API POST COMMENT] Token:", token ? "Found" : "Not found");

    if (!token) {
      return NextResponse.json(
        { message: "Authentication required. Please log in." },
        { status: 401 }
      );
    }

    // Handle both Promise and direct params (for Next.js 14/15 compatibility)
    let movieId: string;
    try {
      if (params && typeof params === 'object' && 'then' in params) {
        const resolved = await params;
        movieId = resolved.id;
      } else {
        movieId = (params as { id: string }).id;
      }
      console.log("[API POST COMMENT] MovieId:", movieId);
    } catch (paramError: any) {
      console.error("[API POST COMMENT] Error parsing params:", paramError);
      return NextResponse.json(
        { message: "Invalid request parameters", error: paramError.message },
        { status: 400 }
      );
    }
    
    let body: any;
    try {
      body = await req.json();
      console.log("[API POST COMMENT] Body received:", body);
    } catch (jsonError: any) {
      console.error("[API POST COMMENT] Error parsing JSON:", jsonError);
      return NextResponse.json(
        { message: "Invalid JSON body", error: jsonError.message },
        { status: 400 }
      );
    }
    
    const { content, parentId } = body;

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json(
        { message: "Content is required" },
        { status: 400 }
      );
    }

    // Prepare payload - only include parentId if it exists
    const payload: { content: string; parentId?: string | null } = { content: content.trim() };
    if (parentId) {
      payload.parentId = parentId;
    }

    console.log("[API POST COMMENT] Sending to backend:", { movieId, payload });

    // Gọi đến API backend với token xác thực
    const backendUrl = process.env.NEXT_PUBLIC_API_ENDPOINT || process.env.API_ENDPOINT;
    if (!backendUrl) {
      console.error("[API POST COMMENT] Backend URL not configured");
      return NextResponse.json(
        { message: "Backend URL not configured" },
        { status: 500 }
      );
    }

    const result = await axios.post(
      `${backendUrl}/api/movie/${movieId}/comment`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log("[API POST COMMENT] Success:", result.data);
    return NextResponse.json(result.data);
  } catch (err: any) {
    console.error("[API POST COMMENT] Error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      stack: err.stack?.split('\n').slice(0, 5).join('\n'),
    });
    return NextResponse.json(
      { 
        message: "Server error", 
        error: err.message,
        details: err.response?.data 
      },
      { status: err.response?.status || 500 }
    );
  }
}
