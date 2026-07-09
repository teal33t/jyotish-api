import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';

type NameInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  error?: boolean;
};

const NameInput = ({ value, onChangeText, error }: NameInputProps) => {
  return (
    <View>
      <Text style={styles.label}>Name *</Text>
      <TextInput
        label="Name"
        mode="flat"
        error={error}
        style={styles.input}
        // placeholder="Name"
        placeholderTextColor="#999"
        onChangeText={onChangeText}
        value={value}
      />
      <HelperText type="error" visible={!!error}>
        Name is required
      </HelperText>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    marginBottom: 5,
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
});

export default NameInput;
