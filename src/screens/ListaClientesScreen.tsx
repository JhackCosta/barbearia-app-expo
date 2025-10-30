import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { showAlert } from '../utils/alert';
import {
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  Searchbar,
  Text,
  Surface,
  IconButton,
  Divider,
  SegmentedButtons,
  Chip,
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList, Cliente } from '../types';
import { ClienteStorage, AgendamentoStorage } from '../storage';
import { WhatsAppService } from '../services/WhatsAppService';

type ListaClientesNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ListaClientes'>;

interface Props {
  navigation: ListaClientesNavigationProp;
}

const ListaClientesScreen: React.FC<Props> = ({ navigation }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [filtroAtivo, setFiltroAtivo] = useState<'todos' | 'ativos' | 'inativos'>('todos');
  const [clientesInativos, setClientesInativos] = useState<Set<string>>(new Set());

  const carregarClientes = async () => {
    try {
      setLoading(true);
      const clientesCarregados = await ClienteStorage.carregarClientes();
      const agendamentos = await AgendamentoStorage.carregarAgendamentos();

      // Identificar clientes inativos (sem agendamento há 30+ dias E sem agendamento futuro)
      const hoje = new Date();
      const diasInatividade = 30;
      const inativos = new Set<string>();

      clientesCarregados.forEach(cliente => {
        // Verificar se tem agendamento futuro pendente
        const temAgendamentoFuturo = agendamentos.some(
          ag => ag.cliente.id === cliente.id &&
                ag.status === 'agendado' &&
                ag.data >= hoje
        );

        // Se tem agendamento futuro, NÃO está inativo
        if (temAgendamentoFuturo) {
          return;
        }        // Pegar todos os agendamentos concluídos deste cliente
        const agendamentosCliente = agendamentos.filter(
          ag => ag.cliente.id === cliente.id && ag.status === 'concluido'
        );

        if (agendamentosCliente.length === 0) {
          // Cliente nunca teve agendamento concluído e não tem futuro = INATIVO
          inativos.add(cliente.id);
        } else {
          // Pegar o agendamento mais recente
          const ultimoAgendamento = agendamentosCliente.sort(
            (a, b) => b.data.getTime() - a.data.getTime()
          )[0];

          // Calcular dias desde o último corte
          const diasDesdeUltimoCorte = Math.floor(
            (hoje.getTime() - ultimoAgendamento.data.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (diasDesdeUltimoCorte > diasInatividade) {
            // Não cortou há mais de 30 dias e não tem agendamento futuro = INATIVO
            inativos.add(cliente.id);
          }
        }
      });

      setClientesInativos(inativos);

      // Ordenar por nome
      const clientesOrdenados = clientesCarregados.sort((a, b) =>
        a.nome.localeCompare(b.nome)
      );

      setClientes(clientesOrdenados);
      aplicarFiltros(clientesOrdenados, filtroAtivo, busca, inativos);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      showAlert('Erro', 'Não foi possível carregar os clientes.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarClientes();
    }, [filtroAtivo])
  );

  const aplicarFiltros = (
    todosClientes: Cliente[],
    filtro: 'todos' | 'ativos' | 'inativos',
    textoBusca: string,
    inativos: Set<string>
  ) => {
    let clientesFiltrados = [...todosClientes];

    // Filtrar por status (ativo/inativo)
    if (filtro === 'ativos') {
      clientesFiltrados = clientesFiltrados.filter(c => !inativos.has(c.id));
    } else if (filtro === 'inativos') {
      clientesFiltrados = clientesFiltrados.filter(c => inativos.has(c.id));
    }

    // Filtrar por busca
    if (textoBusca.trim() !== '') {
      clientesFiltrados = clientesFiltrados.filter(cliente =>
        cliente.nome.toLowerCase().includes(textoBusca.toLowerCase()) ||
        cliente.telefone.includes(textoBusca.replace(/\D/g, ''))
      );
    }

    setClientesFiltrados(clientesFiltrados);
  };

  const filtrarClientes = (textoBusca: string) => {
    setBusca(textoBusca);
    aplicarFiltros(clientes, filtroAtivo, textoBusca, clientesInativos);
  };

  const mudarFiltro = (filtro: 'todos' | 'ativos' | 'inativos') => {
    setFiltroAtivo(filtro);
    aplicarFiltros(clientes, filtro, busca, clientesInativos);
  };

  const removerCliente = async (cliente: Cliente) => {
    showAlert(
      'Confirmar Exclusão',
      `Tem certeza que deseja remover ${cliente.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await ClienteStorage.removerCliente(cliente.id);
              carregarClientes();
            } catch (error) {
              showAlert('Erro', 'Não foi possível remover o cliente.');
            }
          }
        }
      ]
    );
  };

  const enviarMensagemRetorno = (cliente: Cliente) => {
    showAlert(
      '💬 Enviar Mensagem de Retorno',
      `Enviar mensagem para ${cliente.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar WhatsApp',
          onPress: () => WhatsAppService.enviarMensagemRetorno(cliente),
        }
      ]
    );
  };

  const renderCliente = ({ item }: { item: Cliente }) => {
    const isInativo = clientesInativos.has(item.id);

    return (
      <Card style={[styles.card, isInativo && styles.cardInativo]}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.clienteInfo}>
              <View style={styles.nomeRow}>
                <Title style={styles.clienteNome}>{item.nome}</Title>
                {isInativo && (
                  <Chip
                    style={styles.chipInativo}
                    textStyle={styles.chipTexto}
                    compact
                  >
                    💤 Inativo
                  </Chip>
                )}
              </View>
              <Paragraph style={styles.telefone}>📞 {item.telefone}</Paragraph>
              <Paragraph style={styles.dataCadastro}>
                Cadastrado em: {item.criadoEm.toLocaleDateString('pt-BR')}
              </Paragraph>
            </View>

            <View style={styles.cardActions}>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('EditarCliente', {clienteId: item.id})}
                style={styles.editButton}
              >
                ✏️
              </Button>
              <Button
                mode="text"
                textColor="#E74C3C"
                onPress={() => removerCliente(item)}
              >
                🗑️
              </Button>
            </View>
          </View>

          {isInativo && (
            <View style={styles.acaoInativo}>
              <Button
                mode="contained"
                onPress={() => enviarMensagemRetorno(item)}
                style={styles.botaoWhatsApp}
                icon="whatsapp"
                compact
              >
                💬 Chamar de Volta
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.searchContainer} elevation={2}>
        <Searchbar
          placeholder="🔍 Buscar por nome ou telefone..."
          onChangeText={filtrarClientes}
          value={busca}
          style={styles.searchbar}
          icon={() => null}
        />
      </Surface>

      <Surface style={styles.filterContainer} elevation={1}>
        <SegmentedButtons
          value={filtroAtivo}
          onValueChange={(value) => mudarFiltro(value as 'todos' | 'ativos' | 'inativos')}
          buttons={[
            {
              value: 'todos',
              label: 'Todos',
              icon: () => <Text>👥</Text>,
            },
            {
              value: 'ativos',
              label: 'Ativos',
              icon: () => <Text>✅</Text>,
            },
            {
              value: 'inativos',
              label: 'Inativos (30+ dias)',
              icon: () => <Text>💤</Text>,
            },
          ]}
          style={styles.segmentedButtons}
        />
      </Surface>

      {clientesFiltrados.length === 0 && !loading ? (
        <Surface style={styles.emptyState}>
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            {busca ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
          </Text>
          <Text variant="bodyLarge" style={styles.emptySubtitle}>
            {busca
              ? 'Tente buscar com outros termos'
              : 'Comece cadastrando seu primeiro cliente!'
            }
          </Text>
        </Surface>
      ) : (
        <>
          <View style={styles.resultadosHeader}>
            <Text variant="bodyMedium" style={styles.totalClientes}>
              {clientesFiltrados.length} cliente(s) {busca && 'encontrado(s)'}
            </Text>
          </View>

          <FlatList
            data={clientesFiltrados}
            keyExtractor={(item) => item.id}
            renderItem={renderCliente}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}

      <FAB
        style={styles.fab}
        onPress={() => navigation.navigate('NovoCliente')}
        label="Novo Cliente"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  searchbar: {
    elevation: 0,
    backgroundColor: '#F8F9FA',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  segmentedButtons: {
    backgroundColor: '#FFFFFF',
  },
  resultadosHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalClientes: {
    color: '#7F8C8D',
    fontStyle: 'italic',
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 12,
    elevation: 3,
  },
  cardInativo: {
    borderLeftWidth: 4,
    borderLeftColor: '#E67E22',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  acaoInativo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  botaoWhatsApp: {
    backgroundColor: '#25D366',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  editButton: {
    borderColor: '#6200EA',
  },
  clienteInfo: {
    flex: 1,
  },
  nomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  clienteNome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chipInativo: {
    backgroundColor: '#FFF3E0',
    height: 24,
  },
  chipTexto: {
    fontSize: 10,
    color: '#E67E22',
    marginVertical: 0,
  },
  telefone: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 4,
  },
  dataCadastro: {
    fontSize: 12,
    color: '#95A5A6',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200EA',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    padding: 40,
    borderRadius: 12,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#7F8C8D',
  },
  emptySubtitle: {
    textAlign: 'center',
    color: '#95A5A6',
  },
});

export default ListaClientesScreen;
