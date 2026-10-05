import {
  useEffect,
  useState,
} from 'react'

import {
  buscarNotasPorPaciente,
  criarNota,
  atualizarNota,
  excluirNota,
} from '../../services/notaService'

import {
  buscarPsicologoLogado,
} from '../../services/authService'

const NOMES_RELATORIOS = {
  '001': 'Comparativo semanal de emoções',
  '002': 'Emoções predominantes',
  '003': 'Emoções por horário do dia',
  '004': 'Evolução emocional',
  '005': 'Frequência emocional',
  '006': 'Resumo emocional do período',
}

function BlocoNotas({
  paciente,
  tipoRelatorio = null,
  limiteInicial = null,
  modoResumo = false,
}) {
  const [
    notas,
    setNotas,
  ] = useState([])

  const [
    texto,
    setTexto,
  ] = useState('')

  const [
    notaEmEdicao,
    setNotaEmEdicao,
  ] = useState(null)

  const [
    psicologoLogado,
    setPsicologoLogado,
  ] = useState(null)

  const [
    carregando,
    setCarregando,
  ] = useState(false)

  const [
    salvando,
    setSalvando,
  ] = useState(false)

  const [
    erro,
    setErro,
  ] = useState('')

  const [
    mostrarTodas,
    setMostrarTodas,
  ] = useState(false)

  // =========================================
  // CARREGAR PSICÓLOGO LOGADO
  // =========================================

  useEffect(() => {
    async function carregarPsicologo() {
      try {
        const dados =
          await buscarPsicologoLogado()

        setPsicologoLogado(
          dados || null
        )
      } catch (error) {
        console.error(
          'Erro ao identificar psicólogo logado:',
          error
        )

        setPsicologoLogado(null)
      }
    }

    carregarPsicologo()
  }, [])

  // =========================================
  // CARREGAR NOTAS
  // =========================================

  useEffect(() => {
    async function carregarNotas() {
      if (!paciente?.id) {
        setNotas([])
        return
      }

      try {
        setCarregando(true)
        setErro('')
        setMostrarTodas(false)
        setNotaEmEdicao(null)
        setTexto('')

        const dados =
          await buscarNotasPorPaciente(
            paciente.id
          )

        setNotas(dados)
      } catch (error) {
        console.error(
          'Erro ao carregar notas:',
          error
        )

        setErro(
          'Não foi possível carregar as anotações.'
        )
      } finally {
        setCarregando(false)
      }
    }

    carregarNotas()
  }, [paciente?.id])

  // =========================================
  // VERIFICAR SE A NOTA É DO PSICÓLOGO
  // =========================================

  function notaEhDoPsicologoLogado(
    nota
  ) {
    if (
      !nota?.psicologoId ||
      !psicologoLogado?.Psychologist_ID
    ) {
      return false
    }

    return (
      String(nota.psicologoId) ===
      String(
        psicologoLogado.Psychologist_ID
      )
    )
  }

  // =========================================
  // SALVAR NOTA
  // =========================================

  async function salvarNota() {
    const textoLimpo =
      texto.trim()

    if (!textoLimpo) {
      setErro(
        'Digite uma anotação antes de salvar.'
      )

      return
    }

    if (!paciente?.id) {
      return
    }

    try {
      setSalvando(true)
      setErro('')

      // =====================================
      // EDITANDO NOTA EXISTENTE
      // =====================================

      if (notaEmEdicao) {
        if (
          !notaEhDoPsicologoLogado(
            notaEmEdicao
          )
        ) {
          setErro(
            'Você só pode editar anotações criadas por você.'
          )

          return
        }

        const notaAtualizada =
          await atualizarNota(
            notaEmEdicao.id,
            textoLimpo
          )

        setNotas(
          (notasAtuais) =>
            notasAtuais.map(
              (nota) =>
                nota.id ===
                notaAtualizada.id
                  ? notaAtualizada
                  : nota
            )
        )

        setNotaEmEdicao(null)
      }

      // =====================================
      // CRIANDO NOVA NOTA
      // =====================================

      else {
        const novaNota =
          await criarNota({
            pacienteId:
              paciente.id,

            texto:
              textoLimpo,

            origem:
              tipoRelatorio
                ? 'relatorio'
                : 'paciente',

            tipoRelatorio:
              tipoRelatorio,
          })

        setNotas(
          (notasAtuais) => [
            novaNota,
            ...notasAtuais,
          ]
        )
      }

      setTexto('')
    } catch (error) {
      console.error(
        'Erro ao salvar nota:',
        error
      )

      setErro(
        'Não foi possível salvar a anotação.'
      )
    } finally {
      setSalvando(false)
    }
  }

  // =========================================
  // INICIAR EDIÇÃO
  // =========================================

  function iniciarEdicao(
    nota
  ) {
    if (
      !notaEhDoPsicologoLogado(
        nota
      )
    ) {
      setErro(
        'Você só pode editar anotações criadas por você.'
      )

      return
    }

    setNotaEmEdicao(nota)
    setTexto(nota.texto)
    setErro('')
  }

  // =========================================
  // CANCELAR EDIÇÃO
  // =========================================

  function cancelarEdicao() {
    setNotaEmEdicao(null)
    setTexto('')
    setErro('')
  }

  // =========================================
  // EXCLUIR NOTA
  // =========================================

  async function removerNota(
    nota
  ) {
    if (
      !notaEhDoPsicologoLogado(
        nota
      )
    ) {
      setErro(
        'Você só pode excluir anotações criadas por você.'
      )

      return
    }

    const confirmou =
      window.confirm(
        'Deseja realmente excluir esta anotação?'
      )

    if (!confirmou) {
      return
    }

    try {
      setErro('')

      await excluirNota(
        nota.id
      )

      setNotas(
        (notasAtuais) =>
          notasAtuais.filter(
            (item) =>
              item.id !== nota.id
          )
      )

      if (
        notaEmEdicao?.id ===
        nota.id
      ) {
        cancelarEdicao()
      }
    } catch (error) {
      console.error(
        'Erro ao excluir nota:',
        error
      )

      setErro(
        'Não foi possível excluir a anotação.'
      )
    }
  }

  // =========================================
  // FORMATAR DATA
  // =========================================

  function formatarData(
    data
  ) {
    if (!data) {
      return ''
    }

    return new Date(
      data
    ).toLocaleString(
      'pt-BR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    )
  }

  // =========================================
  // ORIGEM DA NOTA
  // =========================================

  function obterOrigemNota(
    nota
  ) {
    if (
      nota.origem === 'relatorio' &&
      nota.tipoRelatorio
    ) {
      const nome =
        NOMES_RELATORIOS[
          nota.tipoRelatorio
        ]

      if (nome) {
        return `Relatório ${nota.tipoRelatorio} — ${nome}`
      }

      return `Relatório ${nota.tipoRelatorio}`
    }

    return 'Anotação do paciente'
  }

  // =========================================
  // RESUMO / EXPANSÃO
  // =========================================

  const notasVisiveis =
    limiteInicial &&
    !mostrarTodas
      ? notas.slice(
          0,
          limiteInicial
        )
      : notas

  const possuiMaisNotas =
    Boolean(
      limiteInicial &&
      notas.length > limiteInicial
    )

  const mostrarEditor =
    !modoResumo ||
    mostrarTodas

  // =========================================
  // SEM PACIENTE
  // =========================================

  if (!paciente) {
    return null
  }

  // =========================================
  // TELA
  // =========================================

  return (
    <section className="bloco-notas">

      {/* =====================================
          CABEÇALHO
      ===================================== */}

      <div className="bloco-notas-cabecalho">

        <div>

          <span className="bloco-notas-etiqueta">
            ANOTAÇÕES
          </span>

          <h3>
            {modoResumo
              ? 'Anotações recentes'
              : 'Bloco de notas'}
          </h3>

          <p>
            {modoResumo
              ? 'Acompanhamento e observações registradas sobre o paciente.'
              : paciente.nome}
          </p>

        </div>

      </div>

      {/* =====================================
          EDITOR
      ===================================== */}

      {mostrarEditor && (
        <div className="bloco-notas-editor">

          <textarea
            value={texto}
            onChange={(event) =>
              setTexto(
                event.target.value
              )
            }
            placeholder={
              notaEmEdicao
                ? 'Edite a anotação...'
                : 'Escreva uma anotação sobre o paciente...'
            }
            rows={4}
          />

          {erro && (
            <p className="bloco-notas-erro">
              {erro}
            </p>
          )}

          <div className="bloco-notas-editor-acoes">

            {notaEmEdicao && (
              <button
                type="button"
                className="bloco-notas-cancelar"
                onClick={
                  cancelarEdicao
                }
                disabled={
                  salvando
                }
              >
                Cancelar
              </button>
            )}

            <button
              type="button"
              className="bloco-notas-salvar"
              onClick={
                salvarNota
              }
              disabled={
                salvando
              }
            >
              {salvando
                ? 'Salvando...'
                : notaEmEdicao
                  ? 'Salvar alteração'
                  : '+ Adicionar anotação'}
            </button>

          </div>

        </div>
      )}

      {!mostrarEditor &&
        erro && (
          <p className="bloco-notas-erro">
            {erro}
          </p>
        )}

      {/* =====================================
          LISTA DE ANOTAÇÕES
      ===================================== */}

      <div className="bloco-notas-lista">

        {carregando && (
          <p className="bloco-notas-mensagem">
            Carregando anotações...
          </p>
        )}

        {!carregando &&
          notas.length === 0 && (
            <div className="bloco-notas-vazio">

              <span>
                📝
              </span>

              <strong>
                Nenhuma anotação
              </strong>

              <p>
                As anotações deste
                paciente aparecerão
                aqui.
              </p>

            </div>
          )}

        {!carregando &&
          notasVisiveis.map(
            (nota) => {
              const ehAutor =
                notaEhDoPsicologoLogado(
                  nota
                )

              return (
                <article
                  className="bloco-notas-item"
                  key={
                    nota.id
                  }
                >

                  {/* ORIGEM */}

                  <div className="bloco-notas-origem">
                    {obterOrigemNota(
                      nota
                    )}
                  </div>

                  {/* CABEÇALHO DA NOTA */}

                  <div className="bloco-notas-item-topo">

                    <div>

                      <strong>
                        {nota.psicologoNome ||
                          'Psicólogo'}
                      </strong>

                      <span>
                        {formatarData(
                          nota.criadoEm
                        )}
                      </span>

                    </div>

                    {/* =================================
                        EDITAR / EXCLUIR

                        Só aparecem quando a nota
                        pertence ao psicólogo logado.
                    ================================= */}

                    {ehAutor && (
                      <div className="bloco-notas-item-acoes">

                        <button
                          type="button"
                          onClick={() =>
                            iniciarEdicao(
                              nota
                            )
                          }
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className="bloco-notas-excluir"
                          onClick={() =>
                            removerNota(
                              nota
                            )
                          }
                        >
                          Excluir
                        </button>

                      </div>
                    )}

                  </div>

                  {/* TEXTO */}

                  <p className="bloco-notas-texto">
                    {nota.texto}
                  </p>

                  {/* DATA DE EDIÇÃO */}

                  {nota.atualizadoEm &&
                    nota.atualizadoEm !==
                      nota.criadoEm && (
                      <small className="bloco-notas-editado">
                        Editado em{' '}
                        {formatarData(
                          nota.atualizadoEm
                        )}
                      </small>
                    )}

                </article>
              )
            }
          )}

      </div>

      {/* =====================================
          VER TODAS / MOSTRAR MENOS
      ===================================== */}

      {possuiMaisNotas && (
        <div className="bloco-notas-expandir">

          <button
            type="button"
            onClick={() => {
              setMostrarTodas(
                (valor) => !valor
              )

              setNotaEmEdicao(null)
              setTexto('')
              setErro('')
            }}
          >
            {mostrarTodas
              ? 'Mostrar menos ↑'
              : `Ver todas as anotações (${notas.length}) ↓`}
          </button>

        </div>
      )}

    </section>
  )
}

export default BlocoNotas