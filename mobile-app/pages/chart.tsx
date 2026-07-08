import React from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import DrawChart from '../components/drawChart';
import HttpService from '../services/httpService';

const { width } = Dimensions.get('window');

const apiService = new HttpService('http://192.168.1.10:9393');

const fallbackChartData: Record<number, { rashi: string; planets: string[] }> = {
  1: { rashi: '1', planets: ['Asc'] },
  2: { rashi: '2', planets: ['Mo'] },
  3: { rashi: '3', planets: [] },
  4: { rashi: '4', planets: ['Ma'] },
  5: { rashi: '5', planets: [] },
  6: { rashi: '6', planets: ['Sa', 'Ju'] },
  7: { rashi: '7', planets: ['Ketu'] },
  8: { rashi: '8', planets: [] },
  9: { rashi: '9', planets: ['Su', 'Me'] },
  10: { rashi: '10', planets: ['Ve'] },
  11: { rashi: '11', planets: [] },
  12: { rashi: '12', planets: ['Rahu'] },
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

export default function Chart() {
  const [chartData, setChartData] = React.useState<
    Record<number, { rashi: string; planets: string[] }>
  >(fallbackChartData);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await apiService.get<ChartResponse>('/api/calculate?latitude=28.6139&longitude=77.209&year=2023&month=12&day=25&hour=12&min=0&sec=0&time_zone=%2B03%3A30&dst_hour=0&dst_min=0&nesting=0&varga=D1%2CD9&infolevel=basic%2Cpanchanga%2Ctransit');
  
        if (!cancelled && response.ok && isChartData(response.data?.chart)) {
          setChartData(response.data.chart);
        }
  
        if (!cancelled) setLoading(false);
        
        console.log('Fetching chart data:', response.data);
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
