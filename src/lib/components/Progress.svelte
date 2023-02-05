<script lang="ts">
  export let progress:number = 0;
  export let imageLabel: string
  export let loading:boolean
</script>

<div class="progress mb-4 bg-gray-300 border border-gray-400">
  <div
    role="progressbar"
    aria-labelledby={imageLabel}
    aria-valuenow={progress}
    data-loading={loading}
    style="width: {loading ? '' : `${progress}%`}"
    class="progress-bar  progress-loading bg-indigo-600"
  />
</div>

<style>
  .progress {
    height: 4px;
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  .progress-bar {
    position: absolute;
    height: 100%;
    width: 100%;
    transition: all 200ms ease;
  }

  .progress-bar[data-loading="true"] {
    animation: animate 2s cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
  }

  @keyframes animate {
    0% {
      transform: translateX(-100%) scaleX(100%);
    }
    50% {
      transform: translateX(0%) scaleX(25%);
    }
    100% {
      transform: translateX(100%) scaleX(100%);
    }
  }
</style>
