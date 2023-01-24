<script lang="ts">
  let input: HTMLInputElement;
  type ElEvent<T extends Event, E extends Element> = T & { currentTarget: EventTarget & E };
  let dragged = false;
  let error = false;
  let files: File[] = [];
  export let createFiles: (data: FileList) => void;
  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    console.log(e.dataTransfer?.files);
    if (e.dataTransfer?.files) {
      createFiles(e.dataTransfer.files);
    }
  };

  const onDragOver = (e: ElEvent<DragEvent, HTMLDivElement>) => {
    e.preventDefault();
    dragged = true;
  };
  const onDragEnter = (e: ElEvent<DragEvent, HTMLDivElement>) => {
    dragged = true;
  };
  const onDragLeave = () => {
    dragged = false;
  };

  const onClick = async () => {
    input.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  };
</script>

<div
  tabindex="-1"
  on:dragenter={onDragEnter}
  on:dragleave={onDragLeave}
  on:dragover={onDragOver}
  on:drop={handleDrop}
  class={`bg-zinc-200 rounded-md mx-auto flex flex-col items-center justify-center  border duration-200 ease-out border-zinc-400 border-dashed h-48 w-96 ${
    dragged ? "bg-indigo-400" : ""
  } ${error ? "bg-red-600/40" : ""}`}
>
  <input bind:this={input} type="file" class="hidden" />
  {#if error}
    <p>Invalid file type</p>
  {/if}
  <p>Drag your photos here to start uploading</p>
  <p class="text-lg">Or</p>
  <button class="bg-indigo-600 text-white font-semibold px-2 py-1 rounded-sm" on:click={onClick}>Browse files</button>
</div>
<div>
  {#if files}
    {#each files as file}
      <p>{file.name}</p>
      <p />
    {/each}
  {/if}
</div>
