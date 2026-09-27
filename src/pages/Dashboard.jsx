import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  buscarPacientes,
  buscarAgendamentos,
} from '../services/agendaService'

function Dashboard() {
  const navigate = useNavigate()

  const [modalAberto, setModalAberto] = useState(false)
  const [pesquisa, setPesquisa] = useState('')
  const [pacienteSelecionado, setPacienteSelecionado] =
    useState(null)

  const [pacientes, setPacientes] = useState([])
  const [agendamentos, setAgendamentos] = useState([])

  // =========================
  // CARREGAR DADOS
  // =========================

  useEffect(() => {
    async function carregarDados() {
      const pacientesRecebidos =
        await buscarPacientes()

      const agendamentosRecebidos =
        await buscarAgendamentos()

      setPacientes(pacientesRecebidos)
      setAgendamentos(agendamentosRecebidos)
    }

    carregarDados()
  }, [])

  // =========================
  // PACIENTES
  // =========================

  const pacientesFiltrados = pacientes.filter(
    (paciente) =>
      paciente.nome
        .toLowerCase()
        .includes(pesquisa.toLowerCase())
  )

  function abrirModalPacientes() {
    setModalAberto(true)
  }

  function fecharModalPacientes() {
    setModalAberto(false)
    setPesquisa('')
  }

  function selecionarPaciente(paciente) {
    setPacienteSelecionado(paciente)
    setModalAberto(false)
    setPesquisa('')
  }

  // =========================
  // NAVEGAÇÃO
  // =========================

  function abrirAgenda() {
    navigate('/agendamentos')
  }

  function abrirPacienteSelecionado() {
    if (!pacienteSelecionado) {
      return
    }

    navigate('/pacientes')
  }

  // =========================
  // PRÓXIMOS AGENDAMENTOS
  // =========================

  const hoje = new Date()

  const dataHoje = [
    hoje.getFullYear(),
    String(hoje.getMonth() + 1).padStart(2, '0'),
    String(hoje.getDate()).padStart(2, '0'),
  ].join('-')

  const proximosAgendamentos = agendamentos
    .filter(
      (agendamento) =>
        agendamento.data >= dataHoje
    )
    .sort((a, b) => {
      const dataA =
        `${a.data} ${a.horario}`

      const dataB =
        `${b.data} ${b.horario}`

      return dataA.localeCompare(dataB)
    })
    .slice(0, 3)

  function buscarNomePaciente(pacienteId) {
    const paciente = pacientes.find(
      (item) => item.id === pacienteId
    )

    return paciente?.nome || 'Paciente'
  }

  function formatarData(data) {
    const [ano, mes, dia] = data
      .split('-')
      .map(Number)

    return new Date(
      ano,
      mes - 1,
      dia
    ).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    })
  }

  return (
    <main className="pagina-dashboard">

      {/* =========================
          CABEÇALHO
      ========================== */}

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

          <Link to="/agendamentos">
            Agenda
          </Link>

          <a href="#">
            Relatórios
          </a>
        </nav>

        <div className="dashboard-usuario">
          <span>Psicólogo</span>

          <button
            type="button"
            className="botao-perfil"
          >
            Perfil
          </button>
        </div>
      </header>

      {/* =========================
          CONTEÚDO
      ========================== */}

      <section className="dashboard-conteudo">

        {/* =========================
            PAINEL PRINCIPAL
        ========================== */}

        <section className="dashboard-principal">

          <div className="titulo-dashboard">
            <span>PAINEL</span>

            <h1>
              Bem-vindo ao SENSUS-MAP
            </h1>

            <p>
              Acompanhe seus pacientes e tenha acesso
              rápido às principais informações.
            </p>
          </div>

          {/* =========================
              PACIENTE
          ========================== */}

          {!pacienteSelecionado ? (
            <section className="dashboard-paciente-vazio">

              <div className="dashboard-avatar-vazio">
                +
              </div>

              <div className="dashboard-paciente-vazio-texto">
                <span>
                  PACIENTE
                </span>

                <h2>
                  Nenhum paciente selecionado
                </h2>

                <p>
                  Selecione um paciente para visualizar
                  suas informações, emoções, histórico
                  e relatórios.
                </p>

                <button
                  type="button"
                  className="dashboard-selecionar"
                  onClick={abrirModalPacientes}
                >
                  Selecionar paciente
                </button>
              </div>

            </section>
          ) : (
            <section className="dashboard-paciente-selecionado">

              <div className="dashboard-paciente-topo">

                <div className="dashboard-paciente-avatar">
                  {pacienteSelecionado.nome.charAt(0)}
                </div>

                <div className="dashboard-paciente-identidade">
                  <span>
                    PACIENTE SELECIONADO
                  </span>

                  <h2>
                    {pacienteSelecionado.nome}
                  </h2>

                  <p>
                    Acesse as informações e o
                    acompanhamento deste paciente.
                  </p>
                </div>

                <button
                  type="button"
                  className="dashboard-trocar-paciente"
                  onClick={abrirModalPacientes}
                >
                  Trocar paciente
                </button>

              </div>

              {/* AÇÕES SÓ APARECEM
                  DEPOIS DA SELEÇÃO */}

              <div className="dashboard-paciente-acoes">

                <button
                  type="button"
                  onClick={abrirPacienteSelecionado}
                >
                  <span className="dashboard-acao-icone">
                    ◉
                  </span>

                  <div>
                    <strong>
                      Ver dados
                    </strong>

                    <small>
                      Informações do paciente
                    </small>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={abrirPacienteSelecionado}
                >
                  <span className="dashboard-acao-icone">
                    ♡
                  </span>

                  <div>
                    <strong>
                      Emoções
                    </strong>

                    <small>
                      Visualizar registros
                    </small>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={abrirPacienteSelecionado}
                >
                  <span className="dashboard-acao-icone">
                    ◷
                  </span>

                  <div>
                    <strong>
                      Histórico
                    </strong>

                    <small>
                      Acompanhar evolução
                    </small>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={abrirPacienteSelecionado}
                >
                  <span className="dashboard-acao-icone">
                    ≡
                  </span>

                  <div>
                    <strong>
                      Relatórios
                    </strong>

                    <small>
                      Consultar relatórios
                    </small>
                  </div>
                </button>

              </div>

            </section>
          )}

        </section>

        {/* =========================
            PRÓXIMOS AGENDAMENTOS
        ========================== */}

        <aside className="dashboard-agenda">

          <div>
            <h2>
              Próximos agendamentos
            </h2>

            <span className="dashboard-agenda-resumo">
              {proximosAgendamentos.length > 0
                ? `${proximosAgendamentos.length} próximos atendimentos`
                : 'Sua agenda está livre'}
            </span>
          </div>

          {proximosAgendamentos.length > 0 ? (
            <div className="dashboard-lista-agendamentos">

              {proximosAgendamentos.map(
                (agendamento) => (
                  <div
                    className="dashboard-agendamento-item"
                    key={agendamento.id}
                  >
                    <div className="dashboard-agendamento-data">
                      <strong>
                        {formatarData(
                          agendamento.data
                        )}
                      </strong>

                      <span>
                        {agendamento.horario}
                      </span>
                    </div>

                    <div className="dashboard-agendamento-paciente">
                      <strong>
                        {buscarNomePaciente(
                          agendamento.pacienteId
                        )}
                      </strong>

                      <span>
                        {agendamento.duracao} minutos
                      </span>
                    </div>
                  </div>
                )
              )}

            </div>
          ) : (
            <div className="agenda-vazia">
              <p>
                Nenhum agendamento próximo.
              </p>
            </div>
          )}

          <button
            type="button"
            className="ver-agenda"
            onClick={abrirAgenda}
          >
            Ver agenda completa
          </button>

        </aside>

      </section>

      {/* =========================
          MENU FLUTUANTE
      ========================== */}

      <div className="atalhos-dashboard">

        <button
          type="button"
          className="atalho-item"
          onClick={abrirAgenda}
        >
          <span className="atalho-icone">
            +
          </span>

          <span className="atalho-texto">
            Novo agendamento
          </span>
        </button>

        <button
          type="button"
          className="atalho-item"
        >
          <span className="atalho-icone">
            ?
          </span>

          <span className="atalho-texto">
            Ajuda
          </span>
        </button>

        <button
          type="button"
          className="atalho-item"
        >
          <span className="atalho-icone">
            ⚙
          </span>

          <span className="atalho-texto">
            Configurações
          </span>
        </button>

      </div>

      {/* =========================
          MODAL DE PACIENTES
      ========================== */}

      {modalAberto && (
        <div
          className="modal-overlay"
          onClick={fecharModalPacientes}
        >
          <section
            className="modal-pacientes"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-cabecalho">

              <div>
                <span>
                  PACIENTES
                </span>

                <h2>
                  Selecionar paciente
                </h2>
              </div>

              <button
                type="button"
                className="fechar-modal"
                onClick={fecharModalPacientes}
                aria-label="Fechar"
              >
                ×
              </button>

            </div>

            {/* PESQUISA */}

            <div className="campo-pesquisa-paciente">

              <span>
                ⌕
              </span>

              <input
                type="text"
                placeholder="Pesquisar paciente..."
                value={pesquisa}
                onChange={(event) =>
                  setPesquisa(
                    event.target.value
                  )
                }
                autoFocus
              />

            </div>

            {/* LISTA */}

            <div className="lista-pacientes">

              {pacientesFiltrados.length > 0 ? (
                pacientesFiltrados.map(
                  (paciente) => (
                    <button
                      type="button"
                      className="paciente-item"
                      key={paciente.id}
                      onClick={() =>
                        selecionarPaciente(
                          paciente
                        )
                      }
                    >

                      <div className="paciente-avatar">
                        {paciente.nome.charAt(0)}
                      </div>

                      <div className="paciente-dados">
                        <strong>
                          {paciente.nome}
                        </strong>

                        <span>
                          Selecionar paciente
                        </span>
                      </div>

                      <span className="paciente-seta">
                        ›
                      </span>

                    </button>
                  )
                )
              ) : (
                <div className="nenhum-paciente">

                  <strong>
                    Nenhum paciente encontrado
                  </strong>

                  <p>
                    Tente pesquisar outro nome.
                  </p>

                </div>
              )}

            </div>

          </section>
        </div>
      )}

    </main>
  )
}

export default Dashboard