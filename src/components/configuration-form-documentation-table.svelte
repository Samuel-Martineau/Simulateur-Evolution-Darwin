<script lang="ts">
  import type { ConfigurationFormInputData } from "../types/configuration-form-input-data";
  import _ from "lodash";

  export let configurationFormInputData: ConfigurationFormInputData[];

  function getChildren(inputData: ConfigurationFormInputData) {
    if (inputData.type === "group") {
      return [inputData, inputData.children.map(getChildren)];
    } else return inputData;
  }

  const flattenConfigurationFormInputData = _.chain(configurationFormInputData)
    .map(getChildren)
    .flattenDeep()
    .uniqBy("glossaryId")
    .value();
</script>

<style lang="scss">
  table {
    border-collapse: collapse;
    width: 100%;
    table-layout: fixed;

    th,
    td {
      border: 2px solid black;
      vertical-align: top;
      padding: 5px;
    }

    th,
    tr :first-child {
      text-align: center;
      font-weight: bold;
      vertical-align: middle;
    }

    th:nth-child(1) {
      width: 15%;
    }

    th:nth-child(3),
    th:nth-child(4) {
      width: 8%;
    }

    tr :nth-child(3),
    tr :nth-child(4) {
      text-align: center;
      vertical-align: middle;
    }
  }
</style>

<table>
  <tr>
    <th>Champ</th>
    <th>Description</th>
    <th>Requis (&check;) Optionnel (&cross;)</th>
    <th>Unité</th>
  </tr>
  {#each flattenConfigurationFormInputData as data}
    {#if data.shownInGlossary}
      <tr>
        <td id={data.glossaryId}>{data.name}</td>
        <td>{data.description}</td>
        <td>
          {@html data.required ? "&check;" : "&cross;"}
        </td>
        <td>
          {(data.type === "number" || data.type === "group"
            ? data.unit
            : undefined) || "N/A"}
        </td>
      </tr>
    {/if}
  {/each}
</table>
