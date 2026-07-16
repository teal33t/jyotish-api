export type ChartResponse = {
  chart?: Record<number, { rashi: string; planets: string[] }>;
};

export const fallbackChartData: Record<number, { rashi: string; planets: string[] }> = {
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


export const formatTimeZoneForApi = (offset: string): string => {
  const value = parseFloat(offset) || 0;
  const sign = value < 0 ? '-' : '+';
  const absHours = Math.abs(value);
  const hours = Math.floor(absHours);
  const minutes = Math.round((absHours - hours) * 60);
  return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export const isChartData = (
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

export const formatChartData = (
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

