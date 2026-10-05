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
    data,
    error,
  } = await supabase.functions.invoke(
    'gemini-analysis',
    {
      body: {
        periodoInicio,
        periodoFim,
        frequencias,
      },
    }
  )

  if (error) {
    console.error(
      'Erro ao chamar IA:',
      error
    )

    throw new Error(
      'Não foi possível gerar a análise com IA.'
    )
  }

  if (data?.error) {
    throw new Error(
      data.error
    )
  }

  if (!data?.analise) {
    throw new Error(
      'A IA não retornou uma análise.'
    )
  }

  return data.analise
}