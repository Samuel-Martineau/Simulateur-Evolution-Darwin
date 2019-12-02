<script>
  import NumberInput from './NumberInput.svelte';
  import TextInput from './TextInput.svelte';
  import Select from './Select.svelte';

  export let config;
</script>

<style lang="scss">
  form {
    flex: 1;
    margin: 10px 0;

    h1.title.is-4 {
      margin: 35px 0 4px 0;
    }

    h1.title.is-5 {
      margin: 20px 0 5px 0;
    }
  }
</style>

<form>

  <TextInput bind:value={config.name} label="Nom de la configuration" />

  <h1 class="title is-4">Proies</h1>
  <TextInput bind:value={config.prey.name} label="Nom de l'espèce des proies" />
  <NumberInput bind:value={config.prey.startingNb} label="Nombre de départ" />
  {#each config.prey.genes as gene}
    <h1 class="title is-5">Gêne de {gene.displayName.toLowerCase()}</h1>
    <Select label="Modificateur" bind:value={gene.modificator}>
      <option value="stddev">Écart Type</option>
      <option value="average">Moyenne</option>
      <option value="constant">Constant</option>
    </Select>
    {#if gene.modificator === 'stddev'}
      <NumberInput label="Valeur moyenne" bind:value={gene.avg} />
      <NumberInput label="Écart type" bind:value={gene.stdDev} />
    {:else if gene.modificator !== ''}
      <NumberInput label="Valeur" bind:value={gene.value} />
    {/if}
  {/each}

  <h1 class="title is-4">Prédateurs</h1>
  <TextInput
    bind:value={config.predator.name}
    label="Nom de l'espèce des prédateurs" />
  <NumberInput
    bind:value={config.predator.startingNb}
    label="Nombre de départ" />
  {#each config.predator.genes as gene}
    <h1 class="title is-5">Gêne de {gene.displayName.toLowerCase()}</h1>
    <Select label="Modificateur" bind:value={gene.modificator}>
      <option value="stddev">Écart Type</option>
      <option value="average">Moyenne</option>
      <option value="constant">Constant</option>
    </Select>
    {#if gene.modificator === 'stddev'}
      <NumberInput label="Valeur moyenne" bind:value={gene.avg} />
      <NumberInput label="Écart type" bind:value={gene.stdDev} />
    {:else if gene.modificator !== ''}
      <NumberInput label="Valeur" bind:value={gene.value} />
    {/if}
  {/each}

  <h1 class="title is-4">Plantes</h1>
  <NumberInput bind:value={config.plant.startingNb} label="Nombre de départ" />
  <NumberInput
    bind:value={config.plant.spawnInterval}
    label="Vitesse d'apparition des plantes" />
  <NumberInput
    bind:value={config.plant.spawnRate}
    label="Nombre de plantes par vague d'apparition" />

  <h1 class="title is-4">Autres</h1>
  <NumberInput bind:value={config.size} label="Taille de la carte" />
  <NumberInput bind:value={config.seed} label="SEED" />

</form>
