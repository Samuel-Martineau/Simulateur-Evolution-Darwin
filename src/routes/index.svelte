<script context="module">
  export async function preload({}, { introCompleted }) {
    if (introCompleted) this.redirect(303, "/simulateur");
  }
</script>

<script>
  import Button from "../components/button.svelte";
  import Cover from "../components/cover.svelte";
  import { description } from "../../package.json";
</script>

<svelte:head>Simuler l'évolution</svelte:head>

<Cover>
  <span slot="title">Simuler l'évolution</span>
  <span slot="description">{description}</span>
  <span slot="actions">
    <Button color="green" style="font-size: 25px" href="/demarrer"
      >Démarrer</Button
    >
  </span>
</Cover>
