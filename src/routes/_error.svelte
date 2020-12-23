<script lang="ts">
  import Button from "../components/button.svelte";
  import Cover from "../components/cover.svelte";

  export let status: number;
  export let error: Error;

  const dev = process.env.NODE_ENV === "development";
</script>

<svelte:head>
  <title>Simulateur d'évolution - Oh non! | Erreur {status}</title>
</svelte:head>

<Cover>
  <span slot="title">Oh non!</span>
  <span slot="description">Erreur
    {status}
    |
    {error.message}
    {#if dev && error.stack}
      |
      <pre>{error.stack}</pre>
    {/if}
  </span>
  <span slot="actions">
    <Button color="green" style="font-size: 25px" href="/">
      Retour à la page principale
    </Button>
  </span>
</Cover>
