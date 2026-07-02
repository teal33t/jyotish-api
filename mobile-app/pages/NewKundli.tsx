import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

export default function NewKundli() {
  const [inputValue, setInputValue] = useState('');
  const [date, setDate] = useState(new Date());
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const updateDate = (nextDay: string, nextMonth: string, nextYear: string) => {
    const d = parseInt(nextDay, 10);
    const m = parseInt(nextMonth, 10);
    const y = parseInt(nextYear, 10);
    if (d && m && y) {
      setDate(new Date(y, m - 1, d));
    }
  };

  const clampField = (text: string, max: number) => {
    const digitsOnly = text.replace(/[^0-9]/g, '');
    if (digitsOnly === '') return '';
    const value = parseInt(digitsOnly, 10);
    return value > max ? String(max) : digitsOnly;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Type something here..."
        placeholderTextColor="#999"
        onChangeText={(text: any) => setInputValue(text)}
        value={inputValue}
      />
      <Text style={styles.label}>Birth Date:</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.dateInput]}
          placeholder="DD"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          maxLength={2}
          value={day}
          onChangeText={(text: string) => {
            const clamped = clampField(text, 31);
            setDay(clamped);
            updateDate(clamped, month, year);
          }}
        />
        <TextInput
          style={[styles.input, styles.dateInput]}
          placeholder="MM"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          maxLength={2}
          value={month}
          onChangeText={(text: string) => {
            const clamped = clampField(text, 12);
            setMonth(clamped);
            updateDate(day, clamped, year);
          }}
        />
        <TextInput
          style={[styles.input, styles.dateInput]}
          placeholder="YYYY"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          maxLength={4}
          value={year}
          onChangeText={(text: string) => {
            setYear(text);
            updateDate(day, month, text);
          }}
        />
      </View>
      {/* <Text style={styles.previewText}>You typed: {inputValue}</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 1,
    marginRight: 10,
    textAlign: 'center',
  },
  previewText: {
    marginTop: 15,
    fontSize: 14,
    color: '#555',
  },
});
