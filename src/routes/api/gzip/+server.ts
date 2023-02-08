import type { RequestHandler } from "@sveltejs/kit";
import archiver from "archiver";
import fs from "fs/promises";
import path from "path";
import { createReadStream } from "fs";

const archive = archiver("zip", {
  zlib: { level: 9 } // Sets the compression level.
});

export const GET = (async () => {
  const files = await fs.readdir(path.join(process.cwd(), "test"));
  const stream = new Promise<ReadableStream<Uint8Array>>((resolve) => {
    const myStream = new ReadableStream({
      start: async (controller) => {
        archive.on("data", (data) => {
          controller.enqueue(new Uint8Array(data));
        });
        archive.on("finish", () => {
          controller.close();
          resolve(myStream);
        });
      }
    });
  });

  files.forEach((file) =>
    archive.append(createReadStream(path.join(process.cwd(), "test", file)), { name: path.basename(file) })
  );
  await archive.finalize();
  const streamData = await stream;

  return new Response(streamData);
}) satisfies RequestHandler;
