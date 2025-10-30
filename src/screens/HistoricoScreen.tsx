import React, {useState, useCallback} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Chip,
  Text,
  Surface,
  Divider,
  Searchbar,
} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {RootStackParamList, Agendamento} from '../types';
import {AgendamentoStorage} from '../storage';

type HistoricoNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Historico'
>;

interface Props {
  navigation: HistoricoNavigationProp;
}

const HistoricoScreen: React.FC<Props> = ({navigation}) => {
  const [historico, setHistorico] = useState<Agendamento[]>([]);
  const [historicoFiltrado, setHistoricoFiltrado] = useState<Agendamento[]>(
    [],
  );
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  const carregarHistorico = async () => {
    try {
      setLoading(true);
      const historicoCarregado = await AgendamentoStorage.carregarHistorico();
      setHistorico(historicoCarregado);
      setHistoricoFiltrado(historicoCarregado);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarHistorico();
    }, []),
  );

  const filtrarHistorico = (textoBusca: string) => {
    setBusca(textoBusca);

    if (textoBusca.trim() === '') {
      setHistoricoFiltrado(historico);
    } else {
      const filtrados = historico.filter(
        item =>
          item.cliente.nome.toLowerCase().includes(textoBusca.toLowerCase()) ||
          item.servico.toLowerCase().includes(textoBusca.toLowerCase()),
      );
      setHistoricoFiltrado(filtrados);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido':
        return '#27AE60';
      case 'cancelado':
        return '#E74C3C';
      default:
        return '#95A5A6';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'Concluído';
      case 'cancelado':
        return 'Cancelado';
      default:
        return 'Agendado';
    }
  };

  const getServicoColor = (servico: string) => {
    switch (servico) {
      case 'Corte e Barba':
        return '#FF6B6B';
      case 'Só Corte':
        return '#4ECDC4';
      case 'Só Barba':
        return '#45B7D1';
      default:
        return '#95A5A6';
    }
  };

  const renderItem = ({item}: {item: Agendamento}) => (
    <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.clienteNome}>{item.cliente.nome}</Title>
            <Chip
              mode="flat"
              style={{backgroundColor: getStatusColor(item.status)}}
              textStyle={{color: '#FFF'}}>
              {getStatusLabel(item.status)}
            </Chip>
          </View>

        <View style={styles.infoRow}>
          <Chip
            mode="outlined"
            textStyle={{color: getServicoColor(item.servico)}}
            style={{borderColor: getServicoColor(item.servico)}}>
            {item.servico}
          </Chip>
        </View>

        <Paragraph style={styles.dataHora}>
          📅 {item.data.toLocaleDateString('pt-BR')} às{' '}
          {item.data.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Paragraph>

        <Paragraph style={styles.telefone}>
          📞 {item.cliente.telefone}
        </Paragraph>

        {item.valorPago !== undefined && (
          <Paragraph style={styles.valor}>
            💰 Valor: R$ {item.valorPago.toFixed(2)}
          </Paragraph>
        )}

        {item.observacoes && (
          <>
            <Divider style={styles.divider} />
            <Paragraph style={styles.observacoes}>
              📝 {item.observacoes}
            </Paragraph>
          </>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Surface style={styles.searchContainer} elevation={2}>
        <Searchbar
          placeholder="🔍 Buscar por cliente ou serviço..."
          onChangeText={filtrarHistorico}
          value={busca}
          style={styles.searchbar}
          icon={() => null}
        />
      </Surface>

      {historicoFiltrado.length === 0 && !loading ? (
        <Surface style={styles.emptyState}>
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            {busca
              ? 'Nenhum registro encontrado'
              : 'Nenhum histórico disponível'}
          </Text>
          <Text variant="bodyLarge" style={styles.emptySubtitle}>
            {busca
              ? 'Tente buscar com outros termos'
              : 'Complete agendamentos para ver o histórico'}
          </Text>
        </Surface>
      ) : (
        <>
          <View style={styles.resultadosHeader}>
            <Text variant="bodyMedium" style={styles.totalItems}>
              {historicoFiltrado.length} atendimento(s){' '}
              {busca && 'encontrado(s)'}
            </Text>
          </View>

          <FlatList
            data={historicoFiltrado}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
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
  resultadosHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  totalItems: {
    color: '#7F8C8D',
    fontStyle: 'italic',
  },
  list: {
    padding: 16,
    paddingBottom: 20,
  },
  card: {
    marginBottom: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clienteNome: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dataHora: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 4,
  },
  telefone: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  valor: {
    fontSize: 16,
    color: '#27AE60',
    fontWeight: 'bold',
    marginTop: 4,
  },
  divider: {
    marginVertical: 12,
  },
  observacoes: {
    fontSize: 14,
    color: '#7F8C8D',
    fontStyle: 'italic',
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

export default HistoricoScreen;
