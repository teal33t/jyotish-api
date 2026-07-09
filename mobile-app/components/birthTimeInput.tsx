import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { HelperText } from 'react-native-paper';
import { birthTimeInputStyles as styles } from '../custom-styles/birthTimeInputStyles';
import { BirthTimeInputProps } from '../utils/componentTypes';

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => String(start + i).padStart(2, '0'));

const HOURS = range(0, 23);
const MINUTES = range(0, 59);

const BirthTimeInput = ({
  hour,
  minute,
  onChangeHour,
  onChangeMinute,
  error,
}: BirthTimeInputProps) => {
  return (
    <View>
      <Text style={styles.label}>Birth Time *</Text>
      <View style={styles.row}>
        <View style={[styles.pickerWrapper, styles.timeField, error && styles.pickerWrapperError]}>
          <Picker
            selectedValue={hour}
            onValueChange={onChangeHour}
            mode="dropdown"
          >
            <Picker.Item label="HH" value="" color="#999" />
            {HOURS.map((h) => (
              <Picker.Item key={h} label={h} value={h} />
            ))}
          </Picker>
        </View>
        <View style={[styles.pickerWrapper, styles.timeField, error && styles.pickerWrapperError]}>
          <Picker
            selectedValue={minute}
            onValueChange={onChangeMinute}
            mode="dropdown"
          >
            <Picker.Item label="MM" value="" color="#999" />
            {MINUTES.map((m) => (
              <Picker.Item key={m} label={m} value={m} />
            ))}
          </Picker>
        </View>
      </View>
      <HelperText type="error" visible={!!error}>
        Birth time is required
      </HelperText>
    </View>
  );
};


export default BirthTimeInput;
