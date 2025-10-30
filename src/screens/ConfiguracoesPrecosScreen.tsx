import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {
  Card,
  Title,
  TextInput,
  Button,
  Text,
  Surface,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {VALORES_SERVICOS, TipoServico} from '../types';
import {showAlert} from '../utils/alert';

const STORAGE_KEYS = {
  PRECO_CORTE_BARBA: '@config_preco_corte_barba',
  PRECO_SO_CORTE: '@config_preco_so_corte',
  PRECO_SO_BARBA: '@config_preco_so_barba',
};

const PRECOS_PADRAO = {
  'Corte e Barba': 50.0,
  'Só Corte': 30.0,
  'Só Barba': 25.0,
};

const ConfiguracoesPrecosScreen: React.FC = () => {
  const [precoCorteBarba, setPrecoCorteBarba] = useState('50.00');
  const [precoSoCorte, setPrecoSoCorte] = useState('30.00');
  const [precoSoBarba, setPrecoSoBarba] = useState('25.00');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPrecos();
  }, []);

  const carregarPrecos = async () => {
    try {
      const [corteBarba, soCorte, soBarba] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PRECO_CORTE_BARBA),
        AsyncStorage.getItem(STORAGE_KEYS.PRECO_SO_CORTE),
        AsyncStorage.getItem(STORAGE_KEYS.PRECO_SO_BARBA),
      ]);

      if (corteBarba) setPrecoCorteBarba(corteBarba);
      if (soCorte) setPrecoSoCorte(soCorte);
      if (soBarba) setPrecoSoBarba(soBarba);
    } catch (error) {
      console.error('Erro ao carregar preços:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatarPreco = (texto: string) => {
    const numeros = texto.replace(/\D/g, '');

    if (numeros === '') return '';

    const numero = parseFloat(numeros) / 100;
    return numero.toFixed(2);
  };

  const handlePrecoChange = (
    texto: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const precoFormatado = formatarPreco(texto);
    setter(precoFormatado);
  };

  const salvarPrecos = async () => {
    try {
      const valorCorteBarba = parseFloat(precoCorteBarba);
      const valorSoCorte = parseFloat(precoSoCorte);
      const valorSoBarba = parseFloat(precoSoBarba);

      if (isNaN(valorCorteBarba) || valorCorteBarba <= 0) {
        showAlert('Atenção', 'Por favor, informe um preço válido para Corte e Barba.');
        return;
      }

      if (isNaN(valorSoCorte) || valorSoCorte <= 0) {
        showAlert('Atenção', 'Por favor, informe um preço válido para Só Corte.');
        return;
      }

      if (isNaN(valorSoBarba) || valorSoBarba <= 0) {
        showAlert('Atenção', 'Por favor, informe um preço válido para Só Barba.');
        return;
      }

      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.PRECO_CORTE_BARBA, precoCorteBarba),
        AsyncStorage.setItem(STORAGE_KEYS.PRECO_SO_CORTE, precoSoCorte),
        AsyncStorage.setItem(STORAGE_KEYS.PRECO_SO_BARBA, precoSoBarba),
      ]);

      VALORES_SERVICOS['Corte e Barba'] = valorCorteBarba;
      VALORES_SERVICOS['Só Corte'] = valorSoCorte;
      VALORES_SERVICOS['Só Barba'] = valorSoBarba;

      showAlert('✅ Sucesso', 'Preços atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar preços:', error);
      showAlert('❌ Erro', 'Não foi possível salvar os preços.');
    }
  };

  const restaurarPadrao = () => {
    showAlert(
      'Restaurar Preços Padrão',
      'Tem certeza que deseja restaurar os preços padrão?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Restaurar',
          onPress: () => {
            setPrecoCorteBarba('50.00');
            setPrecoSoCorte('30.00');
            setPrecoSoBarba('25.00');
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header} elevation={2}>
        <Title style={styles.headerTitle}>💰 Configuração de Preços</Title>
        <Text style={styles.headerSubtitle}>
          Defina os valores dos seus serviços
        </Text>
      </Surface>

      <View style={styles.content}>
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.infoText}>
              💡 Os preços definidos aqui serão usados automaticamente ao criar
              novos agendamentos.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>✂️ Corte e Barba</Title>
            <Text style={styles.description}>Serviço completo</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currency}>R$</Text>
              <TextInput
                mode="outlined"
                value={precoCorteBarba}
                onChangeText={text => handlePrecoChange(text, setPrecoCorteBarba)}
                style={styles.input}
                keyboardType="numeric"
                placeholder="0.00"
              />
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>💈 Só Corte</Title>
            <Text style={styles.description}>Apenas corte de cabelo</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currency}>R$</Text>
              <TextInput
                mode="outlined"
                value={precoSoCorte}
                onChangeText={text => handlePrecoChange(text, setPrecoSoCorte)}
                style={styles.input}
                keyboardType="numeric"
                placeholder="0.00"
              />
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>🧔 Só Barba</Title>
            <Text style={styles.description}>Apenas barba</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currency}>R$</Text>
              <TextInput
                mode="outlined"
                value={precoSoBarba}
                onChangeText={text => handlePrecoChange(text, setPrecoSoBarba)}
                style={styles.input}
                keyboardType="numeric"
                placeholder="0.00"
              />
            </View>
          </Card.Content>
        </Card>

        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={restaurarPadrao}
            style={styles.actionButton}>
            Restaurar Padrão
          </Button>
          <Button
            mode="contained"
            onPress={salvarPrecos}
            style={styles.actionButton}>
            Salvar Preços
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  infoCard: {
    marginBottom: 16,
    backgroundColor: '#E8F5E9',
  },
  infoText: {
    fontSize: 14,
    color: '#2E7D32',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  description: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currency: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    fontSize: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
  },
});

export default ConfiguracoesPrecosScreen;
