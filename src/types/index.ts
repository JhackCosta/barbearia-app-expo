export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  criadoEm: Date;
}

export interface Agendamento {
  id: string;
  clienteId: string;
  cliente: Cliente;
  data: Date;
  servico: TipoServico;
  criadoEm: Date;
  notificacaoEnviada: boolean;
  status: StatusAgendamento;
  valorPago?: number;
  observacoes?: string;
  dataConclusao?: Date;
}

export type TipoServico = 'Corte e Barba' | 'Só Corte' | 'Só Barba';

export type StatusAgendamento = 'agendado' | 'concluido' | 'cancelado';

export const TIPOS_SERVICO: TipoServico[] = [
  'Corte e Barba',
  'Só Corte',
  'Só Barba',
];

export const VALORES_SERVICOS: Record<TipoServico, number> = {
  'Corte e Barba': 50.0,
  'Só Corte': 30.0,
  'Só Barba': 25.0,
};

export type RootStackParamList = {
  Dashboard: undefined;
  NovoCliente: undefined;
  ListaClientes: undefined;
  NovoAgendamento: undefined;
  EditarAgendamento: {agendamentoId: string};
  EditarCliente: {clienteId: string};
  Historico: undefined;
  Relatorios: undefined;
  Configuracoes: undefined;
  ConfiguracoesPrecos: undefined;
};

export interface RelatorioMensal {
  mes: string;
  ano: number;
  totalAtendimentos: number;
  totalRecebido: number;
  atendimentosPorServico: Record<TipoServico, number>;
  receitaPorServico: Record<TipoServico, number>;
}

export interface EstatisticasGerais {
  totalClientes: number;
  totalAtendimentos: number;
  receitaTotal: number;
  servicoMaisPopular: TipoServico;
  clienteMaisFrequente: Cliente | null;
}
