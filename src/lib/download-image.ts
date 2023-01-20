import { cloudinary } from "./cloudinary";
import { Resize } from "@cloudinary/url-gen/actions";

export type ImageFormats = "webp" | "jpg" | "png";

type Config = {
  width: number;
  imageName: string;
  preset: string;
};

export async function downloadImage(publicID: string, config: Config, format: ImageFormats[]): Promise<void> {
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
