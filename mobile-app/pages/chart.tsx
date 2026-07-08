import React from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import DrawChart from '../components/drawChart';
import HttpService from '../services/httpService';

const { width } = Dimensions.get('window');

const apiService = new HttpService('http://192.168.1.10:9393');

const fallbackChartData: Record<number, { rashi: string; planets: string[] }> = {
  // 1: { rashi: '2', planets: ['Asc', 'Ma'] },
  // 2: { rashi: '3', planets: ['Su', 'Me', 'Ve'] },
  // 3: { rashi: '4', planets: ['Rahu'] },
  // 4: { rashi: '5', planets: [] },
  // 5: { rashi: '6', planets: ['Sa', 'Ju'] },
  // 6: { rashi: '7', planets: [] },
  // 7: { rashi: '8', planets: ['Mo'] },
  // 8: { rashi: '9', planets: [] },
  // 9: { rashi: '10', planets: ['Ketu'] },
  // 10: { rashi: '11', planets: [] },
  // 11: { rashi: '12', planets: [] },
  // 12: { rashi: '1', planets: [] },
};

type ChartResponse = {
  chart?: Record<number, { rashi: string; planets: string[] }>;
};

const isChartData = (
  value: unknown
): value is Record<number, { rashi: string; planets: string[] }> => {
  if (!value || typeof value !== 'object') return false;
  return Object.values(value as object).every(
    (v) =>
      v &&
      typeof v === 'object' &&
      'rashi' in v &&
      'planets' in v &&
      Array.isArray((v as { planets: unknown }).planets)
  );
};

const formatChartData = (
  chart: any
): Record<number, { rashi: string; planets: string[] }> => {
  const formattedData: Record<number, { rashi: string; planets: string[] }> = {};
  const houses = chart['houses'];
  const lagna = chart['lagna']['Lg'];
  const startAsc = parseInt(lagna['rashi']);
  
  Object.keys(houses).forEach((house) => {
    const houseData = houses[house];
    const planets = Object.keys(houseData["graha"])
    const rashi = (startAsc + (parseInt(house) - 1))
    formattedData[parseInt(house)] = {
        rashi: String(rashi > 12 ? rashi - 12 : rashi),
        planets: planets
    }
    // console.log("house " + house + " planets:",     planets);
});

  return formattedData;
}

export default function Chart() {
  const [chartData, setChartData] = React.useState<
    Record<number, { rashi: string; planets: string[] }>
  >(fallbackChartData);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const params = {
          latitude: '20.8980',
          longitude: '74.7732',
          year: '1981',
          month: '06',
          day: '15',
          hour: '04',
          min: '29',
          sec: '0',
          time_zone: '+05:30',
          dst_hour: '0',
          dst_min: '0',
          nesting: '0',
          varga: 'D1',
          infolevel: 'basic,panchanga,transit',
        };
        const response = await apiService.get<ChartResponse>('/api/calculate', params);
        const formattedData = formatChartData(response.data.chart);
        if (response.ok && response.data?.chart) {
          setChartData(formattedData);
          console.log('Chart data fetched successfully:', formattedData);
        }
  
        if (!cancelled) setLoading(false);
        
        // console.log('Fetching chart data:', response.data);
      } catch (error) {
        console.log('Error fetching chart data:', error);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DrawChart chartData={chartData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
});
