<script lang="ts">
  import { createEventDispatcher, getContext, hasContext } from "svelte";
  import type { InputSelectOptions } from "../../types/configuration-form-input-data";
  import { contextKey } from "./input-group.svelte";
  import type GithubSlugger from "github-slugger";
  import HelpButton from "./help-button.svelte";
  import { pluralize } from "../../utils";

  export let type: "text" | "number" | "checkbox" | "select" | "file" = "text";
  export let name: string;
  export let accept: string = "";
  export let files: FileList | undefined = undefined;
  export let multiple: boolean = false;
  export let options: InputSelectOptions | undefined = undefined;
  export let step: number | undefined = undefined;
  export let max: number | undefined = undefined;
  export let min: number | undefined = undefined;
  export let disabled: boolean = false;
  export let required: boolean = false;
  export let shownInGlossary: boolean = false;
  export let glossaryId: string | undefined = undefined;
  export let value: any;
  export let actionButtonIconUrl: string | undefined = undefined;

  const dispatch = createEventDispatcher();
  const slugger = getContext("slugger") as GithubSlugger;
  const slug = slugger.slug(
    hasContext(contextKey) ? `${getContext(contextKey)} - ${name}` : name
  );

  $: dispatch("newValue", value);

  function handleInput(
    event: Event & { currentTarget: EventTarget & HTMLInputElement }
  ) {
    const rawValue = event.currentTarget.value;
    switch (type) {
      case "checkbox":
        value = event.currentTarget.checked;
        break;
      case "number":
        value = +rawValue;
        break;
      default:
        value = rawValue;
        break;
    }
  }
</script>

<style lang="scss">
  @import "src/styles/variables.scss";

  $input-font-size: 20px;
  $input-padding: 5px;

  @mixin general-input {
    border-radius: 5px;
    font-size: $input-font-size;
    border: none;
    background-color: map-get($colors, "lightgray");
    padding: $input-padding;
    width: 100%;
    border-color: transparent;
    border-width: 3px;
    border-style: solid;
    box-sizing: border-box;
    transition: all 125ms ease-in-out;
    margin-bottom: 10px;

    &:focus {
      border-color: map-get($colors, "green");
      outline: none;
    }
  }

  div.input-wrapper {
    display: flex;
    position: relative;
  }

  label {
    width: 100%;
    display: inline-block;
    font-size: 16px;
    vertical-align: middle;

    &[data-disabled="true"] {
      color: map-get($colors, "darkgray");
      transition: all 125ms ease-in-out;
    }

    div.file-input {
      @include general-input;
    }
  }

  select {
    @include general-input;

    &:disabled {
      color: map-get($colors, "darkgray");
    }
  }

  input {
    @include general-input;

    &:read-only {
      color: map-get($colors, "darkgray");

      &:focus {
        border-color: map-get($colors, "blue");
      }
    }

    &:invalid {
      box-shadow: none;
      border-color: map-get($colors, "red");
    }

    &[type="file"] {
      display: none;
    }

    &[type="checkbox"] {
      $size: $input-font-size + 2 * $input-padding + 5px;
      width: $size;
      height: $size;
      appearance: none;

      &:checked {
        background-color: map-get($colors, "green");

        &:after {
          content: "\2713";
          color: white;
          position: absolute;
          top: $size / 2;
          left: $size / 2;
          transform: translate(-50%, -50%);
        }
      }
    }
  }

  button {
    @include general-input;

    margin-left: 5px;
    padding: $input-padding;
    width: min-content;

    &:focus,
    &:hover {
      border-color: map-get($colors, "blue");
      outline: none;
    }

    &:active {
      background-color: transparentize(map-get($colors, "blue"), 0.75);
    }

    img {
      height: 20px;
      display: block;
      pointer-events: none;
    }
  }
</style>

<label for={slug} data-disabled={disabled}>
  {name}
  {#if shownInGlossary}
    <HelpButton {glossaryId} id={slug} />
  {/if}
  {#if type === "file"}
    <div class="file-input">
      <b
        >{pluralize("Fichier", multiple)}
        {pluralize("sélectionné", multiple)}:
      </b>
      {files
        ? Array.from(files)
            .map((f) => f.name)
            .join(", ")
        : "Sélectonné un fichier"}
    </div>
  {/if}
</label>

<div class="input-wrapper">
  {#if type === "select"}
    <select id={slug} {disabled} {required} bind:value>
      {#each Object.entries(options || {}) as [optionValue, optionName]}
        <option value={optionValue}>{optionName}</option>
      {/each}
    </select>
  {:else if type === "file"}
    <input
      id={slug}
      type="file"
      {required}
      readonly={disabled}
      {accept}
      {multiple}
      bind:files
    />
  {:else}
    <input
      id={slug}
      {type}
      {min}
      {max}
      {step}
      {required}
      readonly={disabled}
      {value}
      checked={value}
      on:input={handleInput}
    />
  {/if}
  {#if actionButtonIconUrl}
    <button
      on:click
      type="button"
      on:click={dispatch.bind(undefined, "actionClicked")}>
      <img src={actionButtonIconUrl} alt="action-button" />
    </button>
  {/if}
</div>
