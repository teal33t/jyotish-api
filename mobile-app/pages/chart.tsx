import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line, Text, Polygon } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CHART_SIZE = Math.min(width * 0.95, 400); // Responsive size

// Dummy data assigning Rashi numbers (1-12) and Planets to Houses (1 to 12)
const chartData: any = {
  1: { rashi: '1', planets: ['Asc'] },
  2: { rashi: '2', planets: ['Mo'] },
  3: { rashi: '3', planets: [] },
  4: { rashi: '4', planets: ['Ma', 'Ju'] },
  5: { rashi: '5', planets: [] },
  6: { rashi: '6', planets: ['Sa'] },
  7: { rashi: '7', planets: ['Ketu'] },
  8: { rashi: '8', planets: [] },
  9: { rashi: '9', planets: ['Su', 'Me'] },
  10: { rashi: '10', planets: ['Ve'] },
  11: { rashi: '11', planets: [] },
  12: { rashi: '12', planets: ['Rahu'] },
};

// Precise House Center Coordinates (X, Y) for text placements
const housePositions: any = {
  1:  { rx: CHART_SIZE / 2,     ry: CHART_SIZE * 0.28, px: CHART_SIZE / 2,     py: CHART_SIZE * 0.18 }, 
  2:  { rx: CHART_SIZE * 0.28,  ry: CHART_SIZE * 0.14, px: CHART_SIZE * 0.22,  py: CHART_SIZE * 0.08 },
  3:  { rx: CHART_SIZE * 0.14,  ry: CHART_SIZE * 0.28, px: CHART_SIZE * 0.08,  py: CHART_SIZE * 0.22 },
  4:  { rx: CHART_SIZE * 0.28,  ry: CHART_SIZE / 2,     px: CHART_SIZE * 0.18,  py: CHART_SIZE / 2 },
  5:  { rx: CHART_SIZE * 0.14,  ry: CHART_SIZE * 0.72, px: CHART_SIZE * 0.08,  py: CHART_SIZE * 0.78 },
  6:  { rx: CHART_SIZE * 0.28,  ry: CHART_SIZE * 0.86, px: CHART_SIZE * 0.22,  py: CHART_SIZE * 0.92 },
  7:  { rx: CHART_SIZE / 2,     ry: CHART_SIZE * 0.72, px: CHART_SIZE / 2,     py: CHART_SIZE * 0.82 },
  8:  { rx: CHART_SIZE * 0.72,  ry: CHART_SIZE * 0.86, px: CHART_SIZE * 0.78,  py: CHART_SIZE * 0.92 },
  9:  { rx: CHART_SIZE * 0.86,  ry: CHART_SIZE * 0.72, px: CHART_SIZE * 0.92,  py: CHART_SIZE * 0.78 },
  10: { rx: CHART_SIZE * 0.72,  ry: CHART_SIZE / 2,     px: CHART_SIZE * 0.82,  py: CHART_SIZE / 2 },
  11: { rx: CHART_SIZE * 0.86,  ry: CHART_SIZE * 0.28, px: CHART_SIZE * 0.92,  py: CHART_SIZE * 0.22 },
  12: { rx: CHART_SIZE * 0.72,  ry: CHART_SIZE * 0.14, px: CHART_SIZE * 0.78,  py: CHART_SIZE * 0.08 },
};

export default function Chart() {
return (
    <View style={styles.container}>
      <Svg height={CHART_SIZE} width={CHART_SIZE} viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`} accessible={true} accessibilityLabel="North Indian Birth Chart">
        {/* Outer Bounding Box */}
        <Line x1="0" y1="0" x2={CHART_SIZE} y2="0" stroke="black" strokeWidth="2" />
        <Line x1={CHART_SIZE} y1="0" x2={CHART_SIZE} y2={CHART_SIZE} stroke="black" strokeWidth="2" />
        <Line x1={CHART_SIZE} y1={CHART_SIZE} x2="0" y2={CHART_SIZE} stroke="black" strokeWidth="2" />
        <Line x1="0" y1={CHART_SIZE} x2="0" y2="0" stroke="black" strokeWidth="2" />

        {/* Diagonal Cross Lines (X) */}
        <Line x1="0" y1="0" x2={CHART_SIZE} y2={CHART_SIZE} stroke="black" strokeWidth="1.5" />
        <Line x1={CHART_SIZE} y1="0" x2="0" y2={CHART_SIZE} stroke="black" strokeWidth="1.5" />

        {/* Inner Diamond Lines (Rhombus) */}
        <Line x1={CHART_SIZE / 2} y1="0" x2="0" y2={CHART_SIZE / 2} stroke="black" strokeWidth="1.5" />
        <Line x1="0" y1={CHART_SIZE / 2} x2={CHART_SIZE / 2} y2={CHART_SIZE} stroke="black" strokeWidth="1.5" />
        <Line x1={CHART_SIZE / 2} y1={CHART_SIZE} x2={CHART_SIZE} y2={CHART_SIZE / 2} stroke="black" strokeWidth="1.5" />
        <Line x1={CHART_SIZE} y1={CHART_SIZE / 2} x2={CHART_SIZE / 2} y2="0" stroke="black" strokeWidth="1.5" />

        {/* Dynamic Render of Houses */}
        {Object.keys(chartData).map((houseStr) => {
          const houseNum = parseInt(houseStr);
          const data = chartData[houseNum];
          const pos = housePositions[houseNum];

          return (
            <React.Fragment key={houseNum}>
              {/* Rashi Number (Smaller, colored) */}
              <Text x={pos.rx} y={pos.ry} fontSize="12" fill="#d9534f" textAnchor="middle" alignmentBaseline="middle" fontWeight="bold">
                {data.rashi}
              </Text>

              {/* Planets Text Stack (Centered inside the house region) */}
              {data.planets.map((planet: any, index: any) => (
                <Text key={planet} x={pos.px} y={pos.py + index * 12} fontSize="11" fill="#2c3e50" textAnchor="middle" alignmentBaseline="middle">
                  {planet}
                </Text>
              ))}
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});