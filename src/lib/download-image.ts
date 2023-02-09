import { cloudinary } from "./cloudinary";
import { Resize } from "@cloudinary/url-gen/actions";
import { endpoint, presetName, type CloudinaryResponse } from "$lib/cloudinary";
import type { Preset } from "./default-presets";

export type ImageFormats = "webp" | "jpg" | "png";

type Config = {
  width: number;
  imageName: string;
  preset: string;
};

export type DownloadData = {
  width: number;
  preset: string;
  imageName: string;
};

export async function downloadImage(
  publicID: string,
  config: Config,
  format: ImageFormats,
  updateProgress: (data: number) => void
) {
  const image = cloudinary.image(publicID);
  image.resize(Resize.scale().width(config.width));
  image.format(format);

  const res = await fetch(image.toURL());
  const reader = res.body?.getReader()!;
  const contentLength = parseInt(res.headers.get("content-length") || "0");
  console.log(contentLength);
  const stream = new ReadableStream<Uint8Array>({
    start: async (controller) => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          break;
        } else {
          updateProgress((value.byteLength / contentLength) * 100);
          controller.enqueue(value);
        }
      }
    }
  });
  const headers = new Headers();
  headers.set("content-type", `image/${format}`);
  const newRes = new Response(stream, { headers });
  const blob = await newRes.blob();
  const url = URL.createObjectURL(blob);

  fetch("/api/delete-image", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: publicID })
  });
  return url;
}

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", presetName);
  const res = await fetch(endpoint, {
    method: "POST",
    body: formData
  });
  if (res.ok) {
    const json = (await res.json()) as CloudinaryResponse;
    return json.public_id;
  } else {
    throw new Error("There was an error");
  }
}

export async function downloadGzip(public_id: string, downloads: Record<ImageFormats, DownloadData[]>) {
  const data = await Promise.all(
    Object.entries(downloads).map(async ([key, value]) => {
      const format = key as ImageFormats;
      const test = await Promise.all(
        value.map(async (d) => {
          return {
            name: `${d.imageName}-${d.preset}`,
            url: await downloadImage(public_id, d, key as ImageFormats, () => {})
          };
        })
      );
      return { format, test };
    })
  );
  const promises = await Promise.all(
    data.map(async (t) => {
      const d = await Promise.all(
        t.test.map(async (g) => {
          const res = await fetch(g.url);
          const blob = await res.blob();
          return { name: `${g.name}.${t.format}`, blob };
        })
      );
      return d;
    })
  );
  const arr = promises.flat();
  const formData = new FormData();
  arr.forEach((file) => {
    formData.append("file", file.blob, file.name);
  });
  const res = await fetch("/api/gzip", {
    method: "POST",
    body: formData
  });
  if (res.ok) {
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pix-edit-${crypto.randomUUID()}.zip`;
    a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));

    setTimeout(() => URL.revokeObjectURL(url), 200);
    console.log("nice");
  }
}
