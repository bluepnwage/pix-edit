import type { Preset } from "$lib/default-presets";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request, cookies }) => {
  const json = (await request.json()) as { presets: Preset[] };

  const data = json.presets.map((preset) => `${preset.name}-${preset.size}-${preset.id}`);
  const cookieData = data.join(",");
  cookies.set("presets", cookieData, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return new Response("Presets saved");
}) satisfies RequestHandler;

export const DELETE = (async ({ cookies, request, url }) => {
  const json = (await request.json()) as { presets: Preset[] };
  const shouldDel = parseInt(url.searchParams.get("delete") || "0");
  if (shouldDel) {
    cookies.delete("presets", { path: "/" });
  } else {
    const data = json.presets.map((preset) => `${preset.name}-${preset.size}-${preset.id}`);
    cookies.set("presets", data.join(","), { path: "/" });
  }
  return new Response("Presets deleted");
}) satisfies RequestHandler;
