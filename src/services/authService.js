import { supabase } from './supabase'

// =========================================================
// LOGIN
// =========================================================

export async function loginPsicologo(
  email,
  senha
) {
  // Primeiro fazemos o login normal no Supabase Auth.
  const {
    data,
    error,
  } = await supabase.auth.signInWithPassword({
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

  // =======================================================
  // VERIFICAR SE É PSICÓLOGO
  // =======================================================

  const {
    data: psicologo,
    error: erroPsicologo,
  } = await supabase
    .from('Psychologists')
    .select(`
      Psychologist_ID,
      Auth_User_ID,
      Name,
      CRP,
      Phone,
      Active,
      Created_At,
      Updated_At
    `)
    .eq(
      'Auth_User_ID',
      usuario.id
    )
    .maybeSingle()

  /*
    Se não existir na Psychologists,
    esse usuário não pode usar a versão Web.

    Isso inclui os pacientes do Android.
  */
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
  } = await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

// =========================================================
// SESSÃO ATUAL
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

  return (
    data.session ||
    null
  )
}

// =========================================================
// PERFIL DO PSICÓLOGO LOGADO
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
    .select(`
      Psychologist_ID,
      Auth_User_ID,
      Name,
      CRP,
      Phone,
      Active,
      Created_At,
      Updated_At
    `)
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
    Email: user.email,
  }
}

// =========================================================
// ATUALIZAR PERFIL DO PSICÓLOGO
// =========================================================

export async function atualizarPsicologoLogado({
  nome,
  crp,
  telefone,
}) {
  const {
    data: {
      user,
    },
    error: erroUsuario,
  } = await supabase.auth.getUser()

  if (
    erroUsuario ||
    !user
  ) {
    throw new Error(
      'Usuário não autenticado.'
    )
  }

  const {
    data,
    error,
  } = await supabase
    .from('Psychologists')
    .update({
      Name: nome.trim(),
      CRP:
        crp.trim() || null,
      Phone:
        telefone.trim() || null,
      Updated_At:
        new Date().toISOString(),
    })
    .eq(
      'Auth_User_ID',
      user.id
    )
    .select(`
      Psychologist_ID,
      Auth_User_ID,
      Name,
      CRP,
      Phone,
      Active,
      Created_At,
      Updated_At
    `)
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
    Email: user.email,
  }
}