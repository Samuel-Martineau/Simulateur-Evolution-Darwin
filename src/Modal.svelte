<script>
  import { fade } from 'svelte/transition';
  import cssVars from 'svelte-css-vars';

  export let show = false;
  export let width = '80vw';
  export let height = '80vh';

  $: styleVars = {
    width,
    height,
  };

  document.body.style.height = '100vh';
  document.addEventListener('keyup', e => (show = show && e.key !== 'Escape'));

  $: if (show) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'initial';
  }

  function close() {
    show = false;
  }
</script>

<style lang="scss">
  #modal {
    width: var(--width);
    min-height: var(--height);
    position: absolute;
    transform: translateY(-50%) translateX(-50%);
    top: 50%;
    left: 50%;
    background: white;
    border-radius: 17px;
    z-index: 1001;

    & > div {
      margin: 20px;

      hr {
        margin: 10px 0;
      }
    }

    #close {
      font-size: 40px;
      position: absolute;
      right: 10px;
      top: 5px;
      cursor: default;
    }
  }

  #backdrop {
    width: 100vw;
    height: 100vh;
    background: rgba(82, 88, 97, 0.7);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
  }

  .hidden {
    display: none;
  }
</style>

{#if show}
  <div>
    <div id="backdrop" on:click={close} />
    <div id="modal" use:cssVars={styleVars}>
      <div>
        <span id="close" on:click={close}>⛔️</span>
        <slot name="title" />
        <hr />
        <slot />
      </div>
    </div>
  </div>
{/if}
