import type { RequestHandler } from "@sveltejs/kit";
import cloudinary from "cloudinary";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "$env/static/private";
import { PUBLIC_CLOUDINARY_CLOUD_NAME } from "$env/static/public";

cloudinary.v2.config({
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  cloud_name: PUBLIC_CLOUDINARY_CLOUD_NAME
});

export const DELETE = (async ({ request }) => {
  const publicId = await request.json();
  await cloudinary.v2.uploader.destroy(publicId.id as string);
  return new Response(JSON.stringify({ message: "Thing deleted" }));
}) satisfies RequestHandler;
