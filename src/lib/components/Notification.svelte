<script>
  import { store } from "$lib/notifications";
  import { slide } from "svelte/transition";
</script>

{#each $store as noti}
  <div
    transition:slide
    class="fixed border-l-4 z-50 border-emerald-600 bottom-10 px-2 translate-x-2/4 bg-white flex items-center w-2/5 right-2/4 rounded-md h-12 shadow-xl"
  >
    <p class="font-semibold text-lg">{noti.payload}</p>
  </div>
{/each}
