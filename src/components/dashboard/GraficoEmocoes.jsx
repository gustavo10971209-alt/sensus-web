import { useMemo, useState } from 'react'

function GraficoEmocoes({
  emocoes,
  carregando,
  erro,
}) {
  const [filtroPeriodo, setFiltroPeriodo] =
    useState(30)

  // =========================================
  // COR DE CADA EMOÇÃO
  // =========================================

  function obterCorEmocao(emocao) {
    const nome = emocao
      ?.trim()
      .toLowerCase()

    const cores = {
      feliz: '#287735',
      triste: '#35399b',
      irritado: '#cf2d2d',
      ansioso: '#a86608',
      cansado: '#37454b',
      calmo: '#08705f',
    }

    // Se surgir uma emoção nova no banco,
    // usamos a cor padrão do SENSUS.
    return cores[nome] || '#74b3a7'
  }

  // =========================================
  // FILTRAR EMOÇÕES PELO PERÍODO
  // =========================================

  const emocoesFiltradas = useMemo(() => {
    if (filtroPeriodo === 'todos') {
      return emocoes
    }

    const agora = new Date()

    const inicioPeriodo =
      new Date(agora)

    inicioPeriodo.setDate(
      agora.getDate() -
        Number(filtroPeriodo)
    )

    return emocoes.filter((registro) => {
      const dataRegistro =
        new Date(
          registro.Date_Time_Selection
        )

      return (
        dataRegistro >=
        inicioPeriodo
      )
    })
  }, [emocoes, filtroPeriodo])

  // =========================================
  // CONTAGEM DAS EMOÇÕES
  // =========================================

  const dadosGrafico = useMemo(() => {
    const contagem = {}

    emocoesFiltradas.forEach(
      (registro) => {
        const emocao =
          registro.Selection_Type

        if (!emocao) {
          return
        }

        contagem[emocao] =
          (contagem[emocao] || 0) + 1
      }
    )

    return Object.entries(contagem)
      .map(
        ([emocao, quantidade]) => ({
          emocao,
          quantidade,
        })
      )
      .sort(
        (a, b) =>
          b.quantidade -
          a.quantidade
      )
  }, [emocoesFiltradas])

  // =========================================
  // MAIOR QUANTIDADE
  // Usada para calcular o tamanho das barras
  // =========================================

  const maiorQuantidade =
    dadosGrafico.length > 0
      ? Math.max(
          ...dadosGrafico.map(
            (item) =>
              item.quantidade
          )
        )
      : 0

  // =========================================
  // EMOÇÃO MAIS RECENTE
  // =========================================

  const emocaoMaisRecente =
    emocoesFiltradas.length > 0
      ? emocoesFiltradas[0]
      : null

  // =========================================
  // FORMATAR DATA E HORA
  // =========================================

  function formatarDataHora(dataHora) {
    if (!dataHora) {
      return ''
    }

    return new Date(
      dataHora
    ).toLocaleString(
      'pt-BR',
      {
        dateStyle: 'short',
        timeStyle: 'short',
      }
    )
  }

  return (
    <section className="dashboard-emocoes">

      {/* =====================================
          CABEÇALHO
      ===================================== */}

      <div className="dashboard-emocoes-cabecalho">

        <div>
          <span>
            RELATÓRIO EMOCIONAL
          </span>

          <h3>
            Emoções do paciente
          </h3>
        </div>

        {/* ===================================
            FILTROS
        =================================== */}

        <div className="dashboard-filtro-emocoes">

          <button
            type="button"
            className={
              filtroPeriodo === 7
                ? 'ativo'
                : ''
            }
            onClick={() =>
              setFiltroPeriodo(7)
            }
          >
            7 dias
          </button>

          <button
            type="button"
            className={
              filtroPeriodo === 15
                ? 'ativo'
                : ''
            }
            onClick={() =>
              setFiltroPeriodo(15)
            }
          >
            15 dias
          </button>

          <button
            type="button"
            className={
              filtroPeriodo === 30
                ? 'ativo'
                : ''
            }
            onClick={() =>
              setFiltroPeriodo(30)
            }
          >
            30 dias
          </button>

          <button
            type="button"
            className={
              filtroPeriodo ===
              'todos'
                ? 'ativo'
                : ''
            }
            onClick={() =>
              setFiltroPeriodo(
                'todos'
              )
            }
          >
            Todos
          </button>

        </div>

      </div>

      {/* =====================================
          CARREGANDO
      ===================================== */}

      {carregando ? (

        <div className="dashboard-grafico-vazio">
          Carregando emoções...
        </div>

      ) : erro ? (

        /* ===================================
           ERRO
        =================================== */

        <div className="dashboard-grafico-vazio">
          {erro}
        </div>

      ) : dadosGrafico.length === 0 ? (

        /* ===================================
           SEM REGISTROS
        =================================== */

        <div className="dashboard-grafico-vazio">

          <strong>
            Nenhum registro no período
          </strong>

          <span>
            Não existem emoções
            registradas para este
            intervalo.
          </span>

        </div>

      ) : (

        <>
          {/* =================================
              RESUMO
          ================================= */}

          <div className="dashboard-emocoes-resumo">

            <div>

              <span>
                REGISTROS
              </span>

              <strong>
                {emocoesFiltradas.length}
              </strong>

            </div>

            <div>

              <span>
                MAIS RECENTE
              </span>

              <strong>
                {
                  emocaoMaisRecente
                    ?.Selection_Type
                }
              </strong>

              <small>
                {formatarDataHora(
                  emocaoMaisRecente
                    ?.Date_Time_Selection
                )}
              </small>

            </div>

          </div>

          {/* =================================
              GRÁFICO
          ================================= */}

          <div className="dashboard-grafico-emocoes">

            {dadosGrafico.map(
              (item) => {

                const largura =
                  maiorQuantidade > 0
                    ? (
                        item.quantidade /
                        maiorQuantidade
                      ) * 100
                    : 0

                const cor =
                  obterCorEmocao(
                    item.emocao
                  )

                return (
                  <div
                    className="dashboard-grafico-linha"
                    key={item.emocao}
                  >

                    {/* NOME + QUANTIDADE */}

                    <div className="dashboard-grafico-info">

                      <strong>
                        {item.emocao}
                      </strong>

                      <span>
                        {item.quantidade}
                      </span>

                    </div>

                    {/* BARRA */}

                    <div className="dashboard-grafico-trilho">

                      <div
                        className="dashboard-grafico-barra"
                        style={{
                          width:
                            `${largura}%`,

                          background:
                            cor,
                        }}
                      />

                    </div>

                  </div>
                )
              }
            )}

          </div>

        </>
      )}

    </section>
  )
}

export default GraficoEmocoes