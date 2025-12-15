import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Operator } from '../types';
import { AlertCircle } from 'lucide-react-native';

interface DisplayProps {
  value: string;
  previousValue: string;
  operator: Operator;
  error: string | null;
}

const Display: React.FC<DisplayProps> = ({ value, previousValue, operator, error }) => {

  const formatDisplay = (val: string) => {
    if (!val) return '0';
    // Add commas for thousands
    const parts = val.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  return (
    <View style={styles.container}>
      {/* Previous Calculation / Equation Line */}
      <View style={styles.historyRow}>
        {previousValue && operator !== Operator.NONE ? (
          <Text style={styles.historyText}>
            {formatDisplay(previousValue)} <Text style={styles.operatorText}>{operator}</Text>
          </Text>
        ) : (
          <Text style={styles.historyText}> </Text>
        )}
      </View>

      {/* Main Result Display */}
      <View style={styles.resultRow}>
        {error ? (
          <View style={styles.errorContainer}>
            <AlertCircle color="#F87171" size={32} style={{ marginRight: 8 }} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <Text 
            style={styles.resultText}
            adjustsFontSizeToFit
            numberOfLines={1}
            minimumFontScale={0.4}
          >
            {formatDisplay(value)}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 16,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    minHeight: 160,
  },
  historyRow: {
    height: 30,
    marginBottom: 4,
    justifyContent: 'center',
  },
  historyText: {
    color: '#9CA3AF', // gray-400
    fontSize: 18,
    fontWeight: '300',
  },
  operatorText: {
    color: '#FB923C', // orange-400
  },
  resultRow: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  resultText: {
    color: '#FFFFFF',
    fontSize: 80, // roughly 5rem-6rem
    fontWeight: '200',
    textAlign: 'right',
    width: '100%',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: '#F87171', // red-400
    fontSize: 30,
    fontWeight: '500',
  }
});

export default Display;