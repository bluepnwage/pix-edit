<script lang="ts">
  import Dropzone from "./Dropzone.svelte";
  import Dialog from "./Dialog.svelte";
  import { onMount } from "svelte";
  import Preset from "./Preset.svelte";
  import { defaultPresets } from "$lib/default-presets";
  import { submitFiles } from "$lib/download-image";
  import type { Preset as PresetType } from "$lib/default-presets";

  onMount(() => {
    const savedPresets = localStorage.getItem("presets");
    if (savedPresets) {
      presets = JSON.parse(savedPresets).presets;
    }
  });

  let presets: PresetType[] = [];
  let loading = false;
  import type { ImageFormats } from "$lib/download-image";
  const imageFormats: ImageFormats[] = ["jpg", "png", "webp"];
  let selectedFormats: Record<ImageFormats, boolean> = { jpg: true, png: false, webp: false };
  let file: File | null = null;

  $: currentPresets = presets.length > 0 ? presets : defaultPresets;

  const onFileChange = (data: File | null) => {
    file = data;
  };

  const createPreset = (name: string, size: number) => {
    if (presets.length === 3) {
      alert("You can only have 3 max presets");
    }
    presets = [...presets, { name, size, id: crypto.randomUUID() }];
  };

  const savePresets = () => {
    localStorage.setItem("presets", JSON.stringify({ presets }));
  };

  const removePreset = (presetId: string) => {
    presets = presets.filter(({ id }) => id !== presetId);
    if (localStorage.getItem("presets")) {
      localStorage.setItem("presets", JSON.stringify({ presets }));
    }
  };

  const onClick = async () => {
    loading = true;
    await submitFiles(file, { selectedFormats, presets: currentPresets });
    loading = false;
    file = null;
  };
</script>

<div class="flex justify-center text-gray-900 mb-10">
  <div class="rounded-md shadow-lg ring-1 bg-white ring-black/10  p-4 min-w-2/6">
    <p class="text-2xl text-center font-bold">Options</p>
    <fieldset>
      <legend class="text-xl font-semibold text-gray-900 mb-2">Format</legend>
      {#each imageFormats as format}
        <p class="flex items-center gap-2 mb-4 last-of-type:mb-0">
          <input id={format} type="checkbox" class="input" bind:checked={selectedFormats[format]} />
          <label for={format} class="uppercase   text-gray-700">{format}</label>
        </p>
      {/each}
    </fieldset>
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
      class="w-full py-1 disabled:grayscale data-[loading=true]:animate-pulse active:top-[2px] relative font-semibold rounded-lg bg-indigo-600 inline-block mt-4 text-white"
      >Transform</button
    >
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
