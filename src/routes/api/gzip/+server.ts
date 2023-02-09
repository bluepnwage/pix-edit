import type { RequestHandler } from "@sveltejs/kit";
import archiver from "archiver";

export const POST = (async ({ request }) => {
  const archive = archiver("zip", {
    zlib: { level: 9 } // Sets the compression level.
  });
  const json = (await request.formData()).getAll("file") as Blob[];
  const buffers = await Promise.all(
    json.map(async (file) => {
      return {
        name: file.name,
        buffer: await file.arrayBuffer()
      };
    })
  );
  const stream = new Promise<ReadableStream<Uint8Array>>((resolve, reject) => {
    const myStream = new ReadableStream({
      start: (controller) => {
        archive.on("data", (data) => {
          controller.enqueue(new Uint8Array(data));
        });
        archive.on("finish", () => {
          controller.close();
          resolve(myStream);
        });
        archive.on("error", (error) => {
          controller.error(error);
          reject(error);
        });
      }
    });
  });
  buffers.forEach((file) => {
    archive.append(Buffer.from(file.buffer), { name: file.name });
  });

  await archive.finalize();
  const streamData = await stream;
  return new Response(streamData);
}) satisfies RequestHandler;
