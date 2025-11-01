import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  Chip,
  Text,
  Surface,
  Divider
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {RootStackParamList, Agendamento, VALORES_SERVICOS} from '../types';
import {AgendamentoStorage} from '../storage';
import {WhatsAppService} from '../services/WhatsAppService';
import { Dialog } from '../components/Dialog';
import { useDialog } from '../hooks/useDialog';

type DashboardNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

interface Props {
  navigation: DashboardNavigationProp;
}

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const { dialog, showDialog, hideDialog } = useDialog();

  const carregarAgendamentos = async () => {
    try {
      setLoading(true);
      const agendamentosCarregados =
        await AgendamentoStorage.carregarAgendamentos();

      const agendamentosFuturos = agendamentosCarregados
        .filter(
          agendamento =>
            agendamento.data > new Date() && agendamento.status === 'agendado',
        )
        .sort((a, b) => a.data.getTime() - b.data.getTime());

      setAgendamentos(agendamentosFuturos);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      showDialog('Erro', 'Não foi possível carregar os agendamentos.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarAgendamentos();
    }, [])
  );

  const cancelarAgendamento = async (agendamento: Agendamento) => {
    showDialog(
      'Confirmar Cancelamento',
      'Tem certeza que deseja cancelar este agendamento?',
      [
        {text: 'Não', style: 'cancel'},
        {
          text: 'Sim, Cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await AgendamentoStorage.cancelarAgendamento(agendamento.id);

              showDialog(
                '✅ Cancelado',
                'Deseja avisar o cliente por WhatsApp?',
                [
                  {
                    text: 'Não',
                    style: 'cancel',
                    onPress: () => {
                      showDialog('Sucesso', 'Agendamento cancelado!');
                      carregarAgendamentos();
                    }
                  },
                  {
                    text: '📱 Avisar WhatsApp',
                    onPress: async () => {
                      await WhatsAppService.enviarAvisoCancelamento(
                        agendamento.cliente,
                        agendamento
                      );
                      carregarAgendamentos();
                    }
                  }
                ]
              );
            } catch (error) {
              showDialog('Erro', 'Não foi possível cancelar o agendamento.');
            }
          },
        },
      ],
    );
  };

  const concluirAgendamento = async (agendamento: Agendamento) => {
    const valorPadrao = VALORES_SERVICOS[agendamento.servico];
    showDialog(
      'Concluir Atendimento',
      `Cliente: ${agendamento.cliente.nome}\nServiço: ${agendamento.servico}\n\nValor sugerido: R$ ${valorPadrao.toFixed(2)}`,
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Concluir',
          onPress: async () => {
            try {
              await AgendamentoStorage.concluirAgendamento(
                agendamento.id,
                valorPadrao,
              );

              showDialog(
                '✅ Concluído',
                'Deseja enviar agradecimento por WhatsApp?',
                [
                  {
                    text: 'Não',
                    style: 'cancel',
                    onPress: () => {
                      showDialog('Sucesso', 'Atendimento concluído!');
                      carregarAgendamentos();
                    }
                  },
                  {
                    text: '📱 Enviar WhatsApp',
                    onPress: async () => {
                      await WhatsAppService.enviarAgradecimento(
                        agendamento.cliente,
                        agendamento
                      );
                      carregarAgendamentos();
                    }
                  }
                ]
              );
            } catch (error) {
              showDialog('Erro', 'Não foi possível concluir o atendimento.');
            }
          },
        },
      ],
    );
  };

  const getServicoColor = (servico: string) => {
    switch (servico) {
      case 'Corte e Barba': return '#FF6B6B';
      case 'Só Corte': return '#4ECDC4';
      case 'Só Barba': return '#45B7D1';
      default: return '#95A5A6';
    }
  };

  const renderAgendamento = ({ item }: { item: Agendamento }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={styles.clienteNome}>{item.cliente.nome}</Title>
          <Chip
            mode="outlined"
            textStyle={{ color: getServicoColor(item.servico) }}
            style={{ borderColor: getServicoColor(item.servico) }}
          >
            {item.servico}
          </Chip>
        </View>

        <Paragraph style={styles.dataHora}>
          📅 {item.data.toLocaleDateString('pt-BR')} às {item.data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </Paragraph>

        <Paragraph style={styles.telefone}>
          📞 {item.cliente.telefone}
        </Paragraph>

        <Divider style={styles.divider} />

        <View style={styles.cardActions}>
          <Button
            mode="contained"
            onPress={() => concluirAgendamento(item)}
            style={styles.concluirButton}
          >
            Concluir
          </Button>
          <Button
            mode="outlined"
            onPress={() => cancelarAgendamento(item)}
            textColor="#E74C3C"
            style={styles.removeButton}
          >
            Cancelar
          </Button>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.whatsappActions}>
          <Button
            mode="text"
            onPress={() => WhatsAppService.enviarLembrete24h(item.cliente, item)}
            textColor="#25D366"
            compact
          >
            📱 Enviar Lembrete
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Surface style={styles.headerButtons} elevation={1}>
        <View style={styles.buttonRow}>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('ListaClientes')}
            style={styles.headerButton}
          >
            Clientes
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Historico')}
            style={styles.headerButton}
          >
            Histórico
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Relatorios')}
            style={styles.headerButton}
          >
            Relatórios
          </Button>
        </View>
        <View style={styles.buttonRow}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Configuracoes')}
            style={styles.configButton}
          >
            ⚙️ Configurações
          </Button>
        </View>
      </Surface>

      {agendamentos.length === 0 && !loading ? (
        <Surface style={styles.emptyState}>
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            Nenhum agendamento
          </Text>
          <Text variant="bodyLarge" style={styles.emptySubtitle}>
            Comece criando um novo agendamento!
          </Text>
        </Surface>
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={(item) => item.id}
          renderItem={renderAgendamento}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB
        style={styles.fab}
        onPress={() => navigation.navigate('NovoAgendamento')}
        label="Novo Agendamento"
      />

      <Dialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        buttons={dialog.buttons}
        onDismiss={hideDialog}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerButtons: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    flex: 1,
    borderColor: '#6200EA',
  },
  configButton: {
    flex: 1,
    backgroundColor: '#6200EA',
    marginTop: 8,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clienteNome: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  dataHora: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 4,
  },
  telefone: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  divider: {
    marginVertical: 12,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  concluirButton: {
    flex: 1,
    backgroundColor: '#27AE60',
  },
  removeButton: {
    flex: 1,
    borderColor: '#E74C3C',
  },
  whatsappActions: {
    alignItems: 'center',
    marginTop: 4,
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

export default DashboardScreen;
