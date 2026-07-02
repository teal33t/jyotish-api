import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type BirthDateInputProps = {
  day: string;
  month: string;
  year: string;
  onChangeDay: (day: string) => void;
  onChangeMonth: (month: string) => void;
  onChangeYear: (year: string) => void;
};

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
}: BirthDateInputProps) => {
  return (
    <View>
      <Text style={styles.label}>Birth Date:</Text>
      <View style={styles.row}>
        <View style={[styles.pickerWrapper, styles.dateField]}>
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
        <View style={[styles.pickerWrapper, styles.dateField]}>
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
        <View style={[styles.pickerWrapper, styles.dateField]}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerWrapper: {
    borderColor: '#4A90E2',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  dateField: {
    flex: 1,
    marginRight: 10,
  },
});

export default BirthDateInput;
