import { cookies } from "next/headers";

export const PUT = async (
  req: Request,
  { params }: { params: { key: string } }
) => {
  const body = await req.json();
  const key = params.key;
  const cookie = await cookies();

  console.log(body);
  cookie.set(key, JSON.stringify(body));

  return new Response(JSON.stringify({ [key]: body }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
