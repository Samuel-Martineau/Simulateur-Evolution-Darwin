<script lang="ts">
  import { createEventDispatcher, getContext, hasContext } from "svelte";
  import type {
    ConfigurationFormInputData,
    InputSelectOptions,
  } from "../../interfaces/configuration-form-input-data";
  import { contextKey } from "./input-group.svelte";
  import type GithubSlugger from "github-slugger";
  import { goto } from "@sapper/app";
  import HelpButton from "./help-button.svelte";

  export let type: Exclude<ConfigurationFormInputData["type"], "group"> =
    "text";
  export let options: InputSelectOptions | undefined = undefined;
  export let step: number | undefined = undefined;
  export let max: number | undefined = undefined;
  export let min: number | undefined = undefined;
  export let disabled: boolean = false;
  export let required: boolean = false;
  export let name: string;
  export let shownInGlossary: boolean = false;
  export let glossaryId: string | undefined = undefined;
  export let value: any;

  const dispatch = createEventDispatcher();
  const slugger = getContext("slugger") as GithubSlugger;
  const slug = slugger.slug(
    hasContext(contextKey) ? `${getContext(contextKey)} - ${name}` : name
  );
  const hasActionButton = !!$$props.$$slots;

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
  @import "src/styles/theme.scss";
  @import "src/styles/variables.scss";

  $input-font-size: 20px;
  $input-padding: 5px;

  div {
    display: flex;
    position: relative;
  }

  label {
    width: 100%;
    display: inline-block;
    font-size: 16px;
    vertical-align: middle;

    &[data-disabled="true"] {
      color: $darkgray;
      transition: all 125ms ease-in-out;
    }

    // img {
    //   float: right;
    //   position: relative;
    //   width: 20px;
    //   height: 100%;
    //   bottom: 2px;
    //   filter: contrast(0.5);
    //   transition: filter 125ms;
    //   &:hover {
    //     filter: contrast(1);
    //   }
    // }
  }

  @mixin general-input {
    border-radius: 5px;
    font-size: $input-font-size;
    border: none;
    background-color: $lightgray;
    padding: $input-padding;
    width: 100%;
    border-color: transparent;
    border-width: 3px;
    border-style: solid;
    box-sizing: border-box;
    transition: all 125ms ease-in-out;
    margin-bottom: 10px;

    &:focus {
      border-color: $green;
      outline: none;
    }
  }

  select {
    @include general-input;

    &:disabled {
      color: $darkgray;
    }
  }

  input {
    @include general-input;

    &:read-only {
      color: $darkgray;

      &:focus {
        border-color: $blue;
      }
    }

    &:invalid {
      box-shadow: none;
      border-color: red;
    }

    &[type="checkbox"] {
      $size: $input-font-size + 2 * $input-padding + 5px;
      width: $size;
      height: $size;
      appearance: none;

      &:checked {
        background-color: $green;

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

    margin-left: 10px;
    width: 60px;
    font-size: $input-font-size;
    padding: $input-padding;

    color: darken($lightgray, 35);

    &:focus,
    &:hover {
      border-color: $blue;
      outline: none;

      color: $blue;
    }
  }
</style>

<label for={slug} data-disabled={disabled}>
  {name}
  {#if shownInGlossary}
    <HelpButton {glossaryId} id={slug} size="20px" />
  {/if}
</label>

<div>
  {#if type === 'select'}
    <select id={slug} {disabled} {required} bind:value>
      {#each Object.entries(options || {}) as [optionValue, optionName]}
        <option value={optionValue}>{optionName}</option>
      {/each}
    </select>
  {:else}
    <input
      {type}
      {min}
      {max}
      {step}
      {required}
      readonly={disabled}
      id={slug}
      {value}
      checked={value}
      on:input={handleInput} />
  {/if}
  {#if hasActionButton}
    <button on:click type="button"><slot /></button>
  {/if}
</div>
