import {
    StyleSheet
} from 'react-native';

export const registerPageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
        justifyContent: 'center',
        flexGrow: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 24,
    },
    input: {
        marginBottom: 4,
    },
    button: {
        marginTop: 16,
    },
    linkRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    linkText: {
        color: '#4A90E2',
        fontWeight: 'bold',
    },
});
