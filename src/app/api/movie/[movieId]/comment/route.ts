import { NextRequest, NextResponse } from "next/server";
import { CommentModel } from "~/types/comment";

const commentsByMovie: Record<string, CommentModel[]> = {};
// ------------------------------------

interface RouteParams {
  params: {
    movieId: string;
  };
}

/**
 * Xử lý yêu cầu GET để lấy danh sách comment cho một phim
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { movieId } = params;
  const comments = commentsByMovie[movieId] || [];
  return NextResponse.json(comments);
}

/**
 * Xử lý yêu cầu POST để tạo một comment mới
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { movieId } = params;
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Nội dung comment không được để trống" },
        { status: 400 }
      );
    }

    // TODO: Lấy thông tin người dùng đang đăng nhập
    const newComment: CommentModel = {
      id: `comment-${Date.now()}`,
      author: {
        id: "user-1", // ID người dùng giả lập
        name: "Anonymous User", // Tên người dùng giả lập
        avatarUrl: "https://i.pravatar.cc/40",
      },
      content,
      createdAt: new Date().toISOString(),
      replies: [],
    };

    if (!commentsByMovie[movieId]) {
      commentsByMovie[movieId] = [];
    }
    commentsByMovie[movieId].unshift(newComment);

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi tạo comment:", error);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}

