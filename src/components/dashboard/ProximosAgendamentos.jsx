import {
  useMemo,
  useState,
} from 'react'

function obterDataHora(
  agendamento
) {
  if (!agendamento?.data) {
    return null
  }

  const horario =
    agendamento.horario ||
    '00:00'

  const dataHora =
    new Date(
      `${agendamento.data}T${horario}`
    )

  if (
    Number.isNaN(
      dataHora.getTime()
    )
  ) {
    return null
  }

  return dataHora
}

function formatarData(
  dataTexto
) {
  if (!dataTexto) {
    return '-'
  }

  const [
    ano,
    mes,
    dia,
  ] =
    dataTexto
      .split('-')
      .map(Number)

  if (
    !ano ||
    !mes ||
    !dia
  ) {
    return dataTexto
  }

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

function ProximosAgendamentos({
  agendamentos = [],
  pacientes = [],
  psicologoId,
  onAbrirAgenda,
}) {
  const [
    filtro,
    setFiltro,
  ] = useState('meus')

  // =========================================
  // PACIENTE
  // =========================================

  function buscarNomePaciente(
    pacienteId
  ) {
    const paciente =
      pacientes.find(
        (item) =>
          item.id ===
          pacienteId
      )

    return (
      paciente?.nome ||
      'Paciente'
    )
  }

  // =========================================
  // FILTRAGEM
  // =========================================

  const proximosAgendamentos =
    useMemo(() => {
      const agora =
        new Date()

      return agendamentos
        .filter(
          (agendamento) => {
            const dataHora =
              obterDataHora(
                agendamento
              )

            if (
              !dataHora ||
              dataHora < agora
            ) {
              return false
            }

            if (
              filtro === 'meus'
            ) {
              return (
                Boolean(
                  psicologoId
                ) &&
                agendamento
                  .criadoPorId ===
                  psicologoId
              )
            }

            return true
          }
        )
        .sort(
          (a, b) => {
            const dataA =
              obterDataHora(a)

            const dataB =
              obterDataHora(b)

            return (
              dataA.getTime() -
              dataB.getTime()
            )
          }
        )
        .slice(
          0,
          4
        )
    }, [
      agendamentos,
      filtro,
      psicologoId,
    ])

  // =========================================
  // TEXTO
  // =========================================

  const textoResumo =
    proximosAgendamentos.length === 0
      ? filtro === 'meus'
        ? 'Você não possui atendimentos próximos'
        : 'Não existem atendimentos próximos'
      : proximosAgendamentos.length === 1
        ? '1 próximo atendimento'
        : `${proximosAgendamentos.length} próximos atendimentos`

  // =========================================
  // TELA
  // =========================================

  return (
    <aside className="dashboard-agenda">

      <div className="dashboard-agenda-topo">

        <div>

          <span className="dashboard-agenda-etiqueta">
            AGENDA
          </span>

          <h2>
            Próximos agendamentos
          </h2>

          <span className="dashboard-agenda-resumo">
            {textoResumo}
          </span>

        </div>

      </div>

      {/* FILTROS */}

      <div className="dashboard-agenda-filtros">

        <button
          type="button"
          className={
            filtro === 'meus'
              ? 'dashboard-agenda-filtro dashboard-agenda-filtro-ativo'
              : 'dashboard-agenda-filtro'
          }
          onClick={() =>
            setFiltro('meus')
          }
        >
          Meus
        </button>

        <button
          type="button"
          className={
            filtro === 'todos'
              ? 'dashboard-agenda-filtro dashboard-agenda-filtro-ativo'
              : 'dashboard-agenda-filtro'
          }
          onClick={() =>
            setFiltro('todos')
          }
        >
          Todos
        </button>

      </div>

      {/* AGENDAMENTOS */}

      {proximosAgendamentos.length >
      0 ? (
        <div className="dashboard-lista-agendamentos">

          {proximosAgendamentos.map(
            (agendamento) => (
              <button
                type="button"
                className="dashboard-agendamento-item dashboard-agendamento-botao"
                key={
                  agendamento.id
                }
                onClick={
                  onAbrirAgenda
                }
                title="Ver detalhes na agenda"
              >

                <div className="dashboard-agendamento-data">

                  <strong>
                    {formatarData(
                      agendamento.data
                    )}
                  </strong>

                  <span>
                    {agendamento.horario ||
                      '--:--'}
                  </span>

                </div>

                <div className="dashboard-agendamento-paciente">

                  <strong>
                    {buscarNomePaciente(
                      agendamento
                        .pacienteId
                    )}
                  </strong>

                  <span>
                    {agendamento.duracao
                      ? `${agendamento.duracao} minutos`
                      : 'Horário agendado'}
                  </span>

                  {filtro ===
                    'todos' &&
                    agendamento
                      .criadoPorNome && (
                      <small>
                        Responsável:{' '}
                        {
                          agendamento
                            .criadoPorNome
                        }
                      </small>
                    )}

                </div>

                <span className="dashboard-agendamento-seta">
                  ›
                </span>

              </button>
            )
          )}

        </div>
      ) : (
        <div className="agenda-vazia">

          <div className="dashboard-agenda-vazia-icone">
            ◷
          </div>

          <strong>
            Nenhum agendamento
          </strong>

          <p>
            {filtro === 'meus'
              ? 'Você não possui próximos agendamentos.'
              : 'Não existem próximos agendamentos cadastrados.'}
          </p>

        </div>
      )}

      {/* IR PARA AGENDA */}

      <button
        type="button"
        className="ver-agenda"
        onClick={
          onAbrirAgenda
        }
      >
        Ver agenda completa
      </button>

    </aside>
  )
}

export default ProximosAgendamentos