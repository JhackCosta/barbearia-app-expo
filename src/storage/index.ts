import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cliente, Agendamento } from '../types';

const STORAGE_KEYS = {
  CLIENTES: '@barbearia_clientes',
  AGENDAMENTOS: '@barbearia_agendamentos',
};

export const ClienteStorage = {
  async salvarClientes(clientes: Cliente[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(clientes);
      await AsyncStorage.setItem(STORAGE_KEYS.CLIENTES, jsonValue);
    } catch (error) {
      console.error('Erro ao salvar clientes:', error);
      throw error;
    }
  },

  async carregarClientes(): Promise<Cliente[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.CLIENTES);
      if (jsonValue !== null) {
        const clientes = JSON.parse(jsonValue);
        return clientes.map((cliente: any) => ({
          ...cliente,
          criadoEm: new Date(cliente.criadoEm),
        }));
      }
      return [];
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      return [];
    }
  },

  async adicionarCliente(cliente: Cliente): Promise<void> {
    try {
      const clientes = await this.carregarClientes();
      clientes.push(cliente);
      await this.salvarClientes(clientes);
    } catch (error) {
      console.error('❌ Storage: Erro ao adicionar cliente:', error);
      throw error;
    }
  },

  async removerCliente(clienteId: string): Promise<void> {
    try {
      const clientes = await this.carregarClientes();
      const clientesFiltrados = clientes.filter(c => c.id !== clienteId);
      await this.salvarClientes(clientesFiltrados);
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      throw error;
    }
  },
};

export const AgendamentoStorage = {
  async salvarAgendamentos(agendamentos: Agendamento[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(agendamentos);
      await AsyncStorage.setItem(STORAGE_KEYS.AGENDAMENTOS, jsonValue);
    } catch (error) {
      console.error('Erro ao salvar agendamentos:', error);
      throw error;
    }
  },

  async carregarAgendamentos(): Promise<Agendamento[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.AGENDAMENTOS);
      if (jsonValue !== null) {
        const agendamentos = JSON.parse(jsonValue);
        return agendamentos.map((agendamento: any) => ({
          ...agendamento,
          data: new Date(agendamento.data),
          criadoEm: new Date(agendamento.criadoEm),
          dataConclusao: agendamento.dataConclusao ? new Date(agendamento.dataConclusao) : undefined,
          cliente: {
            ...agendamento.cliente,
            criadoEm: new Date(agendamento.cliente.criadoEm),
          },
        }));
      }
      return [];
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      return [];
    }
  },

  async adicionarAgendamento(agendamento: Agendamento): Promise<void> {
    try {
      const agendamentos = await this.carregarAgendamentos();
      agendamentos.push(agendamento);
      await this.salvarAgendamentos(agendamentos);
    } catch (error) {
      console.error('Erro ao adicionar agendamento:', error);
      throw error;
    }
  },

  async removerAgendamento(agendamentoId: string): Promise<void> {
    try {
      const agendamentos = await this.carregarAgendamentos();
      const agendamentosFiltrados = agendamentos.filter(a => a.id !== agendamentoId);
      await this.salvarAgendamentos(agendamentosFiltrados);
    } catch (error) {
      console.error('Erro ao remover agendamento:', error);
      throw error;
    }
  },

  async atualizarNotificacaoEnviada(agendamentoId: string): Promise<void> {
    try {
      const agendamentos = await this.carregarAgendamentos();
      const agendamentoIndex = agendamentos.findIndex(
        a => a.id === agendamentoId,
      );

      if (agendamentoIndex !== -1) {
        agendamentos[agendamentoIndex].notificacaoEnviada = true;
        await this.salvarAgendamentos(agendamentos);
      }
    } catch (error) {
      console.error('Erro ao atualizar notificação:', error);
      throw error;
    }
  },

  async concluirAgendamento(
    agendamentoId: string,
    valorPago?: number,
    observacoes?: string,
  ): Promise<void> {
    try {
      const agendamentos = await this.carregarAgendamentos();
      const agendamentoIndex = agendamentos.findIndex(
        a => a.id === agendamentoId,
      );

      if (agendamentoIndex !== -1) {
        agendamentos[agendamentoIndex].status = 'concluido';
        agendamentos[agendamentoIndex].dataConclusao = new Date();
        if (valorPago !== undefined) {
          agendamentos[agendamentoIndex].valorPago = valorPago;
        }
        if (observacoes) {
          agendamentos[agendamentoIndex].observacoes = observacoes;
        }
        await this.salvarAgendamentos(agendamentos);
      }
    } catch (error) {
      console.error('Erro ao concluir agendamento:', error);
      throw error;
    }
  },

  async cancelarAgendamento(agendamentoId: string): Promise<void> {
    try {
      const agendamentos = await this.carregarAgendamentos();
      const agendamentoIndex = agendamentos.findIndex(
        a => a.id === agendamentoId,
      );

      if (agendamentoIndex !== -1) {
        agendamentos[agendamentoIndex].status = 'cancelado';
        agendamentos[agendamentoIndex].dataConclusao = new Date();
        await this.salvarAgendamentos(agendamentos);
      }
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      throw error;
    }
  },

  async carregarHistorico(): Promise<Agendamento[]> {
    try {
      const agendamentos = await this.carregarAgendamentos();

      const historico = agendamentos
        .filter(
          a => a.status === 'concluido' || a.status === 'cancelado',
        )
        .sort((a, b) => b.data.getTime() - a.data.getTime());

      return historico;
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      return [];
    }
  },
};
