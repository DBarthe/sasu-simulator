import React, { useEffect, useMemo } from "react";
import { Line, Chart } from "test-react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";
import { SimulationOutput } from "../models";

interface VisualizationViewProps {
  output: SimulationOutput;
  currentBrut: number;
}

Chart.register(annotationPlugin);

const colors = [
  "#7F3C8D",
  "#11A579",
  "#3969AC",
  "#F2B701",
  "#E73F74",
  "#80BA5A",
  "#E68310",
  "#008695",
  "#CF1C90",
  "#f97b72",
  "#4b4b8f",
  "#A5AA99",
];

function getData(output: SimulationOutput) {
  console.log("computing data");
  return {
    labels: output.items.map((item) => "" + item.salaire.brut),
    datasets: [
      {
        label: "Après impôts",
        data: output.items.map((item) => item.impots.apres),
        borderColor: "white",
        radius: 0,
        borderWidth: 2,
        yAxisID: "y2",
      },
      {
        label: "Cotisations patronales",
        data: output.items.map((item) => item.salaire.cotisation.partPatronale),
        backgroundColor: colors[4],
        fill: true,
        radius: 0,
      },
      {
        label: "Cotisations salariales",
        data: output.items.map((item) => item.salaire.cotisation.partSalariale),
        backgroundColor: colors[3],
        fill: true,
        radius: 0,
      },
      {
        label: "IS",
        data: output.items.map((item) => item.benefices.is),
        backgroundColor: colors[2],
        fill: true,
        radius: 0,
      },
      {
        label: "Taxes dividendes",
        data: output.items.map(
          (item) => item.dividendes.brut - item.dividendes.net
        ),
        backgroundColor: colors[1],
        fill: true,
        radius: 0,
      },
      {
        label: "IR",
        data: output.items.map((item) => item.impots.montant),
        backgroundColor: colors[0],
        fill: true,
        radius: 0,
      },
    ],
  };
}

function getMax(output: SimulationOutput) {
  return output.items
    .map((item) =>
      Math.max(item.impots.apres, item.ca.total - item.impots.apres)
    )
    .reduce((a, b) => Math.max(a, b), 0);
}

function getOptions(
  output: SimulationOutput,
  currentBrut: number,
  max: number
) {
  return {
    animation: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      annotation: {
        annotations: {
          line1: {
            scaleID: "x",
            borderWidth: 3,
            borderColor: "red",
            value: currentBrut.toString(),
          },
        },
      },
    },
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        stacked: false,
      },

      y: {
        stacked: true,
        min: 0,
        suggestedMax: max,
      },
      y2: {
        stacked: false,
        min: 0,
        suggestedMax: max,
        display: false,
      },
    },
  };
}

export default function VisualizationView({
  output,
  currentBrut,
}: VisualizationViewProps) {
  console.log("rerender");

  const max = useMemo(() => getMax(output), [output]);
  const data = useMemo(() => getData(output), [output]);
  const options = useMemo(() => getOptions(output, currentBrut, max), [
    output,
    currentBrut,
    max,
  ]);

  return  <Line type="line" data={data} options={options} redraw={false} />
}
