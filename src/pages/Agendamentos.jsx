import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

import {
  buscarPacientes,
  buscarAgendamentos,
  criarAgendamento,
  atualizarAgendamento,
  excluirAgendamento,
} from '../services/agendaService'

import {
  buscarPsicologoLogado,
} from '../services/authService'

import ListaPacientes
  from '../components/agenda/ListaPacientes'

import CalendarioMensal
  from '../components/agenda/CalendarioMensal'

import ModalAgendaDia
  from '../components/agenda/ModalAgendaDia'

import ModalNovoAgendamento
  from '../components/agenda/ModalNovoAgendamento'

import ConfirmacaoAgendamento
  from '../components/agenda/ConfirmacaoAgendamento'

function Agendamentos() {
  const navigate = useNavigate()

  // =========================================
  // DADOS
  // =========================================

  const [
    pacientes,
    setPacientes,
  ] = useState([])

  const [
    agendamentos,
    setAgendamentos,
  ] = useState([])

  const [
    psicologo,
    setPsicologo,
  ] = useState(null)

  // =========================================
  // PACIENTES
  // =========================================

  const [
    pesquisa,
    setPesquisa,
  ] = useState('')

  const [
    pacienteSelecionado,
    setPacienteSelecionado,
  ] = useState(null)

  // =========================================
  // FILTROS DA AGENDA
  // =========================================

  const [
    filtroResponsavel,
    setFiltroResponsavel,
  ] = useState('todos')

  const [
    pesquisaPsicologo,
    setPesquisaPsicologo,
  ] = useState('')

  const [
    mostrarSugestoesPsicologo,
    setMostrarSugestoesPsicologo,
  ] = useState(false)

  // =========================================
  // CALENDÁRIO
  // =========================================

  const hoje = new Date()

  const [
    dataCalendario,
    setDataCalendario,
  ] = useState(
    new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      1
    )
  )

  // =========================================
  // MODAIS
  // =========================================

  const [
    diaSelecionado,
    setDiaSelecionado,
  ] = useState(null)

  const [
    mostrarNovoAgendamento,
    setMostrarNovoAgendamento,
  ] = useState(false)

  const [
    dadosIniciaisAgendamento,
    setDadosIniciaisAgendamento,
  ] = useState({})

  const [
    agendamentoEmEdicao,
    setAgendamentoEmEdicao,
  ] = useState(null)

  const [
    agendamentoConfirmado,
    setAgendamentoConfirmado,
  ] = useState(null)

  // =========================================
  // CARREGAR DADOS
  // =========================================

  useEffect(() => {
    async function carregarDados() {
      try {
        const [
          pacientesRecebidos,
          agendamentosRecebidos,
          psicologoRecebido,
        ] = await Promise.all([
          buscarPacientes(),
          buscarAgendamentos(),
          buscarPsicologoLogado(),
        ])

        setPacientes(
          pacientesRecebidos
        )

        setAgendamentos(
          agendamentosRecebidos
        )

        setPsicologo(
          psicologoRecebido
        )
      } catch (erro) {
        console.error(
          'Erro ao carregar agenda:',
          erro
        )
      }
    }

    carregarDados()
  }, [])

  // =========================================
  // RESPONSÁVEIS DISPONÍVEIS
  // =========================================

  const responsaveis =
    useMemo(() => {
      const mapa =
        new Map()

      agendamentos.forEach(
        (agendamento) => {
          if (
            agendamento.criadoPorId &&
            agendamento.criadoPorNome
          ) {
            mapa.set(
              agendamento.criadoPorId,
              agendamento.criadoPorNome
            )
          }
        }
      )

      return Array.from(
        mapa.entries()
      )
        .map(
          ([
            id,
            nome,
          ]) => ({
            id,
            nome,
          })
        )
        .sort((a, b) =>
          a.nome.localeCompare(
            b.nome,
            'pt-BR'
          )
        )
    }, [agendamentos])

  // =========================================
  // PESQUISA DE PSICÓLOGOS
  // =========================================

  const psicologosEncontrados =
    useMemo(() => {
      const termo =
        pesquisaPsicologo
          .trim()
          .toLocaleLowerCase(
            'pt-BR'
          )

      if (!termo) {
        return responsaveis
      }

      return responsaveis.filter(
        (responsavel) =>
          responsavel.nome
            .toLocaleLowerCase(
              'pt-BR'
            )
            .includes(termo)
      )
    }, [
      pesquisaPsicologo,
      responsaveis,
    ])

  function selecionarPsicologo(
    responsavel
  ) {
    setFiltroResponsavel(
      responsavel.id
    )

    setPesquisaPsicologo(
      responsavel.nome
    )

    setMostrarSugestoesPsicologo(
      false
    )
  }

  function limparPesquisaPsicologo() {
    setPesquisaPsicologo('')

    setFiltroResponsavel(
      'todos'
    )

    setMostrarSugestoesPsicologo(
      false
    )
  }

  function mostrarTodos() {
    setFiltroResponsavel(
      'todos'
    )

    setPesquisaPsicologo('')

    setMostrarSugestoesPsicologo(
      false
    )
  }

  function mostrarMeusAgendamentos() {
    setFiltroResponsavel(
      'meus'
    )

    setPesquisaPsicologo('')

    setMostrarSugestoesPsicologo(
      false
    )
  }

  // =========================================
  // AGENDAMENTOS FILTRADOS
  // =========================================

  const agendamentosFiltrados =
    useMemo(() => {
      if (
        filtroResponsavel ===
        'todos'
      ) {
        return agendamentos
      }

      if (
        filtroResponsavel ===
        'meus'
      ) {
        if (
          !psicologo?.Psychologist_ID
        ) {
          return []
        }

        return agendamentos.filter(
          (agendamento) =>
            agendamento.criadoPorId ===
            psicologo.Psychologist_ID
        )
      }

      return agendamentos.filter(
        (agendamento) =>
          agendamento.criadoPorId ===
          filtroResponsavel
      )
    }, [
      agendamentos,
      filtroResponsavel,
      psicologo,
    ])

  // =========================================
  // INFORMAÇÃO DO FILTRO
  // =========================================

  function descricaoFiltro() {
    if (
      filtroResponsavel ===
      'meus'
    ) {
      return 'Exibindo somente os agendamentos criados por você.'
    }

    if (
      filtroResponsavel !==
      'todos'
    ) {
      const responsavel =
        responsaveis.find(
          (item) =>
            item.id ===
            filtroResponsavel
        )

      if (responsavel) {
        return `Exibindo agendamentos criados por ${responsavel.nome}.`
      }
    }

    if (pacienteSelecionado) {
      return 'Exibindo somente os agendamentos deste paciente.'
    }

    return 'Selecione um paciente ou visualize a agenda completa.'
  }

  // =========================================
  // NAVEGAÇÃO
  // =========================================

  function voltarDashboard() {
    navigate('/dashboard')
  }

  function abrirPerfil() {
    navigate('/perfil')
  }

  // =========================================
  // CALENDÁRIO
  // =========================================

  function mesAnterior() {
    setDataCalendario(
      (dataAtual) =>
        new Date(
          dataAtual.getFullYear(),
          dataAtual.getMonth() - 1,
          1
        )
    )
  }

  function proximoMes() {
    setDataCalendario(
      (dataAtual) =>
        new Date(
          dataAtual.getFullYear(),
          dataAtual.getMonth() + 1,
          1
        )
    )
  }

  // =========================================
  // AGENDA DO DIA
  // =========================================

  function abrirDia(data) {
    setDiaSelecionado(data)
  }

  function fecharDia() {
    setDiaSelecionado(null)
  }

  // =========================================
  // NOVO AGENDAMENTO
  // =========================================

  function abrirNovoAgendamento(
    dadosIniciais = {}
  ) {
    setAgendamentoEmEdicao(
      null
    )

    setDadosIniciaisAgendamento(
      dadosIniciais
    )

    setDiaSelecionado(null)

    setMostrarNovoAgendamento(
      true
    )
  }

  function fecharFormularioAgendamento() {
    setMostrarNovoAgendamento(
      false
    )

    setDadosIniciaisAgendamento(
      {}
    )

    setAgendamentoEmEdicao(
      null
    )
  }

  // =========================================
  // EDITAR AGENDAMENTO
  // =========================================

  function abrirEdicaoAgendamento(
    agendamento
  ) {
    setAgendamentoEmEdicao(
      agendamento
    )

    setDadosIniciaisAgendamento({
      pacienteId:
        agendamento.pacienteId,

      data:
        agendamento.data,

      horario:
        agendamento.horario,

      duracao:
        agendamento.duracao,

      observacao:
        agendamento.observacao ||
        '',
    })

    setDiaSelecionado(null)

    setMostrarNovoAgendamento(
      true
    )
  }

  // =========================================
  // CRIAR AGENDAMENTO
  // =========================================

  async function confirmarNovoAgendamento(
    novoAgendamento
  ) {
    try {
      const agendamentoCriado =
        await criarAgendamento(
          novoAgendamento
        )

      const agendamentosAtualizados =
        await buscarAgendamentos()

      setAgendamentos(
        agendamentosAtualizados
      )

      setMostrarNovoAgendamento(
        false
      )

      setDadosIniciaisAgendamento(
        {}
      )

      setAgendamentoEmEdicao(
        null
      )

      setAgendamentoConfirmado(
        agendamentoCriado
      )
    } catch (erro) {
      console.error(
        'Erro ao criar agendamento:',
        erro
      )
    }
  }

  // =========================================
  // EXCLUIR AGENDAMENTO
  // =========================================

  async function removerAgendamento(
    agendamentoId
  ) {
    try {
      await excluirAgendamento(
        agendamentoId
      )

      const agendamentosAtualizados =
        await buscarAgendamentos()

      setAgendamentos(
        agendamentosAtualizados
      )
    } catch (erro) {
      console.error(
        'Erro ao excluir agendamento:',
        erro
      )

      throw erro
    }
  }

  // =========================================
  // SALVAR AGENDAMENTO
  // =========================================

  async function salvarAgendamento(
    dadosAgendamento
  ) {
    if (agendamentoEmEdicao) {
      try {
        await atualizarAgendamento(
          agendamentoEmEdicao.id,
          dadosAgendamento
        )

        const agendamentosAtualizados =
          await buscarAgendamentos()

        setAgendamentos(
          agendamentosAtualizados
        )

        setMostrarNovoAgendamento(
          false
        )

        setDadosIniciaisAgendamento(
          {}
        )

        setAgendamentoEmEdicao(
          null
        )
      } catch (erro) {
        console.error(
          'Erro ao atualizar agendamento:',
          erro
        )
      }

      return
    }

    await confirmarNovoAgendamento(
      dadosAgendamento
    )
  }

  // =========================================
  // CONFIRMAÇÃO
  // =========================================

  function fecharConfirmacao() {
    setAgendamentoConfirmado(
      null
    )
  }

  const pacienteConfirmado =
    agendamentoConfirmado
      ? pacientes.find(
          (paciente) =>
            paciente.id ===
            agendamentoConfirmado.pacienteId
        )
      : null

  // =========================================
  // TELA
  // =========================================

  return (
    <main className="pagina-agendamentos">

      {/* BARRA SUPERIOR */}

      <header className="dashboard-header">

        <div className="dashboard-marca">
          SENSUS-MAP
        </div>

        <nav className="dashboard-nav">

          <Link to="/dashboard">
            Início
          </Link>

          <Link to="/pacientes">
            Pacientes
          </Link>

          <Link
            to="/agendamentos"
            className="nav-ativo"
          >
            Agenda
          </Link>

          <Link to="/relatorios">
            Relatórios
          </Link>

        </nav>

        <div className="dashboard-usuario">

          <span>
            {psicologo?.Name ||
              'Psicólogo'}
          </span>

          <button
            type="button"
            className="botao-perfil"
            onClick={abrirPerfil}
          >
            Perfil
          </button>

        </div>

      </header>

      {/* CONTEÚDO DA AGENDA */}

      <section className="agenda-pagina-conteudo">

        {/* FILTROS */}

        <div className="agenda-filtros-gerais">

          <div className="agenda-filtros-botoes">

            <button
              type="button"
              className={
                filtroResponsavel ===
                'todos'
                  ? 'agenda-filtro-botao agenda-filtro-botao-ativo'
                  : 'agenda-filtro-botao'
              }
              onClick={
                mostrarTodos
              }
            >
              Todos
            </button>

            <button
              type="button"
              className={
                filtroResponsavel ===
                'meus'
                  ? 'agenda-filtro-botao agenda-filtro-botao-ativo'
                  : 'agenda-filtro-botao'
              }
              onClick={
                mostrarMeusAgendamentos
              }
            >
              Meus agendamentos
            </button>

          </div>

          {/* PESQUISA DE PSICÓLOGO */}

          <div className="agenda-pesquisa-psicologo">

            <div className="agenda-pesquisa-campo">

              <span className="agenda-pesquisa-icone">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Pesquisar psicólogo..."
                value={
                  pesquisaPsicologo
                }
                onFocus={() =>
                  setMostrarSugestoesPsicologo(
                    true
                  )
                }
                onChange={(event) => {
                  setPesquisaPsicologo(
                    event.target.value
                  )

                  setMostrarSugestoesPsicologo(
                    true
                  )

                  if (
                    filtroResponsavel !==
                      'todos' &&
                    filtroResponsavel !==
                      'meus'
                  ) {
                    setFiltroResponsavel(
                      'todos'
                    )
                  }
                }}
              />

              {pesquisaPsicologo && (
                <button
                  type="button"
                  className="agenda-pesquisa-limpar"
                  onClick={
                    limparPesquisaPsicologo
                  }
                  aria-label="Limpar pesquisa"
                >
                  ×
                </button>
              )}

            </div>

            {mostrarSugestoesPsicologo && (
              <div className="agenda-pesquisa-resultados">

                {psicologosEncontrados.length >
                0 ? (
                  psicologosEncontrados.map(
                    (responsavel) => (
                      <button
                        type="button"
                        key={
                          responsavel.id
                        }
                        className="agenda-pesquisa-resultado"
                        onClick={() =>
                          selecionarPsicologo(
                            responsavel
                          )
                        }
                      >
                        <span className="agenda-pesquisa-avatar">
                          {responsavel.nome
                            .charAt(0)
                            .toUpperCase()}
                        </span>

                        <span>
                          {
                            responsavel.nome
                          }
                        </span>
                      </button>
                    )
                  )
                ) : (
                  <div className="agenda-pesquisa-vazio">
                    Nenhum psicólogo encontrado.
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

        {/* AGENDA */}

        <section className="agenda-container">

          <ListaPacientes
            pacientes={
              pacientes
            }
            pesquisa={
              pesquisa
            }
            setPesquisa={
              setPesquisa
            }
            pacienteSelecionado={
              pacienteSelecionado
            }
            setPacienteSelecionado={
              setPacienteSelecionado
            }
            onVoltar={
              voltarDashboard
            }
          />

          <section className="agenda-calendario">

            <div className="agenda-calendario-cabecalho">

              <div>

                <span>
                  CALENDÁRIO
                </span>

                <h2>
                  {pacienteSelecionado
                    ? `Agenda de ${pacienteSelecionado.nome}`
                    : 'Todos os agendamentos'}
                </h2>

                <p>
                  {descricaoFiltro()}
                </p>

              </div>

              <button
                type="button"
                className="agenda-novo"
                onClick={() => {
                  abrirNovoAgendamento({
                    pacienteId:
                      pacienteSelecionado?.id ||
                      null,
                  })
                }}
              >
                + Novo agendamento
              </button>

            </div>

            <CalendarioMensal
              dataCalendario={
                dataCalendario
              }
              agendamentos={
                agendamentosFiltrados
              }
              pacienteSelecionado={
                pacienteSelecionado
              }
              onMesAnterior={
                mesAnterior
              }
              onProximoMes={
                proximoMes
              }
              onAbrirDia={
                abrirDia
              }
            />

          </section>

        </section>

      </section>

      {/* MODAL DO DIA */}

      {diaSelecionado && (
        <ModalAgendaDia
          diaSelecionado={
            diaSelecionado
          }
          pacientes={
            pacientes
          }
          agendamentos={
            agendamentosFiltrados
          }
          pacienteSelecionado={
            pacienteSelecionado
          }
          onFechar={
            fecharDia
          }
          onCriarAgendamento={
            abrirNovoAgendamento
          }
          onEditarAgendamento={
            abrirEdicaoAgendamento
          }
          onExcluirAgendamento={
            removerAgendamento
          }
        />
      )}

      {/* FORMULÁRIO */}

      {mostrarNovoAgendamento && (
        <ModalNovoAgendamento
          pacientes={
            pacientes
          }
          dadosIniciais={
            dadosIniciaisAgendamento
          }
          modo={
            agendamentoEmEdicao
              ? 'editar'
              : 'criar'
          }
          onCancelar={
            fecharFormularioAgendamento
          }
          onConfirmar={
            salvarAgendamento
          }
        />
      )}

      {/* CONFIRMAÇÃO */}

      {agendamentoConfirmado && (
        <ConfirmacaoAgendamento
          agendamento={
            agendamentoConfirmado
          }
          paciente={
            pacienteConfirmado
          }
          onVoltar={
            fecharConfirmacao
          }
        />
      )}

    </main>
  )
}

export default Agendamentos