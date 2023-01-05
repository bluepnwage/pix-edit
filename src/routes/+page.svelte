<script lang="ts">
  import Presets from "./Presets.svelte";
  import Dialog from "./Dialog.svelte";
  import { endpoint, presetName, type CloudinaryResponse } from "$lib/cloudinary";
  import { downloadImage, type ImageFormats } from "$lib/download-image";
  let presets: { name: string; size: number }[] = [];
  let files: FileList;

  let formats: ImageFormats[] = ["webp"];
  const createPreset = (name: string, size: number) => {
    presets = [...presets, { name, size }];
  };

  const submitFiles = async () => {
    if (files) {
      if (!files) return;
      const fileName = files[0].name.split(".")[0];
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("upload_preset", presetName);
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        const json = (await res.json()) as CloudinaryResponse;
        const promises = presets.map((preset) => {
          return downloadImage(
            json.public_id,
            {
              width: preset.size,
              preset: preset.name,
              imageName: fileName
            },
            formats
          );
        });

        await Promise.all(promises);
        setTimeout(() => (status = "idle"), 5000);
      }
    }
  };
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>
<h1 class="text-5xl">PixEdit</h1>
<div class="flex justify-center ">
  <div class="p-5 border space-y-4 ">
    <p>Upload image and transform pictures</p>
    <div class="flex gap-4 items-center">
      <p>Presets:</p>
      <Dialog {createPreset} />
    </div>
    {#each presets as preset (preset.name)}
      <p>Name: {preset.name}</p>
      <p>Width in pixels: {preset.size}</p>
    {/each}
    <input bind:files type="file" />
    <button on:click={submitFiles} class="bg-emerald-600 text-white rounded-md px-4 py-2">Upload</button>
  </div>
</div>
<Presets />
