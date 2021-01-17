<script context="module" lang="ts">
  export const contextKey = "parent-input-group";
</script>

<script lang="ts">
  import { getContext, hasContext, setContext } from "svelte";
  import type GithubSlugger from "github-slugger";
  import HelpButton from "./help-button.svelte";

  export let displayName: string;
  export let shownInGlossary: boolean = false;
  export let glossaryId: string | undefined = undefined;
  export let open: boolean = true;

  const parentName = hasContext(contextKey) ? getContext(contextKey) : "";
  const fullName = parentName ? `${parentName} - ${displayName}` : displayName;

  setContext(contextKey, fullName);

  const slugger = getContext("slugger") as GithubSlugger;
  const slug = slugger.slug(fullName);
</script>

<style lang="scss">
  @use "sass:map";

  @import "src/styles/variables.scss";

  fieldset {
    border: 2px dotted map-get($colors, "darkgray");
    padding: 0 10px;
    box-sizing: border-box;
    margin: 10px 0;
  }

  summary {
    font-size: 1.5rem;
    font-weight: bold;
    outline: none;
  }
</style>

<fieldset>
  <details bind:open>
    <summary id={slug}>
      {displayName}
      {#if shownInGlossary}
        <HelpButton {glossaryId} id={slug} />
      {/if}
    </summary>
    <slot />
  </details>
</fieldset>
