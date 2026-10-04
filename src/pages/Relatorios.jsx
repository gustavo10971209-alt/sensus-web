import {
  useEffect,
  useState,
} from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import {
  Link,
} from 'react-router-dom'

import {
  buscarPacientesSupabase,
} from '../services/pacienteService'

import MenuRelatorios
  from '../components/relatorios/MenuRelatorios'

import DetalhesRelatorio
  from '../components/relatorios/DetalhesRelatorio'

import SeletorPacienteRelatorio
  from '../components/relatorios/SeletorPacienteRelatorio'

import FiltrosRelatorio
  from '../components/relatorios/FiltrosRelatorio'

import VisualizacaoRelatorio
  from '../components/relatorios/VisualizacaoRelatorio'

// =========================================
// FUNÇÕES DE DATA
// =========================================

function formatarDataInput(data) {
  const ano =
    data.getFullYear()

  const mes =
    String(
      data.getMonth() + 1
    ).padStart(2, '0')

  const dia =
    String(
      data.getDate()
    ).padStart(2, '0')

  return `${ano}-${mes}-${dia}`
}

function adicionarDias(
  dataRecebida,
  quantidade
) {
  const [
    ano,
    mes,
    dia,
  ] = dataRecebida
    .split('-')
    .map(Number)

  const data =
    new Date(
      ano,
      mes - 1,
      dia
    )

  data.setDate(
    data.getDate() +
      quantidade
  )

  return formatarDataInput(
    data
  )
}

function obterInicioSemana() {
  const hoje =
    new Date()

  const diaSemana =
    hoje.getDay()

  const diferenca =
    diaSemana === 0
      ? -6
      : 1 - diaSemana

  const segunda =
    new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      hoje.getDate()
    )

  segunda.setDate(
    segunda.getDate() +
      diferenca
  )

  return formatarDataInput(
    segunda
  )
}

// =========================================
// PÁGINA
// =========================================

function Relatorios() {
  const [
    relatorioSelecionado,
    setRelatorioSelecionado,
  ] = useState(null)

  const [
    pacientes,
    setPacientes,
  ] = useState([])

  const [
    pacienteSelecionado,
    setPacienteSelecionado,
  ] = useState(null)

  const [
    carregandoPacientes,
    setCarregandoPacientes,
  ] = useState(true)

  const [
    erroPacientes,
    setErroPacientes,
  ] = useState('')

  const inicioSemana =
    obterInicioSemana()

  const [
    dataInicio,
    setDataInicio,
  ] = useState(
    inicioSemana
  )

  const [
    dataFim,
    setDataFim,
  ] = useState(
    adicionarDias(
      inicioSemana,
      6
    )
  )

  // =========================================
  // PACIENTES
  // =========================================

  useEffect(() => {
    async function carregarPacientes() {
      try {
        setCarregandoPacientes(
          true
        )

        setErroPacientes('')

        const dados =
          await buscarPacientesSupabase()

        setPacientes(
          dados
        )
      } catch (error) {
        console.error(
          'Erro ao carregar pacientes:',
          error
        )

        setErroPacientes(
          'Não foi possível carregar os pacientes.'
        )
      } finally {
        setCarregandoPacientes(
          false
        )
      }
    }

    carregarPacientes()
  }, [])

  // =========================================
  // RELATÓRIO
  // =========================================

  function selecionarRelatorio(
    relatorio
  ) {
    setRelatorioSelecionado(
      relatorio
    )

    setPacienteSelecionado(
      null
    )

    const inicio =
      obterInicioSemana()

    setDataInicio(
      inicio
    )

    setDataFim(
      adicionarDias(
        inicio,
        6
      )
    )
  }

  // =========================================
  // DATAS
  // =========================================

  function alterarDataInicio(
    novaData
  ) {
    setDataInicio(
      novaData
    )

    if (
      relatorioSelecionado
        ?.id === '001'
    ) {
      setDataFim(
        adicionarDias(
          novaData,
          6
        )
      )

      return
    }

    if (
      dataFim &&
      novaData > dataFim
    ) {
      setDataFim(
        novaData
      )
    }
  }

  function alterarDataFim(
    novaData
  ) {
    setDataFim(
      novaData
    )
  }

  function semanaAnterior() {
    const inicio =
      adicionarDias(
        dataInicio,
        -7
      )

    setDataInicio(
      inicio
    )

    setDataFim(
      adicionarDias(
        inicio,
        6
      )
    )
  }

  function proximaSemana() {
    const inicio =
      adicionarDias(
        dataInicio,
        7
      )

    setDataInicio(
      inicio
    )

    setDataFim(
      adicionarDias(
        inicio,
        6
      )
    )
  }

  function imprimirRelatorio() {
  window.print()
}

async function gerarPDF() {
  if (
    !relatorioSelecionado ||
    !pacienteSelecionado
  ) {
    return
  }

  const elemento =
    document.getElementById(
      'relatorio-para-pdf'
    )

  if (!elemento) {
    return
  }

  try {
    /*
      Esconde os botões enquanto
      fazemos a captura.
    */
    elemento.classList.add(
      'gerando-pdf'
    )

    const canvas =
      await html2canvas(
        elemento,
        {
          scale: 2,
          useCORS: true,
          backgroundColor:
            '#ffffff',
        }
      )

    const imagem =
      canvas.toDataURL(
        'image/png'
      )

    /*
      A4 em milímetros.
    */
    const pdf =
      new jsPDF({
        orientation:
          'portrait',
        unit: 'mm',
        format: 'a4',
      })

    const larguraPagina =
      pdf.internal
        .pageSize
        .getWidth()

    const alturaPagina =
      pdf.internal
        .pageSize
        .getHeight()

    const margem = 10

    const larguraUtil =
      larguraPagina -
      margem * 2

    const alturaImagem =
      (
        canvas.height *
        larguraUtil
      ) /
      canvas.width

    /*
      Caso o relatório tenha mais
      de uma página.
    */
    let alturaRestante =
      alturaImagem

    let posicao = margem

    pdf.addImage(
      imagem,
      'PNG',
      margem,
      posicao,
      larguraUtil,
      alturaImagem
    )

    alturaRestante -=
      alturaPagina -
      margem * 2

    while (
      alturaRestante > 0
    ) {
      pdf.addPage()

      posicao =
        margem -
        (
          alturaImagem -
          alturaRestante
        )

      pdf.addImage(
        imagem,
        'PNG',
        margem,
        posicao,
        larguraUtil,
        alturaImagem
      )

      alturaRestante -=
        alturaPagina -
        margem * 2
    }

    /*
      Nome do paciente seguro
      para usar como arquivo.
    */
    const nomePaciente =
      pacienteSelecionado.nome
        .trim()
        .normalize('NFD')
        .replace(
          /[\u0300-\u036f]/g,
          ''
        )
        .replace(
          /[^a-zA-Z0-9]+/g,
          '-'
        )
        .replace(
          /^-+|-+$/g,
          ''
        )

    const inicio =
      dataInicio
        .split('-')
        .reverse()
        .join('-')

    const fim =
      dataFim
        .split('-')
        .reverse()
        .join('-')

    const nomeArquivo =
      `SENSUS-MAP_${relatorioSelecionado.id}_${nomePaciente}_${inicio}_a_${fim}.pdf`

    pdf.save(
      nomeArquivo
    )
  } catch (error) {
    console.error(
      'Erro ao gerar PDF:',
      error
    )

    alert(
      'Não foi possível gerar o PDF.'
    )
  } finally {
    elemento.classList.remove(
      'gerando-pdf'
    )
  }
}

  const mostrarDetalhes =
    !pacienteSelecionado

  // =========================================
  // TELA
  // =========================================

  return (
    <main className="pagina-relatorios">

      <header className="dashboard-header">

        <div className="dashboard-marca">
          SENSUS-MAP
        </div>

        <nav className="dashboard-nav">

          <Link to="/dashboard">
            Início
          </Link>

          <Link to="/pacientes">
            Pacientes
          </Link>

          <Link to="/agendamentos">
            Agenda
          </Link>

          <Link
            to="/relatorios"
            className="nav-ativo"
          >
            Relatórios
          </Link>

        </nav>

        <div className="dashboard-usuario">

          <span>
            Psicólogo
          </span>

          <button
            type="button"
            className="botao-perfil"
          >
            Perfil
          </button>

        </div>

      </header>

      <section className="relatorios-container">

        <section className="relatorios-conteudo">

          <header className="relatorios-topo">

            <div>
              <span>
                SENSUS
              </span>

              <h1>
                Relatórios
              </h1>

              <p>
                Visualize e acompanhe os
                registros emocionais dos
                pacientes.
              </p>
            </div>

          </header>

          {/* DETALHES */}

          {mostrarDetalhes && (
            <DetalhesRelatorio
              relatorioSelecionado={
                relatorioSelecionado
              }
            />
          )}

          {/* CARREGANDO */}

          {relatorioSelecionado &&
            carregandoPacientes && (
              <div className="relatorio-status">
                Carregando pacientes...
              </div>
            )}

          {/* ERRO */}

          {relatorioSelecionado &&
            erroPacientes && (
              <div className="relatorio-status relatorio-status-erro">
                {erroPacientes}
              </div>
            )}

          {/* PACIENTE */}

          {relatorioSelecionado &&
            !carregandoPacientes &&
            !erroPacientes && (
              <SeletorPacienteRelatorio
                pacientes={
                  pacientes
                }
                pacienteSelecionado={
                  pacienteSelecionado
                }
                onSelecionarPaciente={
                  setPacienteSelecionado
                }
              />
            )}

          {/* PERÍODO */}

          <FiltrosRelatorio
            relatorioSelecionado={
              relatorioSelecionado
            }
            pacienteSelecionado={
              pacienteSelecionado
            }
            dataInicio={
              dataInicio
            }
            dataFim={
              dataFim
            }
            onAlterarDataInicio={
              alterarDataInicio
            }
            onAlterarDataFim={
              alterarDataFim
            }
            onSemanaAnterior={
              semanaAnterior
            }
            onProximaSemana={
              proximaSemana
            }
          />

          {/* RELATÓRIO */}

          {relatorioSelecionado &&
            pacienteSelecionado &&
            dataInicio &&
            dataFim && (
              <section
  className="relatorio-resultado-placeholder"
  id="relatorio-para-pdf"
>
                <div className="relatorio-acoes">
  <button
    type="button"
    onClick={imprimirRelatorio}
  >
    🖨 Imprimir
  </button>

  <button
    type="button"
    onClick={gerarPDF}
  >
    📄 Salvar em PDF
  </button>
</div>
                <div>
                  <span>
                    RELATÓRIO{' '}
                    {
                      relatorioSelecionado.id
                    }
                  </span>

                  <h2>
                    {
                      relatorioSelecionado.nome
                    }
                  </h2>

                  <p>
                    Dados de{' '}

                    <strong>
                      {
                        pacienteSelecionado.nome
                      }
                    </strong>
                  </p>

                  <p className="relatorio-documento-periodo">
  Período:{' '}
  <strong>
    {dataInicio}
  </strong>
  {' até '}
  <strong>
    {dataFim}
  </strong>
</p>

                </div>

                <VisualizacaoRelatorio
                  tipoRelatorio={
                    relatorioSelecionado.id
                  }
                  paciente={
                    pacienteSelecionado
                  }
                  dataInicio={
                    dataInicio
                  }
                  dataFim={
                    dataFim
                  }
                />

              </section>
            )}

        </section>

        <MenuRelatorios
          relatorioSelecionado={
            relatorioSelecionado
          }
          onSelecionarRelatorio={
            selecionarRelatorio
          }
        />

      </section>

    </main>
  )
}

export default Relatorios