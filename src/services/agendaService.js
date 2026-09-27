import {
  pacientesMock,
  agendamentosMock,
} from '../data/agendaMock'

// Por enquanto usamos os dados simulados.
// Depois essa configuração poderá apontar para o Supabase.
const USAR_SUPABASE = false

// Criamos uma cópia em memória.
// Assim podemos adicionar agendamentos durante o uso do sistema
// sem alterar diretamente o arquivo agendaMock.js.
let agendamentosTemporarios = [...agendamentosMock]

export async function buscarPacientes() {
  if (USAR_SUPABASE) {
    // Futuramente:
    // return buscarPacientesSupabase()
  }

  return pacientesMock
}

export async function buscarAgendamentos() {
  if (USAR_SUPABASE) {
    // Futuramente:
    // return buscarAgendamentosSupabase()
  }

  return agendamentosTemporarios
}

export async function buscarAgendamentosPorPaciente(pacienteId) {
  const agendamentos = await buscarAgendamentos()

  return agendamentos.filter(
    (agendamento) =>
      agendamento.pacienteId === pacienteId
  )
}

export async function buscarAgendamentosPorData(data) {
  const agendamentos = await buscarAgendamentos()

  return agendamentos.filter(
    (agendamento) =>
      agendamento.data === data
  )
}

export async function buscarAgendamentosPorDataEPaciente(
  data,
  pacienteId
) {
  const agendamentos = await buscarAgendamentos()

  return agendamentos.filter(
    (agendamento) =>
      agendamento.data === data &&
      agendamento.pacienteId === pacienteId
  )
}

export async function criarAgendamento(novoAgendamento) {
  if (USAR_SUPABASE) {
    // Futuramente:
    // return criarAgendamentoSupabase(novoAgendamento)
  }

  const agendamentoCriado = {
    id: `agendamento-${Date.now()}`,
    ...novoAgendamento,
  }

  agendamentosTemporarios = [
    ...agendamentosTemporarios,
    agendamentoCriado,
  ]

  return agendamentoCriado
}