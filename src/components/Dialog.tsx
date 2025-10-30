import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { Portal, Dialog as PaperDialog, Button, Text } from 'react-native-paper';

interface DialogButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface DialogProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: DialogButton[];
  onDismiss: () => void;
}

export const Dialog: React.FC<DialogProps> = ({ visible, title, message, buttons = [], onDismiss }) => {
  return (
    <Portal>
      <PaperDialog visible={visible} onDismiss={onDismiss}>
        <PaperDialog.Title>{title}</PaperDialog.Title>
        {message && (
          <PaperDialog.Content>
            <Text variant="bodyMedium">{message}</Text>
          </PaperDialog.Content>
        )}
        <PaperDialog.Actions>
          {buttons.map((button, index) => (
            <Button
              key={index}
              onPress={() => {
                if (button.onPress) {
                  button.onPress();
                }
                onDismiss();
              }}
              mode={button.style === 'cancel' ? 'outlined' : 'contained'}
              textColor={button.style === 'destructive' ? '#E74C3C' : undefined}
            >
              {button.text}
            </Button>
          ))}
        </PaperDialog.Actions>
      </PaperDialog>
    </Portal>
  );
};
