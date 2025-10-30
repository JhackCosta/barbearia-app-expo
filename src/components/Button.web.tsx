import React from 'react';

interface ButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  children: string;
}

export const CustomButton: React.FC<ButtonProps> = ({
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  children,
}) => {
  const handleClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !loading) {
      onPress();
    }
  };

  const baseStyle: React.CSSProperties = {
    flex: 1,
    padding: '12px 16px',
    fontSize: '16px',
    fontWeight: '500',
    borderRadius: '4px',
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'all 0.2s',
    position: 'relative',
    zIndex: 10,
    pointerEvents: disabled || loading ? 'none' : 'auto',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
  };

  const primaryStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: '#6200EA',
    color: '#FFF',
  };

  const secondaryStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: 'transparent',
    color: '#95A5A6',
    border: '1px solid #95A5A6',
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      style={variant === 'primary' ? primaryStyle : secondaryStyle}
      onMouseOver={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.opacity = '0.9';
        }
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.opacity = disabled || loading ? '0.6' : '1';
      }}
    >
      {loading ? 'Carregando...' : children}
    </button>
  );
};
