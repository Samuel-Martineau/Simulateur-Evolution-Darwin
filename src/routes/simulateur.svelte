<script lang="ts">
  import Navbar from "../components/navbar.svelte";
  import ConfigurationsSidebar from "../components/configurations-sidebar.svelte";
  import type { SimulatorConfiguration } from "../interfaces/simulator-configuration";
  import ConfigurationEditor from "../components/configuration-editor.svelte";
  import { generateBaseConfiguration, scrollIntoView } from "../utils";
  import { onMount } from "svelte";
  import { LocalStorageKeys } from "../types/localstorage-keys";

  let main: HTMLElement;

  // Chargement des configurations à partir du localStorage
  let configurations: SimulatorConfiguration[] = process.browser
    ? JSON.parse(localStorage.getItem(LocalStorageKeys.Configurations) || "[]")
    : [];

  // Sauvegarde automatique des configurations dans le localStorage
  function saveConfigurations() {
    try {
      localStorage.setItem(
        LocalStorageKeys.Configurations,
        JSON.stringify(configurations)
      );
    } catch (error) {
      alert(
        "Une erreur est survenue lors de la sauvegarde de la configuration"
      );
    }
  }

  $: if (process.browser && configurations) saveConfigurations();

  // Sélection de la dernière configuration visitée
  let previousSelectedConfiguration = configurations.find(
    ({ id }) =>
      id ===
      (process.browser
        ? localStorage.getItem(LocalStorageKeys.LastVisitedConfiguration) ||
          undefined
        : undefined)
  );
  let selectedConfigurationBuffer = previousSelectedConfiguration;
  let selectedConfiguration:
    | SimulatorConfiguration
    | undefined = previousSelectedConfiguration;

  // Retour au haut de la page lorsque la configuration sélectionnée change
  $: (previousSelectedConfiguration = selectedConfigurationBuffer),
    (selectedConfigurationBuffer = selectedConfiguration);
  $: if (
    selectedConfiguration &&
    previousSelectedConfiguration !== selectedConfiguration
  ) {
    localStorage.setItem(
      LocalStorageKeys.LastVisitedConfiguration,
      selectedConfiguration.id
    );
    document.querySelector("main")?.scroll({ top: 0, behavior: "smooth" });
  }

  // Nécessaire pour que Svelte remarque la mise à jour des configurations
  $: selectedConfiguration && (configurations = configurations);

  function createConfiguration() {
    const configuration = generateBaseConfiguration();
    configurations = [...configurations, configuration];
    selectedConfiguration = configuration;
  }

  onMount(() => {
    const helpFrom = localStorage.getItem(
      LocalStorageKeys.HelpRequestFromElement
    );
    localStorage.removeItem(LocalStorageKeys.HelpRequestFromElement);
    if (helpFrom) {
      scrollIntoView(helpFrom, main, 150);
    }
  });
</script>

<style lang="scss">
  @import "src/styles/theme.scss";
  @import "src/styles/variables.scss";

  div {
    display: flex;
  }

  main {
    width: calc(100vw - #{$sidebar-width});
    height: calc(100vh - #{$navbar-height});
    overflow-y: auto;
    padding: 20px;
    box-sizing: border-box;
  }
</style>

<svelte:head>
  <title>
    Simulateur d'évolution - Éditeur de configuration -
    {(selectedConfiguration && selectedConfiguration.title) || 'Aucune configuration'}
  </title>
</svelte:head>

<Navbar />

<div>
  <ConfigurationsSidebar
    {configurations}
    bind:selectedConfiguration
    on:create-configuration={createConfiguration} />
  <main bind:this={main}>
    {#if selectedConfiguration}
      <ConfigurationEditor bind:configuration={selectedConfiguration} />
    {:else}
      <h1>Bienvenue dans l'éditeur de configurations du simulateur</h1>
      <h2>Veuillez choisir une configuration dans la barre latérale</h2>
    {/if}
  </main>
</div>
