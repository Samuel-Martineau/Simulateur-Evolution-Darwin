<script lang="ts">
  import type { SimulatorConfiguration } from "../interfaces/simulator-configuration";
  import { v4 as uuidv4 } from "uuid";
  import PreConfiguredInput from "./form/pre-configured-input.svelte";
  import {
    generalConfigurationFormInputData,
    getAnimalSpeciesConfigurationFormInputData,
    plantsSpecieConfigurationFormInputData,
  } from "../data/configuration-form-input-data";
  import InputGroup from "./form/input-group.svelte";
  import { onMount, setContext } from "svelte";
  import GithubSlugger from "github-slugger";
  import { element } from "svelte/internal";

  setContext("slugger", new GithubSlugger());

  export let configuration: SimulatorConfiguration;

  function regenerateSEED() {
    configuration.seed = uuidv4();
  }

  function handleNewValue() {
    configuration = configuration;
  }
</script>

<h1>Configuration</h1>

{#each generalConfigurationFormInputData as data}
  <PreConfiguredInput {data} on:newValue={handleNewValue} {configuration} />
{/each}

<InputGroup displayName="Espèce des plantes">
  {#each plantsSpecieConfigurationFormInputData as data}
    <PreConfiguredInput {data} on:newValue={handleNewValue} {configuration} />
  {/each}
</InputGroup>

<InputGroup displayName="Espèce des proies">
  {#each getAnimalSpeciesConfigurationFormInputData('prey') as data}
    <PreConfiguredInput {data} on:newValue={handleNewValue} {configuration} />
  {/each}
</InputGroup>

<InputGroup displayName="Espèce des prédateurs">
  {#each getAnimalSpeciesConfigurationFormInputData('predator') as data}
    <PreConfiguredInput {data} on:newValue={handleNewValue} {configuration} />
  {/each}
</InputGroup>

<br />
