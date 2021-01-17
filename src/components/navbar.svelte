<script lang="ts">
  import Button from "../components/button.svelte";
</script>

<style lang="scss">
  @import "src/styles/variables.scss";

  nav {
    position: relative;
    background-color: map-get($colors, "green");
    padding: 10px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: $navbar-height;
    box-sizing: border-box;
    z-index: 10;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }

  img {
    height: 80px;
  }

  h1 {
    margin-left: 15px;
    font-size: 36px;
  }

  div {
    display: flex;
    align-items: center;

    &:last-child {
      background-color: darken(map-get($colors, "green"), 10);
      border-radius: 15px;
      padding: 5px;
      box-shadow: inset 4px 4px 4px rgba(0, 0, 0, 0.25);
    }
  }
</style>

<nav>
  <div>
    <img src="logo-128.png" alt="logo" />
    <h1>Simulateur d'évolution</h1>
  </div>
  <div>
    <Button color="yellow" href="/simulateur">Simulateur</Button>
    <Button color="yellow" href="/documentation/glossaire">Glossaire</Button>
    <Button color="yellow" href="/documentation/a-propos">À propos</Button>
  </div>
</nav>
