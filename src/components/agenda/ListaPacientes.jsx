function ListaPacientes({
  pacientes,
  pesquisa,
  setPesquisa,
  pacienteSelecionado,
  setPacienteSelecionado,
  onVoltar,
}) {
  const pacientesFiltrados = pacientes.filter((paciente) =>
    paciente.nome
      .toLowerCase()
      .includes(pesquisa.toLowerCase())
  )

  function selecionarPaciente(paciente) {
    if (pacienteSelecionado?.id === paciente.id) {
      setPacienteSelecionado(null)
      return
    }

    setPacienteSelecionado(paciente)
  }

  return (
    <aside className="agenda-pacientes">
      <div className="agenda-pacientes-cabecalho">
        <button
          type="button"
          className="agenda-voltar"
          onClick={onVoltar}
          aria-label="Voltar para o Dashboard"
        >
          ←
        </button>

        <div>
          <span>AGENDA</span>
          <h1>Pacientes</h1>
        </div>
      </div>

      <div className="agenda-pesquisa">
        <span>⌕</span>

        <input
          type="text"
          placeholder="Pesquisar paciente..."
          value={pesquisa}
          onChange={(event) =>
            setPesquisa(event.target.value)
          }
        />
      </div>

      <button
        type="button"
        className={
          pacienteSelecionado === null
            ? 'agenda-todos agenda-paciente-ativo'
            : 'agenda-todos'
        }
        onClick={() => setPacienteSelecionado(null)}
      >
        <div className="agenda-avatar">
          T
        </div>

        <div>
          <strong>Todos os pacientes</strong>
          <span>Visualizar agenda completa</span>
        </div>
      </button>

      <div className="agenda-lista-pacientes">
        {pacientesFiltrados.map((paciente) => (
          <button
            type="button"
            key={paciente.id}
            className={
              pacienteSelecionado?.id === paciente.id
                ? 'agenda-paciente agenda-paciente-ativo'
                : 'agenda-paciente'
            }
            onClick={() =>
              selecionarPaciente(paciente)
            }
          >
            <div className="agenda-avatar">
              {paciente.nome.charAt(0)}
            </div>

            <div className="agenda-paciente-info">
              <strong>
                {paciente.nome}
              </strong>

              <span>
                Ver agendamentos
              </span>
            </div>
          </button>
        ))}

        {pacientesFiltrados.length === 0 && (
          <div className="agenda-sem-paciente">
            <strong>
              Nenhum paciente encontrado
            </strong>

            <span>
              Tente pesquisar outro nome.
            </span>
          </div>
        )}
      </div>
    </aside>
  )
}

export default ListaPacientes