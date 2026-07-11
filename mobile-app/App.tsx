import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import CreateKundli from './pages/CreateKundli';
import ViewKundli from './pages/ViewKundli';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { initDatabase } from './database/database';

// You can customize your theme using Material Design 3 (MD3) guidelines
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',
    secondary: '#03dac6',
  },
};

const styles = StyleSheet.create({
  base: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    marginBottom: Constants.statusBarHeight,
  },
});

type AppRoute = 'create' | 'view';

export default function App() {
  const [route, setRoute] = React.useState<AppRoute>('create');

  React.useEffect(() => {
    initDatabase();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <View style={styles.base}>
        {route === 'create' ? (
          <CreateKundli onNavigateToView={() => setRoute('view')} />
        ) : (
          <ViewKundli onNavigateToCreate={() => setRoute('create')} />
        )}
      </View>
    </PaperProvider>
  );
}
