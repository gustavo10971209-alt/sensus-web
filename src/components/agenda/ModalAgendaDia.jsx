import { useState } from 'react'

function ModalAgendaDia({
  diaSelecionado,
  pacientes,
  agendamentos,
  pacienteSelecionado,
  onFechar,
  onCriarAgendamento,
}) {
  const [filtroPaciente, setFiltroPaciente] = useState(
    pacienteSelecionado?.id || 'todos'
  )

  const [pesquisa, setPesquisa] = useState(
    pacienteSelecionado?.nome || ''
  )

  const [mostrarResultados, setMostrarResultados] =
    useState(false)

  const pacientesFiltrados = pacientes.filter((paciente) =>
    paciente.nome
      .toLowerCase()
      .includes(pesquisa.toLowerCase())
  )

  const pacienteFiltroAtual = pacientes.find(
    (paciente) => paciente.id === filtroPaciente
  )

  const agendamentosDoDia = agendamentos
    .filter(
      (agendamento) =>
        agendamento.data === diaSelecionado
    )
    .filter((agendamento) => {
      if (filtroPaciente === 'todos') {
        return true
      }

      return agendamento.pacienteId === filtroPaciente
    })
    .sort((a, b) =>
      a.horario.localeCompare(b.horario)
    )

  function buscarNomePaciente(pacienteId) {
    const paciente = pacientes.find(
      (item) => item.id === pacienteId
    )

    return paciente?.nome || 'Paciente'
  }

  function selecionarPaciente(paciente) {
    setFiltroPaciente(paciente.id)
    setPesquisa(paciente.nome)
    setMostrarResultados(false)
  }

  function limparFiltro() {
    setFiltroPaciente('todos')
    setPesquisa('')
    setMostrarResultados(false)
  }

  function formatarDataCompleta(data) {
    const [ano, mes, dia] = data
      .split('-')
      .map(Number)

    return new Date(
      ano,
      mes - 1,
      dia
    ).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div
      className="modal-overlay"
      onClick={onFechar}
    >
      <section
        className="modal-agenda-dia"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="agenda-dia-cabecalho">
          <button
            type="button"
            className="agenda-dia-voltar"
            onClick={onFechar}
            aria-label="Voltar"
          >
            ←
          </button>

          <div>
            <span>AGENDA DO DIA</span>

            <h2>
              {formatarDataCompleta(diaSelecionado)}
            </h2>
          </div>
        </div>

        <div className="agenda-dia-filtro">
          <label htmlFor="pesquisaPacienteDia">
            Filtrar por paciente
          </label>

          <div className="agenda-filtro-pesquisa">
            <span>⌕</span>

            <input
              id="pesquisaPacienteDia"
              type="text"
              placeholder="Pesquisar paciente..."
              value={pesquisa}
              onChange={(event) => {
                setPesquisa(event.target.value)
                setMostrarResultados(true)
              }}
              onFocus={() =>
                setMostrarResultados(true)
              }
            />

            {filtroPaciente !== 'todos' && (
              <button
                type="button"
                className="agenda-limpar-filtro"
                onClick={limparFiltro}
                title="Limpar filtro"
              >
                ×
              </button>
            )}
          </div>

          {mostrarResultados && (
            <div className="agenda-filtro-resultados">
              <button
                type="button"
                onClick={limparFiltro}
              >
                <div className="agenda-filtro-avatar">
                  T
                </div>

                <div>
                  <strong>Todos os pacientes</strong>
                  <span>Remover filtro</span>
                </div>
              </button>

              {pacientesFiltrados.map((paciente) => (
                <button
                  type="button"
                  key={paciente.id}
                  onClick={() =>
                    selecionarPaciente(paciente)
                  }
                >
                  <div className="agenda-filtro-avatar">
                    {paciente.nome.charAt(0)}
                  </div>

                  <div>
                    <strong>{paciente.nome}</strong>
                    <span>Filtrar agenda</span>
                  </div>
                </button>
              ))}

              {pacientesFiltrados.length === 0 && (
                <div className="agenda-filtro-vazio">
                  Nenhum paciente encontrado.
                </div>
              )}
            </div>
          )}

          {pacienteFiltroAtual &&
            !mostrarResultados && (
              <div className="agenda-filtro-selecionado">
                Exibindo agenda de{' '}
                <strong>
                  {pacienteFiltroAtual.nome}
                </strong>
              </div>
            )}
        </div>

        <div className="agenda-dia-lista">
          {agendamentosDoDia.length > 0 ? (
            agendamentosDoDia.map((agendamento) => (
              <article
                className="agenda-dia-item"
                key={agendamento.id}
              >
                <div className="agenda-dia-horario">
                  {agendamento.horario}
                </div>

                <div className="agenda-dia-informacoes">
                  <strong>
                    {buscarNomePaciente(
                      agendamento.pacienteId
                    )}
                  </strong>

                  <span>
                    {agendamento.duracao} minutos
                  </span>

                  {agendamento.observacao && (
                    <p>{agendamento.observacao}</p>
                  )}
                </div>
              </article>
            ))
          ) : (
            <div className="agenda-dia-vazia">
              <div>○</div>

              <strong>
                Nenhum atendimento agendado
              </strong>

              <p>
                Não existem atendimentos para este dia
                com o filtro selecionado.
              </p>
            </div>
          )}
        </div>

        <div className="agenda-dia-rodape">
          <button
            type="button"
            className="agenda-criar"
            onClick={() =>
              onCriarAgendamento({
                data: diaSelecionado,
                pacienteId:
                  filtroPaciente === 'todos'
                    ? null
                    : filtroPaciente,
              })
            }
          >
            + Criar agendamento
          </button>
        </div>
      </section>
    </div>
  )
}

export default ModalAgendaDia