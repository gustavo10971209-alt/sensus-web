import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  buscarEmocoesPorPaciente,
} from '../../services/emocaoService'

import {
  gerarAnaliseIA,
} from '../../services/iaService'

function AnaliseIA({
  paciente,
  dataInicio,
  dataFim,
}) {
  const [
    analise,
    setAnalise,
  ] = useState('')

  const [
    carregando,
    setCarregando,
  ] = useState(false)

  const [
    erro,
    setErro,
  ] = useState('')

  const [
    emocoes,
    setEmocoes,
  ] = useState([])

  // =========================================
  // LIMPAR AO TROCAR PACIENTE / PERÍODO
  // =========================================

  useEffect(() => {
    setAnalise('')
    setErro('')
    setEmocoes([])
  }, [
    paciente?.id,
    dataInicio,
    dataFim,
  ])

  // =========================================
  // FILTRAR EMOÇÕES PELO PERÍODO
  // =========================================

  function dataDentroDoPeriodo(
    data
  ) {
    if (!data) {
      return false
    }

    const dataRegistro =
      new Date(data)

    const inicio =
      dataInicio
        ? new Date(
            `${dataInicio}T00:00:00`
          )
        : null

    const fim =
      dataFim
        ? new Date(
            `${dataFim}T23:59:59`
          )
        : null

    if (
      inicio &&
      dataRegistro < inicio
    ) {
      return false
    }

    if (
      fim &&
      dataRegistro > fim
    ) {
      return false
    }

    return true
  }

  // =========================================
  // DESCOBRIR NOME DA EMOÇÃO
  // =========================================

  function obterNomeEmocao(
    emocao
  ) {
    return (
      emocao?.emocao ||
      emocao?.nome ||
      emocao?.Selection_Type ||
      emocao?.selectionType ||
      ''
    )
  }

  // =========================================
  // DESCOBRIR DATA DA EMOÇÃO
  // =========================================

  function obterDataEmocao(
    emocao
  ) {
    return (
      emocao?.data ||
      emocao?.dataHora ||
      emocao?.Date_Time_Selection ||
      emocao?.dateTime ||
      null
    )
  }

  // =========================================
  // FREQUÊNCIAS
  // =========================================

  const frequencias =
    useMemo(() => {
      const contagem = {}

      emocoes.forEach(
        (emocao) => {
          const nome =
            obterNomeEmocao(
              emocao
            )

          const data =
            obterDataEmocao(
              emocao
            )

          if (!nome) {
            return
          }

          if (
            !dataDentroDoPeriodo(
              data
            )
          ) {
            return
          }

          contagem[nome] =
            (contagem[nome] || 0) +
            1
        }
      )

      return Object.entries(
        contagem
      ).map(
        ([
          emocao,
          quantidade,
        ]) => ({
          emocao,
          quantidade,
        })
      )
    }, [
      emocoes,
      dataInicio,
      dataFim,
    ])

  // =========================================
  // GERAR ANÁLISE
  // =========================================

  async function gerar() {
    if (!paciente?.id) {
      setErro(
        'Selecione um paciente primeiro.'
      )
      return
    }

    if (
      !dataInicio ||
      !dataFim
    ) {
      setErro(
        'Selecione o período do relatório.'
      )
      return
    }

    try {
      setCarregando(true)
      setErro('')
      setAnalise('')

      const dadosEmocoes =
        await buscarEmocoesPorPaciente(
          paciente.id
        )

      setEmocoes(
        dadosEmocoes || []
      )

      const contagem = {}

      ;(
        dadosEmocoes || []
      ).forEach(
        (emocao) => {
          const nome =
            obterNomeEmocao(
              emocao
            )

          const data =
            obterDataEmocao(
              emocao
            )

          if (!nome) {
            return
          }

          if (
            !dataDentroDoPeriodo(
              data
            )
          ) {
            return
          }

          contagem[nome] =
            (contagem[nome] || 0) +
            1
        }
      )

      const frequenciasParaIA =
        Object.entries(
          contagem
        ).map(
          ([
            emocao,
            quantidade,
          ]) => ({
            emocao,
            quantidade,
          })
        )

      if (
        frequenciasParaIA.length ===
        0
      ) {
        setErro(
          'Não existem registros emocionais neste período.'
        )

        return
      }

      const resposta =
        await gerarAnaliseIA({
          periodoInicio:
            dataInicio,

          periodoFim:
            dataFim,

          frequencias:
            frequenciasParaIA,
        })

      setAnalise(
        resposta
      )
    } catch (error) {
      console.error(
        'Erro ao gerar análise:',
        error
      )

      setErro(
        error?.message ||
          'Não foi possível gerar a análise com IA.'
      )
    } finally {
      setCarregando(false)
    }
  }

  // =========================================
  // TELA
  // =========================================

  return (
    <section className="analise-ia">

      <div className="analise-ia-cabecalho">

        <div>

          <span className="analise-ia-etiqueta">
            INTELIGÊNCIA ARTIFICIAL
          </span>

          <h3>
            Análise dos registros
          </h3>

          <p>
            Gere um resumo descritivo
            dos registros emocionais
            selecionados.
          </p>

        </div>

        <button
          type="button"
          className="analise-ia-botao"
          onClick={gerar}
          disabled={
            carregando
          }
        >
          {carregando
            ? 'Analisando...'
            : '✦ Gerar análise com IA'}
        </button>

      </div>

      <div className="analise-ia-aviso">
        A análise é apenas um recurso
        de apoio ao profissional e não
        representa diagnóstico.
      </div>

      {erro && (
        <div className="analise-ia-erro">
          {erro}
        </div>
      )}

      {analise && (
        <div className="analise-ia-resposta">

          <div className="analise-ia-resposta-topo">

            <strong>
              Análise gerada
            </strong>

            <button
              type="button"
              onClick={gerar}
              disabled={
                carregando
              }
            >
              Gerar novamente
            </button>

          </div>

          <div className="analise-ia-texto">
            {analise}
          </div>

        </div>
      )}

    </section>
  )
}

export default AnaliseIA