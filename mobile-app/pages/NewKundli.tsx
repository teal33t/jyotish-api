import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import HorizontalBreak from '../components/horizontalBreak';
import NameInput from '../components/nameInput';
import BirthDateInput from '../components/birthDateInput';
import BirthTimeInput from '../components/birthTimeInput';
import BirthPlaceInput from '../components/birthPlaceInput';
import GenderSwitch from '../components/genderSwitch';

type NewKundliProps = {
  onCreateChart?: () => void;
};

export default function NewKundli({ onCreateChart }: NewKundliProps) {
  const [inputValue, setInputValue] = useState('');
  const [date, setDate] = useState(new Date());
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isFemale, setIsFemale] = useState("Male");
  const [showErrors, setShowErrors] = useState(false);

  const updateDate = (nextDay: string, nextMonth: string, nextYear: string) => {
    const d = parseInt(nextDay, 10);
    const m = parseInt(nextMonth, 10);
    const y = parseInt(nextYear, 10);
    if (d && m && y) {
      setDate(new Date(y, m - 1, d));
    }
  };

  const nameError = inputValue.trim() === '';
  const dateError = day === '' || month === '' || year === '';
  const timeError = hour === '' || minute === '';
  const birthPlaceError = birthPlace.trim() === '';
  const isValid = !nameError && !dateError && !timeError && !birthPlaceError;

  const handleCreateChart = () => {
    if (!isValid) {
      setShowErrors(true);
      return;
    }
    onCreateChart?.();
  };

  return (
    <View style={styles.container}>
      <NameInput
        value={inputValue}
        onChangeText={setInputValue}
        error={showErrors && nameError}
      />
      <BirthDateInput
        day={day}
        month={month}
        year={year}
        onChangeDay={(text) => {
          setDay(text);
          updateDate(text, month, year);
        }}
        onChangeMonth={(text) => {
          setMonth(text);
          updateDate(day, text, year);
        }}
        onChangeYear={(text) => {
          setYear(text);
          updateDate(day, month, text);
        }}
        error={showErrors && dateError}
      />
      <BirthTimeInput
        hour={hour}
        minute={minute}
        onChangeHour={setHour}
        onChangeMinute={setMinute}
        error={showErrors && timeError}
      />
      <BirthPlaceInput
        value={birthPlace}
        onChangeText={setBirthPlace}
        onSearchPress={() => {}}
        error={showErrors && birthPlaceError}
      />
      <View style={styles.coordRow}>
        <TextInput
          label="Latitude"
          mode="flat"
          placeholder="Latitude"
          value={latitude}
          onChangeText={setLatitude}
          style={[styles.input, styles.coordField]}
          placeholderTextColor="#999"
        />
        <TextInput
          label="Longitude"
          mode="flat"
          placeholder="Longitude"
          value={longitude}
          onChangeText={setLongitude}
          style={[styles.input, styles.coordField]}
          placeholderTextColor="#999"
        />
      </View>
      <GenderSwitch isFemale={isFemale} onValueChange={setIsFemale} />
      <HorizontalBreak/>
      <Button mode="contained" onPress={handleCreateChart}>
        Create Birth Chart
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
  },
  coordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  input: {
    height: 50,
    borderColor: '#4A90E2',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  coordField: {
    flex: 1,
    marginHorizontal: 5,
  },
});
