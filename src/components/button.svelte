<script lang="ts">
  /** @restProps {a | button} */
  export let href: string | undefined = undefined;
  export let color: 'green' | 'yellow';
</script>

<style lang="scss">
  @import 'src/styles/theme.scss';

  .button {
    cursor: pointer;
    display: inline-block;
    border-radius: 15px;
    user-select: none;
    padding: 15px;
    margin: 10px;
    transition: transform 125ms ease-in-out;
    text-decoration: none;
    box-sizing: border-box;
    text-align: center;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);

    &.yellow {
      color: black;
      background-color: $yellow;
    }

    &.green {
      color: white;
      background-color: $green;
    }

    &:hover {
      transform: scale(110%);
    }
  }
</style>

{#if href}
  <a {href} class="button {color}" {...$$restProps}>
    <slot />
  </a>
{:else}
  <div on:click class="button {color}" {...$$restProps}>
    <slot />
  </div>
{/if}
