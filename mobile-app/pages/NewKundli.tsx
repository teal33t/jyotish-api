import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import HorizontalBreak from '../components/horizontalBreak';
import NameInput from '../components/nameInput';
import BirthDateInput from '../components/birthDateInput';
import BirthTimeInput from '../components/birthTimeInput';
import BirthPlaceInput from '../components/birthPlaceInput';
import GenderSwitch from '../components/genderSwitch';
import { useKundliStore } from '../store/kundliStore';
import { NewKundliProps } from '../utils/newKundliPage';
import { newKundliPageStyles as styles } from "../custom-styles/newKundliPageStyes";

export default function NewKundli({ onCreateChart }: NewKundliProps) {
  const {
    name,
    day,
    month,
    year,
    hour,
    minute,
    birthPlace,
    isFemale,
    setName,
    setDay,
    setMonth,
    setYear,
    setHour,
    setMinute,
    setBirthPlace,
    setIsFemale,
  } = useKundliStore();

  const [showErrors, setShowErrors] = useState(false);

  const nameError = name.trim() === '';
  const dateError = day === '' || month === '' || year === '';
  const timeError = hour === '' || minute === '';
  const birthPlaceError = birthPlace.trim() === '';
  const isValid = !nameError && !dateError && !timeError && !birthPlaceError;

  const handleCreateChart = () => {
    if (!isValid) {
      setShowErrors(true);
      return;
    }

    console.log('\n\n\nCreating chart with data:', {
      name,
      day,
      month,
      year,
      hour,
      minute,
      birthPlace,
      isFemale,
    });

    onCreateChart?.();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <NameInput
        value={name}
        onChangeText={setName}
        error={showErrors && nameError}
      />
      <BirthDateInput
        day={day}
        month={month}
        year={year}
        onChangeDay={setDay}
        onChangeMonth={setMonth}
        onChangeYear={setYear}
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
        onSearchPress={() => { }}
        error={showErrors && birthPlaceError}
      />

      <GenderSwitch isFemale={isFemale} onValueChange={setIsFemale} />
      <HorizontalBreak />
      <Button mode="contained" onPress={handleCreateChart}>
        Create Birth Chart
      </Button>
    </ScrollView>
  );
}
