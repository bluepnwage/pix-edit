import type { RequestHandler } from "./$types";

export const POST = (async ({ cookies, request }) => {
  const data = await request.json();
  cookies.set("formats", JSON.stringify(data), { path: "/" });
  return new Response("Hello there", { status: 200 });
}) satisfies RequestHandler;
