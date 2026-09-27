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