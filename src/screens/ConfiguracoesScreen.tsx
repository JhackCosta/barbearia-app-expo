import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {
  Card,
  Title,
  TextInput,
  Button,
  Text,
  Divider,
  Surface,
  Chip,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';

type ConfiguracoesNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Configuracoes'
>;

interface Props {
  navigation: ConfiguracoesNavigationProp;
}

const STORAGE_KEYS = {
  MSG_CONFIRMACAO: '@config_msg_confirmacao',
  MSG_LEMBRETE: '@config_msg_lembrete',
  MSG_CANCELAMENTO: '@config_msg_cancelamento',
  MSG_AGRADECIMENTO: '@config_msg_agradecimento',
  MSG_RETORNO: '@config_msg_retorno',
};

const MENSAGENS_PADRAO = {
  confirmacao: `Olá {nome}! ✂️

Seu agendamento foi confirmado:
📅 Data: {data}
⏰ Horário: {hora}
💈 Serviço: {servico}
💰 Valor: R$ {valor}

Nos vemos em breve! 😊`,

  lembrete: `Olá {nome}! 🔔

Lembrete: Amanhã você tem agendamento às {hora}!
💈 {servico}

Qualquer imprevisto, avise com antecedência! 😊`,

  cancelamento: `Olá {nome},

Seu agendamento foi cancelado:
📅 {data} às {hora}
💈 {servico}

Para reagendar, entre em contato! 📞`,

  agradecimento: `Olá {nome}! 😊

Obrigado por escolher nossos serviços!
Esperamos que tenha gostado do seu {servico}! ✨

Até a próxima! 💈`,

  retorno: `Olá {nome}! 👋

Sentimos sua falta! 😊
Que tal agendar um horário? Estamos esperando por você! 💈✂️

Entre em contato para marcar seu horário! 📅`,
};

const ConfiguracoesScreen: React.FC<Props> = ({navigation}) => {
  const [msgConfirmacao, setMsgConfirmacao] = useState(MENSAGENS_PADRAO.confirmacao);
  const [msgLembrete, setMsgLembrete] = useState(MENSAGENS_PADRAO.lembrete);
  const [msgCancelamento, setMsgCancelamento] = useState(MENSAGENS_PADRAO.cancelamento);
  const [msgAgradecimento, setMsgAgradecimento] = useState(MENSAGENS_PADRAO.agradecimento);
  const [msgRetorno, setMsgRetorno] = useState(MENSAGENS_PADRAO.retorno);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  const carregarConfiguracoes = async () => {
    try {
      const [confirmacao, lembrete, cancelamento, agradecimento, retorno] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.MSG_CONFIRMACAO),
        AsyncStorage.getItem(STORAGE_KEYS.MSG_LEMBRETE),
        AsyncStorage.getItem(STORAGE_KEYS.MSG_CANCELAMENTO),
        AsyncStorage.getItem(STORAGE_KEYS.MSG_AGRADECIMENTO),
        AsyncStorage.getItem(STORAGE_KEYS.MSG_RETORNO),
      ]);

      if (confirmacao) setMsgConfirmacao(confirmacao);
      if (lembrete) setMsgLembrete(lembrete);
      if (cancelamento) setMsgCancelamento(cancelamento);
      if (agradecimento) setMsgAgradecimento(agradecimento);
      if (retorno) setMsgRetorno(retorno);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const salvarConfiguracoes = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.MSG_CONFIRMACAO, msgConfirmacao),
        AsyncStorage.setItem(STORAGE_KEYS.MSG_LEMBRETE, msgLembrete),
        AsyncStorage.setItem(STORAGE_KEYS.MSG_CANCELAMENTO, msgCancelamento),
        AsyncStorage.setItem(STORAGE_KEYS.MSG_AGRADECIMENTO, msgAgradecimento),
        AsyncStorage.setItem(STORAGE_KEYS.MSG_RETORNO, msgRetorno),
      ]);

      Alert.alert('✅ Sucesso', 'Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      Alert.alert('❌ Erro', 'Não foi possível salvar as configurações.');
    }
  };

  const restaurarPadrao = () => {
    Alert.alert(
      'Restaurar Padrão',
      'Tem certeza que deseja restaurar as mensagens padrão?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Restaurar',
          onPress: () => {
            setMsgConfirmacao(MENSAGENS_PADRAO.confirmacao);
            setMsgLembrete(MENSAGENS_PADRAO.lembrete);
            setMsgCancelamento(MENSAGENS_PADRAO.cancelamento);
            setMsgAgradecimento(MENSAGENS_PADRAO.agradecimento);
            setMsgRetorno(MENSAGENS_PADRAO.retorno);
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
        <Title style={styles.headerTitle}>⚙️ Configurações</Title>
        <Text style={styles.headerSubtitle}>
          Personalize seu aplicativo
        </Text>
      </Surface>

      <View style={styles.content}>
        {/* Botão para Configuração de Preços */}
        <Card style={styles.menuCard} onPress={() => navigation.navigate('ConfiguracoesPrecos')}>
          <Card.Content>
            <View style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <Text style={styles.menuIconText}>💰</Text>
              </View>
              <View style={styles.menuContent}>
                <Title style={styles.menuTitle}>Preços dos Serviços</Title>
                <Text style={styles.menuDescription}>
                  Configure os valores de corte, barba e combo
                </Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </View>
          </Card.Content>
        </Card>

        <Divider style={styles.divider} />

        {/* Seção de Mensagens WhatsApp */}
        <Text style={styles.sectionTitle}>📱 Mensagens do WhatsApp</Text>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.infoTitle}>💡 Variáveis Disponíveis:</Text>
            <View style={styles.chipsContainer}>
              <Chip style={styles.chip}>
                👤 {'{nome}'}
              </Chip>
              <Chip style={styles.chip}>
                📅 {'{data}'}
              </Chip>
              <Chip style={styles.chip}>
                ⏰ {'{hora}'}
              </Chip>
              <Chip style={styles.chip}>
                💈 {'{servico}'}
              </Chip>
              <Chip style={styles.chip}>
                💰 {'{valor}'}
              </Chip>
            </View>
            <Text style={styles.infoText}>
              Use essas variáveis nas mensagens. Elas serão substituídas
              automaticamente pelos dados do agendamento.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>📱 Confirmação de Agendamento</Title>
            <Text style={styles.description}>
              Enviada após criar um novo agendamento
            </Text>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={8}
              value={msgConfirmacao}
              onChangeText={setMsgConfirmacao}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>🔔 Lembrete (24h antes)</Title>
            <Text style={styles.description}>
              Enviada manualmente via botão no dashboard
            </Text>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={6}
              value={msgLembrete}
              onChangeText={setMsgLembrete}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>❌ Cancelamento</Title>
            <Text style={styles.description}>
              Enviada ao cancelar um agendamento
            </Text>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={6}
              value={msgCancelamento}
              onChangeText={setMsgCancelamento}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>😊 Agradecimento</Title>
            <Text style={styles.description}>
              Enviada após concluir um atendimento
            </Text>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={6}
              value={msgAgradecimento}
              onChangeText={setMsgAgradecimento}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>👋 Retorno (Clientes Inativos)</Title>
            <Text style={styles.description}>
              Enviada para clientes que não cortam há 30+ dias
            </Text>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={6}
              value={msgRetorno}
              onChangeText={setMsgRetorno}
              style={styles.input}
              placeholder="Apenas {nome} está disponível"
            />
            <Text style={styles.infoText}>
              💡 Variável disponível: {'{nome}'}
            </Text>
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
            onPress={salvarConfiguracoes}
            style={styles.actionButton}>
            Salvar Configurações
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
  menuCard: {
    marginBottom: 16,
    elevation: 3,
    backgroundColor: '#FFFFFF',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconText: {
    fontSize: 24,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  menuArrow: {
    fontSize: 32,
    color: '#BDC3C7',
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  infoCard: {
    marginBottom: 16,
    backgroundColor: '#E8F5E9',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    marginRight: 4,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#2E7D32',
    fontStyle: 'italic',
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
  input: {
    backgroundColor: '#FFFFFF',
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

export default ConfiguracoesScreen;
