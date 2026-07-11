import React from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import DrawChart from '../components/drawChart';
import HttpService from '../services/httpService';
import { formatChartData, ChartResponse, fallbackChartData, isChartData } from '../utils/chartPage';
const { width } = Dimensions.get('window');

const apiService = new HttpService('http://192.168.1.10:9393');

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
