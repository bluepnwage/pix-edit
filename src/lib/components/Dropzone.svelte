<script lang="ts">
  export let files: File[];
  export let onFileChange: (data: File[]) => void;
  export let onFileFilter: (name: string) => void;
  let input: HTMLInputElement;
  type ElEvent<T extends Event, E extends Element> = T & { currentTarget: EventTarget & E };
  let dragged = false;

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer?.files) {
      onFileChange(Array.from(e.dataTransfer.files));
    }
    dragged = false;
  };

  const onDragOver = (e: ElEvent<DragEvent, HTMLDivElement>) => {
    e.preventDefault();
    dragged = true;
  };
  const onDragEnter = () => {
    dragged = true;
  };
  const onDragLeave = () => {
    dragged = false;
  };

  const onClick = async () => {
    input.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  };

  const onChange = (e: ElEvent<Event, HTMLInputElement>) => {
    if (e.currentTarget.files) {
      onFileChange(Array.from(e.currentTarget.files));
    }
  };
</script>

<p class="font-semibold text-center">Upload file</p>

<div
  tabindex="-1"
  on:dragenter={onDragEnter}
  on:dragleave={onDragLeave}
  on:dragover={onDragOver}
  on:drop={handleDrop}
  class={` px-10 gap-2 py-4 w-full rounded-md mx-auto flex items-center justify-center  border duration-200 ease-out border-zinc-400 border-dashed 
     ${dragged ? "bg-zinc-200" : "bg-zinc-100"}`}
>
  <input bind:this={input} on:change={onChange} type="file" class="hidden" />
  {#if files.length > 0}
    {#each files as file}
      <div class="w-full flex justify-between">
        <div class="flex gap-1 items-center">
          <svg class="fill-indigo-600 scale-75" xmlns="http://www.w3.org/2000/svg" height="48" width="48"
            ><path
              d="M11 44q-1.2 0-2.1-.9Q8 42.2 8 41V7q0-1.2.9-2.1Q9.8 4 11 4h18.05L40 14.95V41q0 1.2-.9 2.1-.9.9-2.1.9Zm16.55-27.7V7H11v34h26V16.3ZM11 7v9.3V7v34V7Z"
            /></svg
          >
          <div>
            <p>{file.name}</p>
            <p class="text-zinc-500">{Math.round(file.size / 1000)} KB</p>
          </div>
        </div>
        <button on:click={() => onFileFilter(file.name)} aria-label="Delete uploaded file">
          <svg
            class="fill-zinc-600 scale-50 inline-block"
            xmlns="http://www.w3.org/2000/svg"
            height="48"
            width="48"
            ><path
              d="m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z"
            /></svg
          >
        </button>
      </div>
    {/each}
  {:else}
    <svg class="fill-indigo-600 scale-75" xmlns="http://www.w3.org/2000/svg" height="48" width="48"
      ><path
        d="M22.6 37.9h3V27.85l4.1 4.1 2.1-2.1-7.8-7.6-7.7 7.7 2.1 2.1 4.2-4.2ZM11 44q-1.2 0-2.1-.9Q8 42.2 8 41V7q0-1.2.9-2.1Q9.8 4 11 4h18.05L40 14.95V41q0 1.2-.9 2.1-.9.9-2.1.9Zm16.55-27.7V7H11v34h26V16.3ZM11 7v9.3V7v34V7Z"
      /></svg
    >
    <p class="text-zinc-500">Drag and drop items here or</p>
    <button class="font-semibold" on:click={onClick}>Browse files</button>
  {/if}
</div>
<p class="text-zinc-500">Images must not be larger than 5MB.</p>
