import { useSafeAreaInsets as useInsets } from 'react-native-safe-area-context';

/**
 * Hook personalizado que devuelve los insets de área segura
 * Útil para componentes que necesitan ajustar padding/margin dinámicamente
 */
export const useSafeAreaInsets = () => {
    const insets = useInsets();
    
    return {
        top: insets.top,
        bottom: insets.bottom,
        left: insets.left,
        right: insets.right,
        // Helpers adicionales
        topWithStatusBar: insets.top || 20,
        bottomWithHomeIndicator: insets.bottom || 0,
    };
};

export default useSafeAreaInsets;