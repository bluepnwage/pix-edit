import { Cloudinary } from "@cloudinary/url-gen";
import { PUBLIC_CLOUDINARY_CLOUD_NAME, PUBLIC_CLOUDINARY_CLOUD_PRESET } from "$env/static/public";

const cloudName = PUBLIC_CLOUDINARY_CLOUD_NAME;

export const cloudinary = new Cloudinary({
  cloud: {
    cloudName
  }
});

export const presetName = PUBLIC_CLOUDINARY_CLOUD_PRESET;
export const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

export type CloudinaryResponse = {
  public_id: string;
  version: string;
  width: number;
  height: number;
  format: string;
  created_at: string;
  resource_type: string;
  tags: any[];
  bytes: number;
  type: string;
  etag: string;
  url: string;
  secure_url: string;
  signature: string;
  original_filename: string;
};
