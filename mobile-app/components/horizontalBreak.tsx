import React from 'react';
import { View, StyleSheet } from 'react-native';

const HorizontalBreak = () => {
  return <View style={styles.line} />;
};

const styles = StyleSheet.create({
  line: {
    // height: 1,                 // Thickness of the line
    width: '100%',             // Full width of the parent container
    backgroundColor: '#CCCCCC', // Light gray color
    marginVertical: 10,        // Spacing above and below the line
  },
});

export default HorizontalBreak;
