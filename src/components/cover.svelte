<style lang="scss">
  @use 'sass:map';

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
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 90vw;
    padding: 100px;
    box-sizing: border-box;
  }

  h1 {
    color: map-get($colors, green);
    font-size: 100px;
  }

  p {
    color: white;
    font-size: 42px;
  }
</style>

<div id="page">
  <div id="container">
    <h1>
      <slot name="title" />
    </h1>
    <p>
      <slot name="description" />
    </p>
    <span>
      <slot name="actions" />
    </span>
  </div>
</div>
