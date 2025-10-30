import React, {useState, useCallback} from 'react';
import {View, ScrollView, StyleSheet, Dimensions} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Text,
  Surface,
  Divider,
  SegmentedButtons,
  DataTable,
  Button,
  Switch,
} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {
  RootStackParamList,
  Agendamento,
  TipoServico,
  TIPOS_SERVICO,
} from '../types';
import {AgendamentoStorage, ClienteStorage} from '../storage';

type RelatoriosNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Relatorios'
>;

interface Props {
  navigation: RelatoriosNavigationProp;
}

interface EstatisticasMes {
  mes: string;
  totalAtendimentos: number;
  totalRecebido: number;
  servicosPorTipo: Record<TipoServico, number>;
  totalConcluidos: number;
  totalCancelados: number;
}

const RelatoriosScreen: React.FC<Props> = ({navigation}) => {
  const [periodo, setPeriodo] = useState<'mes' | 'trimestre' | 'ano'>('mes');
  const [incluirFuturos, setIncluirFuturos] = useState(false);
  const [estatisticas, setEstatisticas] = useState<EstatisticasMes | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const calcularEstatisticas = async () => {
    try {
      setLoading(true);
      const historico = await AgendamentoStorage.carregarHistorico();

      const hoje = new Date();
      let dataInicio: Date;

      // Definir período
      switch (periodo) {
        case 'mes':
          dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
          break;
        case 'trimestre':
          dataInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 3, 1);
          break;
        case 'ano':
          dataInicio = new Date(hoje.getFullYear(), 0, 1);
          break;
      }

      // Filtrar agendamentos do histórico no período
      const atendimentosPeriodo = historico.filter(
        item => {
          if (item.status !== 'concluido' && item.status !== 'cancelado') {
            return false;
          }

          const dataReferencia = item.dataConclusao || item.data;
          const dataFim = incluirFuturos ? new Date(2099, 11, 31) : new Date(hoje);
          dataFim.setHours(23, 59, 59, 999);

          return dataReferencia >= dataInicio && dataReferencia <= dataFim;
        }
      );

      // Separar concluídos e cancelados
      const concluidos = atendimentosPeriodo.filter(item => item.status === 'concluido');
      const cancelados = atendimentosPeriodo.filter(item => item.status === 'cancelado');

      // Calcular estatísticas
      const servicosPorTipo: Record<TipoServico, number> = {
        'Corte e Barba': 0,
        'Só Corte': 0,
        'Só Barba': 0,
      };

      let totalRecebido = 0;

      atendimentosPeriodo.forEach(item => {
        servicosPorTipo[item.servico]++;
        if (item.status === 'concluido') {
          totalRecebido += item.valorPago || 0;
        }
      });

      const nomeMes = hoje.toLocaleDateString('pt-BR', {month: 'long'});
      const nomeAno = hoje.getFullYear();

      setEstatisticas({
        mes: `${nomeMes} de ${nomeAno}`,
        totalAtendimentos: atendimentosPeriodo.length,
        totalRecebido,
        servicosPorTipo,
        totalConcluidos: concluidos.length,
        totalCancelados: cancelados.length,
      });
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      calcularEstatisticas();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [periodo, incluirFuturos]),
  );

  const getPeriodoLabel = () => {
    switch (periodo) {
      case 'mes':
        return 'Mês Atual';
      case 'trimestre':
        return 'Últimos 3 Meses';
      case 'ano':
        return 'Ano Atual';
    }
  };

  const getServicoColor = (servico: TipoServico) => {
    switch (servico) {
      case 'Corte e Barba':
        return '#FF6B6B';
      case 'Só Corte':
        return '#4ECDC4';
      case 'Só Barba':
        return '#45B7D1';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Surface style={styles.headerSurface} elevation={2}>
        <Title style={styles.pageTitle}>📊 Relatórios e Estatísticas</Title>
        <SegmentedButtons
          value={periodo}
          onValueChange={value => setPeriodo(value as 'mes' | 'trimestre' | 'ano')}
          buttons={[
            {value: 'mes', label: 'Mês'},
            {value: 'trimestre', label: '3 Meses'},
            {value: 'ano', label: 'Ano'},
          ]}
          style={styles.segmentedButtons}
        />

        <View style={styles.toggleContainer}>
          <View style={styles.toggleTextContainer}>
            <Text variant="bodyMedium" style={styles.toggleLabel}>
              🔮 Incluir lançamentos futuros
            </Text>
            <Text variant="bodySmall" style={styles.toggleValue}>
              {incluirFuturos ? 'Sim' : 'Não'}
            </Text>
          </View>
          <Switch
            value={incluirFuturos}
            onValueChange={setIncluirFuturos}
            color="#6200EA"
          />
        </View>
      </Surface>

      {estatisticas && (
        <>
          {/* Resumo Geral */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>
                📅 {getPeriodoLabel()}
              </Title>
              <Divider style={styles.divider} />

              <View style={styles.resumoRow}>
                <Surface style={[styles.statBox, styles.statBoxPrimary]}>
                  <Text variant="headlineMedium" style={styles.statNumber}>
                    {estatisticas.totalAtendimentos}
                  </Text>
                  <Text variant="bodyMedium" style={styles.statLabel}>
                    Atendimentos
                  </Text>
                </Surface>

                <Surface style={[styles.statBox, styles.statBoxSuccess]}>
                  <Text variant="headlineMedium" style={styles.statNumber}>
                    R$ {estatisticas.totalRecebido.toFixed(2)}
                  </Text>
                  <Text variant="bodyMedium" style={styles.statLabel}>
                    Receita Total
                  </Text>
                </Surface>
              </View>

              {estatisticas.totalAtendimentos > 0 && (
                <View style={styles.mediaBox}>
                  <Text variant="titleMedium" style={styles.mediaText}>
                    💰 Ticket Médio: R${' '}
                    {(
                      estatisticas.totalRecebido /
                      estatisticas.totalAtendimentos
                    ).toFixed(2)}
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>

          {/* Serviços por Tipo */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>✂️ Serviços Realizados</Title>
              <Divider style={styles.divider} />

              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Serviço</DataTable.Title>
                  <DataTable.Title numeric>Quantidade</DataTable.Title>
                  <DataTable.Title numeric>Percentual</DataTable.Title>
                </DataTable.Header>

                {TIPOS_SERVICO.map(servico => {
                  const quantidade = estatisticas.servicosPorTipo[servico];
                  const percentual =
                    estatisticas.totalAtendimentos > 0
                      ? (quantidade / estatisticas.totalAtendimentos) * 100
                      : 0;

                  return (
                    <DataTable.Row key={servico}>
                      <DataTable.Cell>
                        <View style={styles.servicoCell}>
                          <View
                            style={[
                              styles.servicoIndicator,
                              {backgroundColor: getServicoColor(servico)},
                            ]}
                          />
                          <Text>{servico}</Text>
                        </View>
                      </DataTable.Cell>
                      <DataTable.Cell numeric>
                        <Text style={styles.quantidadeText}>{quantidade}</Text>
                      </DataTable.Cell>
                      <DataTable.Cell numeric>
                        <Text style={styles.percentualText}>
                          {percentual.toFixed(1)}%
                        </Text>
                      </DataTable.Cell>
                    </DataTable.Row>
                  );
                })}
              </DataTable>
            </Card.Content>
          </Card>

          {/* Insights */}
          {estatisticas.totalAtendimentos === 0 ? (
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>💡 Sem Dados</Title>
                <Paragraph style={styles.emptyText}>
                  Nenhum atendimento concluído no período selecionado.
                  Complete agendamentos para ver estatísticas detalhadas.
                </Paragraph>
              </Card.Content>
            </Card>
          ) : (
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>💡 Insights</Title>
                <Divider style={styles.divider} />

                {/* Serviço mais popular */}
                {(() => {
                  const servicoMaisPopular = TIPOS_SERVICO.reduce((a, b) =>
                    estatisticas.servicosPorTipo[a] >
                    estatisticas.servicosPorTipo[b]
                      ? a
                      : b,
                  );
                  const quantidadeMaisPopular =
                    estatisticas.servicosPorTipo[servicoMaisPopular];

                  if (quantidadeMaisPopular > 0) {
                    return (
                      <View style={styles.insightItem}>
                        <Text style={styles.insightIcon}>🏆</Text>
                        <View style={styles.insightContent}>
                          <Text variant="titleMedium" style={styles.insightTitle}>
                            Serviço Mais Popular
                          </Text>
                          <Text variant="bodyLarge" style={styles.insightValue}>
                            {servicoMaisPopular} ({quantidadeMaisPopular}{' '}
                            atendimento
                            {quantidadeMaisPopular > 1 ? 's' : ''})
                          </Text>
                        </View>
                      </View>
                    );
                  }
                  return null;
                })()}

                {/* Média de atendimentos */}
                <View style={styles.insightItem}>
                  <Text style={styles.insightIcon}>📈</Text>
                  <View style={styles.insightContent}>
                    <Text variant="titleMedium" style={styles.insightTitle}>
                      Resumo do Período
                    </Text>
                    <Text variant="bodyLarge" style={styles.insightValue}>
                      ✅ {estatisticas.totalConcluidos} concluído{estatisticas.totalConcluidos !== 1 ? 's' : ''}
                      {estatisticas.totalCancelados > 0 && ` | ❌ ${estatisticas.totalCancelados} cancelado${estatisticas.totalCancelados !== 1 ? 's' : ''}`}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  headerSurface: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#2C3E50',
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleLabel: {
    color: '#2C3E50',
    fontWeight: '500',
  },
  toggleValue: {
    color: '#6200EA',
    fontWeight: 'bold',
    marginTop: 4,
    fontSize: 12,
  },
  toggleButton: {
    minWidth: 60,
  },
  card: {
    marginBottom: 16,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  resumoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  statBoxPrimary: {
    backgroundColor: '#E8F5E8',
  },
  statBoxSuccess: {
    backgroundColor: '#E3F2FD',
  },
  statNumber: {
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  statLabel: {
    color: '#7F8C8D',
    textAlign: 'center',
  },
  mediaBox: {
    backgroundColor: '#FFF9E6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  mediaText: {
    color: '#F39C12',
    fontWeight: '600',
  },
  servicoCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  servicoIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  quantidadeText: {
    fontWeight: '600',
    color: '#2C3E50',
  },
  percentualText: {
    color: '#7F8C8D',
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  insightIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    color: '#2C3E50',
    marginBottom: 4,
  },
  insightValue: {
    color: '#6200EA',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#7F8C8D',
    marginTop: 8,
  },
});

export default RelatoriosScreen;
