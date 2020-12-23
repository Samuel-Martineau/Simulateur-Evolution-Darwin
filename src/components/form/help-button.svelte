<script lang="ts">
  import { LocalStorageKeys } from "../../types/localstorage-keys";
  import { goto } from "@sapper/app";

  export let glossaryId: string;
  export let id: string;
  export let size: string;

  function handleClick() {
    localStorage.setItem(LocalStorageKeys.HelpRequestFromElement, `#${id}`);
    goto(`/documentation/glossaire#${glossaryId}`);
  }
</script>

<style lang="scss">
  img {
    float: right;
    position: relative;
    width: var(--size);
    bottom: 2px;
    transition: filter 125ms;
    filter: contrast(0.5);

    &:hover {
      filter: contrast(1);
    }
  }
</style>

<img
  src="1F198.svg"
  alt="sos-button"
  on:click={handleClick}
  style="--size: {size};" />
