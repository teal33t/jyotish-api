import {
    StyleSheet
} from 'react-native';

export const selectDialogStyles = StyleSheet.create({
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
        fontSize: 14,
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
        fontSize: 10,
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
    loadingContainer: {
        paddingVertical: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
});