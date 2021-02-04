<script lang="ts" context="module">
  export async function preload(
    { path },
    { isMobileUA, mobileOverride, introCompleted }
  ) {
    if (isMobileUA && !path.startsWith("/mobile") && !mobileOverride)
      this.redirect(303, "/mobile");

    if (
      !introCompleted &&
      path !== "/" &&
      (!isMobileUA || (isMobileUA && mobileOverride))
    )
      this.redirect(303, "/");

    if (process.browser) {
      // Détection de si l'appareil utilise une sourie ou un écran tactile
      const { matches } = matchMedia("(pointer: fine)");
      if (!matches && !isMobileUA)
        alert(
          "Cet outil a été conçu pour une utilisation avec une sourie, mais votre appareil ne semble pas en avoir"
        );
    }
  }
</script>

<style global lang="scss">
  @import "src/styles/global.scss";
</style>

<slot />
