import { useEffect, useState } from 'react'

function ModalNovoAgendamento({
  pacientes,
  dadosIniciais,
  onCancelar,
  onConfirmar,
}) {
  const [pacienteId, setPacienteId] = useState(
    dadosIniciais?.pacienteId || ''
  )

  const [data, setData] = useState(
    dadosIniciais?.data || ''
  )

  const [horario, setHorario] = useState('')
  const [duracao, setDuracao] = useState('50')
  const [observacao, setObservacao] = useState('')

  const [pesquisaPaciente, setPesquisaPaciente] =
    useState('')

  const [mostrarPacientes, setMostrarPacientes] =
    useState(false)

  const [erro, setErro] = useState('')

  // Se o formulário já abrir com um paciente selecionado,
  // mostramos o nome dele na pesquisa.
  useEffect(() => {
    if (!dadosIniciais?.pacienteId) {
      return
    }

    const pacienteInicial = pacientes.find(
      (paciente) =>
        paciente.id === dadosIniciais.pacienteId
    )

    if (pacienteInicial) {
      setPesquisaPaciente(pacienteInicial.nome)
    }
  }, [dadosIniciais, pacientes])

  const pacientesFiltrados = pacientes.filter(
    (paciente) =>
      paciente.nome
        .toLowerCase()
        .includes(pesquisaPaciente.toLowerCase())
  )

  const pacienteSelecionado = pacientes.find(
    (paciente) => paciente.id === pacienteId
  )

  function selecionarPaciente(paciente) {
    setPacienteId(paciente.id)
    setPesquisaPaciente(paciente.nome)
    setMostrarPacientes(false)
    setErro('')
  }

  function limparPaciente() {
    setPacienteId('')
    setPesquisaPaciente('')
    setMostrarPacientes(true)
  }

  function formatarDataCompleta(dataRecebida) {
    if (!dataRecebida) {
      return ''
    }

    const [ano, mes, dia] = dataRecebida
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

  function enviarFormulario(event) {
    event.preventDefault()

    if (!pacienteId) {
      setErro('Selecione um paciente.')
      return
    }

    if (!data) {
      setErro('Selecione a data do agendamento.')
      return
    }

    if (!horario) {
      setErro('Informe o horário do agendamento.')
      return
    }

    const novoAgendamento = {
      pacienteId,
      data,
      horario,
      duracao: Number(duracao),
      observacao: observacao.trim(),
    }

    onConfirmar(novoAgendamento)
  }

  return (
    <div
      className="modal-overlay"
      onClick={onCancelar}
    >
      <section
        className="modal-novo-agendamento"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="novo-agendamento-cabecalho">
          <button
            type="button"
            className="agenda-dia-voltar"
            onClick={onCancelar}
            aria-label="Voltar"
          >
            ←
          </button>

          <div>
            <span>NOVO AGENDAMENTO</span>
            <h2>Agendar atendimento</h2>
          </div>
        </div>

        <form
          className="novo-agendamento-formulario"
          onSubmit={enviarFormulario}
        >
          {/* PACIENTE */}

          <div className="novo-agendamento-campo">
            <label htmlFor="novoPaciente">
              Paciente
            </label>

            <div className="novo-paciente-pesquisa">
              <span>⌕</span>

              <input
                id="novoPaciente"
                type="text"
                placeholder="Pesquisar paciente..."
                value={pesquisaPaciente}
                autoComplete="off"
                onFocus={() =>
                  setMostrarPacientes(true)
                }
                onChange={(event) => {
                  setPesquisaPaciente(
                    event.target.value
                  )

                  setPacienteId('')
                  setMostrarPacientes(true)
                }}
              />

              {pacienteId && (
                <button
                  type="button"
                  className="agenda-limpar-filtro"
                  onClick={limparPaciente}
                  title="Alterar paciente"
                >
                  ×
                </button>
              )}
            </div>

            {mostrarPacientes && (
              <div className="novo-paciente-resultados">
                {pacientesFiltrados.length > 0 ? (
                  pacientesFiltrados.map(
                    (paciente) => (
                      <button
                        type="button"
                        key={paciente.id}
                        onClick={() =>
                          selecionarPaciente(
                            paciente
                          )
                        }
                      >
                        <div className="agenda-filtro-avatar">
                          {paciente.nome.charAt(0)}
                        </div>

                        <div>
                          <strong>
                            {paciente.nome}
                          </strong>

                          <span>
                            Selecionar paciente
                          </span>
                        </div>
                      </button>
                    )
                  )
                ) : (
                  <div className="agenda-filtro-vazio">
                    Nenhum paciente encontrado.
                  </div>
                )}
              </div>
            )}

            {pacienteSelecionado &&
              !mostrarPacientes && (
                <span className="novo-campo-confirmacao">
                  Paciente selecionado:{' '}
                  <strong>
                    {pacienteSelecionado.nome}
                  </strong>
                </span>
              )}
          </div>

          {/* DATA */}

          <div className="novo-agendamento-campo">
            <label htmlFor="novoData">
              Data
            </label>

            <input
              id="novoData"
              type="date"
              value={data}
              onChange={(event) => {
                setData(event.target.value)
                setErro('')
              }}
            />

            {data && (
              <span className="novo-data-completa">
                {formatarDataCompleta(data)}
              </span>
            )}
          </div>

          {/* HORÁRIO + DURAÇÃO */}

          <div className="novo-agendamento-linha">
            <div className="novo-agendamento-campo">
              <label htmlFor="novoHorario">
                Horário
              </label>

              <input
                id="novoHorario"
                type="time"
                value={horario}
                onChange={(event) => {
                  setHorario(event.target.value)
                  setErro('')
                }}
              />
            </div>

            <div className="novo-agendamento-campo">
              <label htmlFor="novoDuracao">
                Duração
              </label>

              <select
                id="novoDuracao"
                value={duracao}
                onChange={(event) =>
                  setDuracao(event.target.value)
                }
              >
                <option value="30">
                  30 minutos
                </option>

                <option value="40">
                  40 minutos
                </option>

                <option value="50">
                  50 minutos
                </option>

                <option value="60">
                  1 hora
                </option>

                <option value="90">
                  1 hora e 30 minutos
                </option>
              </select>
            </div>
          </div>

          {/* OBSERVAÇÃO */}

          <div className="novo-agendamento-campo">
            <label htmlFor="novoObservacao">
              Observação
              <span> (opcional)</span>
            </label>

            <textarea
              id="novoObservacao"
              rows="3"
              maxLength="250"
              placeholder="Adicione uma observação sobre o atendimento..."
              value={observacao}
              onChange={(event) =>
                setObservacao(event.target.value)
              }
            />

            <span className="novo-contador">
              {observacao.length}/250
            </span>
          </div>

          {/* ERRO */}

          {erro && (
            <div className="novo-agendamento-erro">
              {erro}
            </div>
          )}

          {/* BOTÕES */}

          <div className="novo-agendamento-acoes">
            <button
              type="button"
              className="novo-cancelar"
              onClick={onCancelar}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="agenda-criar"
            >
              Confirmar agendamento
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default ModalNovoAgendamento