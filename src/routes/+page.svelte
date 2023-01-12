<script lang="ts">
  import Presets from "./Presets.svelte";
  import Dialog from "./Dialog.svelte";
  import { endpoint, presetName, type CloudinaryResponse } from "$lib/cloudinary";
  import { downloadImage, type ImageFormats } from "$lib/download-image";
  let presets: { name: string; size: number }[] = [];
  let files: FileList;
  const defaultPresets: { name: string; size: number }[] = [
    { name: "sm", size: 500 },
    { name: "md", size: 800 },
    { name: "lg", size: 1200 }
  ];

  let imageFormats: Record<ImageFormats, boolean> = { jpg: true, png: true, webp: true };
  const createPreset = (name: string, size: number) => {
    if (presets.length === 3) {
      alert("You can only have 3 max presets");
    }
    presets = [...presets, { name, size }];
  };

  const submitFiles = async () => {
    if (files) {
      if (!files) return;
      const formats = Object.entries(imageFormats)
        .filter(([, value]) => value)
        .map(([key]) => key) as ImageFormats[];
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
        let promises = [];
        if (presets.length === 0) {
          promises = defaultPresets.map((preset) => {
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
        } else {
          promises = presets.map((preset) => {
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
        }

        await Promise.all(promises);
      }
    }
  };
</script>

<svelte:head>
  <title>PixEdit</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>
<h1 class="text-5xl text-gray-900 text-center pt-10 mb-10">PixEdit</h1>
<div class="flex justify-center ">
  <div class="p-5 border border-indigo-800 bg-white rounded-md space-y-4 ">
    <h2 class="font-bold text-xl text-center text-gray-900">Upload and transform images</h2>
    <fieldset>
      <legend class="mb-2">Formats:</legend>
      <label for="webp">WebP</label>
      <input
        id="webp"
        class="h-5 w-5 accent-indigo-600"
        name="format"
        value="webp"
        type="checkbox"
        bind:checked={imageFormats.webp}
      />
      <label for="png">PNG</label>
      <input
        id="png"
        name="format"
        class="h-5 w-5 accent-indigo-600"
        value="png"
        type="checkbox"
        bind:checked={imageFormats.png}
      />
    </fieldset>

    <div class="grid grid-cols-3 gap-4">
      {#if presets.length === 0}
        <div class="flex gap-4 col-span-full justify-between items-center">
          <p>Default presets:</p>
          <Dialog {createPreset} />
        </div>
        {#each defaultPresets as preset (preset.name)}
          <div>
            <p>Name: {preset.name}</p>
            <p>Width: {preset.size}px</p>
          </div>
        {/each}
      {:else}
        <div class="flex gap-4 col-span-full justify-between items-center">
          <p>Custom presets:</p>
          <Dialog {createPreset} />
        </div>
        {#each presets as preset (preset.name)}
          <div>
            <p>Name: {preset.name}</p>
            <p>Width: {preset.size}px</p>
          </div>
        {/each}
      {/if}
    </div>
    <input bind:files type="file" />
    <button on:click={submitFiles} class="bg-emerald-600 text-white rounded-md px-4 py-2">Upload</button>
  </div>
</div>
