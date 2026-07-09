import React, { useState } from 'react';
import { 
  Modal, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  FlatList 
} from 'react-native';

interface SelectDialogProps {
  visible: boolean;
  title: string;
  options: { label: string; value: string }[];
  selectedValue: string;
  onClose: () => void;
  onSelect: (value: string) => void;
}

export default function SelectDialog({
  visible,
  title,
  options,
  selectedValue,
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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginVertical: 4,
  },
  selectedRow: {
    backgroundColor: '#f0f4ff',
  },
  optionText: {
    fontSize: 16,
    color: '#444',
  },
  selectedText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  radioChecked: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  buttonCancelText: {
    color: '#666',
    fontWeight: '600',
  },
  buttonConfirmText: {
    color: '#fff',
    fontWeight: '600',
  },
});
