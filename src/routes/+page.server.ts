import type { Preset } from "$lib/default-presets";
import type { ServerLoad } from "@sveltejs/kit";

export const prerender = false;

export const load = (({ cookies }) => {
  const cookie = cookies.get("presets");
  let data: Preset[] = [];
  if (cookie) {
    const presetStrings = cookie.split(",");
    data = presetStrings.map((string) => {
      const [name, size, id] = string.split("-");
      return {
        name,
        size: parseInt(size),
        id
      };
    });
  }
  return {
    presets: data
  };
}) satisfies ServerLoad;
