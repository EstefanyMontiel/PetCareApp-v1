import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        padding: 20,
        paddingTop: 50,
    },
    logo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4a90e2',
        textAlign: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
    },
    section: {
        marginBottom: 25,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
        color: '#333',
    },
    speciesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    speciesButton: {
        flex: 1,
        padding: 15,
        marginHorizontal: 5,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
    },
    speciesButtonSelected: {
        borderColor: '#4a90e2',
        backgroundColor: '#f0f7ff',
    },
    speciesText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#666',
    },
    speciesTextSelected: {
        color: '#4a90e2',
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
        color: '#333',
    },
    dateButton: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },
    inputContainer: {
        marginBottom: 20,
    },
    labelTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
    },
    button: {
        backgroundColor: '#4a90e2',
        padding: 18,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    buttonDisabled: {
        backgroundColor: '#cccccc',
        shadowOpacity: 0,
        elevation: 0,
    },
    link: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        color: '#4a90e2',
        fontSize: 16,
        textAlign: 'center',
    },
    registerButton: {
        backgroundColor: '#4a90e2',
        padding: 18,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    });

    export default styles;