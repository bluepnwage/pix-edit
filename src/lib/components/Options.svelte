<script lang="ts">
  import Dropzone from "./Dropzone.svelte";
  import Dialog from "./Dialog.svelte";
  import Preset from "./Preset.svelte";
  import Image from "./Image.svelte";
  import { defaultPresets } from "$lib/default-presets";
  import { downloadImage, uploadFile, downloadGzip } from "$lib/download-image";
  import type { Preset as PresetType } from "$lib/default-presets";
  import type { ImageFormats, DownloadData } from "$lib/download-image";
  import { webp } from "@cloudinary/url-gen/qualifiers/format";

  type Format = Record<ImageFormats, boolean>;
  export let data: { presets: PresetType[]; formats: Format | null };

  type Downloads = Record<ImageFormats, DownloadData[]>;

  let presets: PresetType[] = data.presets;
  let loading = false;
  const imageFormats: ImageFormats[] = ["jpg", "png", "webp"];
  let selectedFormats: Format = data.formats || { jpg: true, png: false, webp: false };
  let file: File | null = null;
  let downloads: Downloads = { jpg: [], png: [], webp: [] };
  let publicId = "";
  let progress = 0;

  $: currentPresets = presets.length > 0 ? presets : defaultPresets;
  $: {
    if (file) {
      downloads = { jpg: [], png: [], webp: [] };
    }
  }

  const onFileChange = (data: File | null) => {
    file = data;
  };

  const createPreset = (name: string, size: number) => {
    if (presets.length === 3) {
      alert("You can only have 3 max presets");
    }
    presets = [...presets, { name, size, id: crypto.randomUUID() }];
  };

  const savePresets = async () => {
    const res = await fetch("/api/presets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ presets })
    });
    if (res.ok) {
      const text = await res.text();
      console.log(text);
    }
  };

  const saveFormats = async () => {
    const res = await fetch("/api/formats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formats: selectedFormats })
    });
    if (res.ok) {
      const text = await res.text();
      console.log(text);
    }
  };

  const removePreset = (presetId: string) => {
    const endpoint = new URL("/api/presets", location.origin);
    presets = presets.filter(({ id }) => id !== presetId);
    if (presets.length === 0) endpoint.searchParams.set("delete", "1");
    fetch(endpoint, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ presets })
    });
  };

  const removeImage = (preset: string, format: ImageFormats) => {
    downloads[format] = downloads[format].filter((value) => value.preset !== preset);
  };

  const onClick = async () => {
    if (!file) return;
    loading = true;

    const fileName = file.name.split(".")[0];

    const formats = Object.entries(selectedFormats)
      .filter(([, value]) => value)
      .map(([key]) => key) as ImageFormats[];
    for (const format of formats) {
      downloads[format] = currentPresets.map((preset) => {
        return {
          width: preset.size,
          preset: preset.name,
          imageName: fileName
        };
      });
    }
    publicId = await uploadFile(file);
    loading = false;
    file = null;
  };

  const onZip = async () => {
    await downloadGzip(publicId, downloads);
  };
</script>

<div class="flex justify-center text-gray-900 mb-10">
  <div class="rounded-md shadow-lg ring-1 bg-white ring-black/10  p-4 w-2/6">
    <p class="text-2xl text-center font-bold">Options</p>
    <div class="flex justify-between items-start">
      <fieldset>
        <legend class="text-xl font-semibold text-gray-900 mb-2">Format</legend>
        {#each imageFormats as format}
          <p class="flex items-center gap-2 mb-4 last-of-type:mb-0">
            <input id={format} type="checkbox" class="input" bind:checked={selectedFormats[format]} />
            <label for={format} class="uppercase   text-gray-700">{format}</label>
          </p>
        {/each}
      </fieldset>
      <button
        on:click={saveFormats}
        class="px-2 relative active:top-[2px] py-1 rounded-lg border border-emerald-600 text-emerald-600 font-semibold"
        >Save formats</button
      >
    </div>
    <hr class="w-full my-4 bg-gray-400 h-0.5" />
    <div class="flex justify-between mb-4">
      <p class="text-xl text-center font-semibold">
        {#if presets.length === 0}
          Default presets
        {:else}
          Custom presets
        {/if}
      </p>
      <Dialog {createPreset}>
        {#if presets.length > 0}
          <button
            on:click={savePresets}
            class="px-2 relative active:top-[2px] py-1 rounded-lg border border-emerald-600 text-emerald-600 font-semibold"
            >Save presets</button
          >
        {/if}
      </Dialog>
    </div>
    {#each currentPresets as preset (preset.id)}
      <Preset {preset}>
        {#if presets.length > 0}
          <button
            on:click={() => removePreset(preset.id)}
            aria-label="Delete preset"
            class="bg-red-100 relative active:top-[2px] fill-red-800 rounded-md  flex justify-between items-center"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="inherit"
              class="scale-50"
              height="48"
              width="48"
              ><path
                d="M13.05 42q-1.25 0-2.125-.875T10.05 39V10.5H8v-3h9.4V6h13.2v1.5H40v3h-2.05V39q0 1.2-.9 2.1-.9.9-2.1.9Zm21.9-31.5h-21.9V39h21.9Zm-16.6 24.2h3V14.75h-3Zm8.3 0h3V14.75h-3Zm-13.6-24.2V39Z"
              /></svg
            >
          </button>
        {/if}
      </Preset>
    {/each}
    <hr class="w-full my-4 bg-gray-400 h-0.5" />

    <Dropzone {onFileChange} {file} />
    <button
      disabled={loading || !file}
      on:click={onClick}
      data-loading={loading}
      class="w-full py-1  mb-4 disabled:static disabled:grayscale data-[loading=true]:animate-pulse active:top-[2px] relative font-semibold rounded-lg bg-indigo-600 inline-block mt-4 text-white"
      >Transform</button
    >
    {#if downloads.webp.length > 0}
      <p class="text-lg font-semibold text-gray-800">Webp</p>
    {/if}
    {#each downloads.webp as image (`${image.imageName}-${image.preset}`)}
      <Image {image} format="webp" {loading} {publicId}>
        <button on:click={() => removeImage(image.preset, "webp")} class="relative active:top-[2px] scale-50">
          <svg xmlns="http://www.w3.org/2000/svg" class="fill-gray-700 " height="48" width="48"
            ><path
              d="m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z"
            /></svg
          >
        </button>
      </Image>
    {/each}
    {#each downloads.jpg as image (`${image.imageName}-${image.preset}`)}
      <Image {image} format="jpg" {loading} {publicId}>
        <button on:click={() => removeImage(image.preset, "jpg")} class="relative active:top-[2px] scale-50">
          <svg xmlns="http://www.w3.org/2000/svg" class="fill-gray-700 " height="48" width="48"
            ><path
              d="m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z"
            /></svg
          >
        </button>
      </Image>
    {/each}
    {#each downloads.png as image (`${image.imageName}-${image.preset}`)}
      <Image {image} format="png" {loading} {publicId}>
        <button on:click={() => removeImage(image.preset, "png")} class="relative active:top-[2px] scale-50">
          <svg xmlns="http://www.w3.org/2000/svg" class="fill-gray-700 " height="48" width="48"
            ><path
              d="m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z"
            /></svg
          >
        </button>
      </Image>
    {/each}
    {#if downloads.webp.length > 0 || downloads.jpg.length > 0 || downloads.png.length > 0}
      <button
        disabled={loading}
        data-loading={loading}
        on:click={onZip}
        class="w-full py-1  mb-4 disabled:static disabled:grayscale data-[loading=true]:animate-pulse active:top-[2px] relative font-semibold rounded-lg bg-emerald-600 inline-block mt-4 text-white"
        >Download as gzip</button
      >
    {/if}
  </div>
</div>

<style>
  .input {
    outline: none;
    appearance: none;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid rgb(161, 161, 170);
    position: relative;
    transition: background-color cubic-bezier(0.215, 0.61, 0.355, 1) 200ms;
  }

  .input:checked {
    background-color: rgb(79, 70, 229);
  }
  .input:checked::after {
    content: " ";
    background-image: url("/check.svg");
    background-position: center;
    background-size: contain;
    width: 18px;
    height: 18px;
  }
</style>
