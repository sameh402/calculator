import React from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { HistoryItem } from '../types';
import { History, X, Trash2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HistoryTapeProps {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
  history: HistoryItem[];
  onHistoryItemClick: (result: string) => void;
}

const HistoryTape: React.FC<HistoryTapeProps> = ({ 
  isOpen, 
  onClose, 
  onClear,
  history,
  onHistoryItemClick
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <SafeAreaView edges={['top']} style={styles.header}>
            <View style={styles.headerRow}>
              <View style={styles.titleContainer}>
                <History color="#F97316" size={24} style={{ marginRight: 8 }} />
                <Text style={styles.titleText}>History</Text>
              </View>
              <View style={styles.controls}>
                {history.length > 0 && (
                  <TouchableOpacity onPress={onClear} style={styles.iconButton}>
                    <Trash2 color="#9CA3AF" size={24} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={onClose} style={styles.iconButton}>
                  <X color="#9CA3AF" size={28} />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>

          <FlatList
            data={[...history].reverse()}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No calculations yet.</Text>
              </View>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.historyItem}
                onPress={() => {
                  onHistoryItemClick(item.result);
                  onClose();
                }}
              >
                <Text style={styles.expressionText}>{item.expression}</Text>
                <Text style={styles.resultText}>= {item.result}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '85%',
    backgroundColor: '#030712', // gray-950
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 20,
  },
  header: {
    backgroundColor: '#111827', // gray-900
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  controls: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  listContent: {
    padding: 16,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
  },
  historyItem: {
    backgroundColor: 'rgba(31, 41, 55, 0.5)', // gray-800/50
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  expressionText: {
    color: '#9CA3AF', // gray-400
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  resultText: {
    color: '#FB923C', // orange-400
    fontSize: 24,
    textAlign: 'right',
    fontWeight: '300',
  }
});

export default HistoryTape;