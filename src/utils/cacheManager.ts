import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const CACHE_VERSION_KEY = '@cache_version';
const CURRENT_CACHE_VERSION = '1.0.0';

/**
 * Gerenciador de cache para Web
 * Garante que dados antigos sejam limpos quando há mudanças na estrutura
 */
export const CacheManager = {
  /**
   * Verifica e limpa o cache se a versão mudou
   * Deve ser chamado ao iniciar o app
   */
  async checkAndClearIfNeeded(): Promise<boolean> {
    // Só executa no Web
    if (Platform.OS !== 'web') {
      return false;
    }

    try {
      const savedVersion = await AsyncStorage.getItem(CACHE_VERSION_KEY);

      // Se não tem versão salva ou é diferente da atual, limpa o cache
      if (!savedVersion || savedVersion !== CURRENT_CACHE_VERSION) {
        console.log('🗑️ Cache desatualizado detectado. Limpando...');
        await AsyncStorage.clear();
        await AsyncStorage.setItem(CACHE_VERSION_KEY, CURRENT_CACHE_VERSION);
        console.log('✅ Cache limpo e versão atualizada');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro ao verificar versão do cache:', error);
      return false;
    }
  },

  /**
   * Limpa todo o cache manualmente
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
      await AsyncStorage.setItem(CACHE_VERSION_KEY, CURRENT_CACHE_VERSION);
      console.log('✅ Cache limpo manualmente');
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
      throw error;
    }
  },

  /**
   * Obtém a versão atual do cache
   */
  async getCurrentVersion(): Promise<string> {
    try {
      const version = await AsyncStorage.getItem(CACHE_VERSION_KEY);
      return version || 'não definida';
    } catch (error) {
      console.error('Erro ao obter versão do cache:', error);
      return 'erro';
    }
  },
};
