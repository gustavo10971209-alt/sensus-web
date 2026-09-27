import GraficoEmocoes from './GraficoEmocoes'

function PainelPaciente({
  pacienteSelecionado,
  emocoes,
  carregandoEmocoes,
  erroEmocoes,
  onSelecionarPaciente,
  onTrocarPaciente,
  onVerDados,
  onVerRelatorios,
}) {
  // =========================================
  // NENHUM PACIENTE SELECIONADO
  // =========================================

  if (!pacienteSelecionado) {
    return (
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
            Selecione um paciente para
            visualizar suas informações
            e seu relatório emocional.
          </p>

          <button
            type="button"
            className="dashboard-selecionar"
            onClick={onSelecionarPaciente}
          >
            Selecionar paciente
          </button>

        </div>

      </section>
    )
  }

  // =========================================
  // PACIENTE SELECIONADO
  // =========================================

  return (
    <section className="dashboard-paciente-selecionado">

      {/* CABEÇALHO DO PACIENTE */}

      <div className="dashboard-paciente-topo">

        <div className="dashboard-paciente-avatar">

          {pacienteSelecionado.nome
            ?.charAt(0)
            .toUpperCase()}

        </div>

        <div className="dashboard-paciente-identidade">

          <span>
            PACIENTE SELECIONADO
          </span>

          <h2>
            {pacienteSelecionado.nome}
          </h2>

          <p>
            {pacienteSelecionado.cidade ||
              'Cidade não informada'}

            {pacienteSelecionado.estado
              ? ` • ${pacienteSelecionado.estado}`
              : ''}

            {pacienteSelecionado.pais
              ? ` • ${pacienteSelecionado.pais}`
              : ''}
          </p>

        </div>

        <button
          type="button"
          className="dashboard-trocar-paciente"
          onClick={onTrocarPaciente}
        >
          Trocar paciente
        </button>

      </div>

      {/* GRÁFICO DAS EMOÇÕES */}

      <GraficoEmocoes
        emocoes={emocoes}
        carregando={carregandoEmocoes}
        erro={erroEmocoes}
      />

      {/* AÇÕES */}

      <div className="dashboard-paciente-acoes">

        <button
          type="button"
          onClick={onVerDados}
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
          onClick={onVerRelatorios}
        >
          <span className="dashboard-acao-icone">
            ≡
          </span>

          <div>
            <strong>
              Relatórios
            </strong>

            <small>
              Relatório completo
            </small>
          </div>
        </button>

      </div>

    </section>
  )
}

export default PainelPaciente