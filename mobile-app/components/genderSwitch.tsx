import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Switch } from 'react-native-paper';
import { SegmentedButtons } from 'react-native-paper';
import { genderSwitchStyles as styles } from '../custom-styles/genderSwitchStyles';
import { GenderSwitchProps } from "../utils/componentTypes";

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


export default GenderSwitch;
