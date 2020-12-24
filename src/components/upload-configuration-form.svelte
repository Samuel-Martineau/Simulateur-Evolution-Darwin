<script lang="ts">
  import GithubSlugger from "github-slugger";
  import { createEventDispatcher, setContext } from "svelte";
  import { toFactory } from "../utils";
  import Button from "./button.svelte";
  import Input from "./form/input.svelte";

  const dispatch = createEventDispatcher();

  setContext("slugger", new GithubSlugger());

  let files: FileList;

  $: file = files?.[0];
  let fileContent;

  $: if (file) file.text().then((content) => (fileContent = content));
</script>

<h1>Téléverser une configuration</h1>

<Input
  type="file"
  name="Fichier de configuration"
  required
  accept=".json"
  bind:files />

<Button
  color="green"
  disabled={!fileContent}
  on:click={() => dispatch('upload-configuration', JSON.parse(fileContent))}>
  Téléverser
</Button>
