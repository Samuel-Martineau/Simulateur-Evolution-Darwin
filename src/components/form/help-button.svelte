<script lang="ts">
  import { LocalStorageKeys } from "../../types/localstorage-keys";
  import RedQuestionMarkIcon from "images/red-question-mark.svg";
  import { goto } from "@sapper/app";

  export let glossaryId: string;
  export let id: string;

  function handleClick() {
    localStorage.setItem(LocalStorageKeys.HelpRequestFromElement, `#${id}`);
    goto(`/documentation/glossaire#${glossaryId}`);
  }
</script>

<style lang="scss">
  img {
    z-index: 2;
    float: right;
    position: relative;
    height: 20px;
    transition: all 125ms;

    &:hover {
      transform: scale(1.5);
    }
  }
</style>

<img src={RedQuestionMarkIcon} alt="sos-button" on:click={handleClick} />
