import React, { useReducer, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalculatorState, CalculatorAction, Operator, INITIAL_STATE } from './types';
import Display from './components/Display';
import KeypadButton from './components/KeypadButton';
import HistoryTape from './components/HistoryTape';
import { Delete, History as HistoryIcon } from 'lucide-react-native';

// --- Math Utility ---
const formatResult = (num: number): string => {
  const precision = 10000000000;
  return (Math.round(num * precision) / precision).toString();
};

const calculateResult = (a: string, b: string, op: Operator): string => {
  const num1 = parseFloat(a);
  const num2 = parseFloat(b);

  if (isNaN(num1) || isNaN(num2)) return 'Error';

  let result = 0;
  switch (op) {
    case Operator.ADD:
      result = num1 + num2;
      break;
    case Operator.SUBTRACT:
      result = num1 - num2;
      break;
    case Operator.MULTIPLY:
      result = num1 * num2;
      break;
    case Operator.DIVIDE:
      if (num2 === 0) return 'Error'; // Division by zero
      result = num1 / num2;
      break;
    default:
      return b;
  }

  return formatResult(result);
};

// --- Reducer ---
const reducer = (state: CalculatorState, action: CalculatorAction): CalculatorState => {
  switch (action.type) {
    case 'ADD_DIGIT':
      if (state.error) {
        return { ...INITIAL_STATE, currentValue: action.payload, isNewEntry: false };
      }
      if (state.isNewEntry) {
        return { ...state, currentValue: action.payload, isNewEntry: false };
      }
      if (state.currentValue === '0' && action.payload !== '.') {
        return { ...state, currentValue: action.payload };
      }
      if (state.currentValue.length >= 15) return state; // Max length constraint
      return { ...state, currentValue: state.currentValue + action.payload };

    case 'ADD_DECIMAL':
      if (state.error) return { ...INITIAL_STATE, currentValue: '0.', isNewEntry: false };
      if (state.isNewEntry) {
        return { ...state, currentValue: '0.', isNewEntry: false };
      }
      if (state.currentValue.includes('.')) return state;
      return { ...state, currentValue: state.currentValue + '.' };

    case 'SET_OPERATION':
      if (state.error) return state;
      // If we already have an operator and perform another op, calculate intermediate result
      if (state.operator !== Operator.NONE && !state.isNewEntry) {
        const intermediate = calculateResult(state.previousValue, state.currentValue, state.operator);
        if (intermediate === 'Error') {
          return { ...state, currentValue: 'Error', error: 'Divide by zero', isNewEntry: true };
        }
        return {
          ...state,
          previousValue: intermediate,
          currentValue: intermediate,
          operator: action.payload,
          isNewEntry: true
        };
      }
      return {
        ...state,
        previousValue: state.currentValue,
        operator: action.payload,
        isNewEntry: true
      };

    case 'CALCULATE':
      if (state.error || state.operator === Operator.NONE) return state;
      const result = calculateResult(state.previousValue, state.currentValue, state.operator);
      if (result === 'Error') {
        return { ...state, currentValue: 'Error', error: 'Divide by zero', isNewEntry: true };
      }
      const newHistoryItem = {
        id: Date.now().toString(),
        expression: `${state.previousValue} ${state.operator} ${state.currentValue}`,
        result: result,
        timestamp: Date.now()
      };
      return {
        ...state,
        currentValue: result,
        previousValue: '',
        operator: Operator.NONE,
        isNewEntry: true,
        history: [...state.history, newHistoryItem]
      };

    case 'CLEAR_ALL':
      return { ...INITIAL_STATE, history: state.history }; // Keep history

    case 'DELETE_LAST':
      if (state.error) return { ...INITIAL_STATE, history: state.history };
      if (state.isNewEntry) return state;
      if (state.currentValue.length === 1) {
        return { ...state, currentValue: '0', isNewEntry: true };
      }
      return { ...state, currentValue: state.currentValue.slice(0, -1) };

    case 'TOGGLE_SIGN':
      if (state.error) return state;
      const val = parseFloat(state.currentValue);
      if (val === 0) return state;
      return { ...state, currentValue: (val * -1).toString() };

    case 'PERCENTAGE':
      if (state.error) return state;
      const percentVal = parseFloat(state.currentValue);
      return { ...state, currentValue: (percentVal / 100).toString() };

    default:
      return state;
  }
};

// --- Main App Component ---
const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const restoreHistory = (val: string) => {
    dispatch({ type: 'CLEAR_ALL' });
    dispatch({ type: 'ADD_DIGIT', payload: val });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Top Status Bar Decoration (Mock for visual balance) */}
      <View style={styles.topDecoration} />

      {/* History Button Overlay */}
      <TouchableOpacity 
        onPress={() => setIsHistoryOpen(true)}
        style={styles.historyButton}
      >
        <HistoryIcon color="#9CA3AF" size={24} />
      </TouchableOpacity>

      {/* Display */}
      <Display 
        value={state.currentValue} 
        previousValue={state.previousValue} 
        operator={state.operator}
        error={state.error}
      />

      {/* Keypad */}
      <View style={styles.keypadContainer}>
        {/* Row 1: Function Keys */}
        <View style={styles.row}>
          <KeypadButton 
            label="AC" 
            variant="secondary" 
            onClick={() => dispatch({ type: 'CLEAR_ALL' })}
          />
          <KeypadButton 
            label={<Delete color="#111827" size={24} />} 
            variant="secondary" 
            onClick={() => dispatch({ type: 'DELETE_LAST' })} 
          />
          <KeypadButton 
            label="%" 
            variant="secondary" 
            onClick={() => dispatch({ type: 'PERCENTAGE' })} 
          />
          <KeypadButton 
            label={Operator.DIVIDE} 
            variant="accent" 
            onClick={() => dispatch({ type: 'SET_OPERATION', payload: Operator.DIVIDE })} 
          />
        </View>

        {/* Row 2: 7-8-9-Multiply */}
        <View style={styles.row}>
          <KeypadButton label="7" onClick={() => dispatch({ type: 'ADD_DIGIT', payload: '7' })} />
          <KeypadButton label="8" onClick={() => dispatch({ type: 'ADD_DIGIT', payload: '8' })} />
          <KeypadButton label="9" onClick={() => dispatch({ type: 'ADD_DIGIT', payload: '9' })} />
          <KeypadButton 
            label={Operator.MULTIPLY} 
            variant="accent" 
            onClick={() => dispatch({ type: 'SET_OPERATION', payload: Operator.MULTIPLY })} 
          />
        </View>

        {/* Row 3: 4-5-6-Subtract */}
        <View style={styles.row}>
          <KeypadButton label="4" onClick={() => dispatch({ type: 'ADD_DIGIT', payload: '4' })} />
          <KeypadButton label="5" onClick={() => dispatch({ type: 'ADD_DIGIT', payload: '5' })} />
          <KeypadButton label="6" onClick={() => dispatch({ type: 'ADD_DIGIT', payload: '6' })} />
          <KeypadButton 
            label={Operator.SUBTRACT} 
            variant="accent" 
            onClick={() => dispatch({ type: 'SET_OPERATION', payload: Operator.SUBTRACT })} 
          />
        </View>

        {/* Row 4: 1-2-3-Add */}
        <View style={styles.row}>
          <KeypadButton label="1" onClick={() => dispatch({ type: 'ADD_DIGIT', payload: '1' })} />
          <KeypadButton label="2" onClick={() => dispatch({ type: 'ADD_DIGIT', payload: '2' })} />
          <KeypadButton label="3" onClick={() => dispatch({ type: 'ADD_DIGIT', payload: '3' })} />
          <KeypadButton 
            label={Operator.ADD} 
            variant="accent" 
            onClick={() => dispatch({ type: 'SET_OPERATION', payload: Operator.ADD })} 
          />
        </View>

        {/* Row 5: +/- 0 . = */}
        <View style={styles.row}>
          <KeypadButton 
            label="+/-" 
            onClick={() => dispatch({ type: 'TOGGLE_SIGN' })} 
          />
          <KeypadButton 
            label="0" 
            onClick={() => dispatch({ type: 'ADD_DIGIT', payload: '0' })} 
          />
          <KeypadButton 
            label="." 
            onClick={() => dispatch({ type: 'ADD_DECIMAL' })} 
          />
          <KeypadButton 
            label="=" 
            variant="accent" 
            onClick={() => dispatch({ type: 'CALCULATE' })} 
          />
        </View>
      </View>

      {/* Slide-over History Tape */}
      <HistoryTape 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)}
        onClear={() => { /* Placeholder for clear history feature */ }}
        history={state.history}
        onHistoryItemClick={restoreHistory}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712', // gray-950
    position: 'relative',
  },
  topDecoration: {
    height: 6,
    width: 80,
    backgroundColor: '#111827', // gray-900
    alignSelf: 'center',
    borderRadius: 99,
    marginTop: 10,
  },
  historyButton: {
    position: 'absolute',
    top: 50, // Below safe area typically
    left: 20,
    padding: 8,
    zIndex: 10,
  },
  keypadContainer: {
    backgroundColor: '#111827', // gray-900
    paddingBottom: 30,
    paddingTop: 16,
    paddingHorizontal: 14,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  }
});

export default App;