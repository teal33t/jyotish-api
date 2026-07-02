import * as React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import SavedKundalis from './pages/SavedKundalis';
import NewKundli from './pages/NewKundli';

const renderScene = SceneMap({
  saved: SavedKundalis,
  new: NewKundli,
});

const routes = [
  { key: 'saved', title: 'Saved Kundali`s' },
  { key: 'new', title: 'New Kundli' },
];

export default function App() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  return (
    <TabView
      style={{ marginTop: 50 }}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}