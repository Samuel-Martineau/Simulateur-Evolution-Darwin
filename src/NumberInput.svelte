<script>
  export let label;
  export let value;
</script>

<div class="field">
  <label class="label">{label}</label>
  <div class="control">
    <input type="number" class="input" {label} bind:value />
  </div>
  {#if isNaN(parseInt(value))}
    <p class="help is-danger">Veuillez entrer un nombre</p>
  {/if}
</div>
