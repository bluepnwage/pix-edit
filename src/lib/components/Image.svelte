<script lang="ts">
  import type { DownloadData } from "$lib/download-image";

  export let image: DownloadData;
</script>

<div class="flex justify-between">
  <div>
    <p>{image.imageName}-{image.preset}</p>
  </div>
  <div class="flex gap-2">
    <a href={image.url} download={`${image.imageName}-${image.preset}`} class="">
      <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"
        ><path
          d="M11 40q-1.2 0-2.1-.9Q8 38.2 8 37v-7.15h3V37h26v-7.15h3V37q0 1.2-.9 2.1-.9.9-2.1.9Zm13-7.65-9.65-9.65 2.15-2.15 6 6V8h3v18.55l6-6 2.15 2.15Z"
        /></svg
      >
    </a>
    <button class=""> X </button>
  </div>
</div>
