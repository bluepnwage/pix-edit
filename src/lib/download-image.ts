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
  link.href = URL.createObjectURL(blob);
  link.download = `${config.imageName}-${config.preset}`;
  document.body.appendChild(link);

  link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
  document.body.removeChild(link);
  return downloadImage(publicID, config, rest);
}
