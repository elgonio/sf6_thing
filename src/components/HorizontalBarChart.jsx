import { VictoryBar, VictoryChart, VictoryLabel, VictoryAxis } from 'victory';
export const HorizontalBarChart = ({ data, title, isMobile}) => {
  return (
    <VictoryChart
    height={isMobile ? 700 : undefined}
      theme={{
        axis: {
          style: {
            tickLabels: { fill: "#dfdfd7", fontSize: 10 },
            axis: { stroke: "#D4D4D400" }
          },
          label: { fill: "#dfdfd7" }
        },
      }}
      horizontal={!isMobile}

    >

      <VictoryLabel
        text={title}
        x={225}
        y={20}
        textAnchor="middle"
        style={{ fill: "#D4D4D4", fontSize: 24, fontWeight: "bold" }}
      />

      <VictoryAxis
        dependentAxis
        tickFormat={tick => tick}
        style={{ tickLabels: { fontSize: isMobile ? 12 : 10 }, labels: { fill: "#4a4a4a" } }}
        offsetY={45}
        label={''}
      />

      <VictoryAxis
        style={{ tickLabels: { fontSize: isMobile ? 12 : 10, angle: isMobile ? -90 : undefined} }}
        offsetX={isMobile ? 90 : 45}
        offsetY={isMobile ? 10 : 0}
        label={''}
      />

      <VictoryBar
        data={data}
        y="Count"
        x="CharacterName"
        style={{
          data: { fill: "#4c98c6" },
          labels: { fontSize: 7 }
        }}
        labels={({ datum }) => datum.Count} // Display raw numbers as labels
        labelComponent={<VictoryLabel dx={-10} textAnchor="middle" te />} // Adjust label position
        barWidth={7}


      />
    </VictoryChart>
  );
};