import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function Chart() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Birth Chart</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});