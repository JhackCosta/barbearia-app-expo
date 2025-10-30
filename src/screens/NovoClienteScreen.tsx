import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, ActivityIndicator, Keyboard } from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  HelperText,
  Surface
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList, Cliente } from '../types';
import { ClienteStorage } from '../storage';
import { showAlert } from '../utils/alert';
import { CustomButton } from '../components/Button';

type NovoClienteNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NovoCliente'>;

interface Props {
  navigation: NovoClienteNavigationProp;
}

const NovoClienteScreen: React.FC<Props> = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);

  const validarFormulario = () => {
    if (nome.trim().length < 2) {
      showAlert('Erro', 'Nome deve ter pelo menos 2 caracteres.');
      return false;
    }

    if (telefone.trim().length < 10) {
      showAlert('Erro', 'Telefone deve ter pelo menos 10 dígitos.');
      return false;
    }

    return true;
  };

  const salvarCliente = async () => {
    if (loading) {
      return;
    }

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);

    try {
      const novoCliente: Cliente = {
        id: Date.now().toString(),
        nome: nome.trim(),
        telefone: telefone.trim(),
        criadoEm: new Date(),
      };

      await ClienteStorage.adicionarCliente(novoCliente);

      showAlert(
        '✅ Sucesso',
        'Cliente cadastrado com sucesso!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      showAlert('❌ Erro', 'Não foi possível salvar o cliente.');
      setLoading(false);
    }
  };

  const formatarTelefone = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');

    if (numeros.length <= 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  const handleTelefoneChange = (valor: string) => {
    const telefoneFormatado = formatarTelefone(valor);
    setTelefone(telefoneFormatado);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Surface style={styles.surface}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Cadastrar Novo Cliente</Title>

            <TextInput
              label="👤 Nome completo"
              value={nome}
              onChangeText={setNome}
              mode="outlined"
              style={styles.input}
              autoCapitalize="words"
              autoCorrect={false}
            />
            <HelperText type="info" visible={nome.length > 0 && nome.length < 2}>
              Nome deve ter pelo menos 2 caracteres
            </HelperText>

            <TextInput
              label="📱 Telefone"
              value={telefone}
              onChangeText={handleTelefoneChange}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
              maxLength={15}
            />
            <HelperText type="info" visible={telefone.length > 0 && telefone.replace(/\D/g, '').length < 10}>
              Telefone deve ter pelo menos 10 dígitos
            </HelperText>

            <View style={styles.buttonContainer}>
              <CustomButton
                onPress={() => navigation.goBack()}
                disabled={loading}
                variant="secondary"
              >
                Cancelar
              </CustomButton>

              <CustomButton
                onPress={() => {
                  Keyboard.dismiss();
                  salvarCliente();
                }}
                disabled={loading}
                loading={loading}
                variant="primary"
              >
                Salvar Cliente
              </CustomButton>
            </View>
          </Card.Content>
        </Card>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    flexGrow: 1,
    padding: 16,
  },
  surface: {
    flex: 1,
    borderRadius: 12,
  },
  card: {
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#2C3E50',
  },
  input: {
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#95A5A6',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#95A5A6',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#6200EA',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#9575CD',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default NovoClienteScreen;
