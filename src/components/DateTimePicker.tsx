import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';

interface DateTimePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({ date, onDateChange, mode = 'date' }) => {
  const [show, setShow] = useState(false);
  const [currentMode, setCurrentMode] = useState<'date' | 'time'>('date');

  const onChange = (event: any, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate && event.type === 'set') {
      if (mode === 'datetime' && currentMode === 'date') {
        onDateChange(selectedDate);
        setCurrentMode('time');
        setShow(true);
      } else {
        onDateChange(selectedDate);
        setCurrentMode('date');
      }
    }
  };

  const showPicker = () => {
    setCurrentMode(mode === 'time' ? 'time' : 'date');
    setShow(true);
  };

  const formatDisplayDate = () => {
    if (mode === 'time') return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (mode === 'datetime') return `${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showPicker} style={styles.button}>
        <Text style={styles.text}>📅 {formatDisplayDate()}</Text>
      </TouchableOpacity>
      {show && <RNDateTimePicker value={date} mode={currentMode} is24Hour={true} display="default" onChange={onChange} locale="pt-BR" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  button: { padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  text: { fontSize: 16, color: '#333' }
});
