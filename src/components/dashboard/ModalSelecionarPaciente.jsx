function ModalSelecionarPaciente({
  aberto,
  pesquisa,
  setPesquisa,
  pacientes,
  carregando,
  erro,
  onFechar,
  onSelecionar,
}) {
  // =========================================
  // SE O MODAL ESTIVER FECHADO
  // =========================================

  if (!aberto) {
    return null
  }

  // =========================================
  // FILTRAR PACIENTES
  // =========================================

  const pacientesFiltrados =
    pacientes.filter((paciente) =>
      paciente.nome
        ?.toLowerCase()
        .includes(
          pesquisa
            .trim()
            .toLowerCase()
        )
    )

  return (
    <div
      className="modal-overlay"
      onClick={onFechar}
    >

      <section
        className="modal-pacientes"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* CABEÇALHO */}

        <div className="modal-cabecalho">

          <div>

            <span>
              PACIENTES
            </span>

            <h2>
              Selecionar paciente
            </h2>

          </div>

          <button
            type="button"
            className="fechar-modal"
            onClick={onFechar}
            aria-label="Fechar"
          >
            ×
          </button>

        </div>

        {/* PESQUISA */}

        <div className="campo-pesquisa-paciente">

          <span>
            ⌕
          </span>

          <input
            type="text"
            placeholder="Pesquisar paciente..."
            value={pesquisa}
            onChange={(event) =>
              setPesquisa(
                event.target.value
              )
            }
            autoFocus
          />

        </div>

        {/* LISTA */}

        <div className="lista-pacientes">

          {carregando ? (

            <div className="nenhum-paciente">

              <p>
                Carregando pacientes...
              </p>

            </div>

          ) : erro ? (

            <div className="nenhum-paciente">

              <strong>
                Não foi possível carregar
                os pacientes
              </strong>

              <p>
                {erro}
              </p>

            </div>

          ) : pacientesFiltrados.length > 0 ? (

            pacientesFiltrados.map(
              (paciente) => (

                <button
                  type="button"
                  className="paciente-item"
                  key={paciente.id}
                  onClick={() =>
                    onSelecionar(
                      paciente
                    )
                  }
                >

                  {/* AVATAR */}

                  <div className="paciente-avatar">

                    {paciente.nome
                      ?.charAt(0)
                      .toUpperCase()}

                  </div>

                  {/* DADOS */}

                  <div className="paciente-dados">

                    <strong>
                      {paciente.nome}
                    </strong>

                    <span>
                      {paciente.cidade ||
                        paciente.estado ||
                        paciente.pais ||
                        'Selecionar paciente'}
                    </span>

                  </div>

                  <span className="paciente-seta">
                    ›
                  </span>

                </button>

              )
            )

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
  )
}

export default ModalSelecionarPaciente