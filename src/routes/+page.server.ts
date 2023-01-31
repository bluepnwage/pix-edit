import type { Preset } from "$lib/default-presets";
import type { ServerLoad } from "@sveltejs/kit";
import type { ImageFormats } from "$lib/download-image";

export const prerender = false;
type Formats = Record<ImageFormats, boolean>;

export const load = (({ cookies }) => {
  const cookie = cookies.get("presets");
  const formatsCookie = cookies.get("formats");
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
    presets: data,
    formats: formatsCookie ? (JSON.parse(formatsCookie).formats as Formats) : null
  };
}) satisfies ServerLoad;
