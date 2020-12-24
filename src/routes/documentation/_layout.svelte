<script lang="ts">
  import Navbar from "../../components/navbar.svelte";
  import { stores } from "@sapper/app";
  import { onDestroy, onMount } from "svelte";

  const { page } = stores();
  let unsubscribe;

  // Transformation des ancres relatives en ancres absolues => SAPPER ne traite pas correctement les ancres relatives
  onMount(() => {
    unsubscribe = page.subscribe(() => {
      document.querySelectorAll("main a").forEach((elem) => {
        const link = elem as HTMLAnchorElement;
        const href = link.getAttribute("href") || "";
        if (href.match(/^\#(.*)$/))
          link.href = `${window.location.pathname}${href}`;
      });
    });
  });

  onDestroy(() => unsubscribe && unsubscribe());
</script>

<style lang="scss">
  @use 'sass:map';

  @import "src/styles/variables.scss";

  main {
    background-color: map-get($colors, lightgray);
    border-radius: 25px;
    margin: 25px;
    padding: 25px;

    :global(:is(#{map.keys($headings)}) > a) {
      color: black;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }

    // Application de styles différents pour la table des matières
    :global(h2#table-des-matières + ul, h2#table-des-matières + ul ul) {
      list-style-type: upper-roman;
    }
    :global(h2#table-des-matières + ul li a) {
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>

<Navbar />

<main>
  <slot />
</main>
