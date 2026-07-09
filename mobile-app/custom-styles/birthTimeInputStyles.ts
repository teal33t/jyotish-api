import {
    StyleSheet
} from 'react-native';

export const birthTimeInputStyles = StyleSheet.create({
    label: {
        fontSize: 11,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    pickerWrapper: {
        borderColor: '#4A90E2',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#fff',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    pickerWrapperError: {
        borderColor: '#B00020',
    },
    timeField: {
        flex: 1,
        marginRight: 10,
    },
});