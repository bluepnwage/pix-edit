<script lang="ts">
  import Options from "$lib/components/Options.svelte";
  import type { PageServerData } from "./$types";
  export let data: PageServerData;
</script>

<svelte:head>
  <title>PixEdit - Transform your images!</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>
<h1 class="text-5xl text-gray-900 font-bold text-center pt-10 mb-10">PixEdit</h1>
<Options data={data.presets} />
