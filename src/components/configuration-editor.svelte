<script lang="ts">
  import type { SimulatorConfiguration } from "../types/simulator-configuration";

  import PreConfiguredInput from "./form/pre-configured-input.svelte";
  import {
    generalConfigurationFormInputData,
    getAnimalSpeciesConfigurationFormInputData,
    plantsSpecieConfigurationFormInputData,
  } from "../data/configuration-form-input-data";
  import InputGroup from "./form/input-group.svelte";
  import { createEventDispatcher, onMount, setContext } from "svelte";
  import GithubSlugger from "github-slugger";
  import Button from "./button.svelte";

  export let configuration: SimulatorConfiguration;

  setContext("slugger", new GithubSlugger());

  const dispatch = createEventDispatcher();

  function handleNewValue() {
    configuration = configuration;
  }
</script>

<style lang="scss">
  @use "sass:map";

  @import "src/styles/variables.scss";

  section {
    position: relative;
  }

  #control-buttons {
    position: absolute;
    top: -3px;
    right: 0;
  }
</style>

<section>
  <h1>Configuration</h1>

  <div id="control-buttons">
    <Button
      color="green"
      type="inline"
      on:click={dispatch.bind(undefined, "duplicate")}
    >Dupliquer</Button
    >
    <Button
      color="blue"
      type="inline"
      on:click={dispatch.bind(undefined, "download")}
    >Télécharger</Button
    >
    <Button
      color="red"
      type="inline"
      on:click={dispatch.bind(undefined, "delete")}
    >Supprimer</Button
    >
    <Button
      color="purple"
      type="inline"
      on:click={dispatch.bind(undefined, "run")}
    >Exécuter</Button
    >
  </div>

  {#each generalConfigurationFormInputData as data}
    <PreConfiguredInput {data} on:newValue={handleNewValue} {configuration} />
  {/each}

  <InputGroup displayName="Espèce des plantes">
    {#each plantsSpecieConfigurationFormInputData as data}
      <PreConfiguredInput {data} on:newValue={handleNewValue} {configuration} />
    {/each}
  </InputGroup>

  <InputGroup displayName="Espèce des proies">
    {#each getAnimalSpeciesConfigurationFormInputData("prey") as data}
      <PreConfiguredInput {data} on:newValue={handleNewValue} {configuration} />
    {/each}
  </InputGroup>

  <InputGroup displayName="Espèce des prédateurs">
    {#each getAnimalSpeciesConfigurationFormInputData("predator") as data}
      <PreConfiguredInput {data} on:newValue={handleNewValue} {configuration} />
    {/each}
  </InputGroup>

  <br />
</section>
