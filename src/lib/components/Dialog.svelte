<script lang="ts">
  import { fade, scale } from "svelte/transition";
  let dialogOpen = false;
  let size: number = 0;
  let name = "";
  export let createPreset: (name: string, size: number) => void;

  const onSubmit = () => {
    createPreset(name, size);
    dialogOpen = false;
    name = "";
    size = 0;
  };
</script>

<div>
  <button
    class="px-2 relative active:top-[2px] py-1 rounded-lg bg-indigo-600 text-white font-semibold"
    on:click={() => (dialogOpen = true)}>Create preset</button
  >
  <slot />
</div>
{#if dialogOpen}
  <div
    transition:fade
    aria-labelledby="dialog_title"
    role="dialog"
    class="fixed top-0 left-0 flex items-center justify-center bg-black/40 backdrop-blur-sm w-full h-screen z-[9999]"
  >
    <div transition:scale={{ delay: 0.2 }} class="bg-white w-2/5 rounded-md p-5">
      <div class="flex justify-between">
        <h2 class="font-bold text-3xl" id="dialog_title">Create new preset</h2>
        <button
          class="rounded-full hover:bg-gray-200 duration-200 ease-out"
          aria-label="Close modal"
          on:click={() => (dialogOpen = false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="scale-50 fill-gray-600" height="48" width="48"
            ><path
              d="m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z"
            /></svg
          >
        </button>
      </div>
      <form class="space-y-2" on:submit|preventDefault={onSubmit}>
        <p>
          <label class="block" for="preset_name"> Preset name </label>
          <input
            bind:value={name}
            class="border px-2 w-full appearance-none outline-none border-zinc-300 py-1 rounded-sm"
            id="preset_name"
            name="preset_name"
            required
          />
        </p>
        <p>
          <label class="block" for="preset_size">Preset size</label>
          <input
            bind:value={size}
            id="preset_size"
            name="preset_size"
            type="number"
            class="border w-full px-2 appearance-none outline-none border-zinc-300 py-1 rounded-sm"
          />
        </p>

        <button class="bg-emerald-600 text-white font-semibold px-4 py-2 rounded-md">Create</button>
      </form>
    </div>
  </div>
{/if}
