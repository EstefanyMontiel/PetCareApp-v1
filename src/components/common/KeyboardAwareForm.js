// ============================================
// ⌨️ KEYBOARD AWARE FORM
// ============================================
// ✅ Solución universal para el problema del teclado
// ✅ Compatible iOS y Android
// ✅ Auto-scroll a campos de texto

import React, { useRef, useEffect } from 'react';
import {
    ScrollView,
    Platform,
    Keyboard,
    StyleSheet,
} from 'react-native';

const KeyboardAwareForm = ({ 
    children, 
    style, 
    contentContainerStyle,
    showsVerticalScrollIndicator = false,
    ...props 
}) => {
    const scrollViewRef = useRef(null);
    let scrollToEndTimer = null;

    useEffect(() => {
        // Limpiar timer al desmontar
        return () => {
            if (scrollToEndTimer) {
                clearTimeout(scrollToEndTimer);
            }
        };
    }, []);

    // ✅ Función para hacer scroll cuando se enfoca un campo
    const handleScrollToEnd = () => {
        if (scrollToEndTimer) {
            clearTimeout(scrollToEndTimer);
        }
        
        scrollToEndTimer = setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    // ✅ Añadir handler onFocus a todos los TextInput hijos
    const enhanceChildren = (children) => {
        return React.Children.map(children, (child) => {
            if (!child) return child;

            // Si es un TextInput multiline, añadir onFocus
            if (child.props?.multiline) {
                return React.cloneElement(child, {
                    onFocus: (e) => {
                        handleScrollToEnd();
                        child.props.onFocus?.(e);
                    },
                });
            }

            // Si tiene children, procesar recursivamente
            if (child.props?.children) {
                return React.cloneElement(child, {
                    children: enhanceChildren(child.props.children),
                });
            }

            return child;
        });
    };

    return (
        <ScrollView
            ref={scrollViewRef}
            style={[styles.scrollView, style]}
            contentContainerStyle={[
                styles.contentContainer,
                contentContainerStyle,
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            nestedScrollEnabled={true}
            {...props}
        >
            {enhanceChildren(children)}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: Platform.OS === 'ios' ? 40 : 120, // ✅ Espacio extra para teclado
    },
});

export default KeyboardAwareForm;