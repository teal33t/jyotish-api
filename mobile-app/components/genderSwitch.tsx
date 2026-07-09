import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Switch } from 'react-native-paper';
import { SegmentedButtons } from 'react-native-paper';

// const [value, setValue] = useState('Male');

type GenderSwitchProps = {
  isFemale: string;
  onValueChange: (isFemale: string) => void;
};

const GenderSwitch = ({ isFemale, onValueChange }: GenderSwitchProps) => {
  return (
    <View>
      <Text style={styles.label}>Gender:</Text>
      <View style={styles.row}>
        <SegmentedButtons
          value={isFemale}
          onValueChange={onValueChange}
          buttons={[
            {
              value: 'Male',
              label: 'Male',
              icon: 'face-man',
            },
            {
              value: 'Female',
              label: 'Female',
              icon: 'face-woman',
            }
          ]}
        />

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  option: {
    fontSize: 13,
    marginHorizontal: 10,
  },
});

export default GenderSwitch;
