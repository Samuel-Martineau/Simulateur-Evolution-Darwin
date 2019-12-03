<script>
  export let label;
  export let value;
</script>

<div class="field">
  {#if label}
    <label class="label">{label}</label>
  {/if}
  <div class="control">
    <input type="text" class="input" {label} bind:value />
  </div>
  {#if !value}
    <p class="help is-danger">Veuillez entrer une chaîne de charactère</p>
  {/if}
</div>
