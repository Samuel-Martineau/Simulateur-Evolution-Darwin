import type { AnimalGene } from "../types/simulator-configuration";

export const v1GenesName: { [key in AnimalGene]: string } = {
  speed: "speed",
  numberOfBabies: "nbOfBabies",
  intervalBetweenReproductionPeriods: "intervalBetweenReproducingPeriods",
  viewDistance: "renderDistance",
  longevity: "longevity",
  amountOfFoodToEat: "hungerLevel",
  timeToEat: "eatingInterval",
};

export const genesDisplayName: { [key in AnimalGene]: string } = {
  speed: "vitesse",
  numberOfBabies: "nombre de bébés",
  intervalBetweenReproductionPeriods:
    "intervalle entre les périodes de reproduction",
  viewDistance: "distance de vue",
  longevity: "longévité",
  amountOfFoodToEat: "quantité de nourriture à manger",
  timeToEat: "temps pour manger",
};
