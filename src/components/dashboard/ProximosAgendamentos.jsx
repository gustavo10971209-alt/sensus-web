function ProximosAgendamentos({
  agendamentos,
  pacientes,
  onAbrirAgenda,
}) {
  // =========================================
  // DATA DE HOJE
  // =========================================

  const hoje = new Date()

  const dataHoje = [
    hoje.getFullYear(),
    String(
      hoje.getMonth() + 1
    ).padStart(2, '0'),
    String(
      hoje.getDate()
    ).padStart(2, '0'),
  ].join('-')

  // =========================================
  // PRÓXIMOS 3 AGENDAMENTOS
  // =========================================

  const proximosAgendamentos =
    agendamentos
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

  // =========================================
  // NOME DO PACIENTE
  // =========================================

  function buscarNomePaciente(pacienteId) {
    const paciente =
      pacientes.find(
        (item) =>
          item.id === pacienteId
      )

    return (
      paciente?.nome ||
      'Paciente'
    )
  }

  // =========================================
  // FORMATAR DATA
  // =========================================

  function formatarData(data) {
    const [ano, mes, dia] =
      data
        .split('-')
        .map(Number)

    return new Date(
      ano,
      mes - 1,
      dia
    ).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: '2-digit',
      }
    )
  }

  return (
    <aside className="dashboard-agenda">

      {/* CABEÇALHO */}

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

      {/* AGENDAMENTOS */}

      {proximosAgendamentos.length > 0 ? (

        <div className="dashboard-lista-agendamentos">

          {proximosAgendamentos.map(
            (agendamento) => (

              <div
                className="dashboard-agendamento-item"
                key={agendamento.id}
              >

                {/* DATA E HORÁRIO */}

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

                {/* PACIENTE */}

                <div className="dashboard-agendamento-paciente">

                  <strong>
                    {buscarNomePaciente(
                      agendamento.pacienteId
                    )}
                  </strong>

                  <span>
                    {agendamento.duracao}{' '}
                    minutos
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

      {/* ABRIR AGENDA */}

      <button
        type="button"
        className="ver-agenda"
        onClick={onAbrirAgenda}
      >
        Ver agenda completa
      </button>

    </aside>
  )
}

export default ProximosAgendamentos