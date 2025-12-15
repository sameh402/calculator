import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
// Calculate button size: Screen width - padding (40) - gaps (approx 3 * 12) divided by 4 columns
const BUTTON_SIZE = (width - 40 - 36) / 4;

interface KeypadButtonProps {
  label: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  className?: string; // Kept for interface compatibility
  doubleWidth?: boolean;
}

const KeypadButton: React.FC<KeypadButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary', 
  doubleWidth = false
}) => {
  
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary': return '#1F2937'; // gray-800
      case 'secondary': return '#D1D5DB'; // gray-300
      case 'accent': return '#F97316'; // orange-500
      case 'danger': return '#7F1D1D'; // red-900
      default: return '#1F2937';
    }
  };

  const getTextColor = () => {
     if (variant === 'secondary') return '#111827'; // gray-900
     return '#FFFFFF';
  };

  return (
    <TouchableOpacity
      onPress={onClick}
      style={[
        styles.button,
        { 
          backgroundColor: getBackgroundColor(),
          width: doubleWidth ? (BUTTON_SIZE * 2) + 12 : BUTTON_SIZE,
          borderRadius: BUTTON_SIZE / 2,
        }
      ]}
      activeOpacity={0.7}
    >
      {typeof label === 'string' ? (
        <Text style={[styles.text, { color: getTextColor() }]}>{label}</Text>
      ) : (
        <View style={{ opacity: 0.9 }}>
          {/* We assume icons passed as children will handle their own color or inherit if possible, 
              but usually we pass colored icons from parent */}
          {label}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6, // Half gap
  },
  text: {
    fontSize: 28,
    fontWeight: '500',
  }
});

export default KeypadButton;