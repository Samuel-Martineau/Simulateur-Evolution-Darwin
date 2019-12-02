<script>
  export let label;
  export let value;
</script>

<div class="field">
  <label class="label">{label}</label>
  <div class="control">
    <div class="select">
      <select bind:value>
        <option default value="" disabled>Veuillez choisir une option</option>
        <slot />
      </select>
    </div>
  </div>
</div>
