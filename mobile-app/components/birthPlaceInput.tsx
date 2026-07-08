import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, IconButton, HelperText } from 'react-native-paper';

type BirthPlaceInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSearchPress: () => void;
  error?: boolean;
};

const BirthPlaceInput = ({ value, onChangeText, onSearchPress, error }: BirthPlaceInputProps) => {
  return (
    <View>
      <Text style={styles.label}>Birth Place *</Text>
      <View style={styles.row}>
        <TextInput
          label="Birth Place"
          mode="flat"
          error={error}
          style={[styles.input, styles.textField]}
          placeholderTextColor="#999"
          onChangeText={onChangeText}
          value={value}
        />
        <IconButton
          icon="magnify"
          mode="contained"
          style={styles.searchButton}
          onPress={onSearchPress}
        />
      </View>
      <HelperText type="error" visible={!!error}>
        Birth place is required
      </HelperText>
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
    alignItems: 'center',
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
  textField: {
    flex: 1,
  },
  searchButton: {
    marginLeft: 10,
  },
});

export default BirthPlaceInput;
