import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { httpClient } from "~/api";
import { SESSION_TOKEN_LOCAL } from "~/lib/session";
import { CommentModel } from "~/types/comment";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// GET: Lấy danh sách comments
export async function GET(
  req: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_TOKEN_LOCAL)?.value;

    // Gọi external API với token trong header nếu có
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await httpClient.get<CommentModel[]>(
      `/api/movie/${id}/comment`,
      {
        headers,
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching comments:", error);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Failed to fetch comments";
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}

// POST: Tạo comment mới
export async function POST(
  req: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { content, parentId } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_TOKEN_LOCAL)?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Gọi external API với token trong header
    const response = await httpClient.post<CommentModel>(
      `/api/movie/${id}/comment`,
      { content, parentId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    console.error("Error creating comment:", error);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Failed to create comment";
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}

