import { supabase } from './supabase'

const CAMPOS_PACIENTE = `
  User_ID,
  Name,
  Country,
  State,
  City,
  status,
  Created_At,
  Updated_At
`

function adaptarPaciente(usuario) {
  return {
    id: usuario.User_ID,
    nome: usuario.Name,
    pais: usuario.Country,
    estado: usuario.State,
    cidade: usuario.City,
    status: usuario.status,
    criadoEm: usuario.Created_At,
    atualizadoEm: usuario.Updated_At,
  }
}

export async function buscarPacientesSupabase() {
  const { data, error } = await supabase
    .from('Users')
    .select(CAMPOS_PACIENTE)
    .order('Name', { ascending: true })

  if (error) {
    console.error(
      'Erro ao buscar pacientes no Supabase:',
      error
    )

    throw error
  }

  return (data || []).map(adaptarPaciente)
}

export async function buscarPacientePorId(userId) {
  const { data, error } = await supabase
    .from('Users')
    .select(CAMPOS_PACIENTE)
    .eq('User_ID', userId)
    .single()

  if (error) {
    console.error(
      'Erro ao buscar paciente:',
      error
    )

    throw error
  }

  return adaptarPaciente(data)
}