<script lang="ts">
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

<button class="px-4 py-2 rounded-md bg-orange-600 text-white font-semibold" on:click={() => (dialogOpen = true)}
  >Create preset</button
>
{#if dialogOpen}
  <div
    aria-labelledby="dialog_title"
    role="dialog"
    class="fixed  top-0 left-0 flex items-center justify-center bg-black/40 backdrop-blur-sm w-full h-screen z-[9999]"
  >
    <div class="bg-white w-2/5 rounded-md p-5">
      <div class="flex justify-between">
        <h2 class="font-bold text-3xl" id="dialog_title">Create preset</h2>
        <button aria-label="Close modal" on:click={() => (dialogOpen = false)}>X</button>
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
            max="1500"
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
