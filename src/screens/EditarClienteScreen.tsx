import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Alert, Keyboard} from 'react-native';
import {TextInput, Button, Title, Card} from 'react-native-paper';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';

import {RootStackParamList, Cliente} from '../types';
import {ClienteStorage} from '../storage';

type EditarClienteNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'EditarCliente'
>;
type EditarClienteRouteProp = RouteProp<RootStackParamList, 'EditarCliente'>;

interface Props {
  navigation: EditarClienteNavigationProp;
  route: EditarClienteRouteProp;
}

const EditarClienteScreen: React.FC<Props> = ({navigation, route}) => {
  const {clienteId} = route.params;
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarCliente();
  }, []);

  const carregarCliente = async () => {
    try {
      const clientes = await ClienteStorage.carregarClientes();
      const cliente = clientes.find(c => c.id === clienteId);

      if (cliente) {
        setNome(cliente.nome);
        setTelefone(cliente.telefone);
      } else {
        Alert.alert('Erro', 'Cliente não encontrado.');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Erro ao carregar cliente:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do cliente.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const formatarTelefone = (texto: string) => {
    const numeros = texto.replace(/\D/g, '');

    if (numeros.length <= 2) {
      return numeros;
    } else if (numeros.length <= 7) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    } else if (numeros.length <= 11) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    } else {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
    }
  };

  const handleTelefoneChange = (texto: string) => {
    const telefoneFormatado = formatarTelefone(texto);
    setTelefone(telefoneFormatado);
  };

  const salvarCliente = async () => {
    Keyboard.dismiss();

    if (!nome.trim() || !telefone.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    if (telefone.replace(/\D/g, '').length < 10) {
      Alert.alert('Atenção', 'Por favor, informe um telefone válido.');
      return;
    }

    try {
      const clientes = await ClienteStorage.carregarClientes();
      const clienteIndex = clientes.findIndex(c => c.id === clienteId);

      if (clienteIndex === -1) {
        Alert.alert('Erro', 'Cliente não encontrado.');
        return;
      }

      // Atualiza o cliente mantendo o ID e data de criação
      clientes[clienteIndex] = {
        ...clientes[clienteIndex],
        nome: nome.trim(),
        telefone: telefone.trim(),
      };

      await ClienteStorage.salvarClientes(clientes);

      Alert.alert('✅ Sucesso', 'Cliente atualizado com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      Alert.alert('Erro', 'Não foi possível salvar o cliente.');
    }
  };

  const excluirCliente = async () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const clientes = await ClienteStorage.carregarClientes();
              const clientesAtualizados = clientes.filter(c => c.id !== clienteId);
              await ClienteStorage.salvarClientes(clientesAtualizados);

              Alert.alert('✅ Sucesso', 'Cliente excluído com sucesso!', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error) {
              console.error('Erro ao excluir cliente:', error);
              Alert.alert('Erro', 'Não foi possível excluir o cliente.');
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Title>Carregando...</Title>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>✏️ Editar Cliente</Title>

          <TextInput
            label="Nome completo"
            value={nome}
            onChangeText={setNome}
            mode="outlined"
            style={styles.input}
            autoCapitalize="words"
          />

          <TextInput
            label="Telefone"
            value={telefone}
            onChangeText={handleTelefoneChange}
            mode="outlined"
            style={styles.input}
            keyboardType="phone-pad"
            placeholder="(00) 00000-0000"
          />

          <Button
            mode="contained"
            onPress={salvarCliente}
            style={styles.button}
          >
            💾 Salvar Alterações
          </Button>

          <Button
            mode="outlined"
            onPress={excluirCliente}
            style={[styles.button, styles.deleteButton]}
            textColor="#E74C3C"
          >
            🗑️ Excluir Cliente
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginTop: 8,
  },
  deleteButton: {
    borderColor: '#E74C3C',
    marginTop: 24,
  },
});

export default EditarClienteScreen;
