import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  horizontal?: boolean;
}

const Logo: React.FC<LogoProps> = ({size = 'medium', horizontal = false}) => {
  const squareSize = {
    small: 100,
    medium: 150,
    large: 200,
  }[size];

  const horizontalSizes = {
    small: { width: 180, height: 40 },
    medium: { width: 280, height: 60 },
    large: { width: 350, height: 80 },
  }[size];

  let logoSource;
  try {
    logoSource = horizontal
      ? require('../assets/images/logo-horizontal.png')
      : require('../assets/images/logo.jpeg');
  } catch {
    logoSource = require('../assets/images/logo.jpeg');
  }

  const imageStyle = horizontal
    ? horizontalSizes
    : {width: squareSize, height: squareSize};

  return (
    <View style={styles.container}>
      <Image
        source={logoSource}
        style={[styles.logo, imageStyle]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {},
});

export default Logo;
