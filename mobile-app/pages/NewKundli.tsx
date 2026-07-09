import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
      
      <GenderSwitch isFemale={isFemale} onValueChange={setIsFemale} />
      <HorizontalBreak/>
      <Button mode="contained" onPress={handleCreateChart}>
        Create Birth Chart
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
});
