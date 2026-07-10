import {
    StyleSheet
} from 'react-native';

export const birthPlaceInputStyles = StyleSheet.create({
    label: {
        fontSize: 11,
        marginBottom: 5,
        fontWeight: 'bold',
        
    },
    timezoneLabel: {
        fontSize: 11,
        marginTop: 5,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    smallinput: {
        // 1. Explicitly expand the sizing
        width: '100%',
        height: 48, // Recommended minimum touch target size

        // 2. Strip default platform paddings causing shrinkage
        paddingVertical: 0,
        paddingHorizontal: 12,

        // 3. Make it visible for verification
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        fontSize: 11,
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
