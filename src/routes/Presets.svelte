<script lang="ts">
  import { downloadImage } from "$lib/download-image";
  import { endpoint, presetName } from "$lib/cloudinary";

  import type { CloudinaryResponse } from "$lib/cloudinary";
  import type { ImageFormats } from "$lib/download-image";

  type FormEvent<T extends Event, E extends Element> = T & { currentTarget: EventTarget & E };
  type PresetSettings = {
    name: string;
    width: number;
  };

  let file: FileList;
  let status: "idle" | "loading" | "success" = "idle";
  let presets: PresetSettings[] = [
    { width: 1200, name: "lg" },
    { width: 800, name: "md" },
    { width: 500, name: "sm" }
  ];
  let formats: ImageFormats[] = ["webp", "jpg"];

  const onSubmit = async (e: FormEvent<SubmitEvent, HTMLFormElement>) => {
    if (!file) return;
    const fileName = file[0].name.split(".")[0];
    status = "loading";
    const formData = new FormData();
    formData.append("file", file[0]);
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
            width: preset.width,
            preset: preset.name,
            imageName: fileName
          },
          formats
        );
      });

      await Promise.all(promises);
      status = "success";
      setTimeout(() => (status = "idle"), 5000);
    }
  };
</script>

<form on:submit|preventDefault={onSubmit}>
  <p>
    <input
      bind:files={file}
      type="file"
      name="preset_name"
      id="preset_name"
      class="border px-4 py-1 appearance-none outline-none"
      required
    />
  </p>

  <button class="px-4 py-2 rounded-md bg-orange-600 text-white font-semibold">submit</button>
</form>
<p>
  {#if status === "loading"}
    Loading
  {:else if status === "success"}
    Image succesfully uploaded
  {/if}
</p>
<p>All presets</p>
{#each presets as preset (preset.name)}
  <p>Name: {preset.name}</p>
  <p>Width: {preset.width}</p>
{/each}
