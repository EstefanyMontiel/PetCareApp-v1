import { Dimensions, Platform } from 'react-native';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Detectar si es un dispositivo pequeño
export const isSmallDevice = SCREEN_WIDTH < 375;

// Detectar plataforma
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Función para escalar fuentes responsivamente
export const scale = (size) => {
    const baseWidth = 375; // iPhone X width
    return (SCREEN_WIDTH / baseWidth) * size;
};

// Espaciado vertical según plataforma
export const verticalScale = (size) => {
    const baseHeight = 812; // iPhone X height
    return (SCREEN_HEIGHT / baseHeight) * size;
};

// Padding para Safe Area en iOS
export const SAFE_AREA_PADDING = {
    paddingTop: isIOS ? 50 : 20,
    paddingBottom: isIOS ? 34 : 10,
};

// Sombras multiplataforma
export const SHADOW_STYLE = Platform.select({
    ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    android: {
        elevation: 3,
    },
});