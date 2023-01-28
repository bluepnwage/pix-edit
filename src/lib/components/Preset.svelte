<script lang="ts">
  export let preset: { name: string; size: number };
</script>

<div class="flex justify-between items-center mb-2 last-of-type:mb-0">
  <p class="text-gray-900 font-semibold">
    {preset.name}: <span class="font-normal text-gray-700">{preset.size}px</span>
  </p>
  <slot />
</div>
