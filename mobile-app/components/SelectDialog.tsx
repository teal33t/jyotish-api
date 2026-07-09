import React, { useState } from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { selectDialogStyles as styles } from '../custom-styles/selectDialogStyles';
import { SelectDialogProps } from '../utils/componentTypes';

export default function SelectDialog({
  visible,
  title,
  options,
  selectedValue,
  loading = false,
  onClose,
  onSelect,
}: SelectDialogProps) {
  const [temporaryValue, setTemporaryValue] = useState(selectedValue);

  const handleConfirm = () => {
    onSelect(temporaryValue);
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.dialogBox}>
          <Text style={styles.title}>{title}</Text>

          {/* List of selectable options */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          ) : (
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === temporaryValue;
                return (
                  <TouchableOpacity
                    style={[styles.optionRow, isSelected && styles.selectedRow]}
                    onPress={() => setTemporaryValue(item.value)}
                  >
                    <Text style={[styles.optionText, isSelected && styles.selectedText]}>
                      {item.label}
                    </Text>
                    <View style={[styles.radioButton, isSelected && styles.radioChecked]} />
                  </TouchableOpacity>
                );
              }}
            />
          )}

          {/* Action buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
              <Text style={styles.buttonConfirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}