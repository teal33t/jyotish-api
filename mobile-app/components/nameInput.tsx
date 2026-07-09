import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { nameInputStyles as styles } from '../custom-styles/nameInputStyles';
import { NameInputProps } from '../utils/componentTypes';

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


export default NameInput;
