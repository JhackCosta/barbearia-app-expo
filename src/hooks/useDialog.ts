import { useState, useCallback } from 'react';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface DialogState {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: AlertButton[];
}

export const useDialog = () => {
  const [dialog, setDialog] = useState<DialogState>({
    visible: false,
    title: '',
    message: '',
    buttons: [],
  });

  const showDialog = useCallback((title: string, message?: string, buttons?: AlertButton[]) => {
    console.log('📢 showDialog:', { title, message, buttons: buttons?.map(b => b.text) });
    setDialog({
      visible: true,
      title,
      message,
      buttons,
    });
  }, []);

  const hideDialog = useCallback(() => {
    console.log('🚫 hideDialog');
    setDialog((prev) => ({ ...prev, visible: false }));
  }, []);

  return {
    dialog,
    showDialog,
    hideDialog,
  };
};
