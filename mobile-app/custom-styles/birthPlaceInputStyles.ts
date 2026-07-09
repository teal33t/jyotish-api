import {
    StyleSheet
} from 'react-native';

export const birthPlaceInputStyles = StyleSheet.create({
    label: {
        fontSize: 11,
        marginBottom: 5,
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
    coordField: {
        borderStyle: 'dashed',
        fontSize: 10,
        flex: 1,
        marginHorizontal: 5,
    },
    coordRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },

});
