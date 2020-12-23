<script lang="ts">
  import type { ConfigurationFormInputData } from "../../interfaces/configuration-form-input-data";
  import type { SimulatorConfiguration } from "../../interfaces/simulator-configuration";
  import InputGroup from "./input-group.svelte";
  import Input from "./input.svelte";
  import * as _ from "lodash";

  export let configuration: SimulatorConfiguration;
  export let data: ConfigurationFormInputData;

  let value;

  $: if (data.type !== "group") value = _.get(configuration, data.fieldPath);
  function handleNewValue({ detail: newValue }) {
    if (data.type !== "group") _.set(configuration, data.fieldPath, newValue);
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
    on:newValue
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
    min={data.type === 'number' ? data.min : undefined} />
{/if}
