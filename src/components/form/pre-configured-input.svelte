<script lang="ts">
  import type { ConfigurationFormInputData } from "../../types/configuration-form-input-data";
  import type { SimulatorConfiguration } from "../../types/simulator-configuration";
  import InputGroup from "./input-group.svelte";
  import Input from "./input.svelte";
  import * as _ from "lodash";
  import { createEventDispatcher } from "svelte";

  export let configuration: SimulatorConfiguration;
  export let data: ConfigurationFormInputData;

  const dispatch = createEventDispatcher();

  let value;

  $: if (data.type !== "group") value = _.get(configuration, data.fieldPath);

  function handleNewValue({ detail: newValue }) {
    if (data.type !== "group") {
      _.set(configuration, data.fieldPath, newValue);
      dispatch("newValue");
    }
  }

  function handleActionButtonClicked() {
    if (data.action)
      handleNewValue({ detail: data.action.onClick(configuration) });
  }
</script>

{#if data.type === 'group'}
  <InputGroup
    displayName={data.name}
    shownInGlossary={data.shownInGlossary}
    glossaryId={data.shownInGlossary ? data.glossaryId : undefined}>
    {#each data.children as child}
      <svelte:self data={child} on:newValue {configuration} />
    {/each}
  </InputGroup>
{:else}
  <Input
    on:newValue={handleNewValue}
    {value}
    disabled={data.disabled(configuration)}
    name={data.name}
    shownInGlossary={data.shownInGlossary}
    glossaryId={data.shownInGlossary ? data.glossaryId : undefined}
    required={data.required}
    type={data.type}
    options={data.type === 'select' ? data.options : undefined}
    step={data.type === 'number' ? data.step : undefined}
    max={data.type === 'number' ? data.max : undefined}
    min={data.type === 'number' ? data.min : undefined}
    actionButtonIconUrl={data.action ? data.action.iconUrl : undefined}
    on:actionClicked={handleActionButtonClicked} />
{/if}
