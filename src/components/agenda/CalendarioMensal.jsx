function CalendarioMensal({
  dataCalendario,
  agendamentos,
  pacienteSelecionado,
  onMesAnterior,
  onProximoMes,
  onAbrirDia,
}) {
  const hoje = new Date()

  const anoAtual = dataCalendario.getFullYear()
  const mesAtual = dataCalendario.getMonth()

  const primeiroDiaDoMes = new Date(
    anoAtual,
    mesAtual,
    1
  ).getDay()

  const quantidadeDiasDoMes = new Date(
    anoAtual,
    mesAtual + 1,
    0
  ).getDate()

  const nomeMes = dataCalendario
    .toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    })
    .toUpperCase()

  const diasCalendario = []

  for (let i = 0; i < primeiroDiaDoMes; i += 1) {
    diasCalendario.push(null)
  }

  for (
    let dia = 1;
    dia <= quantidadeDiasDoMes;
    dia += 1
  ) {
    diasCalendario.push(dia)
  }

  const agendamentosVisiveis = pacienteSelecionado
    ? agendamentos.filter(
        (agendamento) =>
          agendamento.pacienteId === pacienteSelecionado.id
      )
    : agendamentos

  function formatarData(dia) {
    const mes = String(mesAtual + 1).padStart(2, '0')
    const diaFormatado = String(dia).padStart(2, '0')

    return `${anoAtual}-${mes}-${diaFormatado}`
  }

  function possuiAgendamento(dia) {
    const data = formatarData(dia)

    return agendamentosVisiveis.some(
      (agendamento) => agendamento.data === data
    )
  }

  function ehHoje(dia) {
    return (
      dia === hoje.getDate() &&
      mesAtual === hoje.getMonth() &&
      anoAtual === hoje.getFullYear()
    )
  }

  return (
    <div className="calendario-mensal">
      <div className="calendario-topo">
        <button
          type="button"
          className="calendario-navegacao"
          onClick={onMesAnterior}
          aria-label="Mês anterior"
        >
          ‹
        </button>

        <h3>{nomeMes}</h3>

        <button
          type="button"
          className="calendario-navegacao"
          onClick={onProximoMes}
          aria-label="Próximo mês"
        >
          ›
        </button>
      </div>

      <div className="calendario-semana">
        <span>DOM</span>
        <span>SEG</span>
        <span>TER</span>
        <span>QUA</span>
        <span>QUI</span>
        <span>SEX</span>
        <span>SÁB</span>
      </div>

      <div className="calendario-grade">
        {diasCalendario.map((dia, index) => {
          if (dia === null) {
            return (
              <div
                className="calendario-dia-vazio"
                key={`vazio-${index}`}
              />
            )
          }

          return (
            <button
              type="button"
              className={
                ehHoje(dia)
                  ? 'calendario-dia calendario-dia-hoje'
                  : 'calendario-dia'
              }
              key={dia}
              onClick={() =>
                onAbrirDia(formatarData(dia))
              }
            >
              <span className="calendario-numero">
                {dia}
              </span>

              {possuiAgendamento(dia) && (
                <span
                  className="calendario-indicador"
                  title="Possui agendamento"
                />
              )}
            </button>
          )
        })}
      </div>

      <div className="calendario-legenda">
        <span className="calendario-indicador" />
        <span>Possui agendamento</span>
      </div>
    </div>
  )
}

export default CalendarioMensal