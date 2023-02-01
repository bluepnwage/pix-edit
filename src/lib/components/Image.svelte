<script lang="ts">
  import type { DownloadData, ImageFormats } from "$lib/download-image";
  import { downloadImage } from "$lib/download-image";
  import { onMount } from "svelte";
  export let image: DownloadData;
  export let format: ImageFormats;
  let progress = 0;
  let url = "";

  onMount(() => {
    downloadImage(
      image.public_id,
      { imageName: image.imageName, preset: image.preset, width: image.width },
      format,
      updateProgress
    ).then((string) => {
      url = string;
    });
  });

  const updateProgress = (data: number) => {
    progress += data;
  };
  const onClick = async () => {};
</script>

<div>
  <div class="flex justify-between">
    <div>
      <p>{image.imageName}-{image.preset}</p>
    </div>
    <div class="flex">
      <a href={url} download={`${image.imageName}-${image.preset}`} aria-label="Download image">
        <svg xmlns="http://www.w3.org/2000/svg" class="fill-emerald-700 scale-75" height="48" width="48"
          ><path
            d="M11 40q-1.2 0-2.1-.9Q8 38.2 8 37v-7.15h3V37h26v-7.15h3V37q0 1.2-.9 2.1-.9.9-2.1.9Zm13-7.65-9.65-9.65 2.15-2.15 6 6V8h3v18.55l6-6 2.15 2.15Z"
          /></svg
        >
      </a>
      <button class="relative active:top-[2px]">
        <svg xmlns="http://www.w3.org/2000/svg" class="fill-gray-700 scale-75" height="48" width="48"
          ><path
            d="m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z"
          /></svg
        >
      </button>
    </div>
  </div>
  <div class="progress">
    <div class="progress-bar" style="width: {progress}%;" />
  </div>
</div>

<style>
  .progress {
    height: 0.75rem;
    width: 100%;
    background-color: red;
    border-radius: 12px;
    position: relative;
  }
  .progress-bar {
    position: absolute;
    height: 100%;
    border-radius: 12px;
    background-color: blue;
  }
</style>
