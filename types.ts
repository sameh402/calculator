export enum Operator {
  ADD = '+',
  SUBTRACT = '-',
  MULTIPLY = '×',
  DIVIDE = '÷',
  NONE = ''
}

export type CalculatorAction = 
  | { type: 'ADD_DIGIT'; payload: string }
  | { type: 'SET_OPERATION'; payload: Operator }
  | { type: 'CALCULATE' }
  | { type: 'CLEAR_ALL' }
  | { type: 'DELETE_LAST' }
  | { type: 'TOGGLE_SIGN' }
  | { type: 'PERCENTAGE' }
  | { type: 'ADD_DECIMAL' };

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface CalculatorState {
  currentValue: string;
  previousValue: string;
  operator: Operator;
  history: HistoryItem[];
  isNewEntry: boolean; // True if the next digit starts a new number (e.g., after an operator)
  error: string | null;
}

export const INITIAL_STATE: CalculatorState = {
  currentValue: '0',
  previousValue: '',
  operator: Operator.NONE,
  history: [],
  isNewEntry: true,
  error: null
};