import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PaperProvider } from 'react-native-paper';

import Navigation from './src/navigation/Navigation';
import { NotificationService } from './src/services/NotificationService';
import { VALORES_SERVICOS } from './src/types';

function App(): React.JSX.Element {
  useEffect(() => {
    NotificationService.init();
    carregarPrecosPersonalizados();
  }, []);

  const carregarPrecosPersonalizados = async () => {
    try {
      const [corteBarba, soCorte, soBarba] = await Promise.all([
        AsyncStorage.getItem('@config_preco_corte_barba'),
        AsyncStorage.getItem('@config_preco_so_corte'),
        AsyncStorage.getItem('@config_preco_so_barba'),
      ]);

      if (corteBarba) {
        VALORES_SERVICOS['Corte e Barba'] = parseFloat(corteBarba);
      }
      if (soCorte) {
        VALORES_SERVICOS['Só Corte'] = parseFloat(soCorte);
      }
      if (soBarba) {
        VALORES_SERVICOS['Só Barba'] = parseFloat(soBarba);
      }
    } catch (error) {
      console.error('Erro ao carregar preços personalizados:', error);
    }
  };

  return (
    <PaperProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#6200EA"
      />
      <Navigation />
    </PaperProvider>
  );
}

export default App;
