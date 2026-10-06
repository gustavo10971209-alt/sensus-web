import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  buscarEmocoesPorPaciente,
} from '../../services/emocaoService'

// =========================================
// CORES
// =========================================

function obterCorEmocao(emocao) {
  const nome =
    emocao
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

  return (
    cores[nome] ||
    '#74b3a7'
  )
}

// =========================================
// DATA
// =========================================

function obterDataRegistro(dataHora) {
  if (!dataHora) {
    return ''
  }

  // Converte a string (que vem em UTC do Supabase) para o fuso local
  const dataLocal = new Date(dataHora)
  
  // Fallback caso a string não seja uma data válida no formato esperado
  if (isNaN(dataLocal.getTime())) {
    return dataHora.slice(0, 10)
  }

  const ano = dataLocal.getFullYear()
  const mes = String(dataLocal.getMonth() + 1).padStart(2, '0')
  const dia = String(dataLocal.getDate()).padStart(2, '0')

  return `${ano}-${mes}-${dia}`
}

function formatarData(
  dataTexto
) {
  if (!dataTexto) {
    return ''
  }

  const [
    ano,
    mes,
    dia,
  ] = dataTexto
    .split('-')

  return `${dia}/${mes}/${ano}`
}

function obterDiaSemana(
  dataTexto
) {
  const [
    ano,
    mes,
    dia,
  ] = dataTexto
    .split('-')
    .map(Number)

  const data =
    new Date(
      ano,
      mes - 1,
      dia
    )

  const dias = [
    'Dom',
    'Seg',
    'Ter',
    'Qua',
    'Qui',
    'Sex',
    'Sáb',
  ]

  return dias[
    data.getDay()
  ]
}

function adicionarDias(
  dataTexto,
  quantidade
) {
  const [
    ano,
    mes,
    dia,
  ] = dataTexto
    .split('-')
    .map(Number)

  const data =
    new Date(
      ano,
      mes - 1,
      dia
    )

  data.setDate(
    data.getDate() +
      quantidade
  )

  const novoAno =
    data.getFullYear()

  const novoMes =
    String(
      data.getMonth() + 1
    ).padStart(
      2,
      '0'
    )

  const novoDia =
    String(
      data.getDate()
    ).padStart(
      2,
      '0'
    )

  return (
    `${novoAno}-${novoMes}-${novoDia}`
  )
}

// =========================================
// COMPONENTE
// =========================================
function GraficoLinhasSemanal({
  dias,
  emocoes,
  registros,
}) {
  const largura = 760
  const altura = 300

  const margem = {
    topo: 25,
    direita: 25,
    baixo: 50,
    esquerda: 45,
  }

  const larguraGrafico =
    largura -
    margem.esquerda -
    margem.direita

  const alturaGrafico =
    altura -
    margem.topo -
    margem.baixo

  // =========================================
  // CONTAGEM POR DIA
  // =========================================

  function quantidadeNoDia(
    emocao,
    data
  ) {
    return registros.filter(
      (registro) =>
        registro.Selection_Type ===
          emocao &&
        obterDataRegistro(
          registro.Date_Time_Selection
        ) === data
    ).length
  }

  // =========================================
  // MAIOR VALOR
  // =========================================

  const valores = []

  emocoes.forEach(
    (emocao) => {
      dias.forEach(
        (data) => {
          valores.push(
            quantidadeNoDia(
              emocao,
              data
            )
          )
        }
      )
    }
  )

  const maiorValor =
    Math.max(
      ...valores,
      0
    )

  /*
    Escala automática.

    2  -> 10
    5  -> 10
    10 -> 20
    37 -> 40
    60 -> 70
    94 -> 100
  */
  const maximoGrafico =
    Math.max(
      10,
      (
        Math.floor(
          maiorValor / 10
        ) + 1
      ) * 10
    )

  // =========================================
  // POSIÇÕES
  // =========================================

  function obterX(indice) {
    if (dias.length <= 1) {
      return margem.esquerda
    }

    return (
      margem.esquerda +
      (
        indice /
        (dias.length - 1)
      ) *
        larguraGrafico
    )
  }

  function obterY(valor) {
    return (
      margem.topo +
      alturaGrafico -
      (
        valor /
        maximoGrafico
      ) *
        alturaGrafico
    )
  }

  // =========================================
  // LINHAS HORIZONTAIS
  // =========================================

  const quantidadeLinhas = 5

  const niveis =
    Array.from(
      {
        length:
          quantidadeLinhas + 1,
      },
      (_, indice) =>
        (
          maximoGrafico /
          quantidadeLinhas
        ) * indice
    )

  // =========================================
  // TELA
  // =========================================

  return (
    <div className="grafico-semanal">

      <div className="grafico-semanal-cabecalho">

        <div>
          <span>
            EVOLUÇÃO NA SEMANA
          </span>

          <h3>
            Registros por dia
          </h3>
        </div>

        <div className="grafico-semanal-legenda">

          {emocoes.map(
            (emocao) => (
              <div
                key={emocao}
              >
                <i
                  style={{
                    backgroundColor:
                      obterCorEmocao(
                        emocao
                      ),
                  }}
                />

                <span>
                  {emocao}
                </span>
              </div>
            )
          )}

        </div>

      </div>

      <div className="grafico-semanal-area">

        <svg
          viewBox={`0 0 ${largura} ${altura}`}
          role="img"
          aria-label="Comparativo semanal das emoções"
        >

          {/* LINHAS HORIZONTAIS */}

          {niveis.map(
            (nivel) => {
              const y =
                obterY(
                  nivel
                )

              return (
                <g
                  key={
                    nivel
                  }
                >
                  <line
                    x1={
                      margem.esquerda
                    }
                    x2={
                      largura -
                      margem.direita
                    }
                    y1={y}
                    y2={y}
                    className="grafico-grade"
                  />

                  <text
                    x={
                      margem.esquerda -
                      10
                    }
                    y={
                      y + 4
                    }
                    textAnchor="end"
                    className="grafico-eixo-texto"
                  >
                    {
                      Math.round(
                        nivel
                      )
                    }
                  </text>
                </g>
              )
            }
          )}

          {/* DIAS */}

          {dias.map(
            (
              data,
              indice
            ) => {
              const x =
                obterX(
                  indice
                )

              return (
                <g
                  key={
                    data
                  }
                >
                  <line
                    x1={x}
                    x2={x}
                    y1={
                      margem.topo
                    }
                    y2={
                      margem.topo +
                      alturaGrafico
                    }
                    className="grafico-grade-vertical"
                  />

                  <text
                    x={x}
                    y={
                      altura -
                      22
                    }
                    textAnchor="middle"
                    className="grafico-dia"
                  >
                    {
                      obterDiaSemana(
                        data
                      )
                    }
                  </text>

                  <text
                    x={x}
                    y={
                      altura -
                      8
                    }
                    textAnchor="middle"
                    className="grafico-data"
                  >
                    {
                      formatarData(
                        data
                      ).slice(
                        0,
                        5
                      )
                    }
                  </text>
                </g>
              )
            }
          )}

          {/* LINHAS DAS EMOÇÕES */}

          {emocoes.map(
            (emocao) => {
              const pontos =
                dias.map(
                  (
                    data,
                    indice
                  ) => {
                    const quantidade =
                      quantidadeNoDia(
                        emocao,
                        data
                      )

                    return {
                      data,
                      quantidade,
                      x:
                        obterX(
                          indice
                        ),
                      y:
                        obterY(
                          quantidade
                        ),
                    }
                  }
                )

              const caminho =
                pontos
                  .map(
                    (
                      ponto,
                      indice
                    ) =>
                      `${
                        indice === 0
                          ? 'M'
                          : 'L'
                      } ${ponto.x} ${ponto.y}`
                  )
                  .join(' ')

              const cor =
                obterCorEmocao(
                  emocao
                )

              return (
                <g
                  key={
                    emocao
                  }
                >

                  <path
                    d={
                      caminho
                    }
                    fill="none"
                    stroke={
                      cor
                    }
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="grafico-linha-emocao"
                  />

                  {pontos.map(
                    (
                      ponto
                    ) => (
                      <g
                        key={
                          `${emocao}-${ponto.data}`
                        }
                      >
                        <circle
                          cx={
                            ponto.x
                          }
                          cy={
                            ponto.y
                          }
                          r="5"
                          fill={
                            cor
                          }
                          stroke="white"
                          strokeWidth="2"
                          className="grafico-ponto"
                        >
                          <title>
                            {`${emocao} — ${formatarData(
                              ponto.data
                            )}: ${ponto.quantidade} registro${
                              ponto.quantidade ===
                              1
                                ? ''
                                : 's'
                            }`}
                          </title>
                        </circle>

                        {ponto.quantidade >
                          0 && (
                          <text
                            x={
                              ponto.x
                            }
                            y={
                              ponto.y -
                              11
                            }
                            textAnchor="middle"
                            className="grafico-valor"
                          >
                            {
                              ponto.quantidade
                            }
                          </text>
                        )}

                      </g>
                    )
                  )}

                </g>
              )
            }
          )}

        </svg>

      </div>

      <div className="grafico-semanal-escala">
        Escala automática: 0 a{' '}
        <strong>
          {maximoGrafico}
        </strong>{' '}
        registros
      </div>

    </div>
  )
}

function VisualizacaoRelatorio({
  tipoRelatorio,
  paciente,
  dataInicio,
  dataFim,
}) {
  const [
    registros,
    setRegistros,
  ] = useState([])

  const [
    carregando,
    setCarregando,
  ] = useState(false)

  const [
    erro,
    setErro,
  ] = useState('')

  // =========================================
  // BUSCAR EMOÇÕES
  // =========================================

  useEffect(() => {
    async function carregar() {
      if (!paciente?.id) {
        setRegistros([])
        return
      }

      try {
        setCarregando(true)
        setErro('')

        /*
          Usamos a função que já existia
          no projeto e sabemos que funciona.
        */
        const dados =
          await buscarEmocoesPorPaciente(
            paciente.id
          )

        setRegistros(
          dados || []
        )
      } catch (error) {
        console.error(
          'Erro ao carregar relatório:',
          error
        )

        setRegistros([])

        setErro(
          'Não foi possível carregar os registros emocionais.'
        )
      } finally {
        setCarregando(false)
      }
    }

    carregar()
  }, [paciente?.id])

  // =========================================
  // FILTRAR PELO PERÍODO
  // =========================================

  const registrosPeriodo =
    useMemo(() => {
      if (
        !dataInicio ||
        !dataFim
      ) {
        return []
      }

      return registros.filter(
        (registro) => {
          const data =
            obterDataRegistro(
              registro
                .Date_Time_Selection
            )

          return (
            data >= dataInicio &&
            data <= dataFim
          )
        }
      )
    }, [
      registros,
      dataInicio,
      dataFim,
    ])

  // =========================================
  // EMOÇÕES
  // =========================================

  const emocoes =
    useMemo(() => {
      return [
        ...new Set(
          registrosPeriodo
            .map(
              (registro) =>
                registro
                  .Selection_Type
            )
            .filter(Boolean)
        ),
      ].sort()
    }, [
      registrosPeriodo,
    ])

  // =========================================
  // CONTAGEM
  // =========================================

  const contagem =
    useMemo(() => {
      const resultado = {}

      registrosPeriodo.forEach(
        (registro) => {
          const emocao =
            registro
              .Selection_Type

          if (!emocao) {
            return
          }

          resultado[emocao] =
            (
              resultado[emocao] ||
              0
            ) + 1
        }
      )

      return resultado
    }, [
      registrosPeriodo,
    ])

  const totalRegistros =
    registrosPeriodo.length

  const ranking =
    useMemo(() => {
      return Object.entries(
        contagem
      )
        .map(
          ([
            emocao,
            quantidade,
          ]) => ({
            emocao,
            quantidade,
          })
        )
        .sort(
          (a, b) =>
            b.quantidade -
            a.quantidade
        )
    }, [
      contagem,
    ])

  const emocaoPredominante =
    ranking[0]?.emocao ||
    'Sem registros'

  // =========================================
  // ESTADOS
  // =========================================

  if (carregando) {
    return (
      <div className="visualizacao-status">
        Carregando registros emocionais...
      </div>
    )
  }

  if (erro) {
    return (
      <div className="visualizacao-status visualizacao-status-erro">
        {erro}
      </div>
    )
  }

  if (
    registrosPeriodo.length === 0
  ) {
    return (
      <div className="relatorio-placeholder-grafico">

        <span>
          📊
        </span>

        <strong>
          Nenhum registro encontrado
        </strong>

        <p>
          Este paciente não possui
          registros emocionais entre{' '}
          {formatarData(
            dataInicio
          )}{' '}
          e{' '}
          {formatarData(
            dataFim
          )}.
        </p>

      </div>
    )
  }

  // =========================================
  // RELATÓRIO 001
  // =========================================

  if (
    tipoRelatorio === '001'
  ) {
    const dias =
      Array.from(
        { length: 7 },
        (_, indice) =>
          adicionarDias(
            dataInicio,
            indice
          )
      )

    return (
      <div className="visualizacao-relatorio">

        <ResumoGeral
  total={
    totalRegistros
  }
  quantidadeEmocoes={
    emocoes.length
  }
  predominante={
    emocaoPredominante
  }
/>

<GraficoLinhasSemanal
  dias={dias}
  emocoes={emocoes}
  registros={
    registrosPeriodo
  }
/>

<div className="relatorio-tabela-wrapper">

          <table className="relatorio-tabela">

            <thead>
              <tr>
                <th>
                  Emoção
                </th>

                {dias.map(
                  (data) => (
                    <th
                      key={data}
                    >
                      <span>
                        {
                          obterDiaSemana(
                            data
                          )
                        }
                      </span>

                      <small>
                        {
                          formatarData(
                            data
                          ).slice(
                            0,
                            5
                          )
                        }
                      </small>
                    </th>
                  )
                )}

                <th>
                  Total
                </th>
              </tr>
            </thead>

            <tbody>

              {emocoes.map(
                (emocao) => (
                  <tr
                    key={emocao}
                  >
                    <th>
                      <span
                        className="emocao-indicador"
                        style={{
                          backgroundColor:
                            obterCorEmocao(
                              emocao
                            ),
                        }}
                      />

                      {emocao}
                    </th>

                    {dias.map(
                      (data) => {
                        const quantidade =
                          registrosPeriodo
                            .filter(
                              (
                                registro
                              ) =>
                                registro
                                  .Selection_Type ===
                                  emocao &&
                                obterDataRegistro(
                                  registro
                                    .Date_Time_Selection
                                ) ===
                                  data
                            )
                            .length

                        return (
                          <td
                            key={
                              data
                            }
                          >
                            {
                              quantidade
                            }
                          </td>
                        )
                      }
                    )}

                    <td className="relatorio-total">
                      {
                        contagem[
                          emocao
                        ]
                      }
                    </td>
                  </tr>
                )
              )}

            </tbody>
          </table>

        </div>

      </div>
    )
  }

  // =========================================
  // RELATÓRIO 002
  // EMOÇÕES PREDOMINANTES
  // =========================================

  if (
    tipoRelatorio === '002'
  ) {
    const maior =
      ranking[0]
        ?.quantidade || 1

    return (
      <div className="visualizacao-relatorio">

        <ResumoGeral
          total={
            totalRegistros
          }
          quantidadeEmocoes={
            emocoes.length
          }
          predominante={
            emocaoPredominante
          }
        />

        <div className="ranking-emocoes">

          {ranking.map(
            (
              item,
              indice
            ) => {
              const percentual =
                Math.round(
                  (
                    item.quantidade /
                    totalRegistros
                  ) * 100
                )

              const largura =
                (
                  item.quantidade /
                  maior
                ) * 100

              return (
                <div
                  className="ranking-emocao"
                  key={
                    item.emocao
                  }
                >
                  <div className="ranking-emocao-topo">

                    <strong>
                      {indice + 1}.{' '}
                      {
                        item.emocao
                      }
                    </strong>

                    <span>
                      {
                        item.quantidade
                      }{' '}
                      registros ·{' '}
                      {
                        percentual
                      }%
                    </span>

                  </div>

                  <div className="ranking-barra">

                    <div
                      className="ranking-barra-preenchimento"
                      style={{
                        width:
                          `${largura}%`,
                        backgroundColor:
                          obterCorEmocao(
                            item.emocao
                          ),
                      }}
                    />

                  </div>
                </div>
              )
            }
          )}

        </div>

      </div>
    )
  }

  // =========================================
  // RELATÓRIO 003
  // HORÁRIO DO DIA
  // =========================================

  if (
    tipoRelatorio === '003'
  ) {
    const periodos = {
      Madrugada: [],
      Manhã: [],
      Tarde: [],
      Noite: [],
    }

    registrosPeriodo.forEach(
      (registro) => {
        const dataHora =
          registro
            .Date_Time_Selection

        if (!dataHora) {
          return
        }
        
        // Convertendo para o fuso local também para pegar a hora correta
        const hora = new Date(dataHora).getHours()

        if (hora < 6) {
          periodos
            .Madrugada
            .push(registro)
        } else if (
          hora < 12
        ) {
          periodos
            .Manhã
            .push(registro)
        } else if (
          hora < 18
        ) {
          periodos
            .Tarde
            .push(registro)
        } else {
          periodos
            .Noite
            .push(registro)
        }
      }
    )

    return (
      <div className="visualizacao-relatorio">

        <ResumoGeral
          total={
            totalRegistros
          }
          quantidadeEmocoes={
            emocoes.length
          }
          predominante={
            emocaoPredominante
          }
        />

        <div className="periodos-dia-grid">

          {Object.entries(
            periodos
          ).map(
            ([
              periodo,
              dados,
            ]) => {
              const quantidade =
                dados.length

              return (
                <div
                  className="periodo-dia-card"
                  key={
                    periodo
                  }
                >
                  <span>
                    {
                      periodo
                    }
                  </span>

                  <strong>
                    {
                      quantidade
                    }
                  </strong>

                  <small>
                    registros
                  </small>

                  <div className="periodo-emocoes">

                    {[
                      ...new Set(
                        dados.map(
                          (
                            registro
                          ) =>
                            registro
                              .Selection_Type
                        )
                      ),
                    ]
                      .filter(
                        Boolean
                      )
                      .map(
                        (
                          emocao
                        ) => (
                          <span
                            key={
                              emocao
                            }
                          >
                            <i
                              style={{
                                backgroundColor:
                                  obterCorEmocao(
                                    emocao
                                  ),
                              }}
                            />

                            {
                              emocao
                            }
                          </span>
                        )
                      )}

                  </div>

                </div>
              )
            }
          )}

        </div>

      </div>
    )
  }

  // =========================================
  // RELATÓRIO 004
  // EVOLUÇÃO EMOCIONAL
  // =========================================

  if (
    tipoRelatorio === '004'
  ) {
    const porData = {}

    registrosPeriodo.forEach(
      (registro) => {
        const data =
          obterDataRegistro(
            registro
              .Date_Time_Selection
          )

        if (!porData[data]) {
          porData[data] = []
        }

        porData[data].push(
          registro
        )
      }
    )

    const datas =
      Object.keys(
        porData
      ).sort()

    return (
      <div className="visualizacao-relatorio">

        <ResumoGeral
          total={
            totalRegistros
          }
          quantidadeEmocoes={
            emocoes.length
          }
          predominante={
            emocaoPredominante
          }
        />

        <div className="evolucao-lista">

          {datas.map(
            (data) => (
              <div
                className="evolucao-dia"
                key={data}
              >
                <div className="evolucao-data">

                  <strong>
                    {
                      formatarData(
                        data
                      )
                    }
                  </strong>

                  <span>
                    {
                      porData[
                        data
                      ].length
                    }{' '}
                    registros
                  </span>

                </div>

                <div className="evolucao-emocoes">

                  {porData[
                    data
                  ].map(
                    (
                      registro,
                      indice
                    ) => (
                      <span
                        className="evolucao-emocao"
                        key={
                          `${
                            registro.ID_Map ||
                            data
                          }-${indice}`
                        }
                      >
                        <i
                          style={{
                            backgroundColor:
                              obterCorEmocao(
                                registro
                                  .Selection_Type
                              ),
                          }}
                        />

                        {
                          registro
                            .Selection_Type
                        }
                      </span>
                    )
                  )}

                </div>
              </div>
            )
          )}

        </div>

      </div>
    )
  }

  // =========================================
  // RELATÓRIO 005
  // FREQUÊNCIA
  // =========================================

  if (
    tipoRelatorio === '005'
  ) {
    return (
      <div className="visualizacao-relatorio">

        <ResumoGeral
          total={
            totalRegistros
          }
          quantidadeEmocoes={
            emocoes.length
          }
          predominante={
            emocaoPredominante
          }
        />

        <div className="frequencia-grid">

          {ranking.map(
            (item) => {
              const percentual =
                (
                  item.quantidade /
                  totalRegistros
                ) * 100

              return (
                <div
                  className="frequencia-card"
                  key={
                    item.emocao
                  }
                >
                  <div
                    className="frequencia-cor"
                    style={{
                      backgroundColor:
                        obterCorEmocao(
                          item.emocao
                        ),
                    }}
                  />

                  <span>
                    {
                      item.emocao
                    }
                  </span>

                  <strong>
                    {
                      item.quantidade
                    }
                  </strong>

                  <small>
                    {
                      percentual.toFixed(
                        1
                      )
                    }%
                  </small>

                </div>
              )
            }
          )}

        </div>

      </div>
    )
  }

  // =========================================
  // RELATÓRIO 006
  // RESUMO DO PERÍODO
  // =========================================

  if (
    tipoRelatorio === '006'
  ) {
    const primeiro =
      registrosPeriodo[0]

    const ultimo =
      registrosPeriodo[
        registrosPeriodo.length -
          1
      ]

    return (
      <div className="visualizacao-relatorio">

        <ResumoGeral
          total={
            totalRegistros
          }
          quantidadeEmocoes={
            emocoes.length
          }
          predominante={
            emocaoPredominante
          }
        />

        <div className="resumo-periodo-grid">

          <div className="resumo-periodo-card">
            <span>
              PERÍODO
            </span>

            <strong>
              {
                formatarData(
                  dataInicio
                )
              }
            </strong>

            <small>
              até{' '}
              {
                formatarData(
                  dataFim
                )
              }
            </small>
          </div>

          <div className="resumo-periodo-card">
            <span>
              PRIMEIRO REGISTRO
            </span>

            <strong>
              {
                primeiro
                  ?.Selection_Type
              }
            </strong>

            <small>
              {
                primeiro
                  ?.Date_Time_Selection
                  ? formatarData(
                      obterDataRegistro(
                        primeiro
                          .Date_Time_Selection
                      )
                    )
                  : '-'
              }
            </small>
          </div>

          <div className="resumo-periodo-card">
            <span>
              ÚLTIMO REGISTRO
            </span>

            <strong>
              {
                ultimo
                  ?.Selection_Type
              }
            </strong>

            <small>
              {
                ultimo
                  ?.Date_Time_Selection
                  ? formatarData(
                      obterDataRegistro(
                        ultimo
                          .Date_Time_Selection
                      )
                    )
                  : '-'
              }
            </small>
          </div>

        </div>

        <div className="resumo-distribuicao">

          <h3>
            Distribuição emocional
          </h3>

          {ranking.map(
            (item) => (
              <div
                className="resumo-distribuicao-item"
                key={
                  item.emocao
                }
              >
                <span
                  className="emocao-indicador"
                  style={{
                    backgroundColor:
                      obterCorEmocao(
                        item.emocao
                      ),
                  }}
                />

                <strong>
                  {
                    item.emocao
                  }
                </strong>

                <span>
                  {
                    item.quantidade
                  }{' '}
                  registros
                </span>

              </div>
            )
          )}

        </div>

      </div>
    )
  }

  return null
}

// =========================================
// RESUMO COMPARTILHADO
// =========================================

function ResumoGeral({
  total,
  quantidadeEmocoes,
  predominante,
}) {
  return (
    <div className="relatorio-resumo-geral">

      <div>
        <span>
          REGISTROS
        </span>

        <strong>
          {total}
        </strong>
      </div>

      <div>
        <span>
          EMOÇÕES
        </span>

        <strong>
          {quantidadeEmocoes}
        </strong>
      </div>

      <div>
        <span>
          PREDOMINANTE
        </span>

        <strong>
          {predominante}
        </strong>
      </div>

    </div>
  )
}

export default VisualizacaoRelatorio