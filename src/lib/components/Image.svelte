<script lang="ts">
  import type { DownloadData, ImageFormats } from "$lib/download-image";
  import { downloadImage } from "$lib/download-image";
  export let image: DownloadData;
  export let format: ImageFormats;
  export let publicId: string;
  export let loading: boolean;
  let progress = 0;
  let url = "";

  $: {
    if (!loading) {
      downloadImage(
        publicId,
        { imageName: image.imageName, preset: image.preset, width: image.width },
        format,
        updateProgress
      ).then((string) => {
        url = string;
      });
    }
  }

  const updateProgress = (data: number) => {
    progress += data;
  };
</script>

<div>
  <div class="flex justify-between items-center">
    <div>
      <p class="text-gray-800 text-lg">{image.imageName}-{image.preset}.{format}</p>
    </div>
    <div class="flex">
      {#if url}
        <a href={url} download={`${image.imageName}-${image.preset}`} aria-label="Download image" class="scale-50">
          <svg xmlns="http://www.w3.org/2000/svg" class="fill-emerald-700" height="48" width="48"
            ><path
              d="M11 40q-1.2 0-2.1-.9Q8 38.2 8 37v-7.15h3V37h26v-7.15h3V37q0 1.2-.9 2.1-.9.9-2.1.9Zm13-7.65-9.65-9.65 2.15-2.15 6 6V8h3v18.55l6-6 2.15 2.15Z"
            /></svg
          >
        </a>
        <slot />
      {/if}
    </div>
  </div>
  <div class="progress mb-4 bg-gray-300 border border-gray-400">
    <div
      data-loading={loading}
      style="width: {loading ? '' : `${progress}%`}"
      class="progress-bar  progress-loading bg-indigo-600"
    />
  </div>
</div>

<style>
  .progress {
    height: 4px;
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  .progress-bar {
    position: absolute;
    height: 100%;
    width: 100%;
    transition: all 200ms ease;
  }

  .progress-bar[data-loading="true"] {
    animation: animate 2s cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
  }

  @keyframes animate {
    0% {
      transform: translateX(-100%) scaleX(100%);
    }
    50% {
      transform: translateX(0%) scaleX(25%);
    }
    100% {
      transform: translateX(100%) scaleX(100%);
    }
  }
</style>
