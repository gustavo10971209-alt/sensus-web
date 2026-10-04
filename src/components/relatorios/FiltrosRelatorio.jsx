function FiltrosRelatorio({
  relatorioSelecionado,
  pacienteSelecionado,
  dataInicio,
  dataFim,
  onAlterarDataInicio,
  onAlterarDataFim,
  onSemanaAnterior,
  onProximaSemana,
}) {
  if (
    !relatorioSelecionado ||
    !pacienteSelecionado
  ) {
    return null
  }

  const relatorioSemanal =
    relatorioSelecionado.id === '001'

  function formatarData(data) {
    if (!data) {
      return ''
    }

    const [ano, mes, dia] =
      data.split('-').map(Number)

    return new Date(
      ano,
      mes - 1,
      dia
    ).toLocaleDateString('pt-BR')
  }

  return (
    <section className="relatorio-filtros">
      <div className="relatorio-filtros-cabecalho">
        <div>
          <span>PERÍODO</span>

          <h3>
            {relatorioSemanal
              ? 'Semana analisada'
              : 'Período analisado'}
          </h3>
        </div>

        {dataInicio && dataFim && (
          <div className="relatorio-periodo-resumo">
            {formatarData(dataInicio)}
            <span> até </span>
            {formatarData(dataFim)}
          </div>
        )}
      </div>

      {/* =================================
          RELATÓRIO 001
          SEMANA
      ================================= */}

      {relatorioSemanal ? (
        <div className="relatorio-filtro-semana">
          <button
            type="button"
            className="relatorio-semana-navegar"
            onClick={onSemanaAnterior}
          >
            ← Semana anterior
          </button>

          <div className="relatorio-semana-datas">
            <div>
              <label htmlFor="relatorioInicioSemana">
                Início
              </label>

              <input
                id="relatorioInicioSemana"
                name="relatorioInicioSemana"
                type="date"
                value={dataInicio}
                onChange={(event) =>
                  onAlterarDataInicio(
                    event.target.value
                  )
                }
              />
            </div>

            <span className="relatorio-data-separador">
              até
            </span>

            <div>
              <label htmlFor="relatorioFimSemana">
                Fim
              </label>

              <input
                id="relatorioFimSemana"
                name="relatorioFimSemana"
                type="date"
                value={dataFim}
                readOnly
              />
            </div>
          </div>

          <button
            type="button"
            className="relatorio-semana-navegar"
            onClick={onProximaSemana}
          >
            Próxima semana →
          </button>
        </div>
      ) : (
        /* =================================
           RELATÓRIOS 002 E 003
           PERÍODO PERSONALIZADO
        ================================= */

        <div className="relatorio-filtro-periodo">
          <div className="relatorio-filtro-data">
            <label htmlFor="relatorioDataInicio">
              Data inicial
            </label>

            <input
              id="relatorioDataInicio"
              name="relatorioDataInicio"
              type="date"
              value={dataInicio}
              onChange={(event) =>
                onAlterarDataInicio(
                  event.target.value
                )
              }
            />
          </div>

          <span className="relatorio-data-separador">
            até
          </span>

          <div className="relatorio-filtro-data">
            <label htmlFor="relatorioDataFim">
              Data final
            </label>

            <input
              id="relatorioDataFim"
              name="relatorioDataFim"
              type="date"
              value={dataFim}
              min={dataInicio}
              onChange={(event) =>
                onAlterarDataFim(
                  event.target.value
                )
              }
            />
          </div>
        </div>
      )}
    </section>
  )
}

export default FiltrosRelatorio