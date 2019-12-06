<script>
  export let label;
  export let value;
</script>

{#if label}
  <label class="label">{label}</label>
{/if}
<div class="field">
  <div class="control">
    <input type="text" class="input" placeholder={label} bind:value />
  </div>
</div>
