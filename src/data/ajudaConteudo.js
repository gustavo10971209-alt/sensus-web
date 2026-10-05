export const topicosAjuda = [
  {
    slug: 'inicio',
    numero: '01',
    titulo: 'Início',
    resumo:
      'Visualize rapidamente um paciente, acompanhe seus registros emocionais, consulte o gráfico e registre observações.',
    tituloPagina:
      'Como utilizar o painel inicial',
    introducao:
      'A página inicial reúne atalhos para as principais funções do SENSUS-MAP. Nela você pode selecionar um paciente, acompanhar seus registros emocionais, consultar anotações e visualizar os próximos atendimentos.',
    secoes: [
      {
        titulo: 'Selecionar um paciente',
        texto:
          'Utilize a área de seleção de paciente para escolher quem deseja acompanhar. Depois da seleção, o painel passa a exibir as informações disponíveis daquele paciente.',
      },
      {
        titulo: 'Consultar registros emocionais',
        texto:
          'O painel apresenta um resumo dos registros emocionais enviados pelo paciente através do aplicativo SENSUS.',
      },
      {
        titulo: 'Ver dados do paciente',
        texto:
          'Use a opção “Ver dados” para abrir a página completa do paciente e consultar suas informações e histórico emocional.',
      },
      {
        titulo: 'Consultar relatórios',
        texto:
          'A opção “Relatórios” direciona para a área de relatórios, onde os registros emocionais podem ser analisados de diferentes maneiras.',
      },
      {
        titulo: 'Fazer anotações',
        texto:
          'Quando um paciente está selecionado, o bloco de notas permite registrar observações relacionadas ao acompanhamento.',
      },
      {
        titulo: 'Próximos agendamentos',
        texto:
          'A área lateral apresenta os próximos atendimentos cadastrados.',
        itens: [
          'Meus: mostra inicialmente os agendamentos associados ao psicólogo logado.',
          'Todos: permite consultar os próximos atendimentos cadastrados no sistema.',
          'Clique sobre um atendimento para abrir a Agenda e consultar mais detalhes.',
        ],
      },
    ],
  },

  {
    slug: 'pacientes',
    numero: '02',
    titulo: 'Pacientes',
    resumo:
      'Consulte os dados dos pacientes, registros emocionais e anotações realizadas durante o acompanhamento.',
    tituloPagina:
      'Como consultar pacientes',
    introducao:
      'A área de Pacientes concentra os dados disponíveis sobre cada paciente, seus registros emocionais e as anotações relacionadas ao acompanhamento.',
    secoes: [
      {
        titulo: 'Pesquisar paciente',
        texto:
          'Utilize o campo de pesquisa para localizar rapidamente um paciente pelo nome.',
      },
      {
        titulo: 'Selecionar paciente',
        texto:
          'Clique em um paciente da lista para carregar suas informações na área principal da página.',
      },
      {
        titulo: 'Informações gerais',
        texto:
          'A página apresenta os dados disponíveis do paciente, como nome, localização e situação do cadastro.',
      },
      {
        titulo: 'Resumo emocional',
        texto:
          'O sistema apresenta a quantidade de registros emocionais e também o registro mais recente enviado pelo paciente.',
      },
      {
        titulo: 'Emoções registradas',
        texto:
          'Os registros são agrupados por emoção para facilitar a visualização da frequência de cada uma.',
      },
      {
        titulo: 'Histórico emocional',
        texto:
          'Inicialmente são exibidos os registros mais recentes. Quando existirem mais registros, utilize “Ver histórico completo” para expandir a lista.',
      },
      {
        titulo: 'Anotações',
        texto:
          'O psicólogo pode consultar, criar e gerenciar suas anotações relacionadas ao paciente.',
      },
    ],
  },

  {
    slug: 'agenda',
    numero: '03',
    titulo: 'Agenda',
    resumo:
      'Crie e organize agendamentos, consulte consultas futuras e acompanhe quem criou ou alterou cada registro.',
    tituloPagina:
      'Como utilizar a Agenda',
    introducao:
      'A Agenda permite consultar, criar, editar e organizar os atendimentos dos pacientes.',
    secoes: [
      {
        titulo: 'Consultar o calendário',
        texto:
          'Navegue entre os meses utilizando os controles do calendário. Os dias que possuem atendimentos apresentam uma indicação visual.',
      },
      {
        titulo: 'Consultar um dia',
        texto:
          'Clique sobre um dia do calendário para visualizar os atendimentos cadastrados naquela data.',
      },
      {
        titulo: 'Criar um agendamento',
        texto:
          'Utilize a opção “Novo agendamento” para cadastrar um atendimento.',
        itens: [
          'Paciente',
          'Data',
          'Horário',
          'Duração',
          'Observação',
        ],
      },
      {
        titulo: 'Editar um atendimento',
        texto:
          'Abra um atendimento existente para modificar suas informações. O sistema mantém informações sobre o profissional responsável pela alteração.',
      },
      {
        titulo: 'Excluir atendimento',
        texto:
          'Quando necessário, um atendimento pode ser excluído mediante confirmação.',
      },
      {
        titulo: 'Filtrar agendamentos',
        texto:
          'Os filtros ajudam a visualizar somente os atendimentos desejados.',
        itens: [
          'Meus agendamentos: atendimentos criados pelo psicólogo logado.',
          'Todos: todos os atendimentos disponíveis.',
          'Criado por: permite filtrar pelo profissional responsável.',
        ],
      },
    ],
  },

  {
    slug: 'relatorios',
    numero: '04',
    titulo: 'Relatórios',
    resumo:
      'Gere análises dos registros emocionais, escolha períodos específicos e exporte os resultados em PDF.',
    tituloPagina:
      'Como utilizar os Relatórios',
    introducao:
      'A área de Relatórios transforma os registros emocionais dos pacientes em diferentes visualizações para auxiliar o acompanhamento profissional.',
    secoes: [
      {
        titulo: 'Selecionar um relatório',
        texto:
          'Escolha no menu lateral o tipo de relatório que deseja gerar.',
        itens: [
          '001 — Comparativo semanal de emoções',
          '002 — Emoções predominantes',
          '003 — Emoções por horário do dia',
          '004 — Evolução emocional',
          '005 — Frequência emocional',
          '006 — Resumo emocional do período',
        ],
      },
      {
        titulo: 'Selecionar paciente',
        texto:
          'Depois de escolher o relatório, selecione o paciente cujos registros deseja analisar.',
      },
      {
        titulo: 'Escolher período',
        texto:
          'Defina a data inicial e a data final. No relatório semanal também é possível navegar entre semanas.',
      },
      {
        titulo: 'Visualizar resultado',
        texto:
          'Os relatórios utilizam os registros emocionais enviados pelo paciente. Cada relatório organiza esses dados de uma maneira diferente.',
      },
      {
        titulo: 'Imprimir',
        texto:
          'Utilize o botão “Imprimir” para abrir as opções de impressão do navegador.',
      },
      {
        titulo: 'Salvar em PDF',
        texto:
          'Utilize “Salvar em PDF” para gerar um documento com o relatório atualmente selecionado.',
      },
      {
        titulo: 'Análise com inteligência artificial',
        texto:
          'Quando disponível, a análise com IA auxilia na organização e descrição dos padrões presentes nos registros emocionais.',
        aviso:
          'A análise gerada por inteligência artificial é apenas um recurso de apoio. Ela não representa diagnóstico e deve ser revisada pelo psicólogo.',
      },
      {
        titulo: 'Anotações do relatório',
        texto:
          'O psicólogo pode registrar observações enquanto consulta um relatório. Essas anotações permanecem separadas do conteúdo exportado para PDF.',
      },
    ],
  },

  {
    slug: 'anotacoes',
    numero: '05',
    titulo: 'Anotações',
    resumo:
      'Registre observações sobre os pacientes. As anotações ficam associadas ao paciente e ao psicólogo responsável.',
    tituloPagina:
      'Como utilizar as Anotações',
    introducao:
      'O bloco de notas permite registrar observações relacionadas ao acompanhamento dos pacientes.',
    secoes: [
      {
        titulo: 'Criar uma anotação',
        texto:
          'Digite sua observação no campo disponível e utilize o botão “Adicionar anotação”.',
      },
      {
        titulo: 'Onde as anotações aparecem',
        texto:
          'As anotações podem ser consultadas em diferentes partes do sistema.',
        itens: [
          'Dashboard',
          'Página do paciente',
          'Área de Relatórios',
        ],
      },
      {
        titulo: 'Identificação da anotação',
        texto:
          'Cada anotação mantém informações que ajudam a identificar seu contexto.',
        itens: [
          'Paciente relacionado',
          'Psicólogo responsável',
          'Data de criação',
          'Origem da anotação',
          'Relatório relacionado, quando aplicável',
        ],
      },
      {
        titulo: 'Editar anotação',
        texto:
          'O psicólogo pode alterar as anotações criadas por ele.',
      },
      {
        titulo: 'Excluir anotação',
        texto:
          'Também é possível excluir uma anotação criada pelo próprio profissional.',
        aviso:
          'Um profissional não deve editar ou excluir anotações criadas por outro psicólogo.',
      },
    ],
  },

  {
    slug: 'perfil',
    numero: '06',
    titulo: 'Perfil',
    resumo:
      'Consulte e atualize seus dados profissionais, como nome, CRP e telefone, além de alterar sua senha.',
    tituloPagina:
      'Como utilizar o Perfil',
    introducao:
      'A área de Perfil reúne os dados profissionais do psicólogo e as opções de segurança da conta.',
    secoes: [
      {
        titulo: 'Consultar dados profissionais',
        texto:
          'Na página de Perfil você pode consultar as informações cadastradas para sua conta.',
        itens: [
          'Nome',
          'Data de nascimento',
          'E-mail',
          'Número de celular',
          'CRP',
          'Cidade',
          'Estado',
          'País',
        ],
      },
      {
        titulo: 'Editar perfil',
        texto:
          'Clique em “Editar perfil” para habilitar os campos que podem ser modificados. Depois utilize “Salvar alterações” ou “Cancelar”.',
      },
      {
        titulo: 'E-mail',
        texto:
          'O endereço de e-mail identifica a conta de acesso ao SENSUS-MAP e pode ser consultado no Perfil.',
        aviso:
          'O e-mail não pode ser alterado pela página de Perfil.',
      },
      {
        titulo: 'Alterar senha',
        texto:
          'Na seção “Segurança da conta”, utilize “Alterar senha”, informe a nova senha e confirme-a.',
      },
      {
        titulo: 'Sair da conta',
        texto:
          'O botão “Sair” encerra a sessão atual e retorna para a tela de login.',
      },
    ],
  },
]

export function buscarTopicoAjuda(
  slug
) {
  return (
    topicosAjuda.find(
      (topico) =>
        topico.slug === slug
    ) || null
  )
}