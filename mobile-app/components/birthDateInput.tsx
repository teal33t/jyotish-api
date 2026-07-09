import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { HelperText } from 'react-native-paper';
import { birthDateInputStyles as styles } from '../custom-styles/birthDateInputStyles';
import { BirthDateInputProps } from '../utils/componentTypes';

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => String(start + i));

const DAYS = range(1, 31);
const MONTHS = range(1, 12);
const YEARS = range(1950, 2050);

const BirthDateInput = ({
  day,
  month,
  year,
  onChangeDay,
  onChangeMonth,
  onChangeYear,
  error,
}: BirthDateInputProps) => {
  return (
    <View>
      <Text style={styles.label}>Birth Date *</Text>
      <View style={styles.row}>
        <View style={[styles.pickerWrapper, styles.dateField, error && styles.pickerWrapperError]}>
          <Picker
            selectedValue={day}
            onValueChange={onChangeDay}
            mode="dropdown"
          >
            <Picker.Item label="DD" value="" color="#999" />
            {DAYS.map((d) => (
              <Picker.Item key={d} label={d} value={d} />
            ))}
          </Picker>
        </View>
        <View style={[styles.pickerWrapper, styles.dateField, error && styles.pickerWrapperError]}>
          <Picker
            selectedValue={month}
            onValueChange={onChangeMonth}
            mode="dropdown"
          >
            <Picker.Item label="MM" value="" color="#999" />
            {MONTHS.map((m) => (
              <Picker.Item key={m} label={m} value={m} />
            ))}
          </Picker>
        </View>
        <View style={[styles.pickerWrapper, styles.dateField, error && styles.pickerWrapperError]}>
          <Picker
            selectedValue={year}
            onValueChange={onChangeYear}
            mode="dropdown"
          >
            <Picker.Item label="YYYY" value="" color="#999" />
            {YEARS.map((y) => (
              <Picker.Item key={y} label={y} value={y} />
            ))}
          </Picker>
        </View>
      </View>
      <HelperText type="error" visible={!!error}>
        Full birth date is required
      </HelperText>
    </View>
  );
};



export default BirthDateInput;
