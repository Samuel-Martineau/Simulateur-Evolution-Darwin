<script lang="ts">
  import Navbar from "../components/navbar.svelte";
  import ConfigurationsSidebar from "../components/configurations-sidebar.svelte";
  import ConfigurationEditor from "../components/configuration-editor.svelte";
  import UploadConfigurationForm from "../components/upload-configuration-form.svelte";
  import {
    applyDefaultsDeep,
    baseConfiguration,
    generateBaseConfiguration,
    getRandomSeed,
    isV2SimulatorConfiguration,
    scrollIntoView,
    toFactory,
    transpileV1ConfigurationToV2,
  } from "../utils";
  import type { SimulatorConfiguration } from "../types/simulator-configuration";
  import { LocalStorageKeys } from "../types/localstorage-keys";
  import { Boundary } from "@crownframework/svelte-error-boundary";
  import { onMount } from "svelte";
  import { v4 as uuidv4 } from "uuid";
  import * as _ from "lodash";
  import ms from "ms";
  import type { V1SimulatorConfiguration } from "../types/v1-simulator-configuration";
  import SimulatorRunner from "../components/simulator-runner.svelte";

  let main: HTMLElement;
  let view: "uploadConfigurationForm" | "simulator" | undefined;

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
  )
    document.querySelector("main")?.scroll({ top: 0, behavior: "smooth" });

  // Sauvegarde de la dernière configuration choisie dans le stockage local
  // Règle https://github.com/Samuel-Martineau/Simulateur-Evolution-Darwin/issues/27
  $: selectedConfiguration &&
    localStorage.setItem(
      LocalStorageKeys.LastVisitedConfiguration,
      selectedConfiguration.id
    );

  // Nécessaire pour que Svelte remarque la mise à jour des configurations
  $: selectedConfiguration && (configurations = configurations);

  // Utilitaires de contrôle des configurations
  async function downloadExampleConfigurations() {
    const exampleConfigurations = (
      await (await fetch("documentation/example-configurations")).json()
    ).map((configuration) => Object.assign(configuration, { id: uuidv4() }));
    configurations = [...exampleConfigurations, ...configurations];
    selectedConfiguration = exampleConfigurations?.[0] || selectedConfiguration;
  }

  function createConfiguration() {
    const configuration = generateBaseConfiguration();
    configurations = [...configurations, configuration];
    selectedConfiguration = configuration;
  }

  function uploadConfiguration({
    detail: configuration,
  }: {
    detail: SimulatorConfiguration | V1SimulatorConfiguration;
  }) {
    view = undefined;
    if (isV2SimulatorConfiguration(configuration)) {
      const newConfiguration = applyDefaultsDeep(
        Object.assign(configuration, { id: uuidv4() }),
        Object.assign(baseConfiguration, { seed: getRandomSeed() })
      );
      configurations = [...configurations, newConfiguration];
      selectedConfiguration = newConfiguration;
    } else {
      const newConfiguration = transpileV1ConfigurationToV2(configuration);
      configurations = [...configurations, newConfiguration];
      selectedConfiguration = newConfiguration;
    }
  }

  function duplicateConfiguration() {
    if (!selectedConfiguration) return;

    let newTitle = selectedConfiguration.title.trim();
    const titleChunks = _.words(newTitle);
    const endNumber = parseInt(_.last(titleChunks) || "");

    if (isNaN(endNumber)) newTitle += " 2";
    else
      newTitle = newTitle.replace(
        new RegExp(endNumber.toString() + "$"),
        (endNumber + 1).toString()
      );

    const newConfiguration = Object.assign(_.cloneDeep(selectedConfiguration), {
      id: uuidv4(),
      title: newTitle,
    });
    const curentIndex = configurations.indexOf(selectedConfiguration);
    configurations.splice(curentIndex + 1, 0, newConfiguration);
    configurations = configurations;
    selectedConfiguration = newConfiguration;
  }

  function downloadConfiguration() {
    if (!selectedConfiguration) return;
    const json = JSON.stringify(selectedConfiguration, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const uri = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = uri;
    anchor.download = `${selectedConfiguration.title}.json`;
    anchor.click();
  }

  function deleteConfiguration() {
    if (!selectedConfiguration) return;
    if (
      !confirm(
        `Êtes-vous sur de vouloir supprimer la configuration « ${selectedConfiguration.title} »`
      )
    )
      return;
    const index = configurations.indexOf(selectedConfiguration);
    configurations.splice(index, 1);
    selectedConfiguration = undefined;
    configurations = configurations;
  }

  function fixCorruptedConfiguration() {
    if (!selectedConfiguration) return;
    alert("Cette configuration est corrompue");
    alert("Elle sera donc supprimée");
    const index = configurations.indexOf(selectedConfiguration);
    configurations.splice(index, 1);
    configurations = configurations;
    selectedConfiguration =
      configurations[Math.min(index, configurations.length - 1)];
    setTimeout(window.location.reload.bind(window.location), ms("1s"));
  }

  // Défilement automatique lorsque l'usager revient du glossaire
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
  @import "src/styles/variables.scss";

  div {
    display: flex;
  }

  main {
    width: calc(100vw - #{$sidebar-width});
    height: calc(100vh - #{$navbar-height});
    overflow-y: auto;
    padding: $main-padding;
    box-sizing: border-box;
  }
</style>

<svelte:head>
  <title>
    Simulateur d'évolution - Éditeur de configuration -
    {(selectedConfiguration && selectedConfiguration.title) ||
      "Aucune configuration"}
  </title>
</svelte:head>

<Navbar />

<div>
  <ConfigurationsSidebar
    {configurations}
    bind:selectedConfiguration
    on:click={() => (view = undefined)}
    on:download-example-configurations={downloadExampleConfigurations}
    on:create-configuration={createConfiguration}
    on:upload-configuration={() => (view = "uploadConfigurationForm")}
  />
  <main bind:this={main}>
    {#if view === "uploadConfigurationForm"}
      <UploadConfigurationForm on:upload-configuration={uploadConfiguration} />
    {:else if view === "simulator" && selectedConfiguration}
      <SimulatorRunner configuration={selectedConfiguration} />
    {:else if selectedConfiguration}
      <Boundary onError={fixCorruptedConfiguration}>
        <ConfigurationEditor
          bind:configuration={selectedConfiguration}
          on:duplicate={duplicateConfiguration}
          on:download={downloadConfiguration}
          on:delete={deleteConfiguration}
          on:run={() => (view = "simulator")}
        />
      </Boundary>
    {:else}
      <h1>Bienvenue dans l'éditeur de configurations du simulateur</h1>
      <h2>Veuillez choisir une configuration dans la barre latérale</h2>
    {/if}
  </main>
</div>
