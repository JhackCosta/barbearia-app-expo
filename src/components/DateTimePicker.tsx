import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform, Modal } from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Button } from 'react-native-paper';

interface DateTimePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({ date, onDateChange, mode = 'date' }) => {
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [tempDate, setTempDate] = useState(date);
  const [tempTime, setTempTime] = useState(date);

  const onDateChange_internal = (event: any, selectedDate?: Date) => {
    // No Android, fecha o picker automaticamente
    if (Platform.OS === 'android') {
      setShowDate(false);
      if (selectedDate && event.type === 'set') {
        if (mode === 'datetime') {
          setTempDate(selectedDate);
          setShowTime(true);
        } else {
          onDateChange(selectedDate);
        }
      }
    } else {
      // No iOS, apenas atualiza o valor temporário
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const onTimeChange_internal = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTime(false);
      if (selectedTime && event.type === 'set') {
        const combined = new Date(tempDate);
        combined.setHours(selectedTime.getHours());
        combined.setMinutes(selectedTime.getMinutes());
        onDateChange(combined);
      }
    } else {
      // No iOS, apenas atualiza o valor temporário
      if (selectedTime) {
        setTempTime(selectedTime);
      }
    }
  };

  const confirmDateSelection = () => {
    setShowDate(false);
    if (mode === 'datetime') {
      // Abre o seletor de hora após confirmar a data
      setTimeout(() => setShowTime(true), 100);
    } else {
      onDateChange(tempDate);
    }
  };

  const confirmTimeSelection = () => {
    setShowTime(false);
    const combined = new Date(tempDate);
    combined.setHours(tempTime.getHours());
    combined.setMinutes(tempTime.getMinutes());
    onDateChange(combined);
  };

  const cancelSelection = () => {
    setShowDate(false);
    setShowTime(false);
  };

  const showDatePicker = () => {
    setTempDate(date);
    setShowDate(true);
  };

  const showTimePicker = () => {
    setTempTime(date);
    setShowTime(true);
  };

  const formatDisplayDate = () => {
    if (mode === 'time') return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (mode === 'datetime') return `${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    return date.toLocaleDateString('pt-BR');
  };

  // Renderiza o picker com modal no iOS
  const renderIOSPicker = (show: boolean, pickerMode: 'date' | 'time', value: Date, onChange: any, onConfirm: () => void) => {
    if (!show || Platform.OS !== 'ios') return null;

    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={show}
        onRequestClose={cancelSelection}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Button onPress={cancelSelection} textColor="#6200EA">
                Cancelar
              </Button>
              <Button onPress={onConfirm} textColor="#6200EA" mode="contained">
                Confirmar
              </Button>
            </View>
            <RNDateTimePicker
              value={value}
              mode={pickerMode}
              is24Hour={true}
              display="spinner"
              onChange={onChange}
              locale="pt-BR"
              minimumDate={pickerMode === 'date' ? new Date() : undefined}
              style={styles.iosPicker}
            />
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {mode === 'datetime' ? (
        // Para datetime, mostramos dois botões separados
        <View style={styles.datetimeContainer}>
          <TouchableOpacity onPress={showDatePicker} style={[styles.button, styles.halfButton]}>
            <Text style={styles.text}>📅 {date.toLocaleDateString('pt-BR')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={showTimePicker} style={[styles.button, styles.halfButton]}>
            <Text style={styles.text}>🕒 {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={showDatePicker} style={styles.button}>
          <Text style={styles.text}>📅 {formatDisplayDate()}</Text>
        </TouchableOpacity>
      )}

      {/* Renderiza pickers para iOS com modal */}
      {Platform.OS === 'ios' ? (
        <>
          {renderIOSPicker(showDate, 'date', tempDate, onDateChange_internal, confirmDateSelection)}
          {renderIOSPicker(showTime, 'time', tempTime, onTimeChange_internal, confirmTimeSelection)}
        </>
      ) : (
        <>
          {showDate && (
            <RNDateTimePicker
              value={tempDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onDateChange_internal}
              locale="pt-BR"
              minimumDate={new Date()}
            />
          )}

          {showTime && (
            <RNDateTimePicker
              value={tempTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onTimeChange_internal}
              locale="pt-BR"
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  datetimeContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between'
  },
  button: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center'
  },
  halfButton: {
    flex: 1
  },
  text: { fontSize: 16, color: '#333' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  iosPicker: {
    height: 216,
  },
});
