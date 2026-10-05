import { supabase } from './supabase'

const CAMPOS_PSICOLOGO = `
  Psychologist_ID,
  Auth_User_ID,
  Name,
  Birth_Date,
  City,
  State,
  Country,
  CRP,
  Phone,
  Active,
  Created_At,
  Updated_At
`

function textoOuNull(valor) {
  const texto =
    typeof valor === 'string'
      ? valor.trim()
      : ''

  return texto || null
}

// =========================================================
// LOGIN
// =========================================================

export async function loginPsicologo(
  email,
  senha
) {
  const {
    data,
    error,
  } =
    await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

  if (error) {
    throw new Error(
      'E-mail ou senha inválidos.'
    )
  }

  const usuario =
    data.user

  if (!usuario) {
    throw new Error(
      'Não foi possível autenticar o usuário.'
    )
  }

  const {
    data: psicologo,
    error: erroPsicologo,
  } = await supabase
    .from('Psychologists')
    .select(CAMPOS_PSICOLOGO)
    .eq(
      'Auth_User_ID',
      usuario.id
    )
    .maybeSingle()

  if (
    erroPsicologo ||
    !psicologo
  ) {
    await supabase.auth.signOut()

    throw new Error(
      'Este usuário não possui acesso à versão Web do SENSUS-MAP.'
    )
  }

  if (!psicologo.Active) {
    await supabase.auth.signOut()

    throw new Error(
      'Este usuário está desativado.'
    )
  }

  return {
    usuario,
    psicologo,
  }
}

// =========================================================
// LOGOUT
// =========================================================

export async function logoutPsicologo() {
  const {
    error,
  } =
    await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

// =========================================================
// SESSÃO
// =========================================================

export async function buscarSessaoAtual() {
  const {
    data,
    error,
  } =
    await supabase.auth.getSession()

  if (error) {
    throw error
  }

  return data.session || null
}

// =========================================================
// PSICÓLOGO LOGADO
// =========================================================

export async function buscarPsicologoLogado() {
  const {
    data: {
      user,
    },
    error: erroUsuario,
  } =
    await supabase.auth.getUser()

  if (
    erroUsuario ||
    !user
  ) {
    return null
  }

  const {
    data,
    error,
  } = await supabase
    .from('Psychologists')
    .select(CAMPOS_PSICOLOGO)
    .eq(
      'Auth_User_ID',
      user.id
    )
    .maybeSingle()

  if (error) {
    console.error(
      'Erro ao buscar psicólogo:',
      error
    )

    throw error
  }

  if (
    !data ||
    !data.Active
  ) {
    return null
  }

  return {
    ...data,
    Email: user.email || '',
  }
}

// =========================================================
// ATUALIZAR PERFIL
// =========================================================

export async function atualizarPsicologoLogado({
  nome,
  dataNascimento,
  cidade,
  estado,
  pais,
  telefone,
  crp,
}) {
  const {
    data: {
      user,
    },
    error: erroUsuario,
  } =
    await supabase.auth.getUser()

  if (
    erroUsuario ||
    !user
  ) {
    throw new Error(
      'Usuário não autenticado.'
    )
  }

  const nomeLimpo =
    nome?.trim() || ''

  if (!nomeLimpo) {
    throw new Error(
      'Informe seu nome.'
    )
  }

  const {
    data,
    error,
  } = await supabase
    .from('Psychologists')
    .update({
      Name:
        nomeLimpo,

      Birth_Date:
        dataNascimento ||
        null,

      City:
        textoOuNull(
          cidade
        ),

      State:
        textoOuNull(
          estado
        ),

      Country:
        textoOuNull(
          pais
        ),

      Phone:
        textoOuNull(
          telefone
        ),

      CRP:
        textoOuNull(
          crp
        ),

      Updated_At:
        new Date().toISOString(),
    })
    .eq(
      'Auth_User_ID',
      user.id
    )
    .select(CAMPOS_PSICOLOGO)
    .single()

  if (error) {
    console.error(
      'Erro ao atualizar psicólogo:',
      error
    )

    throw new Error(
      'Não foi possível salvar as alterações.'
    )
  }

  return {
    ...data,
    Email: user.email || '',
  }
}