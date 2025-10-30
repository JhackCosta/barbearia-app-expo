import React, { useEffect } from 'react';

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
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [visible]);

  if (!visible) return null;

  const handleButtonClick = (button: DialogButton) => {
    if (button.onPress) {
      button.onPress();
    }
    onDismiss();
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  };

  const dialogStyle: React.CSSProperties = {
    backgroundColor: '#FFF',
    borderRadius: '8px',
    padding: '24px',
    minWidth: '300px',
    maxWidth: '500px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '12px',
    color: '#2C3E50',
  };

  const messageStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#5A6C7D',
    marginBottom: '24px',
    lineHeight: '1.5',
  };

  const buttonsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  };

  const getButtonStyle = (button: DialogButton): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      padding: '10px 20px',
      borderRadius: '4px',
      border: 'none',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
    };

    if (button.style === 'cancel') {
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        color: '#95A5A6',
        border: '1px solid #95A5A6',
      };
    } else if (button.style === 'destructive') {
      return {
        ...baseStyle,
        backgroundColor: '#E74C3C',
        color: '#FFF',
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: '#6200EA',
        color: '#FFF',
      };
    }
  };

  return (
    <div style={overlayStyle} onClick={onDismiss}>
      <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
        <div style={titleStyle}>{title}</div>
        {message && <div style={messageStyle}>{message}</div>}
        <div style={buttonsContainerStyle}>
          {buttons.map((button, index) => (
            <button
              key={index}
              style={getButtonStyle(button)}
              onClick={() => handleButtonClick(button)}
              onMouseOver={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
