import {
  supabase,
} from './supabase'

export async function gerarAnaliseIA({
  periodoInicio,
  periodoFim,
  frequencias,
}) {
  if (
    !Array.isArray(frequencias) ||
    frequencias.length === 0
  ) {
    throw new Error(
      'Não existem emoções suficientes para gerar a análise.'
    )
  }

  const {
    data: sessaoData,
    error: sessaoError,
  } =
    await supabase.auth.getSession()

  console.log(
    sessaoData?.session
      ? 'IA: sessão existe'
      : 'IA: sessão não existe'
  )

  if (sessaoError) {
    console.error(
      'IA: erro ao obter sessão:',
      sessaoError
    )
  }

  const accessToken =
    sessaoData?.session?.access_token

  if (!accessToken) {
    throw new Error(
      'Usuário não autenticado.'
    )
  }

  try {
    const partes =
      accessToken.split('.')

    console.log(
      'IA: token possui formato JWT:',
      partes.length === 3
    )

    if (partes.length === 3) {
      const cabecalho =
        JSON.parse(
          atob(partes[0])
        )

      const payload =
        JSON.parse(
          atob(partes[1])
        )

      console.log(
        'IA: algoritmo do token:',
        cabecalho.alg
      )

      console.log(
        'IA: emissor do token:',
        payload.iss
      )

      console.log(
        'IA: usuário do token:',
        payload.sub
      )
    }
  } catch (error) {
    console.error(
      'IA: não foi possível inspecionar o token:',
      error
    )
  }

  const supabaseUrl =
    import.meta.env.VITE_SUPABASE_URL

  const resposta =
    await fetch(
      `${supabaseUrl}/functions/v1/gemini-analysis`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${accessToken}`,
        },

        body: JSON.stringify({
          periodoInicio,
          periodoFim,
          frequencias,
        }),
      }
    )

  const data =
    await resposta.json()

  console.log(
    'IA: status da função:',
    resposta.status
  )

  console.log(
    'IA: resposta da função:',
    data
  )

  if (!resposta.ok) {
    throw new Error(
      data?.detalhe ||
      data?.error ||
      'Não foi possível gerar a análise com IA.'
    )
  }

  if (!data?.analise) {
    throw new Error(
      'A IA não retornou uma análise.'
    )
  }

  return data.analise
}