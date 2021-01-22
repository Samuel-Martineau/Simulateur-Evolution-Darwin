<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { SimulatorConfiguration } from "../types/simulator-configuration";
  import { toFactory } from "../utils";
  import Button from "./button.svelte";

  export let configurations: SimulatorConfiguration[];
  export let selectedConfiguration: SimulatorConfiguration;

  const dispatch = createEventDispatcher();

  const buttonStyles = "width: 95%; margin: inherit auto;";
</script>

<style lang="scss">
  @use "sass:map";

  @import "src/styles/variables.scss";

  aside {
    width: $sidebar-width;
    height: calc(100vh - #{$navbar-height});
    background-color: map-get($colors, "palegreen");
    box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.35);
    box-sizing: border-box;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  h1 {
    text-align: center;
    color: white;
  }

  ul {
    list-style: none;
    background-color: map-get($colors, "yellow");
    border-radius: 15px;
    padding: 10px;
    box-shadow: inset 4px 4px 4px rgba(0, 0, 0, 0.25);
    overflow-y: auto;
    margin: 15px 0;
    flex: 1;

    $thumbBG: map-get($colors, "green");
    $scrollbarBG: transparent;
    scrollbar-width: thin;
    scrollbar-color: $thumbBG $scrollbarBG;
    &::-webkit-scrollbar-thumb {
      background: $thumbBG;
      border-radius: 15px;
    }
    &::-webkit-scrollbar {
      width: 10px;
    }
    &::-webkit-scrollbar-track {
      background: $scrollbarBG;
    }

    li {
      font-size: 20px;
      padding: 5px;
      border-radius: 10px;
      cursor: pointer;

      &[data-selected="true"] {
        box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.35);
        background-color: map-get($colors, "palegreen");
        color: white;
      }

      & > span.no-title {
        font-style: italic;
      }
    }

    h2 {
      text-align: center;
    }
  }
</style>

<aside>
  <h1>Configurations</h1>
  <ul>
    {#each configurations as configuration (configuration.id)}
      <li
        data-selected={selectedConfiguration === configuration}
        on:click
        on:click={() => (selectedConfiguration = configuration)}
      >
        {#if configuration.title}
          {configuration.title}
        {:else}<span class="no-title">(Sans titre)</span>{/if}
      </li>
    {:else}
      <h2>Vous n'avez aucune configuration...</h2>
      <Button
        color="green"
        on:click={toFactory(dispatch, "download-example-configurations")}
      >Télécharger les configurations d'exemple</Button
      >
    {/each}
  </ul>

  <Button
    color="green"
    style={buttonStyles}
    on:click={toFactory(dispatch, "create-configuration")}
  >Créer une nouvelle configuration</Button
  >
  <Button
    color="green"
    style={buttonStyles}
    on:click={toFactory(dispatch, "upload-configuration")}
  >Téléverser une configuration</Button
  >
</aside>
