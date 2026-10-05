import { supabase } from './supabase'

// =========================================
// IDENTIFICAR PSICÓLOGO LOGADO
// =========================================

async function buscarPsicologoAtual() {
  const {
    data: { user },
    error: erroUsuario,
  } = await supabase.auth.getUser()

  if (erroUsuario || !user) {
    throw new Error(
      'Usuário não autenticado.'
    )
  }

  const {
    data: psicologo,
    error: erroPsicologo,
  } = await supabase
    .from('Psychologists')
    .select(`
      Psychologist_ID,
      Name
    `)
    .eq(
      'Auth_User_ID',
      user.id
    )
    .eq(
      'Active',
      true
    )
    .single()

  if (
    erroPsicologo ||
    !psicologo
  ) {
    console.error(
      'Erro ao identificar psicólogo:',
      erroPsicologo
    )

    throw new Error(
      'Não foi possível identificar o psicólogo responsável.'
    )
  }

  return psicologo
}

// =========================================
// BUSCAR NOME DO PSICÓLOGO
// =========================================

async function buscarNomePsicologo(
  psicologoId
) {
  if (!psicologoId) {
    return null
  }

  const {
    data,
    error,
  } = await supabase
    .from('Psychologists')
    .select('Name')
    .eq(
      'Psychologist_ID',
      psicologoId
    )
    .maybeSingle()

  if (error) {
    console.error(
      'Erro ao buscar nome do psicólogo:',
      error
    )

    return null
  }

  return data?.Name || null
}

// =========================================
// ADAPTAR NOTA
// =========================================

async function adaptarNota(
  nota
) {
  const psicologoNome =
    await buscarNomePsicologo(
      nota.Psychologist_ID
    )

  return {
    id:
      nota.Note_ID,

    pacienteId:
      nota.Patient_ID,

    psicologoId:
      nota.Psychologist_ID,

    psicologoNome,

    texto:
      nota.Note_Text || '',

    origem:
      nota.Source || 'paciente',

    tipoRelatorio:
      nota.Report_Type || null,

    criadoEm:
      nota.Created_At,

    atualizadoEm:
      nota.Updated_At,
  }
}

// =========================================
// CAMPOS
// =========================================

const CAMPOS_NOTA = `
  Note_ID,
  Patient_ID,
  Psychologist_ID,
  Note_Text,
  Source,
  Report_Type,
  Created_At,
  Updated_At
`

// =========================================
// BUSCAR NOTAS DO PACIENTE
// =========================================

export async function buscarNotasPorPaciente(
  pacienteId
) {
  if (!pacienteId) {
    return []
  }

  const {
    data,
    error,
  } = await supabase
    .from('Patient_Notes')
    .select(CAMPOS_NOTA)
    .eq(
      'Patient_ID',
      pacienteId
    )
    .order(
      'Created_At',
      {
        ascending: false,
      }
    )

  if (error) {
    console.error(
      'Erro ao buscar anotações:',
      error
    )

    throw error
  }

  const notas =
    await Promise.all(
      (data || []).map(
        adaptarNota
      )
    )

  return notas
}

// =========================================
// CRIAR NOTA
// =========================================

export async function criarNota({
  pacienteId,
  texto,
  origem = 'paciente',
  tipoRelatorio = null,
}) {
  if (!pacienteId) {
    throw new Error(
      'Paciente não informado.'
    )
  }

  const textoLimpo =
    texto?.trim()

  if (!textoLimpo) {
    throw new Error(
      'Digite uma anotação.'
    )
  }

  const psicologo =
    await buscarPsicologoAtual()

  const agora =
    new Date().toISOString()

  const {
    data,
    error,
  } = await supabase
    .from('Patient_Notes')
    .insert({
      Patient_ID:
        pacienteId,

      Psychologist_ID:
        psicologo.Psychologist_ID,

      Note_Text:
        textoLimpo,

      Source:
        origem,

      Report_Type:
        tipoRelatorio,

      Created_At:
        agora,

      Updated_At:
        agora,
    })
    .select(CAMPOS_NOTA)
    .single()

  if (error) {
    console.error(
      'Erro ao criar anotação:',
      error
    )

    throw error
  }

  return {
    id:
      data.Note_ID,

    pacienteId:
      data.Patient_ID,

    psicologoId:
      data.Psychologist_ID,

    psicologoNome:
      psicologo.Name,

    texto:
      data.Note_Text,

    origem:
      data.Source,

    tipoRelatorio:
      data.Report_Type,

    criadoEm:
      data.Created_At,

    atualizadoEm:
      data.Updated_At,
  }
}

// =========================================
// ATUALIZAR NOTA
// =========================================

export async function atualizarNota(
  notaId,
  texto
) {
  if (!notaId) {
    throw new Error(
      'Anotação não informada.'
    )
  }

  const textoLimpo =
    texto?.trim()

  if (!textoLimpo) {
    throw new Error(
      'A anotação não pode ficar vazia.'
    )
  }

  const {
    data,
    error,
  } = await supabase
    .from('Patient_Notes')
    .update({
      Note_Text:
        textoLimpo,

      Updated_At:
        new Date().toISOString(),
    })
    .eq(
      'Note_ID',
      notaId
    )
    .select(CAMPOS_NOTA)
    .single()

  if (error) {
    console.error(
      'Erro ao atualizar anotação:',
      error
    )

    throw error
  }

  return await adaptarNota(
    data
  )
}

// =========================================
// EXCLUIR NOTA
// =========================================

export async function excluirNota(
  notaId
) {
  if (!notaId) {
    throw new Error(
      'Anotação não informada.'
    )
  }

  const {
    error,
  } = await supabase
    .from('Patient_Notes')
    .delete()
    .eq(
      'Note_ID',
      notaId
    )

  if (error) {
    console.error(
      'Erro ao excluir anotação:',
      error
    )

    throw error
  }

  return true
}