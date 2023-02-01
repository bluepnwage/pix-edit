import type { RequestHandler } from "./$types";

export const POST = (async ({ cookies, request }) => {
  const data = await request.json();
  cookies.set("formats", JSON.stringify(data), { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return new Response("Hello there", { status: 200 });
}) satisfies RequestHandler;
