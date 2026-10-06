import { createClient } from 'npm:@supabase/supabase-js@2'
import { GoogleGenAI } from 'npm:@google/genai'

const MODELO = 'gemini-3.6-flash'

const INSTRUCAO_SISTEMA = `
Você é um assistente de apoio ao psicólogo dentro do sistema SENSUS-MAP.

Sua função é analisar registros emocionais fornecidos pelo sistema.

REGRAS OBRIGATÓRIAS:

- Responda sempre em português do Brasil.
- Seja objetivo e profissional.
- Não faça diagnósticos psicológicos ou psiquiátricos.
- Não diga que o paciente possui um transtorno.
- Não prescreva medicamentos.
- Não recomende medicamentos.
- Não substitua avaliação profissional.
- Não determine tratamentos.
- Não invente informações.
- Analise somente os dados fornecidos.
- Descreva padrões observáveis nos registros.
- A interpretação final sempre pertence ao psicólogo responsável.

Estruture a resposta em:

RESUMO

PADRÕES OBSERVADOS

PONTOS PARA OBSERVAÇÃO

IMPORTANTE

No final, informe que a análise é apenas apoio baseado nos registros apresentados e não representa diagnóstico.
`

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function respostaJson(corpo: object, status = 200) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

Deno.serve(async (req) => {
  // =====================================
  // CORS PREFLIGHT
  // =====================================
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // =====================================
  // SOMENTE POST
  // =====================================
  if (req.method !== 'POST') {
    return respostaJson({ error: 'Método não permitido.' }, 405)
  }

  // =====================================
  // INICIALIZAR SUPABASE E LER TOKEN
  // =====================================
  const authHeader = req.headers.get('Authorization')
  
  if (!authHeader) {
    return respostaJson({ error: 'Token de autorização ausente.' }, 401)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

  // Cria o cliente repassando o token do usuário para que o RLS e a função getUser funcionem
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { Authorization: authHeader },
    },
  })

  // =====================================
  // USUÁRIO AUTENTICADO
  // =====================================
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return respostaJson({ error: 'Usuário não autenticado.' }, 401)
  }

  const usuarioId = user.id

  // =====================================
  // VERIFICAR PSICÓLOGO
  // =====================================
  const { data: psicologo, error: erroPsicologo } = await supabase
    .from('Psychologists')
    .select(`
      Psychologist_ID,
      Active
    `)
    .eq('Auth_User_ID', usuarioId)
    .eq('Active', true)
    .maybeSingle()

  if (erroPsicologo || !psicologo) {
    console.error('Erro ao verificar psicólogo:', erroPsicologo)
    return respostaJson({ error: 'Acesso permitido apenas para psicólogos ativos.' }, 403)
  }

  // =====================================
  // LER CORPO
  // =====================================
  let corpo

  try {
    corpo = await req.json()
  } catch {
    return respostaJson({ error: 'Dados inválidos.' }, 400)
  }

  const { periodoInicio, periodoFim, frequencias } = corpo

  // =====================================
  // VALIDAR FREQUÊNCIAS
  // =====================================
  if (!Array.isArray(frequencias) || frequencias.length === 0) {
    return respostaJson({ error: 'Nenhum registro emocional foi enviado.' }, 400)
  }

  const frequenciasValidas = frequencias.every(
    (item) =>
      typeof item?.emocao === 'string' &&
      typeof item?.quantidade === 'number' &&
      item.quantidade >= 0,
  )

  if (!frequenciasValidas) {
    return respostaJson({ error: 'Os registros emocionais possuem formato inválido.' }, 400)
  }

  // =====================================
  // SOMAR REGISTROS
  // =====================================
  const totalRegistros = frequencias.reduce(
    (total, item) => total + item.quantidade,
    0,
  )

  if (totalRegistros <= 0) {
    return respostaJson({ error: 'Não existem registros suficientes para análise.' }, 400)
  }

  // =====================================
  // PEGAR SECRET DO GEMINI
  // =====================================
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY')

  if (!geminiApiKey) {
    console.error('GEMINI_API_KEY não configurada.')
    return respostaJson({ error: 'A integração com IA ainda não foi configurada.' }, 500)
  }

  // =====================================
  // PREPARAR DADOS
  // =====================================
  const listaEmocoes = frequencias
    .map((item) => `- ${item.emocao}: ${item.quantidade} registro(s)`)
    .join('\n')

  const prompt = `
Analise os registros emocionais abaixo.

Período inicial:
${periodoInicio || 'Não informado'}

Período final:
${periodoFim || 'Não informado'}

Total de registros:
${totalRegistros}

Frequências:

${listaEmocoes}
`

  // =====================================
  // GEMINI
  // =====================================
  try {
    const ia = new GoogleGenAI({
      apiKey: geminiApiKey,
    })

    const resposta = await ia.models.generateContent({
      model: MODELO,
      contents: prompt,
      config: {
        systemInstruction: INSTRUCAO_SISTEMA,
        temperature: 0.2,
        store: false,
      },
    })

    const analise = resposta.text?.trim()

    if (!analise) {
      return respostaJson({ error: 'A IA não retornou uma resposta.' }, 502)
    }

    return respostaJson({
      analise,
      modelo: MODELO,
      totalRegistros,
    })
  } catch (error) {
    console.error('Erro ao consultar Gemini:', error)
    return respostaJson({ error: 'Não foi possível gerar a análise com IA.' }, 502)
  }
})