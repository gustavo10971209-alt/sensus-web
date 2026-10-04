import { useState } from 'react'

function SeletorPacienteRelatorio({
  pacientes,
  pacienteSelecionado,
  onSelecionarPaciente,
}) {
  const [mostrarModal, setMostrarModal] =
    useState(false)

  const [pesquisa, setPesquisa] =
    useState('')

  // =========================================
  // FILTRAR PACIENTES
  // =========================================

  const pacientesFiltrados =
    pacientes.filter((paciente) =>
      paciente.nome
        .toLowerCase()
        .includes(
          pesquisa
            .trim()
            .toLowerCase()
        )
    )

  // =========================================
  // SELECIONAR
  // =========================================

  function selecionarPaciente(
    paciente
  ) {
    onSelecionarPaciente(paciente)

    setMostrarModal(false)
    setPesquisa('')
  }

  function fecharModal() {
    setMostrarModal(false)
    setPesquisa('')
  }

  // =========================================
  // TELA
  // =========================================

  return (
    <>
      <div className="relatorio-paciente">
        <div className="relatorio-paciente-info">
          <div className="relatorio-paciente-avatar">
            {pacienteSelecionado
              ? pacienteSelecionado.nome
                  .charAt(0)
                  .toUpperCase()
              : '?'}
          </div>

          <div>
            <span>
              PACIENTE
            </span>

            {pacienteSelecionado ? (
              <strong>
                {
                  pacienteSelecionado.nome
                }
              </strong>
            ) : (
              <strong>
                Nenhum paciente selecionado
              </strong>
            )}
          </div>
        </div>

        <button
          type="button"
          className="relatorio-selecionar-paciente"
          onClick={() =>
            setMostrarModal(true)
          }
        >
          {pacienteSelecionado
            ? 'Trocar paciente'
            : 'Selecionar paciente'}
        </button>
      </div>

      {/* =================================
          MODAL
      ================================= */}

      {mostrarModal && (
        <div
          className="modal-overlay"
          onClick={fecharModal}
        >
          <section
            className="relatorio-paciente-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* CABEÇALHO */}

            <div className="relatorio-paciente-modal-cabecalho">
              <div>
                <span>
                  RELATÓRIOS
                </span>

                <h2>
                  Selecionar paciente
                </h2>

                <p>
                  Escolha o paciente cujos
                  dados deseja analisar.
                </p>
              </div>

              <button
                type="button"
                className="relatorio-modal-fechar"
                onClick={fecharModal}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>

            {/* PESQUISA */}

            <div className="relatorio-paciente-pesquisa">
              <span>⌕</span>

              <input
                type="text"
                name="pesquisaPacienteRelatorio"
                placeholder="Pesquisar paciente..."
                value={pesquisa}
                autoComplete="off"
                autoFocus
                onChange={(event) =>
                  setPesquisa(
                    event.target.value
                  )
                }
              />
            </div>

            {/* LISTA */}

            <div className="relatorio-paciente-lista">
              {pacientesFiltrados.length >
              0 ? (
                pacientesFiltrados.map(
                  (paciente) => {
                    const selecionado =
                      pacienteSelecionado
                        ?.id ===
                      paciente.id

                    return (
                      <button
                        type="button"
                        key={paciente.id}
                        className={`relatorio-paciente-item ${
                          selecionado
                            ? 'ativo'
                            : ''
                        }`}
                        onClick={() =>
                          selecionarPaciente(
                            paciente
                          )
                        }
                      >
                        <div className="relatorio-paciente-item-avatar">
                          {paciente.nome
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {
                              paciente.nome
                            }
                          </strong>

                          <span>
                            {selecionado
                              ? 'Paciente selecionado'
                              : 'Selecionar paciente'}
                          </span>
                        </div>

                        {selecionado && (
                          <span className="relatorio-paciente-check">
                            ✓
                          </span>
                        )}
                      </button>
                    )
                  }
                )
              ) : (
                <div className="relatorio-paciente-vazio">
                  <strong>
                    Nenhum paciente encontrado
                  </strong>

                  <span>
                    Verifique o nome
                    pesquisado.
                  </span>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  )
}

export default SeletorPacienteRelatorio