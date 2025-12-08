import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { httpClient } from "~/api";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";

async function getBackendToken() {
  const session = await getServerSession(authOptions);
  // Lấy token từ session đã được cấu hình trong [...nextauth]
  return (session as any)?.backendToken;
}

// GET /api/movie/[id]/comment
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const movieId = params.id;
  try {
    // Gọi thẳng đến backend, không cần token cho việc xem comment
    const result = await httpClient.get(`/api/movie/${movieId}/comment`);
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
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getBackendToken();

    if (!token) {
      return NextResponse.json(
        { message: "Authentication required. Please log in." },
        { status: 401 }
      );
    }

    const { content, parentId } = await req.json();
    const movieId = params.id;

    // Gọi đến API backend với token xác thực
    const result = await httpClient.post(
      `/api/movie/${movieId}/comment`,
      { content, parentId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(result.data);
  } catch (err: any) {
    console.error("[API POST COMMENT] Error:", err.response?.data || err.message);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: err.response?.status || 500 }
    );
  }
}
