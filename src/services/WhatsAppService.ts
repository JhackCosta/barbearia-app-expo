import {Linking, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Cliente, Agendamento} from '../types';

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

export class WhatsAppService {
  /**
   * Substitui variáveis na mensagem template
   */
  private static substituirVariaveis(
    template: string,
    cliente: Cliente,
    agendamento: Agendamento,
  ): string {
    const dataFormatada = agendamento.data.toLocaleDateString('pt-BR');
    const horaFormatada = agendamento.data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return template
      .replace(/{nome}/g, cliente.nome)
      .replace(/{data}/g, dataFormatada)
      .replace(/{hora}/g, horaFormatada)
      .replace(/{servico}/g, agendamento.servico)
      .replace(/{valor}/g, agendamento.valorPago?.toFixed(2) || '0.00');
  }

  /**
   * Envia mensagem de confirmação de agendamento
   */
  static async enviarConfirmacaoAgendamento(
    cliente: Cliente,
    agendamento: Agendamento,
  ): Promise<void> {
    const template = await AsyncStorage.getItem(STORAGE_KEYS.MSG_CONFIRMACAO) || MENSAGENS_PADRAO.confirmacao;
    const mensagem = this.substituirVariaveis(template, cliente, agendamento);
    const telefone = this.formatarTelefone(cliente.telefone);

    await this.abrirWhatsApp(telefone, mensagem);
  }

  /**
   * Envia lembrete 24h antes do agendamento
   */
  static async enviarLembrete24h(
    cliente: Cliente,
    agendamento: Agendamento,
  ): Promise<void> {
    const template = await AsyncStorage.getItem(STORAGE_KEYS.MSG_LEMBRETE) || MENSAGENS_PADRAO.lembrete;
    const mensagem = this.substituirVariaveis(template, cliente, agendamento);
    const telefone = this.formatarTelefone(cliente.telefone);

    await this.abrirWhatsApp(telefone, mensagem);
  }

  /**
   * Envia aviso de cancelamento
   */
  static async enviarAvisoCancelamento(
    cliente: Cliente,
    agendamento: Agendamento,
  ): Promise<void> {
    const template = await AsyncStorage.getItem(STORAGE_KEYS.MSG_CANCELAMENTO) || MENSAGENS_PADRAO.cancelamento;
    const mensagem = this.substituirVariaveis(template, cliente, agendamento);
    const telefone = this.formatarTelefone(cliente.telefone);

    await this.abrirWhatsApp(telefone, mensagem);
  }

  /**
   * Envia mensagem de agradecimento após conclusão
   */
  static async enviarAgradecimento(
    cliente: Cliente,
    agendamento: Agendamento,
  ): Promise<void> {
    const template = await AsyncStorage.getItem(STORAGE_KEYS.MSG_AGRADECIMENTO) || MENSAGENS_PADRAO.agradecimento;
    const mensagem = this.substituirVariaveis(template, cliente, agendamento);
    const telefone = this.formatarTelefone(cliente.telefone);

    await this.abrirWhatsApp(telefone, mensagem);
  }

  /**
   * Envia mensagem para cliente inativo
   */
  static async enviarMensagemRetorno(cliente: Cliente): Promise<void> {
    const template = await AsyncStorage.getItem(STORAGE_KEYS.MSG_RETORNO) || MENSAGENS_PADRAO.retorno;
    const mensagem = template.replace(/{nome}/g, cliente.nome);
    const telefone = this.formatarTelefone(cliente.telefone);

    await this.abrirWhatsApp(telefone, mensagem);
  }

  /**
   * Formata o telefone removendo caracteres especiais
   */
  private static formatarTelefone(telefone: string): string {
    return telefone.replace(/\D/g, '');
  }

  /**
   * Abre o WhatsApp com a mensagem pré-pronta
   */
  private static async abrirWhatsApp(
    telefone: string,
    mensagem: string,
  ): Promise<void> {
    try {
      const telefoneLimpo = telefone.replace(/\D/g, '');

      const telefoneCompleto = telefoneLimpo.startsWith('55')
        ? telefoneLimpo
        : `55${telefoneLimpo}`;

      const url = `https://wa.me/${telefoneCompleto}?text=${encodeURIComponent(mensagem)}`;

      await Linking.openURL(url);
    } catch (error) {
      console.error('Erro ao abrir WhatsApp:', error);
      Alert.alert(
        '❌ Erro ao abrir WhatsApp',
        `Não foi possível abrir o WhatsApp.\n\nTelefone: ${telefone}\n\nVerifique se o WhatsApp está instalado.`,
      );
    }
  }
}
