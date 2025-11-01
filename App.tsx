import React, { useEffect, useState } from 'react';
import { StatusBar, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PaperProvider } from 'react-native-paper';

import Navigation from './src/navigation/Navigation';
import { NotificationService } from './src/services/NotificationService';
import { VALORES_SERVICOS } from './src/types';
import { CacheManager } from './src/utils/cacheManager';

function App(): React.JSX.Element {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Verifica e limpa cache se necessário (somente Web)
      await CacheManager.checkAndClearIfNeeded();

      // Inicializa serviços
      NotificationService.init();
      await carregarPrecosPersonalizados();
    } catch (error) {
      console.error('Erro ao inicializar app:', error);
    } finally {
      setIsInitializing(false);
    }
  };

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

  // Mostra loading enquanto inicializa
  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EA" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6200EA',
  },
});

export default App;
