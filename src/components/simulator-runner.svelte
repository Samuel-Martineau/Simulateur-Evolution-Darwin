<script lang="ts">
  import type { SimulatorConfiguration } from "../types/simulator-configuration";
  import { transpileV2ConfigurationToV1 } from "../utils";

  export let configuration: SimulatorConfiguration;

  let iframe: HTMLIFrameElement;
  let loaded: boolean = false;

  $: if (loaded) {
    const simulator = iframe.contentWindow;
    const v1Configuration = transpileV2ConfigurationToV1(configuration);
    //@ts-expect-error
    simulator.config = v1Configuration;
    //@ts-expect-error
    simulator.start();
  }
</script>

<style lang="scss">
  @import "src/styles/variables.scss";

  iframe {
    width: 100%;
    max-width: 1250px;
    height: calc(100vh - #{$navbar-height + 40px + 2 * $main-padding});
  }
</style>

<h1>Simulateur</h1>
<iframe
  src="simulator-core/simulator.html"
  frameborder="0"
  title="simulateur"
  on:load={() => (loaded = true)}
  bind:this={iframe}
/>
