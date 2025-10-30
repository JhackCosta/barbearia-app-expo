import { Alert, Platform } from 'react-native';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export const showAlert = (
  title: string,
  message?: string,
  buttons?: AlertButton[]
) => {
  if (Platform.OS === 'web') {
    console.log('🔔 showAlert WEB:', { title, message, buttons: buttons?.map(b => b.text) });

    // Na web, usa window.confirm ou alert
    if (buttons && buttons.length > 1) {
      // Tem botões de confirmação
      const cancelButton = buttons.find(b => b.style === 'cancel');
      const confirmButton = buttons.find(b => b.style !== 'cancel');

      const cancelText = cancelButton?.text || 'Cancelar';
      const confirmText = confirmButton?.text || 'OK';

      const alertText = message
        ? `${title}\n\n${message}\n\nClique em OK para "${confirmText}" ou Cancelar para "${cancelText}"`
        : `${title}\n\nClique em OK para "${confirmText}" ou Cancelar para "${cancelText}"`;

      const result = window.confirm(alertText);

      if (result) {
        console.log(`✅ Usuário clicou OK (${confirmText})`);
        if (confirmButton?.onPress) {
          confirmButton.onPress();
        }
      } else {
        console.log(`❌ Usuário clicou Cancelar (${cancelText})`);
        if (cancelButton?.onPress) {
          cancelButton.onPress();
        }
      }
    } else if (buttons && buttons.length === 1) {
      // Alert simples com 1 botão
      const alertText = message ? `${title}\n\n${message}` : title;
      window.alert(alertText);
      if (buttons[0]?.onPress) {
        buttons[0].onPress();
      }
    } else {
      // Alert sem botões
      const alertText = message ? `${title}\n\n${message}` : title;
      window.alert(alertText);
    }
  } else {
    // Mobile usa Alert nativo
    Alert.alert(title, message, buttons);
  }
};
