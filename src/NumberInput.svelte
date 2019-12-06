<script>
  export let label;
  export let value;
  export let unit = '';
</script>

{#if label}
  <label class="label">{label}</label>
{/if}
<div class="field has-addons">
  <div class="control is-expanded">
    <input type="number" class="input" bind:value placeholder={label} />
  </div>
  {#if unit}
    <div class="control">
      <button type="submit" class="button is-static">{unit}</button>
    </div>
  {/if}
</div>
