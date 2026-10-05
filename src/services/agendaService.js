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
// PSICÓLOGO LOGADO
// =========================================

async function buscarPsicologoLogado() {
  const {
    data: {
      user,
    },
    error: erroUsuario,
  } = await supabase.auth.getUser()

  if (erroUsuario) {
    console.error(
      'Erro ao buscar usuário autenticado:',
      erroUsuario
    )

    throw new Error(
      'Não foi possível verificar o usuário autenticado.'
    )
  }

  if (!user) {
    throw new Error(
      'Usuário não autenticado.'
    )
  }

  console.log(
    'Auth User ID:',
    user.id
  )

  const {
    data: psicologo,
    error: erroPsicologo,
  } = await supabase
    .from('Psychologists')
    .select(`
      Psychologist_ID,
      Auth_User_ID,
      Name,
      Active
    `)
    .eq(
      'Auth_User_ID',
      user.id
    )
    .maybeSingle()

  if (erroPsicologo) {
    console.error(
      'Erro ao consultar Psychologists:',
      erroPsicologo
    )

    throw erroPsicologo
  }

  if (!psicologo) {
    throw new Error(
      'O usuário autenticado não possui cadastro em Psychologists.'
    )
  }

  if (!psicologo.Active) {
    throw new Error(
      'O psicólogo autenticado está desativado.'
    )
  }

  console.log(
    'Psicólogo identificado:',
    {
      id:
        psicologo.Psychologist_ID,

      nome:
        psicologo.Name,

      authUserId:
        psicologo.Auth_User_ID,
    }
  )

  return psicologo
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

    criadoPorId:
      agendamento.Created_By ||
      null,

    criadoPorNome:
      agendamento.criador?.Name ||
      null,

    editadoPorId:
      agendamento.Last_Edited_By ||
      null,

    editadoPorNome:
      agendamento.editor?.Name ||
      null,

    atualizadoEm:
      agendamento.Updated_At ||
      null,
  }
}

// =========================================
// CAMPOS DA CONSULTA
// =========================================

const CAMPOS_AGENDAMENTO = `
  Appointment_ID,
  Patient_ID,
  Appointment_Date_Time,
  Time_Session,
  Observation,
  Created_By,
  Last_Edited_By,
  Updated_At,

  criador:Psychologists!Appointments_Created_By_fkey (
    Psychologist_ID,
    Name
  ),

  editor:Psychologists!Appointments_Last_Edited_By_fkey (
    Psychologist_ID,
    Name
  )
`

// =========================================
// BUSCAR TODOS OS AGENDAMENTOS
// =========================================

export async function buscarAgendamentos() {
  const {
    data,
    error,
  } = await supabase
    .from('Appointments')
    .select(
      CAMPOS_AGENDAMENTO
    )
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
  const psicologo =
    await buscarPsicologoLogado()

  const dataHora = new Date(
    `${novoAgendamento.data}T${novoAgendamento.horario}:00`
  )

  const registro = {
    Patient_ID:
      novoAgendamento.pacienteId,

    Appointment_Date_Time:
      dataHora.toISOString(),

    Time_Session:
      novoAgendamento.duracao,

    Observation:
      novoAgendamento.observacao ||
      null,

    Created_By:
      psicologo.Psychologist_ID,

    Last_Edited_By:
      null,

    Updated_At:
      null,
  }

  console.log(
    'Tentando criar agendamento:',
    registro
  )

  const {
    data,
    error,
  } = await supabase
    .from('Appointments')
    .insert(registro)
    .select(
      CAMPOS_AGENDAMENTO
    )
    .single()

  if (error) {
    console.error(
      'SUPABASE recusou a criação:',
      {
        code:
          error.code,

        message:
          error.message,

        details:
          error.details,

        hint:
          error.hint,
      }
    )

    throw error
  }

  console.log(
    'Agendamento criado:',
    data
  )

  return adaptarAgendamento(data)
}

// =========================================
// ATUALIZAR AGENDAMENTO
// =========================================

export async function atualizarAgendamento(
  agendamentoId,
  agendamentoAtualizado
) {
  const psicologo =
    await buscarPsicologoLogado()

  const dataHora = new Date(
    `${agendamentoAtualizado.data}T${agendamentoAtualizado.horario}:00`
  )

  const alteracoes = {
    Patient_ID:
      agendamentoAtualizado.pacienteId,

    Appointment_Date_Time:
      dataHora.toISOString(),

    Time_Session:
      agendamentoAtualizado.duracao,

    Observation:
      agendamentoAtualizado.observacao ||
      null,

    Last_Edited_By:
      psicologo.Psychologist_ID,

    Updated_At:
      new Date().toISOString(),
  }

  console.log(
    'Tentando atualizar agendamento:',
    {
      agendamentoId,
      psicologo:
        psicologo.Name,
      alteracoes,
    }
  )

  const {
    data,
    error,
  } = await supabase
    .from('Appointments')
    .update(
      alteracoes
    )
    .eq(
      'Appointment_ID',
      agendamentoId
    )
    .select(
      CAMPOS_AGENDAMENTO
    )
    .single()

  if (error) {
    console.error(
      'SUPABASE recusou a edição:',
      {
        code:
          error.code,

        message:
          error.message,

        details:
          error.details,

        hint:
          error.hint,
      }
    )

    throw error
  }

  console.log(
    'Agendamento atualizado:',
    data
  )

  return adaptarAgendamento(data)
}

// =========================================
// EXCLUIR AGENDAMENTO
// =========================================

export async function excluirAgendamento(
  agendamentoId
) {
  const {
    error,
  } = await supabase
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