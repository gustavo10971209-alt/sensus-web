function ConfirmacaoAgendamento({
  agendamento,
  paciente,
  onVoltar,
}) {
  if (!agendamento) {
    return null
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
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="modal-overlay">
      <section className="modal-agenda-confirmacao">
        <div className="confirmacao-icone">
          ✓
        </div>

        <span className="confirmacao-etiqueta">
          AGENDAMENTO CONCLUÍDO
        </span>

        <h2>
          Agendamento realizado com sucesso!
        </h2>

        <div className="confirmacao-dados">
          <strong>{paciente?.nome}</strong>

          <span>
            {formatarData(agendamento.data)}
          </span>

          <span>
            {agendamento.horario}
          </span>
        </div>

        <button
          type="button"
          className="agenda-criar"
          onClick={onVoltar}
        >
          Voltar para a agenda
        </button>
      </section>
    </div>
  )
}

export default ConfirmacaoAgendamento