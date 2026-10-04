import { supabase } from './supabase'

export async function buscarEmocoesPorPaciente(
  userId
) {
  const { data, error } = await supabase
    .from('SENSUS_Emotion_Select')
    .select(
      'ID_Map, User_ID, Selection_Type, Date_Time_Selection'
    )
    .eq('User_ID', userId)
    .order(
      'Date_Time_Selection',
      { ascending: false }
    )

  if (error) {
    console.error(
      'Erro ao buscar emoções:',
      error
    )

    throw error
  }

  return data || []
}

export async function buscarEmocoesPorPacienteEPeriodo(
  userId,
  dataInicio,
  dataFim
) {
  const { data, error } = await supabase
    .from('SENSUS_Emotion_Select')
    .select(`
      ID_Map,
      User_ID,
      Selection_Type,
      Date_Time_Selection
    `)
    .eq('User_ID', userId)
    .gte(
      'Date_Time_Selection',
      `${dataInicio}T00:00:00`
    )
    .lte(
      'Date_Time_Selection',
      `${dataFim}T23:59:59.999`
    )
    .order(
      'Date_Time_Selection',
      { ascending: true }
    )

  if (error) {
    console.error(
      'Erro ao buscar emoções do período:',
      error
    )

    throw error
  }

  return data || []
}