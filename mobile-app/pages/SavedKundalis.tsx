import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SavedKundalis() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>First Route</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0000ff',
  },
});
