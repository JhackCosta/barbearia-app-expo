import React from 'react';
import { View, StyleSheet } from 'react-native';

interface DateTimePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({ date, onDateChange, mode = 'date' }) => {
  const formatValue = () => {
    if (mode === 'time') {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    if (mode === 'datetime' || mode === 'date') {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return mode === 'datetime' ? `${year}-${month}-${day}T${hours}:${minutes}` : `${year}-${month}-${day}`;
    }
    return '';
  };

  const handleChange = (e: any) => {
    const value = e.target.value;
    if (mode === 'time') {
      const [hours, minutes] = value.split(':');
      const newDate = new Date(date);
      newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      onDateChange(newDate);
    } else {
      const newDate = new Date(value);
      if (!isNaN(newDate.getTime())) onDateChange(newDate);
    }
  };

  const inputType = mode === 'time' ? 'time' : mode === 'datetime' ? 'datetime-local' : 'date';

  return (
    <View style={styles.container}>
      <input type={inputType} value={formatValue()} onChange={handleChange} style={styles.input as any} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  input: { padding: 16, fontSize: 16, backgroundColor: '#f5f5f5', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', width: '100%' }
});
