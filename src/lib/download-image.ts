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

async function downloadImage(publicID: string, config: Config, format: ImageFormats[]): Promise<void> {
  if (format.length === 0) return;
  const [first, ...rest] = format;
  const image = cloudinary.image(publicID);
  image.resize(Resize.scale().width(config.width));
  image.format(first);

  const res = await fetch(image.toURL());

  const link = document.createElement("a");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = `${config.imageName}-${config.preset}`;
  document.body.appendChild(link);

  link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
  fetch("/api/delete-image", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: publicID })
  });
  return downloadImage(publicID, config, rest);
}

type UploadOptions = {
  selectedFormats: Record<ImageFormats, boolean>;
  presets: Preset[];
};

export async function submitFiles(file: File | null, options: UploadOptions) {
  if (!file) return;
  const formats = Object.entries(options.selectedFormats)
    .filter(([, value]) => value)
    .map(([key]) => key) as ImageFormats[];
  const fileName = file.name.split(".")[0];
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", presetName);

  const res = await fetch(endpoint, {
    method: "POST",
    body: formData
  });
  if (res.ok) {
    const json = (await res.json()) as CloudinaryResponse;
    let promises = [];

    promises = options.presets.map((preset) => {
      return downloadImage(
        json.public_id,
        {
          width: preset.size,
          preset: preset.name,
          imageName: fileName
        },
        formats
      );
    });

    await Promise.all(promises);
    file = null;
  }
}
