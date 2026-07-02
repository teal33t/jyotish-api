import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type BirthTimeInputProps = {
  hour: string;
  minute: string;
  onChangeHour: (hour: string) => void;
  onChangeMinute: (minute: string) => void;
};

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => String(start + i).padStart(2, '0'));

const HOURS = range(0, 23);
const MINUTES = range(0, 59);

const BirthTimeInput = ({
  hour,
  minute,
  onChangeHour,
  onChangeMinute,
}: BirthTimeInputProps) => {
  return (
    <View>
      <Text style={styles.label}>Birth Time:</Text>
      <View style={styles.row}>
        <View style={[styles.pickerWrapper, styles.timeField]}>
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
        <View style={[styles.pickerWrapper, styles.timeField]}>
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
  timeField: {
    flex: 1,
    marginRight: 10,
  },
});

export default BirthTimeInput;
