<script>
  import downloadFile from 'js-file-download';
  import uuid from 'uuid-random';
  import '../node_modules/bulma/css/bulma.min.css';
  import EditConfig from './EditConfig.svelte';
  import Modal from './Modal.svelte';
  import Navbar from './Navbar.svelte';
  import Sidebar from './Sidebar.svelte';

  const defaultConfig = {
    name: 'Nouvelle configuration',
    id: uuid(),
    prey: {
      name: '',
      startingNb: 0,
      genes: [
        {
          displayName: 'Vitesse',
          name: 'speed',
          modificator: '',
          avg: 0,
          stdDev: 0,
          value: 0,
          displayValue: '${this.value.toFixed(2)} ue / ut',
          adjustments: {},
        },
        {
          displayName: 'Nombre de bébés',
          name: 'nbOfBabies',
          modificator: '',
          avg: 0,
          stdDev: 0,
          value: 0,
          displayValue:
            "${Math.round(this.value)} bébé${ this.value > 1 ? 's' : '' }",
          adjustments: {},
        },
        {
          displayName: 'Longévité',
          name: 'longevity',
          modificator: '',
          avg: 0,
          stdDev: 0,
          value: 0,
          displayValue: '${this.value.toFixed(2)} ut',
          adjustments: {},
        },
        {
          displayName: 'Intervalle entre les périodes de reproduction',
          name: 'intervalBetweenReproducingPeriods',
          modificator: '',
          avg: 0,
          stdDev: 0,
          value: 0,
          displayValue: '${this.value.toFixed(2)} ut',
          adjustments: {},
        },
        {
          displayName: 'Distance de vue',
          name: 'renderDistance',
          modificator: '',
          avg: 0,
          stdDev: 0,
          value: 0,
          displayValue: '${this.value.toFixed(2)} ue',
          adjustments: {},
        },
        {
          displayName: 'Nombre de plantes à manger',
          name: 'hungerLevel',
          modificator: '',
          avg: 0,
          stdDev: 0,
          value: 0,
          displayValue: '${Math.round(this.value)} plantes',
          adjustments: {},
        },
        {
          displayName: 'Temps pour manger',
          name: 'eatingInterval',
          modificator: '',
          avg: 0,
          stdDev: 0,
          value: 0,
          displayValue: '${this.value.toFixed(2)} ue',
          adjustments: {},
        },
      ],
    },
    predator: {
      name: '',
      startingNb: 0,
      genes: [
        {
          displayName: 'Vitesse',
          name: 'speed',
          modificator: '',
          avg: 0,
          stdDev: 0,
          value: 0,
          displayValue: '${this.value.toFixed(2)} ue / ut',
          adjustments: {},
        },
        {
          displayName: 'Nombre de bébés',
          name: 'nbOfBabies',
          modificator: '',
          avg: 0,
          stdDev: 0,
          value: 0,
          displayValue:
            "${Math.round(this.value)} bébé${ this.value > 1 ? 's' : '' }",
          adjustments: {},
        },
        {
          displayName: 'Longévité',
          name: 'longevity',
          modificator: '',
          avg: 0,
          stdDev: 0,
          value: 0,
          displayValue: '${this.value.toFixed(2)} ut',
          adjustments: {},
        },
        {
          displayName: 'Intervalle entre les périodes de reproduction',
          name: 'intervalBetweenReproducingPeriods',
          modificator: '',
          avg: 0,
          stdDev: 0,
          value: 0,
          displayValue: '${this.value.toFixed(2)} ut',
          adjustments: {},
        },
        {
          displayName: 'Distance de vue',
          name: 'renderDistance',
          modificator: '',
          avg: 0,
          stdDev: 0,
          value: 0,
          displayValue: '${this.value.toFixed(2)} ue',
          adjustments: {},
        },
        {
          displayName: "Nombre d'herbivores à manger",
          name: 'hungerLevel',
          modificator: '',
          avg: 0,
          stdDev: 0,
          value: 0,
          displayValue: '${Math.round(this.value)} herbivores',
          adjustments: {},
        },
        {
          displayName: 'Temps pour manger',
          name: 'eatingInterval',
          modificator: '',
          avg: 0,
          stdDev: 0,
          value: 0,
          displayValue: '${this.value.toFixed(2)} ue',
          adjustments: {},
        },
      ],
    },
    plant: {
      startingNb: 0,
      spawnRate: 0,
      spawnInterval: 0,
    },
    size: 8000,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    speed: 1,
    seed: Math.floor(Math.random() * 100000000),
    nbOfAnimalsSnapshotInterval: 50,
  };

  let configs = loadConfigs();
  let currConfig = configs[0] || undefined;

  let showSimulatorModal = false;
  let loaded = false;
  let fullscreenDiv;
  let iframe;

  let showUploadModal = false;
  let chosenFile = '';

  $: if (currConfig) configs = configs;
  $: configs = configs.sort((a, b) => a.name > b.name);

  function save() {
    localStorage.setItem('configs', JSON.stringify(configs));
  }

  function newConfig() {
    let config = JSON.parse(JSON.stringify(defaultConfig));
    config.id = uuid();
    configs = [...configs, config];
    editConfig({ detail: config.id });
  }

  function editConfig({ detail: id }) {
    currConfig = configs.filter((c) => c.id === id)[0];
  }

  function deleteConfig() {
    const i = configs.findIndex((c) => c.id === currConfig.id);
    configs = configs.filter((c) => c.id !== currConfig.id);
    if (i > 0) currConfig = configs[i - 1];
    else currConfig = undefined;
  }

  function duplicateConfig() {
    const i = configs.findIndex((c) => c.id === currConfig.id);
    const part1 = configs.slice(0, i + 1);
    const part2 = configs.slice(i + 1);
    const newConfig = JSON.parse(JSON.stringify(currConfig));
    newConfig.name += ' (Copie)';
    newConfig.id = uuid();
    currConfig = newConfig;
    configs = [...part1, newConfig, ...part2];
  }

  function executeConfig() {
    showSimulatorModal = true;
    currConfig.prey.genes.forEach((g) => {
      for (let key in g.adjustments) {
        if (!g.adjustments[key]) delete g.adjustments[key];
      }
    });
    currConfig.predator.genes.forEach((g) => {
      for (let key in g.adjustments) {
        if (!g.adjustments[key]) delete g.adjustments[key];
      }
    });
    if (!loaded) {
      setTimeout(executeConfig, 0);
    } else {
      let simulator = iframe.contentWindow;
      simulator.config = currConfig;
      simulator.start();
      loaded = false;
    }
  }

  function uploadConfig() {
    showUploadModal = true;
  }

  function endUploadConfig() {
    if (!chosenFile) return;
    showUploadModal = false;
    let reader = new FileReader();
    reader.onload = (e) => {
      const newConfig = Object.assign(
        JSON.parse(JSON.stringify(defaultConfig)),
        JSON.parse(e.target.result)
      );
      newConfig.name = newConfig.name || 'Configuration téléversée';
      newConfig.id = uuid();
      configs = [...configs, newConfig];
      currConfig = newConfig;
    };
    reader.readAsText(chosenFile);
  }

  function loadConfigs() {
    return JSON.parse(localStorage.getItem('configs')) || [];
  }

  function toggleSimulatorFullscreen() {
    if (iframe.requestFullscreen) iframe.requestFullscreen();
    else if (iframe.mozRequestFullScreen) iframe.mozRequestFullScreen();
    else if (iframe.webkitRequestFullscreen) iframe.webkitRequestFullscreen();
    else if (iframe.msRequestFullscreen) iframe.msRequestFullscreen();
  }

  function downloadConfig() {
    downloadFile(
      JSON.stringify(currConfig, null, 2),
      currConfig.name + '.json'
    );
  }
</script>

<style lang="scss" global>
  * {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
  }

  #wrapper {
    display: flex;
    padding: 15px;
  }

  :-moz-full-screen {
    background: white;
  }

  :-webkit-full-screen {
    background: white;
  }

  :-ms-fullscreen {
    background: white;
  }

  :fullscreen {
    background: white;
  }
</style>

<svelte:head>
  <title>Simulateur d'évolution selon Darwin</title>
  <link rel="stylesheet" href="bulma.css" />
</svelte:head>

<Navbar />

<div id="wrapper">
  <Sidebar
    {configs}
    currentConfigId={currConfig ? currConfig.id : undefined}
    on:save={save}
    on:delete={deleteConfig}
    on:duplicate={duplicateConfig}
    on:execute={executeConfig}
    on:newconfig={newConfig}
    on:uploadconfig={uploadConfig}
    on:editconfig={editConfig}
    on:download={downloadConfig} />
  {#if currConfig}
    <EditConfig bind:config={currConfig} />
  {/if}
</div>

<Modal bind:show={showSimulatorModal}>
  <h1 class="title is-4" slot="title" style="margin: 0;">
    {currConfig ? currConfig.name : undefined}
  </h1>
  <div bind:this={fullscreenDiv}>
    <iframe
      id="simulator"
      src="simulator.html"
      frameborder="0"
      title="simulateur"
      style="width: 75vw; height: 79vh;"
      on:load={() => (loaded = true)}
      bind:this={iframe} />
  </div>
  <button
    class="button is-primary"
    style="width: 100%;"
    on:click={toggleSimulatorFullscreen}>
    Plein écran
  </button>
</Modal>

<Modal bind:show={showUploadModal} height="100px">
  <h1 class="title is-4" slot="title" style="margin: 0;">
    Téléversement d'une configuration
  </h1>
  <div class="file has-name is-fullwidth">
    <label class="file-label">
      <input
        class="file-input"
        type="file"
        accept="application/json"
        on:change={(e) => setTimeout(() => (chosenFile = e.target.files[0]), 0)} />
      <span class="file-cta">
        <span class="file-label">⬆️ Choisissez un fichier ⬆️</span>
      </span>
      <span class="file-name">
        {chosenFile.name || 'Veuillez téléverser un fichier de type JSON'}
      </span>
    </label>
  </div>
  <button
    class="button"
    class:is-success={chosenFile}
    class:is-danger={!chosenFile}
    on:click={endUploadConfig}
    style="margin-top: 10px; width: 100%; transition: background 500ms;">
    Téléverser
  </button>
</Modal>
