<script>
  import { createEventDispatcher } from 'svelte';
  import Modal from './Modal.svelte';

  export let currentConfigId;
  export let configs;

  let dispatch = createEventDispatcher();
  let maxCharCount = 40;
</script>

<style>
  div {
    flex: 0 0 25%;
    max-width: 25vw;
    overflow: hidden;
    margin-right: 10px;
  }
</style>

<div>
  <aside class="menu">
    <p class="menu-label">Actions</p>
    <ul class="menu-list">
      <li>
        <a href="##" on:click={() => dispatch('save')}>
          Sauvegarder toutes les configurations
        </a>
      </li>
      {#if currentConfigId}
        <li>
          <a href="##" on:click={() => dispatch('delete')}>
            Supprimer cette configuration
          </a>
        </li>
        <li>
          <a href="##" on:click={() => dispatch('duplicate')}>
            Dupliquer cette configuration
          </a>
        </li>
        <li>
          <a href="##" on:click={() => dispatch('execute')}>
            Exécuter cette configuration
          </a>
        </li>
        <li>
          <a href="##" on:click={() => dispatch('download')}>
            Télécharger cette configuration
          </a>
        </li>
      {/if}
      <li>
        <a href="##" on:click={() => dispatch('newconfig')}>
          Créer une nouvelle configuration
        </a>
      </li>
      <li>
        <a href="##" on:click={() => dispatch('uploadconfig')}>
          Charger une configuration à partir d'un fichier
        </a>
      </li>
    </ul>
    <p class="menu-label">Configuration(s)</p>
    <ul class="menu-list">
      {#each configs as config}
        <li>
          <a
            href="##"
            on:click={() => {
              currentConfigId = config.id;
              dispatch('editconfig', config.id);
            }}
            class:is-active={currentConfigId === config.id}>
            {config.name.substring(0, maxCharCount) + (config.name.length > maxCharCount ? '...' : '')}
          </a>
        </li>
      {/each}
    </ul>
  </aside>
</div>
