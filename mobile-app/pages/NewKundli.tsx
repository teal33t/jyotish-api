import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
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
  const [isFemale, setIsFemale] = useState(false);

  const updateDate = (nextDay: string, nextMonth: string, nextYear: string) => {
    const d = parseInt(nextDay, 10);
    const m = parseInt(nextMonth, 10);
    const y = parseInt(nextYear, 10);
    if (d && m && y) {
      setDate(new Date(y, m - 1, d));
    }
  };

  return (
    <View style={styles.container}>
      <NameInput value={inputValue} onChangeText={setInputValue} />
      <HorizontalBreak/>
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
      />
      <HorizontalBreak/>
      <BirthTimeInput
        hour={hour}
        minute={minute}
        onChangeHour={setHour}
        onChangeMinute={setMinute}
      />
      <HorizontalBreak/>
      <BirthPlaceInput
        value={birthPlace}
        onChangeText={setBirthPlace}
        onSearchPress={() => {}}
      />
      <HorizontalBreak/>
      <GenderSwitch isFemale={isFemale} onValueChange={setIsFemale} />
      <HorizontalBreak/>
      <Button mode="contained" onPress={onCreateChart}>
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
});
