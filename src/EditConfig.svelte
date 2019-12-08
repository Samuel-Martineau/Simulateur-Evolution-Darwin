<script>
  import NumberInput from './NumberInput.svelte';
  import TextInput from './TextInput.svelte';
  import Select from './Select.svelte';
  import copy from 'copy-to-clipboard';

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

  <h1 class="title is-4">Herbivores</h1>
  <TextInput
    bind:value={config.prey.name}
    label="Nom de l'espèce des herbivores" />
  <NumberInput
    bind:value={config.prey.startingNb}
    label="Nombre de départ"
    unit="herbivore(s)" />
  {#each config.prey.genes as gene}
    {console.log((gene.adjustments = gene.adjustments || {})) || ''}
    <h1 class="title is-5">Gêne de {gene.displayName.toLowerCase()}</h1>
    <Select label="Modificateur" bind:value={gene.modificator}>
      <option value="stddev">Écart type</option>
      <option value="constant">Constant</option>
    </Select>
    {#if gene.modificator === 'stddev'}
      <NumberInput label="Valeur moyenne" bind:value={gene.avg} />
      <NumberInput label="Écart type" bind:value={gene.stdDev} />
    {:else if gene.modificator !== ''}
      <NumberInput label="Valeur" bind:value={gene.value} />
    {/if}
    <label class="label">
      Ajustements
      <i>
        ( Ex:
        <code on:click={() => copy('Math.round(${value} * 0.05)')}>
          {'Math.round(${value} * 0.05)'}
        </code>
        )
      </i>
    </label>
    <div class="field has-addons">
      <p class="control">
        <span class="select">
          <select bind:value={gene.selectedAdjustmentGeneName}>
            <option value="" disabled default>Veuillez choisir un gêne</option>
            {#each config.prey.genes as g}
              <option value={g.name}>{g.displayName}</option>
            {/each}
          </select>
        </span>
      </p>
      <p class="control is-expanded">
        {console.log((gene.selectedAdjustmentGeneName = gene.selectedAdjustmentGeneName || '')) || ''}
        {console.log((gene.adjustments[gene.selectedAdjustmentGeneName] = gene.adjustments[gene.selectedAdjustmentGeneName] || '')) || ''}
        <input
          disabled={gene.selectedAdjustmentGeneName === ''}
          class="input"
          type="text"
          placeholder="Formule pour ledit gêne"
          bind:value={gene.adjustments[gene.selectedAdjustmentGeneName]} />
      </p>
    </div>
  {/each}

  <h1 class="title is-4">Carnivores</h1>
  <TextInput
    bind:value={config.predator.name}
    label="Nom de l'espèce des carnivores" />
  <NumberInput
    bind:value={config.predator.startingNb}
    label="Nombre de départ"
    unit="carnivore(s)" />
  {#each config.predator.genes as gene}
    {console.log((gene.adjustments = gene.adjustments || {})) || ''}
    <h1 class="title is-5">Gêne de {gene.displayName.toLowerCase()}</h1>
    <Select label="Modificateur" bind:value={gene.modificator}>
      <option value="stddev">Écart type</option>
      <option value="constant">Constant</option>
    </Select>
    {#if gene.modificator === 'stddev'}
      <NumberInput label="Valeur moyenne" bind:value={gene.avg} />
      <NumberInput label="Écart type" bind:value={gene.stdDev} />
    {:else if gene.modificator !== ''}
      <NumberInput label="Valeur" bind:value={gene.value} />
    {/if}
    <label class="label">
      Ajustements
      <i>
        ( Ex:
        <code on:click={() => copy('Math.round(${value} * 0.05)')}>
          {'Math.round(${value} * 0.05)'}
        </code>
        )
      </i>
    </label>
    <div class="field has-addons">
      <p class="control">
        <span class="select">
          <select bind:value={gene.selectedAdjustmentGeneName}>
            <option value="" disabled default>Veuillez choisir un gêne</option>
            {#each config.prey.genes as g}
              <option value={g.name}>{g.displayName}</option>
            {/each}
          </select>
        </span>
      </p>
      <p class="control is-expanded">
        {console.log((gene.selectedAdjustmentGeneName = gene.selectedAdjustmentGeneName || '')) || ''}
        {console.log((gene.adjustments[gene.selectedAdjustmentGeneName] = gene.adjustments[gene.selectedAdjustmentGeneName] || '')) || ''}
        <input
          disabled={gene.selectedAdjustmentGeneName === ''}
          class="input"
          type="text"
          placeholder="Formule pour ledit gêne"
          bind:value={gene.adjustments[gene.selectedAdjustmentGeneName]} />
      </p>
    </div>
  {/each}

  <h1 class="title is-4">Plantes</h1>
  <NumberInput
    bind:value={config.plant.startingNb}
    label="Nombre de départ"
    unit="plantes" />
  <NumberInput
    bind:value={config.plant.spawnInterval}
    label="Interval entre les vagues d'appartion des plantes"
    unit="ut" />
  <NumberInput
    bind:value={config.plant.spawnRate}
    label="Nombre de plantes par vague d'apparition"
    unit="plantes" />

  <h1 class="title is-4">Autres</h1>
  <NumberInput bind:value={config.size} label="Taille de la carte" unit="ue" />
  <NumberInput bind:value={config.seed} label="SEED" />
  <NumberInput
    bind:value={config.nbOfAnimalsSnapshotInterval}
    label="Interval entre les recensement des populations"
    unit="ut" />
</form>
