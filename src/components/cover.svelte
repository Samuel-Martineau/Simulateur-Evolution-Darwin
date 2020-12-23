<style lang="scss">
  @import 'src/styles/theme.scss';

  #page {
    background: linear-gradient(to top right, $green, $yellow);
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
    color: $green;
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
