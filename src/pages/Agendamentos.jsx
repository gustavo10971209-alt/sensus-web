import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  buscarPacientes,
  buscarAgendamentos,
  criarAgendamento,
  atualizarAgendamento,
  excluirAgendamento,
} from '../services/agendaService'

import ListaPacientes from '../components/agenda/ListaPacientes'
import CalendarioMensal from '../components/agenda/CalendarioMensal'
import ModalAgendaDia from '../components/agenda/ModalAgendaDia'
import ModalNovoAgendamento from '../components/agenda/ModalNovoAgendamento'
import ConfirmacaoAgendamento from '../components/agenda/ConfirmacaoAgendamento'

function Agendamentos() {
  const navigate = useNavigate()

  // =========================================
  // DADOS
  // =========================================

  const [pacientes, setPacientes] = useState([])
  const [agendamentos, setAgendamentos] = useState([])

  // =========================================
  // PACIENTES
  // =========================================

  const [pesquisa, setPesquisa] = useState('')

  const [
    pacienteSelecionado,
    setPacienteSelecionado,
  ] = useState(null)

  // =========================================
  // CALENDÁRIO
  // =========================================

  const hoje = new Date()

  const [dataCalendario, setDataCalendario] =
    useState(
      new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        1
      )
    )

  // =========================================
  // MODAIS
  // =========================================

  const [diaSelecionado, setDiaSelecionado] =
    useState(null)

  const [
    mostrarNovoAgendamento,
    setMostrarNovoAgendamento,
  ] = useState(false)

  const [
    dadosIniciaisAgendamento,
    setDadosIniciaisAgendamento,
  ] = useState({})

  const [
    agendamentoEmEdicao,
    setAgendamentoEmEdicao,
  ] = useState(null)

  const [
    agendamentoConfirmado,
    setAgendamentoConfirmado,
  ] = useState(null)

  // =========================================
  // CARREGAR DADOS
  // =========================================

  useEffect(() => {
    async function carregarDados() {
      try {
        const [
          pacientesRecebidos,
          agendamentosRecebidos,
        ] = await Promise.all([
          buscarPacientes(),
          buscarAgendamentos(),
        ])

        setPacientes(pacientesRecebidos)
        setAgendamentos(agendamentosRecebidos)
      } catch (erro) {
        console.error(
          'Erro ao carregar agenda:',
          erro
        )
      }
    }

    carregarDados()
  }, [])

  // =========================================
  // VOLTAR
  // =========================================

  function voltarDashboard() {
    navigate('/dashboard')
  }

  // =========================================
  // CALENDÁRIO
  // =========================================

  function mesAnterior() {
    setDataCalendario((dataAtual) => {
      return new Date(
        dataAtual.getFullYear(),
        dataAtual.getMonth() - 1,
        1
      )
    })
  }

  function proximoMes() {
    setDataCalendario((dataAtual) => {
      return new Date(
        dataAtual.getFullYear(),
        dataAtual.getMonth() + 1,
        1
      )
    })
  }

  // =========================================
  // AGENDA DO DIA
  // =========================================

  function abrirDia(data) {
    setDiaSelecionado(data)
  }

  function fecharDia() {
    setDiaSelecionado(null)
  }

  // =========================================
  // NOVO AGENDAMENTO
  // =========================================

  function abrirNovoAgendamento(
    dadosIniciais = {}
  ) {
    setAgendamentoEmEdicao(null)

    setDadosIniciaisAgendamento(
      dadosIniciais
    )

    setDiaSelecionado(null)

    setMostrarNovoAgendamento(true)
  }

  function fecharFormularioAgendamento() {
    setMostrarNovoAgendamento(false)
    setDadosIniciaisAgendamento({})
    setAgendamentoEmEdicao(null)
  }

  // =========================================
  // EDITAR AGENDAMENTO
  // =========================================

  function abrirEdicaoAgendamento(
    agendamento
  ) {
    setAgendamentoEmEdicao(
      agendamento
    )

    setDadosIniciaisAgendamento({
      pacienteId:
        agendamento.pacienteId,

      data:
        agendamento.data,

      horario:
        agendamento.horario,

      duracao:
        agendamento.duracao,

      observacao:
        agendamento.observacao || '',
    })

    setDiaSelecionado(null)

    setMostrarNovoAgendamento(true)
  }

  // =========================================
  // CRIAR AGENDAMENTO
  // =========================================

  async function confirmarNovoAgendamento(
    novoAgendamento
  ) {
    try {
      const agendamentoCriado =
        await criarAgendamento(
          novoAgendamento
        )

      const agendamentosAtualizados =
        await buscarAgendamentos()

      setAgendamentos(
        agendamentosAtualizados
      )

      setMostrarNovoAgendamento(false)
      setDadosIniciaisAgendamento({})
      setAgendamentoEmEdicao(null)

      setAgendamentoConfirmado(
        agendamentoCriado
      )
    } catch (erro) {
      console.error(
        'Erro ao criar agendamento:',
        erro
      )
    }
  }

  // =========================================
  // EXCLUIR AGENDAMENTO
  // =========================================

  async function removerAgendamento(
    agendamentoId
  ) {
    try {
      await excluirAgendamento(
        agendamentoId
      )

      const agendamentosAtualizados =
        await buscarAgendamentos()

      setAgendamentos(
        agendamentosAtualizados
      )
    } catch (erro) {
      console.error(
        'Erro ao excluir agendamento:',
        erro
      )

      throw erro
    }
  }

  // =========================================
// SALVAR AGENDAMENTO
// Criar ou editar
// =========================================

async function salvarAgendamento(
  dadosAgendamento
) {
  if (agendamentoEmEdicao) {
    try {
      await atualizarAgendamento(
        agendamentoEmEdicao.id,
        dadosAgendamento
      )

      const agendamentosAtualizados =
        await buscarAgendamentos()

      setAgendamentos(
        agendamentosAtualizados
      )

      setMostrarNovoAgendamento(false)
      setDadosIniciaisAgendamento({})
      setAgendamentoEmEdicao(null)
    } catch (erro) {
      console.error(
        'Erro ao atualizar agendamento:',
        erro
      )
    }

    return
  }

  await confirmarNovoAgendamento(
    dadosAgendamento
  )
}

  // =========================================
  // CONFIRMAÇÃO
  // =========================================

  function fecharConfirmacao() {
    setAgendamentoConfirmado(null)
  }

  const pacienteConfirmado =
    agendamentoConfirmado
      ? pacientes.find(
          (paciente) =>
            paciente.id ===
            agendamentoConfirmado.pacienteId
        )
      : null

  // =========================================
  // TELA
  // =========================================

  return (
    <main className="pagina-agendamentos">

      <section className="agenda-container">

        {/* LISTA DE PACIENTES */}

        <ListaPacientes
          pacientes={pacientes}
          pesquisa={pesquisa}
          setPesquisa={setPesquisa}
          pacienteSelecionado={
            pacienteSelecionado
          }
          setPacienteSelecionado={
            setPacienteSelecionado
          }
          onVoltar={voltarDashboard}
        />

        {/* CALENDÁRIO */}

        <section className="agenda-calendario">

          <div className="agenda-calendario-cabecalho">

            <div>
              <span>
                CALENDÁRIO
              </span>

              <h2>
                {pacienteSelecionado
                  ? `Agenda de ${pacienteSelecionado.nome}`
                  : 'Todos os agendamentos'}
              </h2>

              <p>
                {pacienteSelecionado
                  ? 'Exibindo somente os agendamentos deste paciente.'
                  : 'Selecione um paciente ou visualize sua agenda completa.'}
              </p>
            </div>

            <button
              type="button"
              className="agenda-novo"
              onClick={() => {
                abrirNovoAgendamento({
                  pacienteId:
                    pacienteSelecionado?.id ||
                    null,
                })
              }}
            >
              + Novo agendamento
            </button>

          </div>

          <CalendarioMensal
            dataCalendario={dataCalendario}
            agendamentos={agendamentos}
            pacienteSelecionado={
              pacienteSelecionado
            }
            onMesAnterior={mesAnterior}
            onProximoMes={proximoMes}
            onAbrirDia={abrirDia}
          />

        </section>

      </section>

      {/* =====================================
          MODAL DO DIA
      ===================================== */}

      {diaSelecionado && (
        <ModalAgendaDia
          diaSelecionado={diaSelecionado}
          pacientes={pacientes}
          agendamentos={agendamentos}
          pacienteSelecionado={
            pacienteSelecionado
          }
          onFechar={fecharDia}
          onCriarAgendamento={
            abrirNovoAgendamento
          }
          onEditarAgendamento={
            abrirEdicaoAgendamento
          }
          onExcluirAgendamento={
            removerAgendamento
          }
        />
      )}

      {/* =====================================
          FORMULÁRIO DE AGENDAMENTO
      ===================================== */}

      {mostrarNovoAgendamento && (
        <ModalNovoAgendamento
          pacientes={pacientes}
          dadosIniciais={
            dadosIniciaisAgendamento
          }
          modo={
            agendamentoEmEdicao
              ? 'editar'
              : 'criar'
          }
          onCancelar={
            fecharFormularioAgendamento
          }
          onConfirmar={
            salvarAgendamento
          }
        />
      )}

      {/* =====================================
          CONFIRMAÇÃO
      ===================================== */}

      {agendamentoConfirmado && (
        <ConfirmacaoAgendamento
          agendamento={
            agendamentoConfirmado
          }
          paciente={
            pacienteConfirmado
          }
          onVoltar={
            fecharConfirmacao
          }
        />
      )}

    </main>
  )
}

export default Agendamentos