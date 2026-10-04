import { supabase } from './supabase'

import {
  buscarPacientesSupabase,
} from './pacienteService'

// =========================================
// PACIENTES
// =========================================

export async function buscarPacientes() {
  return buscarPacientesSupabase()
}

// =========================================
// ADAPTAR AGENDAMENTO
// Banco → Frontend
// =========================================

function adaptarAgendamento(
  agendamento
) {
  const dataHora = new Date(
    agendamento.Appointment_Date_Time
  )

  const ano =
    dataHora.getFullYear()

  const mes = String(
    dataHora.getMonth() + 1
  ).padStart(2, '0')

  const dia = String(
    dataHora.getDate()
  ).padStart(2, '0')

  const hora = String(
    dataHora.getHours()
  ).padStart(2, '0')

  const minuto = String(
    dataHora.getMinutes()
  ).padStart(2, '0')

  return {
    id:
      agendamento.Appointment_ID,

    pacienteId:
      agendamento.Patient_ID,

    data:
      `${ano}-${mes}-${dia}`,

    horario:
      `${hora}:${minuto}`,

    duracao:
      agendamento.Time_Session,

    observacao:
      agendamento.Observation || '',
  }
}

// =========================================
// BUSCAR TODOS OS AGENDAMENTOS
// =========================================

export async function buscarAgendamentos() {
  const { data, error } =
    await supabase
      .from('Appointments')
      .select(`
        Appointment_ID,
        Patient_ID,
        Appointment_Date_Time,
        Time_Session,
        Observation
      `)
      .order(
        'Appointment_Date_Time',
        {
          ascending: true,
        }
      )

  if (error) {
    console.error(
      'Erro ao buscar agendamentos:',
      error
    )

    throw error
  }

  return (data || []).map(
    adaptarAgendamento
  )
}

// =========================================
// BUSCAR POR PACIENTE
// =========================================

export async function buscarAgendamentosPorPaciente(
  pacienteId
) {
  const agendamentos =
    await buscarAgendamentos()

  return agendamentos.filter(
    (agendamento) =>
      agendamento.pacienteId ===
      pacienteId
  )
}

// =========================================
// BUSCAR POR DATA
// =========================================

export async function buscarAgendamentosPorData(
  data
) {
  const agendamentos =
    await buscarAgendamentos()

  return agendamentos.filter(
    (agendamento) =>
      agendamento.data === data
  )
}

// =========================================
// BUSCAR POR DATA + PACIENTE
// =========================================

export async function buscarAgendamentosPorDataEPaciente(
  data,
  pacienteId
) {
  const agendamentos =
    await buscarAgendamentos()

  return agendamentos.filter(
    (agendamento) =>
      agendamento.data === data &&
      agendamento.pacienteId ===
        pacienteId
  )
}

// =========================================
// CRIAR AGENDAMENTO
// =========================================

export async function criarAgendamento(
  novoAgendamento
) {
  const dataHora = new Date(
    `${novoAgendamento.data}T${novoAgendamento.horario}:00`
  )

  const {
    data,
    error,
  } = await supabase
    .from('Appointments')
    .insert({
      Patient_ID:
        novoAgendamento.pacienteId,

      Appointment_Date_Time:
        dataHora.toISOString(),

      Time_Session:
        novoAgendamento.duracao,

      Observation:
        novoAgendamento.observacao ||
        null,
    })
    .select(`
      Appointment_ID,
      Patient_ID,
      Appointment_Date_Time,
      Time_Session,
      Observation
    `)
    .single()

  if (error) {
    console.error(
      'Erro ao criar agendamento:',
      error
    )

    throw error
  }

  return adaptarAgendamento(data)
}

// =========================================
// ATUALIZAR AGENDAMENTO
// =========================================

export async function atualizarAgendamento(
  agendamentoId,
  agendamentoAtualizado
) {
  const dataHora = new Date(
    `${agendamentoAtualizado.data}T${agendamentoAtualizado.horario}:00`
  )

  const {
    data,
    error,
  } = await supabase
    .from('Appointments')
    .update({
      Patient_ID:
        agendamentoAtualizado.pacienteId,

      Appointment_Date_Time:
        dataHora.toISOString(),

      Time_Session:
        agendamentoAtualizado.duracao,

      Observation:
        agendamentoAtualizado.observacao ||
        null,
    })
    .eq(
      'Appointment_ID',
      agendamentoId
    )
    .select(`
      Appointment_ID,
      Patient_ID,
      Appointment_Date_Time,
      Time_Session,
      Observation
    `)
    .single()

  if (error) {
    console.error(
      'Erro ao atualizar agendamento:',
      error
    )

    throw error
  }

  return adaptarAgendamento(data)
}

// =========================================
// EXCLUIR AGENDAMENTO
// =========================================

export async function excluirAgendamento(
  agendamentoId
) {
  const { error } = await supabase
    .from('Appointments')
    .delete()
    .eq(
      'Appointment_ID',
      agendamentoId
    )

  if (error) {
    console.error(
      'Erro ao excluir agendamento:',
      error
    )

    throw error
  }

  return true
}