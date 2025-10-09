import { StyleSheet, Dimensions, LogBox } from 'react-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F8F9',
        paddingHorizontal: 24,
        paddingTop: 50,
    },
    logoContainer: {
        backgroundColor: '#F2F8F9',

    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 20,
    },
    labelTitle: {
        padding: 15,
        fontFamily: 'Manrope',
        fontSize: 22,
        fontWeight: '500',
        color: '#000000ff',
        marginBottom: 8,
    },
    label: {
        fontFamily: 'Manrope',
        fontSize: 16,
        fontWeight: '400',
        color: '#202020ff',
        marginBottom: 8,
    },
    logo: {
        width: 200,
        height: 200,
        alignSelf: 'center',    
        marginBottom: 20,
        marginTop: 10,
    },
    input: {
        backgroundColor: '#F7FAFA',
        borderWidth: 1,
        borderColor: '#D1DBE5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
    },
    inputError: {
        borderColor: '#ff4444',
    },
    errorText: {
        color: '#ff4444',
        fontSize: 14,
        marginTop: 5,
    },
    button: {
        backgroundColor: '#3db2d2ff',
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    link: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        color: '#4F7594',
        fontSize: 16,
    },
    // Nuevos estilos para el botón de fecha
    dateButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateButtonText: {
        fontSize: 16,
        color: '#333',
    },
    dateButtonPlaceholder: {
        color: '#999',
    },
    calendarIcon: {
        fontSize: 18,
    },
    // Estilos adicionales para el selector de fecha
    dateInput: {
        justifyContent: 'center',
        height: 48, // Misma altura que los otros inputs
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },
    placeholderText: {
        fontSize: 16,
        color: '#999',
    },
    // Estilos para el DatePicker si necesitas personalizarlo
    datePicker: {
        backgroundColor: 'white',
    },
    datePickerContainer: {
        backgroundColor: 'white',
    },
    // Estilo para cuando el campo de fecha tiene error
    dateInputError: {
        borderColor: '#ff4444',
    },
    });

export default styles;