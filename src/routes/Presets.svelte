<script lang="ts">
  let loaded = 0;

  let src = "";
  const fetchImage = async () => {
    const res = await fetch(
      "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    );
    const contentLength = res.headers.get("content-length");
    console.log(contentLength);
    const total = parseInt(contentLength as string);

    const stream = new ReadableStream({
      start: async (controller) => {
        const reader = res.body?.getReader();
        await read();
        async function read() {
          const t = await reader?.read();
          const length = t?.value?.byteLength || 0;
          if (t?.done) {
            controller.close();
            return;
          }
          loaded += Math.round((length / total) * 100);
          controller.enqueue(t?.value);
          await read();
        }
      }
    });
    return new Response(stream);
  };
  const bruh = async () => {
    const test = await fetchImage();
    const blob = await test.blob();
    const url = URL.createObjectURL(blob);
    src = url;
  };
</script>

<button on:click={bruh}>Fetch image</button>

<p>Bytes loaded: {loaded}%</p>

<img {src} alt={"Image"} />
