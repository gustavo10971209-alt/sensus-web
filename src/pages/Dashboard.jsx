import { useState } from 'react'
import { Link } from 'react-router-dom'

function Dashboard() {
  const [modalAberto, setModalAberto] = useState(false)
  const [pesquisa, setPesquisa] = useState('')
  const [pacienteSelecionado, setPacienteSelecionado] = useState(null)

  // Dados temporários.
  // Depois vamos substituir pelos pacientes reais do Supabase.
  const pacientes = [
    { id: 1, nome: 'Ana Souza' },
    { id: 2, nome: 'Carlos Silva' },
    { id: 3, nome: 'João Santos' },
    { id: 4, nome: 'Maria Oliveira' },
    { id: 5, nome: 'Pedro Almeida' },
  ]

  const pacientesFiltrados = pacientes.filter((paciente) =>
    paciente.nome.toLowerCase().includes(pesquisa.toLowerCase())
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
          <Link to="/dashboard">Início</Link>
          <a href="#">Pacientes</a>
          <a href="#">Agenda</a>
          <a href="#">Relatórios</a>
        </nav>

        <div className="dashboard-usuario">
          <span>Psicólogo</span>

          <button type="button" className="botao-perfil">
            Perfil
          </button>
        </div>
      </header>

      {/* =========================
          CONTEÚDO
      ========================== */}
      <section className="dashboard-conteudo">
        {/* Painel principal */}
        <section className="dashboard-principal">
          <div className="titulo-dashboard">
            <span>PAINEL</span>

            <h1>Bem-vindo ao SENSUS-MAP</h1>

            <p>
              Acompanhe seus pacientes e tenha acesso rápido às
              principais informações.
            </p>
          </div>

          {/* Paciente */}
          <div className="paciente-dashboard">
            <button
              type="button"
              className="botao-selecionar-paciente"
              onClick={abrirModalPacientes}
            >
              Selecionar paciente
            </button>

            <div className="informacoes-paciente">
              {pacienteSelecionado ? (
                <>
                  <span className="paciente-label">
                    PACIENTE SELECIONADO
                  </span>

                  <h2>{pacienteSelecionado.nome}</h2>

                  <p>
                    Agora você pode visualizar as emoções,
                    o histórico e os relatórios deste paciente.
                  </p>
                </>
              ) : (
                <>
                  <h2>Nenhum paciente selecionado</h2>

                  <p>
                    Selecione um paciente para visualizar
                    suas informações.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Ações */}
          <div className="acoes-dashboard">
            <button
              type="button"
              className="botao-secundario"
              onClick={abrirModalPacientes}
            >
              Ver pacientes
            </button>

            <button
              type="button"
              className="botao-principal"
            >
              Novo agendamento
            </button>
          </div>
        </section>

        {/* =========================
            AGENDA
        ========================== */}
        <aside className="dashboard-agenda">
          <h2>Próximos agendamentos</h2>

          <div className="agenda-vazia">
            <p>Nenhum agendamento próximo.</p>
          </div>

          <button
            type="button"
            className="ver-agenda"
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
        >
          <span className="atalho-icone">+</span>
          <span className="atalho-texto">
            Novo agendamento
          </span>
        </button>

        <button
          type="button"
          className="atalho-item"
        >
          <span className="atalho-icone">?</span>
          <span className="atalho-texto">
            Ajuda
          </span>
        </button>

        <button
          type="button"
          className="atalho-item"
        >
          <span className="atalho-icone">⚙</span>
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
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-cabecalho">
              <div>
                <span>PACIENTES</span>
                <h2>Selecionar paciente</h2>
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

            {/* Pesquisa */}
            <div className="campo-pesquisa-paciente">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Pesquisar paciente..."
                value={pesquisa}
                onChange={(event) =>
                  setPesquisa(event.target.value)
                }
                autoFocus
              />
            </div>

            {/* Lista */}
            <div className="lista-pacientes">
              {pacientesFiltrados.length > 0 ? (
                pacientesFiltrados.map((paciente) => (
                  <button
                    type="button"
                    className="paciente-item"
                    key={paciente.id}
                    onClick={() =>
                      selecionarPaciente(paciente)
                    }
                  >
                    <div className="paciente-avatar">
                      {paciente.nome.charAt(0)}
                    </div>

                    <div className="paciente-dados">
                      <strong>{paciente.nome}</strong>
                      <span>Selecionar paciente</span>
                    </div>

                    <span className="paciente-seta">
                      ›
                    </span>
                  </button>
                ))
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
