<script lang="ts">
  import type { Dependency } from "../types/dependency";

  export let dependencies: Dependency[];
</script>

<ul>
  {#each dependencies as { name, version, url }}
    <li><a href={url}>{name}</a> v{version}</li>
  {/each}
</ul>
