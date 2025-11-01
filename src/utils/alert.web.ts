import { Platform } from 'react-native';

// Sistema de callback para dialogs no Web
let dialogCallback: ((title: string, message: string, buttons: any[]) => void) | null = null;

export const registerDialogHandler = (handler: (title: string, message: string, buttons: any[]) => void) => {
  dialogCallback = handler;
};

interface AlertButton {
  text?: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

/**
 * Wrapper do Alert que usa Dialog no Web e Alert nativo no mobile
 */
export const showAlert = (
  title: string,
  message?: string,
  buttons?: AlertButton[]
) => {
  if (Platform.OS === 'web' && dialogCallback) {
    // No Web, usa o Dialog customizado
    dialogCallback(title, message || '', buttons || [{ text: 'OK' }]);
  } else {
    // No mobile, usa Alert nativo
    const Alert = require('react-native').Alert;
    Alert.alert(title, message, buttons);
  }
};
