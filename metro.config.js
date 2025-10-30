const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@react-native-community/datetimepicker' && platform === 'web') {
    return {
      filePath: path.resolve(__dirname, 'src/components/DateTimePicker.web.tsx'),
      type: 'sourceFile',
    };
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
