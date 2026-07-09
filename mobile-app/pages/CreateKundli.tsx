import * as React from 'react';
import { useWindowDimensions } from 'react-native';
import { TabView, SceneRendererProps } from 'react-native-tab-view';
import SavedKundalis from './SavedKundalis';
import NewKundli from './NewKundli';
import Chart from './chart';
import { CreateKundliProps } from "../utils/createKundliPage";

const routes = [
  { key: 'saved', title: 'Saved Kundali`s' },
  { key: 'new', title: 'New Kundli' },
];

export default function CreateKundli({ onNavigateToView }: CreateKundliProps) {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [screen, setScreen] = React.useState<'tabs' | 'chart'>('tabs');

  const renderScene = ({ route }: SceneRendererProps & { route: { key: string } }) => {
    switch (route.key) {
      case 'saved':
        return <SavedKundalis />;
      case 'new':
        return <NewKundli onCreateChart={() => setScreen('chart')} />;
      default:
        return null;
    }
  };

  if (screen === 'chart') {
    return <Chart />;
  }

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}
