<script context="module">
  export async function preload({}, { isMobileUA, mobileOverride }) {
    if (!isMobileUA || mobileOverride) this.redirect(303, "/");
  }
</script>

<script>
  import Button from "../../components/button.svelte";
</script>

<style lang="scss">
  @import "src/styles/variables.scss";

  #page {
    background: linear-gradient(
      to top right,
      map-get($colors, green),
      map-get($colors, yellow)
    );
    width: 100%;
    height: 100%;
  }

  #container {
    text-align: center;
    padding: 15px;
    position: fixed;
    top: 50%;
    left: 50%;
    width: 75vw;
    transform: translate(-50%, -50%);
  }

  h1 {
    color: map-get($colors, green);
  }

  p {
    color: white;
  }
</style>

<svelte:head>
  <title>Simulateur d'évolution - Oh non! 📵</title>
</svelte:head>

<div id="page">
  <div id="container">
    <h1>Oh non!</h1>
    <p>
      Il semblerait que vous êtes sur un appareil mobile 📱, mais cet outil a
      été créer pour ordinateurs 💻
    </p>
    <Button color="green" href="/mobile/continuer">
      Continuer (à vos risques et périls)
    </Button>
  </div>
</div>
