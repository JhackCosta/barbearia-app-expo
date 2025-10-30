import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import { Agendamento } from '../types';

// Configurar comportamento das notificações quando o app está em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  static async init() {
    // Solicitar permissões
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert(
        'Permissão Necessária',
        'Para receber lembretes de agendamentos, é necessário permitir notificações.',
      );
      return false;
    }

    // Configurar canal de notificação no Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('barbearia-channel', {
        name: 'Barbearia Notificações',
        description: 'Notificações de agendamentos da barbearia',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        sound: 'default',
        enableLights: true,
        lightColor: '#6200EA',
        enableVibrate: true,
      });
    }

    return true;
  }

  static async agendarLembrete(agendamento: Agendamento) {
    // Calcular 24 horas antes do agendamento
    const dataLembrete = new Date(agendamento.data.getTime() - 24 * 60 * 60 * 1000);
    const agora = new Date();

    // Verificar se a data do lembrete é no futuro
    if (dataLembrete <= agora) {
      return;
    }

    // Calcular segundos até o lembrete
    const segundosAteNotificacao = Math.floor((dataLembrete.getTime() - agora.getTime()) / 1000);

    try {
      await Notifications.scheduleNotificationAsync({
        identifier: agendamento.id,
        content: {
          title: '✂️ Lembrete de Agendamento',
          body: `${agendamento.cliente.nome} tem ${agendamento.servico} agendado para amanhã às ${agendamento.data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
          sound: 'default',
          data: {
            agendamentoId: agendamento.id,
            tipo: 'lembrete_agendamento',
          },
        },
        trigger: {
          seconds: segundosAteNotificacao,
          channelId: 'barbearia-channel',
        },
      });
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
    }
  }

  static async cancelarLembrete(agendamentoId: string) {
    try {
      await Notifications.cancelScheduledNotificationAsync(agendamentoId);
    } catch (error) {
      console.error('Erro ao cancelar notificação:', error);
    }
  }

  static async cancelarTodasNotificacoes() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Erro ao cancelar todas as notificações:', error);
    }
  }
}
