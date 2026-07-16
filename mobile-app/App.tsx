import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import CreateKundli from './pages/CreateKundli';
import ViewKundli from './pages/ViewKundli';
import Login from './pages/Login';
import Register from './pages/Register';
import { ActivityIndicator, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { initDatabase } from './database/database';
import { useAuthStore } from './store/authStore';

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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type AppRoute = 'create' | 'view';
type AuthRoute = 'login' | 'register';

export default function App() {
  const [route, setRoute] = React.useState<AppRoute>('create');
  const [authRoute, setAuthRoute] = React.useState<AuthRoute>('login');
  const { isAuthenticated, isHydrating, hydrate } = useAuthStore();

  React.useEffect(() => {
    initDatabase();
    hydrate();
  }, []);

  const renderContent = () => {
    if (isHydrating) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator animating size="large" />
        </View>
      );
    }

    if (!isAuthenticated) {
      return authRoute === 'login' ? (
        <Login
          onLoginSuccess={() => setRoute('create')}
          onNavigateToRegister={() => setAuthRoute('register')}
        />
      ) : (
        <Register
          onRegisterSuccess={() => setRoute('create')}
          onNavigateToLogin={() => setAuthRoute('login')}
        />
      );
    }

    return route === 'create' ? (
      <CreateKundli onNavigateToView={() => setRoute('view')} />
    ) : (
      <ViewKundli onNavigateToCreate={() => setRoute('create')} />
    );
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.base}>{renderContent()}</View>
    </PaperProvider>
  );
}
