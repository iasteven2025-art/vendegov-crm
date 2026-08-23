const modules = [
  ["dashboard", "00", "Painel", "Geral"],
  ["agenda", "01", "Agenda e viagens", "Comercial"],
  ["clientes", "02", "Clientes", "Comercial"],
  ["licitacoes", "03", "Licitacoes", "Comercial"],
  ["propostas", "04", "Propostas", "Comercial"],
  ["marketing", "05", "Marketing", "Comercial"],
  ["contratos", "06", "Contratos", "Carteira"],
  ["documentos", "07", "Entrega docs", "Carteira"],
  ["renovacoes", "08", "Renovacoes", "Carteira"],
  ["comissoes", "09", "Comissoes", "Financeiro"],
  ["ia", "10", "IA Gemini", "Automacao"],
  ["relatorios", "11", "Relatorios", "Relatorios"],
  ["configuracoes", "12", "Parametros", "Parametrizacao"],
];

const statusOptions = [
  ["green", "Ativo"],
  ["cyan", "Em analise"],
  ["yellow", "Atencao"],
  ["red", "Risco"],
];

const schemas = {
  clientes: {
    title: "Clientes",
    desc: "Empresas, contatos e potencial comercial da carteira B2G.",
    singular: "cliente",
    columns: ["Empresa", "Segmento", "Potencial", "Status", "Responsavel", "Acoes"],
    fields: [
      field("name", "Empresa", "text", true),
      field("segment", "Segmento/tipo", "select", true, ["Construcao", "Saude", "Tecnologia", "Transporte", "Alimentos", "Servicos", "Prefeitura", "Camara", "Consorcio", "Instituto", "Autarquia", "Fundacao", "Outro"]),
      field("cnpj", "CNPJ", "text"),
      field("contact", "Contato principal", "text"),
      field("email", "E-mail", "email"),
      field("phone", "Telefone", "text"),
      field("city", "Cidade/UF", "text"),
      field("website", "Site/dominio", "url"),
      field("region", "Regiao", "text"),
      field("originalName", "Nome origem", "text"),
      field("sourceId", "ID origem", "text"),
      field("potential", "Potencial", "number"),
      field("status", "Status", "select", true, statusOptions),
      field("owner", "Responsavel", "select", true, ["Steven Passos", "Diego Pereira", "Digital Compasso", "Mariana Costa", "Rafael Lima", "Equipe comercial"]),
      field("notes", "Observacoes", "textarea"),
    ],
    row: (r) => [mainCell(r.name, r.contact || r.cnpj), r.segment, money(r.potential), badge(r.status), r.owner],
  },
  licitacoes: {
    title: "Licitacoes",
    desc: "Oportunidades publicas em monitoramento, analise, proposta e resultado.",
    singular: "licitacao",
    columns: ["Licitacao", "Orgao", "Valor", "Etapa", "Prazo", "Acoes"],
    fields: [
      field("name", "Licitacao", "text", true),
      field("client", "Cliente atendido", "text", true),
      field("agency", "Orgao comprador", "text", true),
      field("modality", "Modalidade", "select", true, ["Pregao eletronico", "Concorrencia", "Dispensa", "Credenciamento", "Tomada de precos"]),
      field("object", "Objeto", "textarea"),
      field("value", "Valor estimado", "number"),
      field("stage", "Etapa", "select", true, ["Oportunidade", "Edital", "Documentos", "Proposta", "Resultado", "Contrato"]),
      field("status", "Status", "select", true, statusOptions),
      field("deadline", "Prazo", "date"),
      field("owner", "Responsavel", "select", true, ["Mariana Costa", "Rafael Lima", "Steven Passos", "Equipe docs"]),
      field("source", "Fonte/link", "text"),
      field("notes", "Observacoes", "textarea"),
    ],
    row: (r) => [mainCell(r.name, r.client), r.agency, money(r.value), `${r.stage}<br>${badge(r.status)}`, date(r.deadline)],
  },
  propostas: {
    title: "Propostas",
    desc: "Propostas tecnicas e comerciais, com validade, responsavel e margem.",
    singular: "proposta",
    columns: ["Proposta", "Cliente", "Valor", "Status", "Validade", "Acoes"],
    fields: [
      field("name", "Proposta", "text", true),
      field("client", "Cliente", "text", true),
      field("licitation", "Licitacao vinculada", "text"),
      field("value", "Valor", "number"),
      field("margin", "Margem (%)", "number"),
      field("status", "Status", "select", true, [["green", "Enviada"], ["cyan", "Gerada por IA"], ["yellow", "Em revisao"], ["red", "Pendencia"]]),
      field("sentAt", "Data de envio", "date"),
      field("validUntil", "Valida ate", "date"),
      field("owner", "Responsavel", "select", true, ["Mariana Costa", "Rafael Lima", "Steven Passos", "Equipe comercial"]),
      field("notes", "Observacoes", "textarea"),
    ],
    row: (r) => [mainCell(r.name, r.licitation), r.client, money(r.value), badge(r.status), date(r.validUntil)],
  },
  contratos: {
    title: "Contratos",
    desc: "Contratos ativos, renovacoes, reajustes, receita mensal e riscos.",
    singular: "contrato",
    columns: ["Contrato", "Cliente", "Valor total", "Mensal", "Vencimento", "Acoes"],
    fields: [
      field("name", "Contrato", "text", true),
      field("client", "Cliente", "text", true),
      field("agency", "Orgao comprador", "text"),
      field("object", "Objeto", "textarea"),
      field("legalBasis", "Fundamento legal", "text"),
      field("legalRegime", "Regime legal", "select", true, ["Lei 14.133/2021", "Lei 8.666/1993", "Outro"]),
      field("contractNature", "Natureza para vigencia", "select", true, ["Servicos continuos", "Fornecimento continuo", "Escopo definido", "Aluguel de equipamentos/software", "Obra/projeto PPA", "Emergencial/calamidade", "Receita/eficiencia", "Monopolio/servico publico", "Outro"]),
      field("prorrogable", "Permite prorrogacao/aditivo?", "select", true, ["Sim", "Nao", "Depende de justificativa"]),
      field("maxTermMonths", "Prazo maximo legal estimado (meses)", "number"),
      field("renewalAlertDays", "Alerta antes do vencimento (dias)", "number"),
      field("addendumCount", "Aditivos realizados", "number"),
      field("region", "Regiao", "text"),
      field("agencyType", "Tipo de orgao", "text"),
      field("value", "Valor total", "number"),
      field("monthly", "Receita mensal", "number"),
      field("status", "Status", "select", true, [["green", "Ativo"], ["cyan", "Reajuste"], ["yellow", "Renovacao"], ["red", "Risco"]]),
      field("start", "Inicio", "date"),
      field("end", "Fim", "date"),
      field("renewal", "Renovacao prevista", "date"),
      field("adjustment", "Indice/reajuste", "text"),
      field("attachment", "Enviar PDF para o Firebase", "file"),
      field("fileRef", "Nome do PDF na plataforma", "text"),
      field("fileUrl", "PDF salvo no VendeGov", "url"),
      field("documentUrl", "PDF origem (importado)", "url"),
      field("sourceId", "ID origem", "text"),
      field("owner", "Responsavel", "select", true, ["Steven Passos", "Diego Pereira", "Digital Compasso", "Mariana Costa", "Rafael Lima", "Financeiro", "Equipe comercial"]),
      field("notes", "Observacoes", "textarea"),
    ],
    row: (r) => [mainCell(r.name, r.agency), r.client, money(r.value), money(r.monthly), `${date(r.end)}<br>${badge(r.status)}`],
  },
  documentos: {
    title: "Entrega de documentos",
    desc: "Certidoes, anexos e pendencias de habilitacao por cliente e licitacao.",
    singular: "entrega",
    columns: ["Documento", "Cliente", "Tipo", "Status", "Prazo", "Acoes"],
    fields: [
      field("name", "Documento", "text", true),
      field("client", "Cliente", "text", true),
      field("type", "Tipo", "select", true, ["Certidao", "Atestado tecnico", "Contrato social", "Balanco", "Procuracao", "Proposta"]),
      field("status", "Status", "select", true, [["green", "Aprovado"], ["cyan", "Em revisao"], ["yellow", "Pendente"], ["red", "Vencido"]]),
      field("dueDate", "Vencimento", "date"),
      field("deliveredAt", "Entregue em", "date"),
      field("owner", "Responsavel", "select", true, ["Equipe docs", "Mariana Costa", "Rafael Lima", "Steven Passos"]),
      field("attachment", "Anexar arquivo", "file"),
      field("fileRef", "Referencia do arquivo", "text"),
      field("fileUrl", "Link do arquivo", "url"),
      field("notes", "Observacoes", "textarea"),
    ],
    row: (r) => [mainCell(r.name, r.fileRef), r.client, r.type, badge(r.status), date(r.dueDate)],
  },
  renovacoes: {
    title: "Renovacoes",
    desc: "Controle de renovacoes, reajustes, etapas, riscos e proximas tratativas.",
    singular: "renovacao",
    columns: ["Renovacao", "Cliente", "Contrato", "Valor", "Prazo", "Acoes"],
    fields: [
      field("name", "Renovacao", "text", true),
      field("client", "Cliente", "text", true),
      field("contract", "Contrato", "text", true),
      field("value", "Valor previsto", "number"),
      field("legalRegime", "Regime legal", "select", true, ["Lei 14.133/2021", "Lei 8.666/1993", "Outro"]),
      field("addendumType", "Tipo de aditivo", "select", true, ["Prorrogacao de prazo", "Reajuste", "Reequilibrio", "Acrescimo/supressao", "Renovacao comercial", "Outro"]),
      field("currentEnd", "Vigencia atual ate", "date"),
      field("proposedEnd", "Nova vigencia proposta", "date"),
      field("addendumNumber", "Numero do aditivo", "text"),
      field("regularityChecklist", "Checklist documental", "textarea"),
      field("clientEmail", "E-mail do cliente", "email"),
      field("consultantEmail", "Copia para consultor", "email"),
      field("emailStatus", "Status do envio", "select", true, [["pending", "Pendente"], ["ready", "Carta pronta"], ["queued", "Na fila"], ["sent", "Enviada"], ["blocked", "Bloqueada"]]),
      field("letterSubject", "Assunto da carta", "text"),
      field("letterDraft", "Carta de renovacao", "textarea"),
      field("letterGeneratedAt", "Carta gerada em", "date"),
      field("emailQueuedAt", "Envio na fila em", "date"),
      field("letterSentAt", "Carta enviada em", "date"),
      field("followUpAt", "Ultimo acompanhamento", "date"),
      field("stage", "Etapa", "select", true, ["Mapeada", "Em contato", "Proposta enviada", "Negociacao", "Renovada", "Perdida"]),
      field("status", "Status", "select", true, [["green", "Renovada"], ["cyan", "Em andamento"], ["yellow", "Atencao"], ["red", "Risco"]]),
      field("renewalDate", "Data limite", "date"),
      field("owner", "Responsavel", "select", true, ["Mariana Costa", "Rafael Lima", "Steven Passos", "Financeiro"]),
      field("notes", "Observacoes", "textarea"),
    ],
    row: (r) => [mainCell(r.name, r.stage), r.client, r.contract, money(r.value), `${date(r.renewalDate)}<br>${badge(r.status)}`],
  },
  agenda: {
    title: "Agenda e viagens",
    desc: "Compromissos, visitas, follow-ups, viagens e tarefas comerciais.",
    singular: "compromisso",
    columns: ["Compromisso", "Cliente", "Tipo", "Data", "Status", "Acoes"],
    fields: [
      field("name", "Compromisso", "text", true),
      field("client", "Cliente", "text"),
      field("type", "Tipo", "select", true, ["Reuniao", "Viagem", "Follow-up", "Entrega", "Treinamento", "Audiencia"]),
      field("date", "Data", "date", true),
      field("time", "Horario", "time"),
      field("city", "Cidade/UF", "text"),
      field("status", "Status", "select", true, [["green", "Concluido"], ["cyan", "Agendado"], ["yellow", "Pendente"], ["red", "Cancelado"]]),
      field("owner", "Responsavel", "select", true, ["Mariana Costa", "Rafael Lima", "Steven Passos", "Equipe comercial"]),
      field("notes", "Observacoes", "textarea"),
    ],
    row: (r) => [mainCell(r.name, r.city), r.client || "-", r.type, `${date(r.date)} ${r.time || ""}`, badge(r.status)],
  },
  marketing: {
    title: "Marketing",
    desc: "Campanhas, listas, canais, verba e retorno para gerar demanda B2G.",
    singular: "campanha",
    columns: ["Campanha", "Canal", "Publico", "Investimento", "Status", "Acoes"],
    fields: [
      field("name", "Campanha", "text", true),
      field("channel", "Canal", "select", true, ["E-mail", "WhatsApp", "LinkedIn", "Evento", "Indicacao", "Conteudo"]),
      field("audience", "Publico", "text", true),
      field("goal", "Objetivo", "select", true, ["Gerar leads", "Reativar carteira", "Divulgar edital", "Vender renovacao", "Relacionamento"]),
      field("budget", "Investimento", "number"),
      field("leads", "Leads gerados", "number"),
      field("status", "Status", "select", true, [["green", "Ativa"], ["cyan", "Planejada"], ["yellow", "Em revisao"], ["red", "Pausada"]]),
      field("start", "Inicio", "date"),
      field("end", "Fim", "date"),
      field("owner", "Responsavel", "select", true, ["Marketing", "Mariana Costa", "Rafael Lima", "Steven Passos"]),
      field("notes", "Observacoes", "textarea"),
    ],
    row: (r) => [mainCell(r.name, r.goal), r.channel, r.audience, money(r.budget), badge(r.status)],
  },
  financeiro: {
    title: "Financeiro",
    desc: "Comissoes, previsoes, recebimentos e reajustes contratuais.",
    singular: "lancamento",
    columns: ["Lancamento", "Cliente", "Tipo", "Valor", "Status", "Acoes"],
    fields: [
      field("name", "Lancamento", "text", true),
      field("client", "Cliente/carteira", "text"),
      field("type", "Tipo", "select", true, ["Comissao", "Receita", "Reajuste", "Despesa", "Boleto"]),
      field("value", "Valor", "number"),
      field("dueDate", "Vencimento", "date"),
      field("status", "Status", "select", true, [["green", "Pago"], ["cyan", "Previsto"], ["yellow", "A validar"], ["red", "Atrasado"]]),
      field("owner", "Responsavel", "select", true, ["Financeiro", "Mariana Costa", "Rafael Lima", "Steven Passos"]),
      field("notes", "Observacoes", "textarea"),
    ],
    row: (r) => [mainCell(r.name, date(r.dueDate)), r.client || "-", r.type, money(r.value), badge(r.status)],
  },
  comissoes: {
    title: "Comissoes",
    desc: "Comissoes por vendedor, cliente, contrato, vencimento, pagamento e status.",
    singular: "comissao",
    columns: ["Comissao", "Vendedor", "Cliente", "Valor", "Status", "Acoes"],
    fields: [
      field("name", "Comissao", "text", true),
      field("seller", "Vendedor", "select", true, ["Mariana Costa", "Rafael Lima", "Steven Passos", "Equipe comercial"]),
      field("client", "Cliente", "text", true),
      field("contract", "Contrato/proposta", "text"),
      field("baseValue", "Base de calculo", "number"),
      field("percentage", "Percentual (%)", "number"),
      field("value", "Valor da comissao", "number"),
      field("status", "Status", "select", true, [["green", "Paga"], ["cyan", "Prevista"], ["yellow", "A aprovar"], ["red", "Atrasada"]]),
      field("dueDate", "Vencimento", "date"),
      field("paidAt", "Pago em", "date"),
      field("notes", "Observacoes", "textarea"),
    ],
    row: (r) => [mainCell(r.name, r.contract), r.seller, r.client, money(r.value), badge(r.status)],
  },
  usuarios: {
    title: "Usuarios",
    desc: "Equipe, perfil e situacao de acesso.",
    singular: "usuario",
    columns: ["Usuario", "Perfil", "Status", "E-mail", "Ultimo acesso", "Acoes"],
    fields: [
      field("name", "Nome", "text", true),
      field("email", "E-mail", "email", true),
      field("role", "Perfil", "select", true, ["Administrador", "Gestor", "Comercial", "Consultor", "Consultor Comercial", "Consultor de Negocios", "Documentos", "Financeiro"]),
      field("phone", "Telefone", "text"),
      field("photoUrl", "Foto", "url"),
      field("contactEmail", "E-mail de contato", "email"),
      field("sourceId", "ID origem", "text"),
      field("status", "Status", "select", true, [["green", "Ativo"], ["yellow", "Pendente"], ["red", "Bloqueado"]]),
      field("lastAccess", "Ultimo acesso", "date"),
      field("notes", "Observacoes", "textarea"),
    ],
    row: (r) => [mainCell(r.name, r.email), r.role, badge(r.status), r.email, date(r.lastAccess)],
  },
  templates: {
    title: "Templates de e-mail",
    desc: "Mensagens padronizadas para propostas, documentos e renovacoes.",
    singular: "template",
    columns: ["Template", "Tipo", "Status", "Assunto", "Atualizado", "Acoes"],
    fields: [
      field("name", "Nome", "text", true),
      field("type", "Tipo", "select", true, ["Proposta", "Documentos", "Renovacao", "Follow-up", "Cobranca"]),
      field("subject", "Assunto", "text", true),
      field("status", "Status", "select", true, [["green", "Ativo"], ["yellow", "Rascunho"], ["red", "Inativo"]]),
      field("updatedAt", "Atualizado em", "date"),
      field("body", "Mensagem", "textarea"),
    ],
    row: (r) => [mainCell(r.name, r.subject), r.type, badge(r.status), r.subject, date(r.updatedAt)],
  },
  empresas: {
    title: "Empresas",
    desc: "Empresas internas, regioes e carteiras comerciais.",
    singular: "empresa",
    columns: ["Empresa", "Regiao", "Status", "Gestor", "Carteira", "Acoes"],
    fields: [
      field("name", "Empresa", "text", true),
      field("region", "Regiao", "select", true, ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul", "Nacional"]),
      field("portfolio", "Carteira", "text"),
      field("manager", "Gestor", "text"),
      field("status", "Status", "select", true, [["green", "Ativa"], ["yellow", "Implantacao"], ["red", "Inativa"]]),
      field("notes", "Observacoes", "textarea"),
    ],
    row: (r) => [mainCell(r.name, r.portfolio), r.region, badge(r.status), r.manager, r.portfolio],
  },
  regioes: {
    title: "Regioes",
    desc: "Regioes comerciais, responsaveis e metas de carteira.",
    singular: "regiao",
    columns: ["Regiao", "Responsavel", "Meta", "Status", "Observacao", "Acoes"],
    fields: [
      field("name", "Regiao", "text", true),
      field("owner", "Responsavel", "text", true),
      field("states", "UFs atendidas", "text"),
      field("goal", "Meta mensal", "number"),
      field("status", "Status", "select", true, [["green", "Ativa"], ["cyan", "Expansao"], ["yellow", "Revisao"], ["red", "Inativa"]]),
      field("notes", "Observacoes", "textarea"),
    ],
    row: (r) => [mainCell(r.name, r.states), r.owner, money(r.goal), badge(r.status), r.notes || "-"],
  },
  documentosImportantes: {
    title: "Documentos importantes",
    desc: "Documentos padrao exigidos em processos, validade e obrigatoriedade.",
    singular: "documento importante",
    columns: ["Documento", "Categoria", "Uso", "Validade", "Status", "Acoes"],
    fields: [
      field("name", "Documento", "text", true),
      field("category", "Categoria", "select", true, ["Fiscal", "Juridico", "Tecnico", "Financeiro", "Societario"]),
      field("requiredFor", "Obrigatorio para", "text", true),
      field("validityDays", "Validade padrao em dias", "number"),
      field("status", "Status", "select", true, [["green", "Ativo"], ["cyan", "Opcional"], ["yellow", "Em revisao"], ["red", "Inativo"]]),
      field("owner", "Responsavel", "select", true, ["Equipe docs", "Juridico", "Financeiro", "Comercial"]),
      field("notes", "Observacoes", "textarea"),
    ],
    row: (r) => [mainCell(r.name, r.owner), r.category, r.requiredFor, `${r.validityDays || 0} dias`, badge(r.status)],
  },
  sistema: {
    title: "Sistema",
    desc: "Parametros operacionais, integracoes previstas e regras gerais.",
    singular: "parametro",
    columns: ["Parametro", "Area", "Valor", "Status", "Atualizado", "Acoes"],
    fields: [
      field("name", "Parametro", "text", true),
      field("area", "Area", "select", true, ["Comercial", "Carteira", "Financeiro", "IA", "Seguranca", "Integracoes"]),
      field("value", "Valor", "text", true),
      field("status", "Status", "select", true, [["green", "Ativo"], ["cyan", "Planejado"], ["yellow", "Validar"], ["red", "Inativo"]]),
      field("updatedAt", "Atualizado em", "date"),
      field("notes", "Observacoes", "textarea"),
    ],
    row: (r) => [mainCell(r.name, r.notes), r.area, r.value, badge(r.status), date(r.updatedAt)],
  },
  gruposUsuarios: {
    title: "Grupos de usuarios",
    desc: "Perfis, permissoes e limites de acesso por equipe.",
    singular: "grupo",
    columns: ["Grupo", "Permissoes", "Status", "Usuarios", "Responsavel", "Acoes"],
    fields: [
      field("name", "Grupo", "text", true),
      field("permissions", "Permissoes", "textarea", true),
      field("users", "Usuarios vinculados", "number"),
      field("status", "Status", "select", true, [["green", "Ativo"], ["yellow", "Revisao"], ["red", "Bloqueado"]]),
      field("owner", "Responsavel", "select", true, ["Steven Passos", "Mariana Costa", "Financeiro", "Equipe docs"]),
      field("notes", "Observacoes", "textarea"),
    ],
    row: (r) => [mainCell(r.name, r.notes), r.permissions, badge(r.status), r.users || 0, r.owner],
  },
};

const state = {
  view: "dashboard",
  query: "",
  status: "todos",
  configTab: "usuarios",
  editing: null,
  deleteTarget: null,
  clientDetailId: "",
  clientTab: "contratos",
  aiBusy: "",
  aiFocus: "",
  aiContractId: "",
  aiDraftContract: null,
  aiLastExtraction: null,
  aiLetter: "",
  contractFormAiBusy: false,
  contractFormAiFile: null,
  contractFormAiExtraction: null,
};

let db = emptyDb();

const el = {
  loginScreen: document.querySelector("#loginScreen"),
  appShell: document.querySelector("#appShell"),
  loginForm: document.querySelector("#loginForm"),
  nav: document.querySelector("#mainNav"),
  title: document.querySelector("#pageTitle"),
  kicker: document.querySelector("#pageKicker"),
  content: document.querySelector("#content"),
  search: document.querySelector("#globalSearch"),
  newButton: document.querySelector("#newButton"),
  exportButton: document.querySelector("#exportButton"),
  importButton: document.querySelector("#importButton"),
  importFile: document.querySelector("#importFile"),
  logoutButton: document.querySelector("#logoutButton"),
  modal: document.querySelector("#recordModal"),
  form: document.querySelector("#recordForm"),
  modalTitle: document.querySelector("#modalTitle"),
  modalKicker: document.querySelector("#modalKicker"),
  closeModal: document.querySelector("#closeModal"),
  confirmModal: document.querySelector("#confirmModal"),
  confirmText: document.querySelector("#confirmText"),
  cancelDelete: document.querySelector("#cancelDelete"),
  confirmDelete: document.querySelector("#confirmDelete"),
  drawer: document.querySelector("#detailDrawer"),
  drawerBackdrop: document.querySelector("#drawerBackdrop"),
  drawerKicker: document.querySelector("#drawerKicker"),
  drawerTitle: document.querySelector("#drawerTitle"),
  drawerBody: document.querySelector("#drawerBody"),
  closeDrawer: document.querySelector("#closeDrawer"),
  toast: document.querySelector("#toast"),
  cloudStatus: document.querySelector("#cloudStatus"),
};

function field(name, label, type, required = false, options = null) {
  return { name, label, type, required, options };
}

function seedDb() {
  return {
    clientes: [
      record({ name: "Construtora Vale Norte", segment: "Construcao", cnpj: "12.345.678/0001-90", contact: "Paula Farias", email: "paula@valenorte.com.br", phone: "(31) 98888-1200", city: "Belo Horizonte/MG", potential: 1800000, status: "green", owner: "Mariana Costa", notes: "Carteira ativa com contratos de obras e manutencao." }),
      record({ name: "MedSupply Brasil", segment: "Saude", cnpj: "22.876.111/0001-44", contact: "Andre Mota", email: "andre@medsupply.com.br", phone: "(11) 97777-4800", city: "Sao Paulo/SP", potential: 742000, status: "cyan", owner: "Rafael Lima", notes: "Alto potencial em hospitais regionais." }),
      record({ name: "TechVia Servicos", segment: "Tecnologia", cnpj: "31.555.210/0001-10", contact: "Nadia Lopes", email: "nadia@techvia.com.br", phone: "(85) 96666-9010", city: "Fortaleza/CE", potential: 318000, status: "yellow", owner: "Steven Passos", notes: "Precisa organizar atestados tecnicos." }),
      record({ name: "Alfa Mobilidade", segment: "Transporte", cnpj: "44.923.800/0001-88", contact: "Roberto Alves", email: "roberto@alfamob.com.br", phone: "(41) 95555-7712", city: "Curitiba/PR", potential: 964000, status: "green", owner: "Mariana Costa", notes: "Reajuste contratual previsto." }),
      record({ name: "Nutriplan Alimentos", segment: "Alimentos", cnpj: "18.452.733/0001-75", contact: "Clara Martins", email: "clara@nutriplan.com.br", phone: "(62) 94444-2288", city: "Goiania/GO", potential: 526000, status: "red", owner: "Equipe comercial", notes: "Pendencia fiscal bloqueando habilitacao." }),
    ],
    licitacoes: [
      record({ name: "Pregao eletronico 184/2026", client: "MedSupply Brasil", agency: "Hospital Regional Norte", modality: "Pregao eletronico", object: "Fornecimento de equipamentos hospitalares", value: 420000, stage: "Documentos", status: "yellow", deadline: "2026-08-26", owner: "Mariana Costa", source: "Portal de compras", notes: "IA extraiu 8 documentos obrigatorios." }),
      record({ name: "Concorrencia 09/2026", client: "Construtora Vale Norte", agency: "Secretaria de Obras", modality: "Concorrencia", object: "Reforma de unidades administrativas", value: 2100000, stage: "Edital", status: "cyan", deadline: "2026-08-31", owner: "Rafael Lima", source: "Diario oficial", notes: "Analisar capacidade tecnica exigida." }),
      record({ name: "Dispensa 77/2026", client: "TechVia Servicos", agency: "Universidade Estadual", modality: "Dispensa", object: "Suporte tecnico 24x7", value: 98000, stage: "Proposta", status: "green", deadline: "2026-08-28", owner: "Steven Passos", source: "E-mail do comprador", notes: "Proposta gerada por template." }),
      record({ name: "Pregao 225/2026", client: "Nutriplan Alimentos", agency: "Consorcio Intermunicipal", modality: "Pregao eletronico", object: "Kits de alimentacao escolar", value: 670000, stage: "Oportunidade", status: "yellow", deadline: "2026-09-04", owner: "Equipe docs", source: "Monitoramento", notes: "Regularizar certidao antes do envio." }),
    ],
    propostas: [
      record({ name: "Proposta tecnica - Hospital Norte", client: "MedSupply Brasil", licitation: "Pregao eletronico 184/2026", value: 420000, margin: 18, status: "yellow", sentAt: "", validUntil: "2026-09-10", owner: "Mariana Costa", notes: "Aguardando revisao tecnica." }),
      record({ name: "Projeto executivo - Obras", client: "Construtora Vale Norte", licitation: "Concorrencia 09/2026", value: 2100000, margin: 22, status: "green", sentAt: "2026-08-18", validUntil: "2026-09-18", owner: "Rafael Lima", notes: "Enviada com anexos de capacidade tecnica." }),
      record({ name: "Suporte 24x7 - Universidade", client: "TechVia Servicos", licitation: "Dispensa 77/2026", value: 98000, margin: 27, status: "cyan", sentAt: "", validUntil: "2026-08-28", owner: "Steven Passos", notes: "Gerada por IA e template comercial." }),
    ],
    contratos: [
      record({ name: "Contrato 021/2026", client: "Construtora Vale Norte", agency: "Secretaria de Obras", value: 1800000, monthly: 150000, status: "green", start: "2026-02-01", end: "2027-01-31", renewal: "2026-12-10", adjustment: "IPCA", owner: "Mariana Costa", notes: "Contrato principal da carteira." }),
      record({ name: "Contrato 114/2025", client: "MedSupply Brasil", agency: "Hospital Regional Norte", value: 742000, monthly: 61833, status: "yellow", start: "2025-10-01", end: "2026-09-30", renewal: "2026-09-05", adjustment: "IGP-M", owner: "Rafael Lima", notes: "Renovacao em andamento." }),
      record({ name: "Contrato 044/2026", client: "Alfa Mobilidade", agency: "Consorcio de Transporte", value: 964000, monthly: 80333, status: "cyan", start: "2026-01-15", end: "2026-12-15", renewal: "2026-11-01", adjustment: "IPCA + 2%", owner: "Financeiro", notes: "Reajuste pendente de validacao." }),
      record({ name: "Contrato 087/2024", client: "Nutriplan Alimentos", agency: "Prefeitura Municipal", value: 526000, monthly: 43833, status: "red", start: "2024-09-01", end: "2026-08-31", renewal: "2026-08-24", adjustment: "Sem indice definido", owner: "Equipe docs", notes: "Risco por pendencia documental." }),
    ],
    renovacoes: [
      record({ name: "Renovar Hospital Norte", client: "MedSupply Brasil", contract: "Contrato 114/2025", value: 812000, stage: "Negociacao", status: "yellow", renewalDate: "2026-09-05", owner: "Rafael Lima", notes: "Aguardar validacao de reajuste e escopo." }),
      record({ name: "Renovar Alfa Mobilidade", client: "Alfa Mobilidade", contract: "Contrato 044/2026", value: 1030000, stage: "Em contato", status: "cyan", renewalDate: "2026-11-01", owner: "Financeiro", notes: "Reajuste por IPCA + 2% em simulacao." }),
      record({ name: "Renovar Nutriplan", client: "Nutriplan Alimentos", contract: "Contrato 087/2024", value: 552000, stage: "Mapeada", status: "red", renewalDate: "2026-08-24", owner: "Equipe docs", notes: "Documentacao fiscal bloqueia avance." }),
    ],
    documentos: [
      record({ name: "Certidao federal", client: "Nutriplan Alimentos", type: "Certidao", status: "red", dueDate: "2026-08-31", deliveredAt: "", owner: "Equipe docs", fileRef: "certidao-federal.pdf", notes: "Vence antes do envio da proposta." }),
      record({ name: "Atestado tecnico - Obras", client: "Construtora Vale Norte", type: "Atestado tecnico", status: "green", dueDate: "2027-02-10", deliveredAt: "2026-08-18", owner: "Rafael Lima", fileRef: "atestado-obras.pdf", notes: "Valido para concorrencia atual." }),
      record({ name: "Balanco patrimonial", client: "TechVia Servicos", type: "Balanco", status: "yellow", dueDate: "2026-09-15", deliveredAt: "", owner: "Steven Passos", fileRef: "balanco-2025.xlsx", notes: "Contabilidade revisando." }),
      record({ name: "Contrato social", client: "MedSupply Brasil", type: "Contrato social", status: "green", dueDate: "2028-01-01", deliveredAt: "2026-08-09", owner: "Equipe docs", fileRef: "contrato-social.pdf", notes: "Atualizado." }),
    ],
    agenda: [
      record({ name: "Reuniao de renovacao", client: "MedSupply Brasil", type: "Reuniao", date: "2026-08-24", time: "09:30", city: "Sao Paulo/SP", status: "cyan", owner: "Rafael Lima", notes: "Levar relatorio de consumo do contrato." }),
      record({ name: "Entrega de documentos", client: "Nutriplan Alimentos", type: "Entrega", date: "2026-08-25", time: "14:00", city: "Goiania/GO", status: "yellow", owner: "Equipe docs", notes: "Regularizar certidao." }),
      record({ name: "Visita tecnica", client: "Construtora Vale Norte", type: "Viagem", date: "2026-08-29", time: "08:00", city: "Belo Horizonte/MG", status: "cyan", owner: "Mariana Costa", notes: "Preparar relatorio de viagem." }),
    ],
    marketing: [
      record({ name: "Campanha renovacoes setembro", channel: "E-mail", audience: "Clientes com contrato vencendo em 90 dias", goal: "Vender renovacao", budget: 3200, leads: 18, status: "green", start: "2026-08-20", end: "2026-09-20", owner: "Marketing", notes: "Sequencia com template de renovacao." }),
      record({ name: "Webinar como vender para governo", channel: "LinkedIn", audience: "Empresas B2G de tecnologia e servicos", goal: "Gerar leads", budget: 5800, leads: 43, status: "cyan", start: "2026-09-01", end: "2026-09-15", owner: "Mariana Costa", notes: "Conectar formulario de interessados." }),
      record({ name: "Reativacao carteira inativa", channel: "WhatsApp", audience: "Clientes sem proposta ha 120 dias", goal: "Reativar carteira", budget: 900, leads: 12, status: "yellow", start: "2026-08-22", end: "2026-08-30", owner: "Rafael Lima", notes: "Validar lista antes do disparo." }),
    ],
    financeiro: [
      record({ name: "Comissao agosto - Mariana", client: "Carteira obras", type: "Comissao", value: 18420, dueDate: "2026-08-30", status: "cyan", owner: "Financeiro", notes: "Aguardando fechamento mensal." }),
      record({ name: "Comissao agosto - Rafael", client: "Carteira saude", type: "Comissao", value: 12760, dueDate: "2026-08-25", status: "green", owner: "Financeiro", notes: "Liberado." }),
      record({ name: "Receita recorrente mensal", client: "Carteira ativa", type: "Receita", value: 286400, dueDate: "2026-08-31", status: "green", owner: "Financeiro", notes: "Base demonstrativa." }),
      record({ name: "Reajustes pendentes", client: "Contratos ativos", type: "Reajuste", value: 42800, dueDate: "2026-09-10", status: "yellow", owner: "Financeiro", notes: "Validar indices." }),
    ],
    comissoes: [
      record({ name: "Comissao contrato obras", seller: "Mariana Costa", client: "Construtora Vale Norte", contract: "Contrato 021/2026", baseValue: 150000, percentage: 3, value: 4500, status: "green", dueDate: "2026-08-30", paidAt: "2026-08-20", notes: "Comissao recorrente mensal." }),
      record({ name: "Comissao renovacao saude", seller: "Rafael Lima", client: "MedSupply Brasil", contract: "Contrato 114/2025", baseValue: 61833, percentage: 4, value: 2473, status: "yellow", dueDate: "2026-08-25", paidAt: "", notes: "Aprovar apos aceite da renovacao." }),
      record({ name: "Comissao proposta suporte", seller: "Steven Passos", client: "TechVia Servicos", contract: "Dispensa 77/2026", baseValue: 98000, percentage: 5, value: 4900, status: "cyan", dueDate: "2026-09-05", paidAt: "", notes: "Prevista se proposta for vencedora." }),
      record({ name: "Comissao carteira alimentos", seller: "Equipe comercial", client: "Nutriplan Alimentos", contract: "Contrato 087/2024", baseValue: 43833, percentage: 2, value: 877, status: "red", dueDate: "2026-08-18", paidAt: "", notes: "Bloqueada por pendencia documental." }),
    ],
    usuarios: [
      record({ name: "Steven Passos", email: "steven.passos@computeck.com.br", role: "Administrador", status: "green", lastAccess: today() }),
      record({ name: "Mariana Costa", email: "mariana@vendegov.com.br", role: "Gestor", status: "green", lastAccess: "2026-08-21" }),
      record({ name: "Rafael Lima", email: "rafael@vendegov.com.br", role: "Comercial", status: "green", lastAccess: "2026-08-20" }),
      record({ name: "Equipe documentos", email: "docs@vendegov.com.br", role: "Documentos", status: "yellow", lastAccess: "2026-08-18" }),
    ],
    templates: [
      record({ name: "Envio de proposta", type: "Proposta", subject: "Proposta comercial - {{cliente}}", status: "green", updatedAt: "2026-08-12", body: "Segue proposta comercial para analise." }),
      record({ name: "Pendencia documental", type: "Documentos", subject: "Documentos pendentes para habilitacao", status: "green", updatedAt: "2026-08-10", body: "Identificamos documentos pendentes para a licitacao." }),
      record({ name: "Renovacao de contrato", type: "Renovacao", subject: "Renovacao contratual - {{contrato}}", status: "yellow", updatedAt: "2026-08-08", body: "Vamos iniciar a tratativa de renovacao." }),
    ],
    empresas: [
      record({ name: "Computeck Solucoes Inteligentes", region: "Nacional", portfolio: "Gestao B2G", manager: "Steven Passos", status: "green", notes: "Empresa proprietaria do produto." }),
      record({ name: "Grupo Actcon", region: "Sudeste", portfolio: "Consultoria publica", manager: "Mariana Costa", status: "green", notes: "Carteira demonstrativa." }),
    ],
    regioes: [
      record({ name: "Sudeste", owner: "Mariana Costa", states: "SP, RJ, MG, ES", goal: 420000, status: "green", notes: "Maior carteira em receita recorrente." }),
      record({ name: "Nordeste", owner: "Rafael Lima", states: "BA, PE, CE, RN, PB", goal: 210000, status: "cyan", notes: "Expansao com foco em saude e tecnologia." }),
      record({ name: "Centro-Oeste", owner: "Steven Passos", states: "GO, MT, MS, DF", goal: 160000, status: "yellow", notes: "Carteira em reorganizacao." }),
    ],
    documentosImportantes: [
      record({ name: "Certidao negativa federal", category: "Fiscal", requiredFor: "Habilitacao fiscal", validityDays: 180, status: "green", owner: "Equipe docs", notes: "Conferir antes de cada proposta." }),
      record({ name: "Atestado de capacidade tecnica", category: "Tecnico", requiredFor: "Pregoes e concorrencias", validityDays: 0, status: "green", owner: "Comercial", notes: "Classificar por objeto e segmento." }),
      record({ name: "Balanco patrimonial", category: "Financeiro", requiredFor: "Qualificacao economica", validityDays: 365, status: "yellow", owner: "Financeiro", notes: "Atualizar fechamento anual." }),
      record({ name: "Contrato social consolidado", category: "Societario", requiredFor: "Credenciamento e habilitacao", validityDays: 0, status: "green", owner: "Juridico", notes: "Manter ultima alteracao arquivada." }),
    ],
    sistema: [
      record({ name: "Alerta de vencimento", area: "Carteira", value: "30 dias", status: "green", updatedAt: "2026-08-18", notes: "Usado no painel de proximas acoes." }),
      record({ name: "Indice padrao de reajuste", area: "Financeiro", value: "IPCA", status: "green", updatedAt: "2026-08-14", notes: "Pode ser alterado por contrato." }),
      record({ name: "Modelo de IA para editais", area: "IA", value: "Assistente documental", status: "cyan", updatedAt: "2026-08-12", notes: "Assistente preparado para analise documental." }),
      record({ name: "Integracao portal de compras", area: "Integracoes", value: "Planejada", status: "yellow", updatedAt: "2026-08-10", notes: "Etapa futura para SaaS." }),
    ],
    gruposUsuarios: [
      record({ name: "Administradores", permissions: "Acesso total, configuracoes, usuarios, auditoria e exportacao.", users: 1, status: "green", owner: "Steven Passos", notes: "Perfil restrito." }),
      record({ name: "Comercial", permissions: "Clientes, agenda, licitacoes, propostas, marketing e relatorios de vendas.", users: 3, status: "green", owner: "Mariana Costa", notes: "Equipe de relacionamento." }),
      record({ name: "Documentos", permissions: "Entrega de documentos, documentos importantes, licitacoes e alertas.", users: 2, status: "yellow", owner: "Equipe docs", notes: "Revisar permissao de exclusao." }),
      record({ name: "Financeiro", permissions: "Comissoes, contratos, reajustes e relatorios financeiros.", users: 2, status: "green", owner: "Financeiro", notes: "Perfil operacional." }),
    ],
    audit: [],
  };
}

function emptyDb() {
  const clean = {};
  Object.keys(schemas).forEach((key) => {
    clean[key] = [];
  });
  clean.audit = [];
  clean.notificacoes = [];
  return clean;
}

function isDemoDb(data) {
  const hasRecord = (key, name) => Array.isArray(data?.[key]) && data[key].some((item) => item?.name === name);
  return (
    hasRecord("clientes", "Construtora Vale Norte") ||
    hasRecord("clientes", "MedSupply Brasil") ||
    hasRecord("contratos", "Contrato 021/2026") ||
    hasRecord("financeiro", "Receita recorrente mensal")
  );
}

function record(values) {
  return { id: uid(), createdAt: now(), updatedAt: now(), ...values };
}

function uid() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function now() {
  return new Date().toISOString();
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function cloud() {
  return window.VendeGovCloud || null;
}

function cloudEnabled() {
  return Boolean(cloud() && cloud().enabled);
}

function setCloudStatus(message) {
  if (el.cloudStatus) el.cloudStatus.textContent = message;
}

function currentUserLabel() {
  const user = cloud()?.currentUser?.();
  return user?.email || "Usuario Firebase";
}

async function enterSystem(email, password) {
  if (!cloudEnabled()) {
    setCloudStatus("Firebase obrigatorio. Verifique a configuracao do projeto.");
    toast("O sistema roda somente no Firebase.");
    return false;
  }
  setCloudStatus("Conectando ao Firebase...");
  try {
    const user = await cloud().signIn(email, password);
    const remoteDb = await cloud().loadDb(emptyDb());
    db = isDemoDb(remoteDb) ? emptyDb() : { ...emptyDb(), ...remoteDb };
    const renewed = syncAllContractRenewals();
    const automated = await processRenewalAutomation({ generateLetters: true });
    if (isDemoDb(remoteDb)) {
      await cloud().saveDb(db);
    } else if (renewed || automated) {
      await cloud().saveDb(db);
    }
    setCloudStatus(`Firebase conectado: ${user.email || "usuario autenticado"}.`);
    toast("Firebase conectado. Dados sincronizados.");
  } catch (error) {
    setCloudStatus("Nao foi possivel entrar pelo Firebase. Verifique usuario e senha.");
    toast("Nao foi possivel entrar pelo Firebase.");
    return false;
  }
  el.loginScreen.classList.add("hidden");
  el.appShell.classList.remove("hidden");
  setView("dashboard");
  return true;
}

function saveDb(action, detail) {
  if (action) db.audit.unshift(auditRecord(action, detail));
  db.audit = db.audit.slice(0, 80);
  if (!cloudEnabled()) {
    setCloudStatus("Firebase obrigatorio. Alteracao nao salva.");
    toast("Firebase nao conectado. Alteracao nao salva.");
    return;
  }
  cloud()
    .saveDb(db)
    .then(() => setCloudStatus("Alteracao salva no Firebase."))
    .catch(() => {
      setCloudStatus("Falha ao salvar no Firebase. Verifique a conexao.");
      toast("Falha ao salvar no Firebase.");
    });
}

function auditRecord(action, detail) {
  return { id: uid(), at: now(), user: currentUserLabel(), action, detail };
}

function init() {
  renderNav();
  bindEvents();
  updateLoginNumbers();
  setCloudStatus(cloudEnabled() ? "Firebase configurado. Entre para acessar." : "Firebase obrigatorio. Configure o projeto para entrar.");
}

function bindEvents() {
  el.loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(el.loginForm);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const entered = await enterSystem(email, password);
    if (entered) toast("Bem-vindo ao VendeGov CRM.");
  });
  el.logoutButton.addEventListener("click", async () => {
    if (cloudEnabled()) await cloud().signOut().catch(() => {});
    el.appShell.classList.add("hidden");
    el.loginScreen.classList.remove("hidden");
    setCloudStatus(cloudEnabled() ? "Firebase configurado. Entre para acessar." : "Firebase obrigatorio. Configure o projeto para entrar.");
  });
  el.nav.addEventListener("click", (event) => {
    const button = event.target.closest("[data-view]");
    if (button) setView(button.dataset.view);
  });
  el.search.addEventListener("input", (event) => {
    state.query = event.target.value.trim().toLowerCase();
    render();
  });
  el.newButton.addEventListener("click", () => openForm(activeCrudModule()));
  el.closeModal.addEventListener("click", closeForm);
  el.modal.addEventListener("click", (event) => {
    if (event.target === el.modal) closeForm();
  });
  el.form.addEventListener("submit", submitForm);
  el.exportButton.addEventListener("click", exportDb);
  el.importButton.addEventListener("click", () => {
    el.importFile.dataset.mode = "";
    el.importFile.accept = ".json,.csv,application/json,text/csv";
    el.importFile.click();
  });
  el.importFile.addEventListener("change", importDb);
  el.cancelDelete.addEventListener("click", closeConfirm);
  el.confirmDelete.addEventListener("click", deleteConfirmed);
  el.closeDrawer.addEventListener("click", closeDrawer);
  el.drawerBackdrop.addEventListener("click", closeDrawer);
}

function renderNav() {
  let currentGroup = "";
  el.nav.innerHTML = modules
    .map(([key, code, label, group]) => {
      const groupTitle = group && group !== currentGroup ? `<span class="nav-group">${group}</span>` : "";
      currentGroup = group || currentGroup;
      return `${groupTitle}<button class="nav-item" data-view="${key}" type="button"><span class="nav-code">${code}</span><span>${label}</span></button>`;
    })
    .join("");
}

function setView(view) {
  state.view = view;
  if (view !== "cliente") state.clientDetailId = "";
  state.status = "todos";
  state.query = "";
  el.search.value = "";
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === view));
  render();
}

function render() {
  const meta = viewMeta(state.view);
  el.title.textContent = meta.title;
  el.kicker.textContent = meta.kicker;
  el.newButton.disabled = ["dashboard", "relatorios", "ia", "cliente"].includes(state.view);
  if (state.view === "dashboard") return renderDashboard();
  if (state.view === "cliente") return renderClientDetail();
  if (state.view === "ia") return renderAi();
  if (state.view === "renovacoes") return renderRenewals();
  if (state.view === "relatorios") return renderReports();
  if (state.view === "configuracoes") return renderSettings();
  return renderCrud(state.view);
}

function viewMeta(view) {
  if (view === "dashboard") return { title: "Painel executivo", kicker: "Visao geral" };
  if (view === "cliente") return { title: "Ficha do cliente", kicker: "Carteira" };
  if (view === "ia") return { title: "IA Gemini", kicker: "Automacao operacional" };
  if (view === "relatorios") return { title: "Relatorios", kicker: "Vendas, gestao e comissoes" };
  if (view === "configuracoes") return { title: "Parametrizacao", kicker: "Administracao" };
  return { title: schemas[view].title, kicker: "Modulo" };
}

function renderDashboard() {
  const monthly = sum(db.contratos || [], "monthly");
  const adjustments = money(sum((db.financeiro || []).filter((item) => item.type === "Reajuste"), "value"));
  const activeContracts = (db.contratos || []).filter((item) => item.status === "green" || item.status === "cyan").length;
  const openBids = (db.licitacoes || []).filter((item) => item.stage !== "Contrato" && item.status !== "red").length;
  const alerts = [...(db.documentos || []), ...(db.contratos || []), ...(db.renovacoes || []), ...(db.comissoes || [])].filter((item) => item.status === "yellow" || item.status === "red").length;
  const commissionsOpen = sum((db.comissoes || []).filter((item) => item.status !== "green"), "value");
  el.content.innerHTML = `
    <div class="metric-grid">
      ${metric("Receita mensal", money(monthly), `+ ${adjustments} em reajustes`)}
      ${metric("Contratos ativos", activeContracts, "base monitorada")}
      ${metric("Licitacoes abertas", openBids, "em execucao comercial")}
      ${metric("Alertas", alerts, `${money(commissionsOpen)} em comissoes abertas`)}
    </div>
    <div class="grid-2">
      <section class="panel">
        <div class="panel-header">
          <div><h2>Pipeline B2G</h2><p>Visao por etapa das licitacoes e propostas ativas.</p></div>
          <button class="secondary-button" data-jump="licitacoes" type="button">Abrir licitacoes</button>
        </div>
        <div class="kanban">${renderKanban()}</div>
      </section>
      <section class="panel">
        <div class="panel-header">
          <div><h2>IA operacional</h2><p>Automacoes operacionais para apoiar a rotina comercial.</p></div>
        </div>
        <div class="ai-grid">
          ${aiButton("ED", "Analisar edital", "Extrai objeto, documentos, prazos e riscos.")}
          ${aiButton("DC", "Preparar documentos", "Monta checklist de habilitacao e pendencias.")}
          ${aiButton("PR", "Gerar proposta", "Cria proposta tecnica e comercial a partir de templates.")}
          ${aiButton("CT", "Analisar contrato", "Identifica vencimento, reajuste e obrigacoes.")}
          ${aiButton("DG", "Diagnostico digital", "Mostra maturidade, riscos e proximas acoes.")}
          ${aiButton("RV", "Relatorio de viagem", "Gera resumo de visita, custos e encaminhamentos.")}
        </div>
      </section>
    </div>
    <section class="table-panel">
      <div class="table-toolbar">
        <div><h2>Proximas acoes</h2><p>Prioridades calculadas por status e prazo.</p></div>
        <div class="toolbar-controls"><button class="primary-button" data-add="agenda" type="button">Agendar acao</button></div>
      </div>
      ${simpleTable(["Acao", "Cliente", "Modulo", "Prazo", "Status", "Acoes"], upcomingRows())}
    </section>
    <div class="module-grid">
      ${moduleCard("MKT", "Marketing", "Campanhas, listas e leads para alimentar o comercial.")}
      ${moduleCard("REN", "Renovacoes", "Tratativas de renovacao e reajuste antes do vencimento.")}
      ${moduleCard("COM", "Comissoes", "Controle de pagamento, previsao e atraso por vendedor.")}
    </div>
  `;
  bindDynamicActions();
}

function renderKanban() {
  const stages = ["Oportunidade", "Edital", "Documentos", "Proposta", "Resultado"];
  return stages
    .map((stage) => {
      const cards = db.licitacoes.filter((item) => item.stage === stage).slice(0, 3);
      return `<div class="kanban-column"><strong>${stage}</strong>${cards
        .map((item) => `<div class="kanban-card"><b>${item.name}</b>${item.client}<br>${money(item.value)}</div>`)
        .join("") || `<div class="kanban-card">Sem registros nesta etapa.</div>`}</div>`;
    })
    .join("");
}

function upcomingRows() {
  return [
    ...(db.documentos || []).filter((item) => item.status === "red" || item.status === "yellow").map((item) => [mainCell(item.name, item.fileRef), item.client, "Entrega docs", date(item.dueDate), badge(item.status), rowButton("documentos", item.id)]),
    ...(db.renovacoes || []).filter((item) => item.status === "red" || item.status === "yellow").map((item) => [mainCell(item.name, item.stage), item.client, "Renovacoes", date(item.renewalDate), badge(item.status), rowButton("renovacoes", item.id)]),
    ...(db.contratos || []).filter((item) => item.status === "yellow" || item.status === "red").map((item) => [mainCell(item.name, item.agency), item.client, "Contratos", date(item.renewal || item.end), badge(item.status), rowButton("contratos", item.id)]),
    ...(db.licitacoes || []).filter((item) => item.status === "yellow").map((item) => [mainCell(item.name, item.stage), item.client, "Licitacoes", date(item.deadline), badge(item.status), rowButton("licitacoes", item.id)]),
    ...(db.comissoes || []).filter((item) => item.status === "yellow" || item.status === "red").map((item) => [mainCell(item.name, item.seller), item.client, "Comissoes", date(item.dueDate), badge(item.status), rowButton("comissoes", item.id)]),
    ...(db.agenda || []).filter((item) => item.status === "yellow").map((item) => [mainCell(item.name, item.city), item.client, "Agenda", date(item.date), badge(item.status), rowButton("agenda", item.id)]),
  ].slice(0, 10);
}

function renderCrud(moduleKey) {
  const schema = schemas[moduleKey];
  const rows = filtered(db[moduleKey] || []);
  el.content.innerHTML = `
    <section class="table-panel">
      <div class="table-toolbar">
        <div><h2>${schema.title}</h2><p>${schema.desc}</p></div>
        <div class="toolbar-controls">
          <select class="select" id="statusFilter" aria-label="Filtrar status">
            <option value="todos">Todos os status</option>
            <option value="green">Ativos/liberados</option>
            <option value="cyan">Em analise</option>
            <option value="yellow">Atencao</option>
            <option value="red">Risco</option>
          </select>
          ${moduleKey === "clientes" ? `<button class="secondary-button" data-import-clients type="button">Importar clientes CSV</button>` : ""}
          ${moduleKey === "contratos" ? `<button class="secondary-button" data-import-contracts type="button">Importar contratos CSV</button>` : ""}
          <button class="primary-button" data-add="${moduleKey}" type="button">Novo ${schema.singular}</button>
        </div>
      </div>
      ${rows.length ? crudTable(moduleKey, rows) : `<div class="empty-state">Nenhum registro encontrado.</div>`}
    </section>
    <div class="module-grid">
      ${moduleCard("AI", "Acao inteligente", "Cria resumo e proxima acao para o registro selecionado.")}
      ${moduleCard("LOG", "Auditoria", "Todas as mudancas entram no historico do sistema.")}
      ${moduleCard("EXP", "Exportacao", "Baixe uma copia JSON da base do Firebase para backup ou migracao.")}
    </div>
  `;
  const filter = document.querySelector("#statusFilter");
  filter.value = state.status;
  filter.addEventListener("change", (event) => {
    state.status = event.target.value;
    renderCrud(moduleKey);
  });
  bindDynamicActions();
}

function renderRenewals() {
  const schema = schemas.renovacoes;
  const pending = filtered(pendingRenewals(90));
  const allRows = filtered(db.renovacoes || []);
  const notifications = (db.notificacoes || []).slice(0, 12);
  const critical = pending.filter((item) => renewalDaysRemaining(item) <= 30).length;
  const readyLetters = (db.renovacoes || []).filter((item) => item.emailStatus === "ready").length;
  const blockedLetters = (db.renovacoes || []).filter((item) => item.emailStatus === "blocked").length;
  const openNotifications = (db.notificacoes || []).filter((item) => !item.read).length;
  el.content.innerHTML = `
    <div class="metric-grid">
      ${metric("Pendencias 90 dias", pending.length, "renovacoes abertas")}
      ${metric("Criticas", critical, "ate 30 dias ou vencidas")}
      ${metric("Cartas prontas", readyLetters, `${blockedLetters} sem e-mail do cliente`)}
      ${metric("Notificacoes", openNotifications, "avisos de 60, 45 e 30 dias")}
    </div>
    <section class="table-panel">
      <div class="table-toolbar">
        <div>
          <h2>Pendencias dos proximos 90 dias</h2>
          <p>Contratos com vigencia a vencer, marcos de aviso e carta automatica em 15 dias sem acompanhamento.</p>
        </div>
        <div class="toolbar-controls">
          <button class="secondary-button" data-run-renewal-automation type="button">Atualizar alertas</button>
          <button class="primary-button" data-add="renovacoes" type="button">Nova renovacao</button>
        </div>
      </div>
      ${pending.length ? simpleTable(["Cliente", "Contrato", "Vencimento", "Marco", "Acompanhamento", "Carta", "Acoes"], pending.map(renewalPendingRow)) : `<div class="empty-state">Nenhuma pendencia de renovacao nos proximos 90 dias.</div>`}
    </section>
    <div class="grid-2">
      <section class="panel renewal-rules">
        <div class="panel-header">
          <div><h2>Regra automatica</h2><p>O sistema monitora a vigencia e prepara a comunicacao antes do vencimento.</p></div>
        </div>
        <div class="automation-steps">
          ${automationStep("60", "Primeiro aviso", "abre notificacao preventiva")}
          ${automationStep("45", "Segundo aviso", "reforca tratativa comercial")}
          ${automationStep("30", "Aviso critico", "prioriza decisao e documentos")}
          ${automationStep("15", "Carta automatica", "gera minuta se nao houver acompanhamento")}
        </div>
      </section>
      <section class="panel">
        <div class="panel-header">
          <div><h2>Notificacoes geradas</h2><p>Historico dos avisos criados pela rotina de renovacao.</p></div>
        </div>
        ${renewalNotificationsTable(notifications)}
      </section>
    </div>
    <section class="table-panel">
      <div class="table-toolbar">
        <div><h2>${schema.title}</h2><p>${schema.desc}</p></div>
        <div class="toolbar-controls">
          <select class="select" id="statusFilter" aria-label="Filtrar status">
            <option value="todos">Todos os status</option>
            <option value="green">Renovadas</option>
            <option value="cyan">Em andamento</option>
            <option value="yellow">Atencao</option>
            <option value="red">Risco</option>
          </select>
          <button class="primary-button" data-add="renovacoes" type="button">Nova renovacao</button>
        </div>
      </div>
      ${allRows.length ? crudTable("renovacoes", allRows) : `<div class="empty-state">Nenhuma renovacao cadastrada.</div>`}
    </section>
  `;
  const filter = document.querySelector("#statusFilter");
  filter.value = state.status;
  filter.addEventListener("change", (event) => {
    state.status = event.target.value;
    renderRenewals();
  });
  bindDynamicActions();
}

function renewalPendingRow(item) {
  const days = renewalDaysRemaining(item);
  const endDate = item.currentEnd || item.renewalDate;
  const letter = item.letterDraft
    ? emailStatusBadge(item.emailStatus)
    : `<span class="status status-cyan">Nao gerada</span>`;
  return [
    mainCell(item.client, item.clientEmail || "sem e-mail do cliente"),
    mainCell(item.contract || item.name, item.legalRegime || item.addendumType),
    `${date(endDate)}<br><span class="record-subtitle">${daysLabel(days)}</span>`,
    renewalWindowBadge(days),
    mainCell(item.stage || "-", item.followUpAt ? `ultimo: ${date(item.followUpAt)}` : "sem acompanhamento manual"),
    letter,
    renewalRowActions(item),
  ];
}

function renewalWindowBadge(days) {
  if (days < 0) return `<span class="status status-red">Vencido</span>`;
  if (days <= 15) return `<span class="status status-red">Carta automatica</span>`;
  if (days <= 30) return `<span class="status status-red">Aviso 30 dias</span>`;
  if (days <= 45) return `<span class="status status-yellow">Aviso 45 dias</span>`;
  if (days <= 60) return `<span class="status status-yellow">Aviso 60 dias</span>`;
  return `<span class="status status-cyan">Monitorar</span>`;
}

function emailStatusBadge(status) {
  const map = {
    pending: ["cyan", "Pendente"],
    ready: ["yellow", "Carta pronta"],
    queued: ["cyan", "Na fila"],
    sent: ["green", "Enviada"],
    blocked: ["red", "Bloqueada"],
  };
  const [color, label] = map[status] || ["cyan", status || "Pendente"];
  return `<span class="status status-${color}">${escapeHtml(label)}</span>`;
}

function renewalRowActions(item) {
  const emailAction = item.letterDraft
    ? item.clientEmail
      ? `<button class="mini-button" data-renewal-email="${escapeAttr(item.id)}" type="button">Enviar</button>`
      : `<button class="mini-button" data-edit="${escapeAttr(item.id)}" data-module="renovacoes" type="button">Completar e-mail</button>`
    : `<button class="mini-button" data-renewal-generate="${escapeAttr(item.id)}" type="button">Gerar carta</button>`;
  const sentAction = item.letterDraft && item.emailStatus !== "sent"
    ? `<button class="mini-button" data-renewal-mark-sent="${escapeAttr(item.id)}" type="button">Marcar enviada</button>`
    : "";
  return `<div class="row-actions"><button class="mini-button" data-open="${escapeAttr(item.id)}" data-module="renovacoes" type="button">Abrir</button>${emailAction}${sentAction}</div>`;
}

function renewalNotificationsTable(notifications) {
  const rows = notifications.map((item) => [
    mainCell(item.title, item.message),
    item.client || "-",
    item.contract || "-",
    item.milestone ? `${item.milestone} dias` : "-",
    date(item.dueDate),
    badge(item.status || "cyan"),
  ]);
  return simpleTable(["Aviso", "Cliente", "Contrato", "Marco", "Vencimento", "Status"], rows);
}

function automationStep(number, title, description) {
  return `<div class="automation-step"><span>${number}</span><div><strong>${title}</strong><small>${description}</small></div></div>`;
}

function openClientDetail(id) {
  closeDrawer();
  state.clientDetailId = id;
  state.clientTab = state.clientTab || "contratos";
  state.view = "cliente";
  state.status = "todos";
  state.query = "";
  el.search.value = "";
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === "clientes"));
  render();
}

function renderClientDetail() {
  const client = (db.clientes || []).find((item) => item.id === state.clientDetailId);
  if (!client) {
    state.clientDetailId = "";
    setView("clientes");
    return;
  }
  const rel = clientRelations(client);
  const revenue = sum(rel.contracts, "monthly");
  const active = rel.contracts.some((item) => ["green", "cyan"].includes(item.status)) ? "green" : client.status || "cyan";
  const tabs = [
    ["contratos", "Contratos", rel.contracts.length],
    ["produtos", "Produtos", rel.products.length],
    ["cartas", "Cartas", rel.renewals.length],
    ["propostas", "Propostas", rel.proposals.length],
    ["licitacoes", "Licitacoes", rel.bids.length],
    ["ia", "Diagnostico IA", ""],
  ];
  if (!tabs.some(([key]) => key === state.clientTab)) state.clientTab = "contratos";
  el.title.textContent = client.name || "Cliente";
  el.kicker.textContent = "Ficha do cliente";
  el.content.innerHTML = `
    <section class="client-page">
      <button class="link-button" data-client-back type="button">Voltar para Clientes</button>
      <header class="client-hero">
        <div class="client-icon">CL</div>
        <div>
          <h2>${escapeHtml(client.name || "Cliente sem nome")}</h2>
          <p>${escapeHtml([client.segment, client.city, client.region].filter(Boolean).join(" - ") || "Carteira comercial")}</p>
        </div>
        <div class="client-hero-actions">
          ${badge(active)}
          <button class="secondary-button" data-client-edit="${escapeAttr(client.id)}" type="button">Editar</button>
        </div>
      </header>
      <div class="client-metrics">
        ${clientMetric("Receita mensal", money(revenue), "contratos ativos")}
        ${clientMetric("Contratos", rel.contracts.length, "vinculados")}
        ${clientMetric("Cartas de renovacao", rel.renewals.length, "tratativas")}
        ${clientMetric("Licitacoes", rel.bids.length, "oportunidades")}
      </div>
      <section class="client-quick">
        <span>Acoes rapidas</span>
        <div>
          <button class="secondary-button" data-client-new-contract="${escapeAttr(client.id)}" type="button">Novo contrato</button>
          <button class="secondary-button success" data-client-new-proposal="${escapeAttr(client.id)}" type="button">Nova proposta</button>
          <button class="secondary-button violet" data-client-letter="${escapeAttr(client.id)}" type="button">Carta de renovacao</button>
          <button class="secondary-button warning" data-client-new-bid="${escapeAttr(client.id)}" type="button">Nova licitacao</button>
          <button class="secondary-button danger-soft" data-client-docs="${escapeAttr(client.id)}" type="button">CNDs</button>
          <button class="secondary-button" data-client-certificate="${escapeAttr(client.id)}" type="button">Atestados</button>
        </div>
      </section>
      <nav class="client-tabs" aria-label="Dados do cliente">
        ${tabs.map(([key, label, count]) => `<button class="${state.clientTab === key ? "active" : ""}" data-client-tab="${key}" type="button">${label}${count !== "" ? `<span>${count}</span>` : ""}</button>`).join("")}
      </nav>
      <section class="client-content">
        ${renderClientTab(client, rel)}
      </section>
    </section>
  `;
  bindDynamicActions();
}

function renderClientTab(client, rel) {
  if (state.clientTab === "produtos") return renderClientProducts(rel.products);
  if (state.clientTab === "cartas") return renderClientRenewals(client, rel);
  if (state.clientTab === "propostas") return renderClientRows("propostas", rel.proposals);
  if (state.clientTab === "licitacoes") return renderClientRows("licitacoes", rel.bids);
  if (state.clientTab === "ia") return renderClientAiDiagnosis(client, rel);
  return renderClientContracts(client, rel.contracts);
}

function renderClientContracts(client, contracts) {
  if (!contracts.length) {
    return `<div class="empty-state">Nenhum contrato vinculado a este cliente.</div>`;
  }
  return `
    <div class="client-section-actions">
      <button class="primary-button" data-client-new-contract="${escapeAttr(client.id)}" type="button">Novo contrato</button>
    </div>
    <div class="client-contract-list">
      ${contracts.map((contract) => clientContractCard(contract)).join("")}
    </div>`;
}

function clientContractCard(contract) {
  const history = [
    `${escapeHtml(contract.name || "Contrato")} ${date(contract.start)} - ${date(contract.end)} ${money(contract.monthly)}/mes`,
    contract.renewal ? `Renovacao prevista em ${date(contract.renewal)}` : "",
  ].filter(Boolean);
  return `
    <article class="client-contract-card">
      <div class="client-contract-main">
        <div>
          <h3>${escapeHtml(contract.name || "Contrato")}</h3>
          <p>${escapeHtml(contract.object || contract.agency || "Objeto nao informado")}</p>
          <small>Inicio: ${date(contract.start)} &nbsp; Vencimento: ${date(contract.end)} &nbsp; Responsavel: ${escapeHtml(contract.owner || "Equipe")}</small>
        </div>
        <div class="client-contract-value">
          <strong>${money(contract.monthly)}<span>/mes</span></strong>
          <small>${money(contract.value)} total</small>
        </div>
      </div>
      <div class="client-contract-actions">
        ${badge(contract.status)}
        <button class="mini-button" data-open="${escapeAttr(contract.id)}" data-module="contratos" type="button">Visualizar</button>
        <button class="mini-button" data-edit="${escapeAttr(contract.id)}" data-module="contratos" type="button">Editar</button>
        <button class="mini-button" data-ai-letter-contract="${escapeAttr(contract.id)}" type="button">Carta</button>
        <button class="mini-button" data-client-add-renewal="${escapeAttr(contract.id)}" type="button">Aditivo</button>
      </div>
      <div class="client-history">
        <strong>Historico</strong>
        ${history.map((item) => `<span>${item}</span>`).join("")}
      </div>
      ${legalMonitorCard(contract, contractLegalAssessment(contract), "inline")}
    </article>`;
}

function renderClientProducts(products) {
  if (!products.length) return `<div class="empty-state">Nenhum produto identificado nos contratos.</div>`;
  return `<div class="client-card-grid">${products.map((item) => `
    <article class="client-mini-card">
      <strong>${escapeHtml(item.name)}</strong>
      <span>${item.count} contrato(s)</span>
      <small>${money(item.revenue)}/mes</small>
    </article>`).join("")}</div>`;
}

function renderClientRenewals(client, rel) {
  const renewalRows = rel.renewals.map((item) => [mainCell(item.name, item.contract), item.stage || "-", money(item.value), date(item.renewalDate), badge(item.status), rowButton("renovacoes", item.id)]);
  const rows = renewalRows.length ? simpleTable(["Carta/tratativa", "Etapa", "Valor", "Data", "Status", "Acoes"], renewalRows) : `<div class="empty-state">Nenhuma carta ou renovacao registrada.</div>`;
  return `<div class="client-section-actions"><button class="primary-button" data-client-letter="${escapeAttr(client.id)}" type="button">Gerar carta de renovacao</button></div>${rows}`;
}

function renderClientRows(moduleKey, rows) {
  if (!rows.length) return `<div class="empty-state">Nenhum registro vinculado a este cliente.</div>`;
  return simpleTable(schemas[moduleKey].columns, rows.map((item) => [...schemas[moduleKey].row(item), rowButton(moduleKey, item.id)]));
}

function renderClientAiDiagnosis(client, rel) {
  const revenue = sum(rel.contracts, "monthly");
  const nextEnd = [...rel.contracts].filter((item) => item.end).sort((a, b) => String(a.end).localeCompare(String(b.end)))[0];
  return `
    <div class="client-ai-panel">
      ${insight("01", `${rel.contracts.length} contratos vinculados com ${money(revenue)} de receita mensal.`)}
      ${insight("02", nextEnd ? `Proximo vencimento: ${nextEnd.name} em ${date(nextEnd.end)}.` : "Nenhum vencimento de contrato informado.")}
      ${insight("03", `${rel.bids.length} licitacoes e ${rel.proposals.length} propostas vinculadas ao cliente.`)}
      <button class="primary-button" data-ai="Diagnostico do cliente ${escapeAttr(client.name || "")}" type="button">Abrir IA Gemini</button>
    </div>`;
}

function clientMetric(label, value, hint) {
  return `<article><span>${label}</span><strong>${value}</strong><small>${hint}</small></article>`;
}

function contractLegalSection(moduleKey, contract) {
  if (moduleKey !== "contratos") return "";
  const assessment = contractLegalAssessment(contract);
  return `
    <section class="drawer-section">
      <h3>Vigencia e aditivos</h3>
      ${legalMonitorCard(contract, assessment, "compact")}
    </section>`;
}

function legalMonitorCard(contract, assessment = contractLegalAssessment(contract), mode = "") {
  const checklist = assessment.checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  return `
    <article class="legal-monitor ${mode}">
      <div class="legal-monitor-head">
        <div>
          <strong>${escapeHtml(assessment.title)}</strong>
          <span>${escapeHtml(assessment.reference)}</span>
        </div>
        ${badge(assessment.status)}
      </div>
      <div class="legal-monitor-grid">
        ${detailField("Vencimento", date(contract.end))}
        ${detailField("Dias restantes", String(assessment.daysRemaining))}
        ${detailField("Prazo usado", `${assessment.usedMonths} meses`)}
        ${detailField("Limite estimado", assessment.limitLabel)}
      </div>
      <p>${escapeHtml(assessment.message)}</p>
      <ul>${checklist}</ul>
    </article>`;
}

function applyContractLegalDefaults(contract) {
  contract.legalRegime = inferLegalRegime(contract);
  contract.contractNature = contract.contractNature || inferContractNature(contract);
  const rule = legalRuleForContract(contract);
  contract.prorrogable = normalizeProrrogable(contract.prorrogable) || rule.prorrogable;
  contract.maxTermMonths = Number(contract.maxTermMonths || rule.maxMonths || 0);
  contract.renewalAlertDays = Number(contract.renewalAlertDays || 120);
  contract.addendumCount = Number(contract.addendumCount || 0);
  return contract;
}

function syncContractRenewal(contract) {
  if (!contract?.end) return null;
  db.renovacoes = db.renovacoes || [];
  const assessment = contractLegalAssessment(contract);
  const existingIndex = db.renovacoes.findIndex((item) => (
    item.contractId === contract.id ||
    (sameText(item.contract, contract.name) && sameText(item.client, contract.client))
  ));
  const existing = existingIndex >= 0 ? db.renovacoes[existingIndex] : {};
  const contacts = renewalContacts(existing, contract);
  const hasTracking = renewalHasManualFollowUp(existing);
  const payload = {
    name: `Renovacao ${contract.name || "contrato"}`,
    client: contract.client,
    clientId: contract.clientId,
    contract: contract.name,
    contractId: contract.id,
    value: Number(contract.monthly || 0),
    legalRegime: assessment.regime,
    addendumType: "Prorrogacao de prazo",
    currentEnd: contract.end,
    proposedEnd: "",
    addendumNumber: nextAddendumLabel(contract),
    regularityChecklist: assessment.checklist.join("\n"),
    clientEmail: existing.clientEmail || contacts.clientEmail,
    consultantEmail: existing.consultantEmail || contacts.consultantEmail,
    emailStatus: existing.emailStatus || "pending",
    letterSubject: existing.letterSubject || "",
    letterDraft: existing.letterDraft || "",
    letterGeneratedAt: existing.letterGeneratedAt || "",
    emailQueuedAt: existing.emailQueuedAt || "",
    letterSentAt: existing.letterSentAt || "",
    followUpAt: existing.followUpAt || "",
    stage: hasTracking ? existing.stage || assessment.stage : assessment.stage,
    status: hasTracking ? existing.status || assessment.status : assessment.status,
    renewalDate: contract.renewal || assessment.actionDate || contract.end,
    owner: existing.owner || contract.owner || currentUserLabel() || "Equipe comercial",
    notes: hasTracking ? existing.notes || assessment.message : assessment.message,
  };
  if (existingIndex >= 0) {
    const hasChanges = Object.keys(payload).some((key) => String(existing[key] ?? "") !== String(payload[key] ?? ""));
    if (!hasChanges) return existing;
    db.renovacoes[existingIndex] = {
      ...existing,
      ...payload,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: now(),
    };
    return db.renovacoes[existingIndex];
  }
  const item = record(payload);
  db.renovacoes.unshift(item);
  return item;
}

function syncAllContractRenewals() {
  let changed = 0;
  (db.contratos || []).forEach((contract) => {
    const contractBefore = JSON.stringify(contract);
    const before = JSON.stringify(db.renovacoes || []);
    applyContractLegalDefaults(contract);
    syncContractRenewal(contract);
    if (JSON.stringify(contract) !== contractBefore || JSON.stringify(db.renovacoes || []) !== before) changed += 1;
  });
  return changed;
}

async function processRenewalAutomation({ generateLetters = false } = {}) {
  db.renovacoes = db.renovacoes || [];
  db.notificacoes = db.notificacoes || [];
  let changed = 0;
  for (const renewal of db.renovacoes) {
    const days = renewalDaysRemaining(renewal);
    if (!Number.isFinite(days)) continue;
    const milestone = renewalNotificationMilestone(days);
    if (milestone && ensureRenewalNotification(renewal, milestone, days)) changed += 1;
    if (generateLetters && shouldAutoGenerateRenewalLetter(renewal, days)) {
      const generated = await generateAutomaticRenewalLetter(renewal);
      if (generated) changed += 1;
    }
    if (generateLetters && shouldQueueRenewalLetter(renewal, days)) {
      const queued = await queueRenewalLetter(renewal);
      if (queued) changed += 1;
    }
  }
  if (changed) {
    db.notificacoes.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  }
  return changed;
}

function renewalDaysRemaining(renewal) {
  const endDate = renewal?.currentEnd || renewal?.renewalDate;
  if (!endDate) return Number.NaN;
  return daysUntil(endDate);
}

function renewalNotificationMilestone(days) {
  if (days < 0 || days > 60) return null;
  return [30, 45, 60].find((milestone) => days <= milestone) || null;
}

function ensureRenewalNotification(renewal, milestone, days) {
  const endDate = renewal.currentEnd || renewal.renewalDate;
  const key = `contract-expiry:${renewal.id || renewal.contractId}:${milestone}`;
  const exists = (db.notificacoes || []).some((item) => item.key === key);
  if (exists) return false;
  const notification = record({
    key,
    type: "contract-expiry",
    title: `Contrato vence em ${milestone} dias`,
    message: `${renewal.contract || renewal.name || "Contrato"} - ${renewal.client || "cliente"} (${daysLabel(days)}).`,
    client: renewal.client || "",
    contract: renewal.contract || renewal.name || "",
    renewalId: renewal.id || "",
    contractId: renewal.contractId || "",
    milestone,
    dueDate: endDate,
    status: milestone <= 30 ? "red" : "yellow",
    read: false,
  });
  db.notificacoes.unshift(notification);
  return true;
}

function shouldAutoGenerateRenewalLetter(renewal, days) {
  if (days < 0 || days > 15) return false;
  if (renewal.letterGeneratedAt || renewal.letterDraft || renewal.emailStatus === "sent") return false;
  if (renewal.stage === "Renovada" || renewal.stage === "Perdida") return false;
  return !renewalHasManualFollowUp(renewal);
}

function shouldQueueRenewalLetter(renewal, days) {
  if (days < 0 || days > 15) return false;
  if (!renewal.letterDraft || !renewal.clientEmail) return false;
  if (renewal.emailQueuedAt || ["queued", "sent"].includes(renewal.emailStatus)) return false;
  return true;
}

async function queueRenewalLetter(renewal) {
  if (!cloudEnabled() || !cloud()?.queueEmail) return false;
  const contract = findContractForRenewal(renewal) || {};
  try {
    const queuedId = await cloud().queueEmail({
      type: "renewal",
      renewalId: renewal.id || "",
      contractId: renewal.contractId || contract.id || "",
      to: renewal.clientEmail,
      cc: renewal.consultantEmail,
      subject: renewal.letterSubject || renewalLetterSubject(contract, renewal),
      body: renewal.letterDraft,
      client: renewal.client,
      contract: renewal.contract || contract.name,
    });
    if (!queuedId) return false;
    renewal.emailStatus = "queued";
    renewal.emailQueuedAt = today();
    renewal.emailQueueId = queuedId;
    renewal.updatedAt = now();
    ensureQueuedNotification(renewal);
    return true;
  } catch {
    return false;
  }
}

function ensureQueuedNotification(renewal) {
  const key = `renewal-email-queued:${renewal.id || renewal.contractId}`;
  const exists = (db.notificacoes || []).some((item) => item.key === key);
  if (exists) return false;
  db.notificacoes.unshift(record({
    key,
    type: "renewal-email-queued",
    title: "Carta colocada na fila de envio",
    message: `${renewal.contract || renewal.name || "Contrato"} - ${renewal.client || "cliente"}.`,
    client: renewal.client || "",
    contract: renewal.contract || renewal.name || "",
    renewalId: renewal.id || "",
    contractId: renewal.contractId || "",
    dueDate: renewal.currentEnd || renewal.renewalDate || "",
    status: "cyan",
    read: false,
  }));
  return true;
}

function renewalHasManualFollowUp(renewal = {}) {
  const stage = cleanImport(renewal.stage);
  if (renewal.followUpAt) return true;
  if (["Proposta enviada", "Negociacao", "Renovada", "Perdida"].includes(stage)) return true;
  return hasManualRenewalNotes(renewal.notes);
}

function hasManualRenewalNotes(notes) {
  const text = normalizeText(notes);
  if (!text) return false;
  const systemMarkers = [
    "contrato monitorado",
    "dentro da janela de renovacao",
    "vencimento critico",
    "contrato vencido",
    "prazo maximo estimado",
    "a natureza informada exige atencao",
    "informe a data fim",
  ];
  return !systemMarkers.some((marker) => text.includes(marker));
}

async function generateAutomaticRenewalLetter(renewal, { force = false } = {}) {
  if (!renewal || (!force && renewal.letterDraft)) return false;
  const contract = findContractForRenewal(renewal) || {};
  const contacts = renewalContacts(renewal, contract);
  const enrichedRenewal = { ...renewal, ...contacts, currentEnd: renewal.currentEnd || contract.end };
  let draft = "";
  if (cloudEnabled() && cloud()?.generateRenewalLetter) {
    try {
      draft = await cloud().generateRenewalLetter(contract, enrichedRenewal);
    } catch {
      draft = "";
    }
  }
  if (!draft) draft = renewalLetterTemplate(contract, enrichedRenewal);
  renewal.clientEmail = renewal.clientEmail || contacts.clientEmail;
  renewal.consultantEmail = renewal.consultantEmail || contacts.consultantEmail;
  renewal.letterSubject = renewalLetterSubject(contract, renewal);
  renewal.letterDraft = draft;
  renewal.letterGeneratedAt = today();
  renewal.emailStatus = renewal.clientEmail ? "ready" : "blocked";
  renewal.updatedAt = now();
  ensureLetterNotification(renewal);
  return true;
}

function ensureLetterNotification(renewal) {
  const key = `renewal-letter:${renewal.id || renewal.contractId}`;
  const exists = (db.notificacoes || []).some((item) => item.key === key);
  if (exists) return false;
  db.notificacoes.unshift(record({
    key,
    type: "renewal-letter",
    title: renewal.clientEmail ? "Carta de renovacao pronta" : "Carta gerada sem e-mail do cliente",
    message: `${renewal.contract || renewal.name || "Contrato"} - ${renewal.client || "cliente"}.`,
    client: renewal.client || "",
    contract: renewal.contract || renewal.name || "",
    renewalId: renewal.id || "",
    contractId: renewal.contractId || "",
    dueDate: renewal.currentEnd || renewal.renewalDate || "",
    status: renewal.clientEmail ? "yellow" : "red",
    read: false,
  }));
  return true;
}

function renewalContacts(renewal = {}, contract = {}) {
  const client = findClientForRenewal(renewal, contract);
  const owner = renewal.owner || contract.owner || client?.owner || currentUserLabel();
  return {
    client,
    clientContact: client?.contact || "",
    clientEmail: cleanImport(renewal.clientEmail) || cleanImport(client?.email),
    consultantEmail: cleanImport(renewal.consultantEmail) || findConsultantEmail(owner),
    consultantName: owner || "Equipe comercial",
  };
}

function findClientForRenewal(renewal = {}, contract = {}) {
  const clientName = cleanImport(renewal.client) || cleanImport(contract.client) || cleanImport(contract.agency);
  return (db.clientes || []).find((client) => (
    (renewal.clientId && client.id === renewal.clientId) ||
    (contract.clientId && client.id === contract.clientId) ||
    sameText(client.name, clientName) ||
    sameText(client.originalName, clientName) ||
    sameText(client.name, contract.agency) ||
    sameText(client.originalName, contract.agency)
  )) || null;
}

function findConsultantEmail(owner) {
  const raw = cleanImport(owner);
  if (raw.includes("@")) return raw;
  const user = (db.usuarios || []).find((item) => sameText(item.name, raw) || sameText(item.email, raw));
  return cleanImport(user?.email);
}

function findContractForRenewal(renewal = {}) {
  return (db.contratos || []).find((contract) => (
    (renewal.contractId && contract.id === renewal.contractId) ||
    sameText(contract.name, renewal.contract) ||
    (sameText(contract.client, renewal.client) && sameText(contract.end, renewal.currentEnd))
  )) || null;
}

function pendingRenewals(days = 90) {
  return (db.renovacoes || [])
    .filter((renewal) => {
      const remaining = renewalDaysRemaining(renewal);
      if (!Number.isFinite(remaining)) return false;
      if (renewal.stage === "Renovada" || renewal.emailStatus === "sent") return false;
      return remaining <= days;
    })
    .sort((a, b) => renewalDaysRemaining(a) - renewalDaysRemaining(b));
}

function renewalLetterSubject(contract = {}, renewal = {}) {
  const number = contract.name || renewal.contract || renewal.name || "contrato";
  return `Renovacao contratual - ${number}`;
}

function renewalLetterTemplate(contract = {}, renewal = {}) {
  const contacts = renewalContacts(renewal, contract);
  const client = renewal.client || contract.client || contract.agency || "cliente";
  const contractName = contract.name || renewal.contract || "contrato em vigor";
  const endDate = renewal.currentEnd || contract.end || renewal.renewalDate;
  const value = Number(renewal.value || contract.monthly || 0);
  const checklist = cleanImport(renewal.regularityChecklist)
    .split("\n")
    .map((item) => cleanImport(item))
    .filter(Boolean)
    .slice(0, 5);
  return [
    `Assunto: ${renewalLetterSubject(contract, renewal)}`,
    "",
    `Prezados${contacts.clientContact ? `, ${contacts.clientContact}` : ""},`,
    "",
    `Identificamos que o ${contractName}, vinculado a ${client}, possui vigencia prevista ate ${date(endDate)}. Para evitar descontinuidade operacional, sugerimos iniciar imediatamente a tratativa de renovacao contratual/aditivo.`,
    "",
    `Resumo da tratativa:`,
    `- Contrato: ${contractName}`,
    `- Cliente/orgao: ${client}`,
    `- Base legal monitorada: ${renewal.legalRegime || contract.legalRegime || "conforme contrato"}`,
    `- Valor mensal de referencia: ${money(value)}`,
    `- Vencimento: ${date(endDate)}`,
    "",
    `Proximos passos recomendados:`,
    ...(checklist.length ? checklist.map((item) => `- ${item}`) : [
      "- Confirmar interesse na continuidade do contrato.",
      "- Validar documentacao, regularidade fiscal e justificativa de vantagem.",
      "- Preparar minuta do termo aditivo antes do vencimento.",
    ]),
    "",
    "Ficamos a disposicao para alinhar escopo, prazos e documentos necessarios.",
    "",
    "Atenciosamente,",
    contacts.consultantName || "Equipe VendeGov",
  ].join("\n");
}

function daysLabel(days) {
  if (!Number.isFinite(days)) return "-";
  if (days < 0) return `${Math.abs(days)} dia(s) vencido`;
  if (days === 0) return "vence hoje";
  return `${days} dia(s)`;
}

function contractLegalAssessment(contract) {
  const normalized = applyContractLegalDefaults({ ...contract });
  const rule = legalRuleForContract(normalized);
  const daysRemaining = daysUntil(normalized.end);
  const usedMonths = monthsBetween(normalized.start, normalized.end);
  const maxMonths = Number(normalized.maxTermMonths || rule.maxMonths || 0);
  const alertDays = Number(normalized.renewalAlertDays || 120);
  const noEnd = !normalized.end;
  let status = "green";
  let stage = "Mapeada";
  if (noEnd) {
    status = "yellow";
  } else if (daysRemaining < 0) {
    status = "red";
    stage = "Perdida";
  } else if (daysRemaining <= 30) {
    status = "red";
    stage = "Negociacao";
  } else if (daysRemaining <= alertDays) {
    status = "yellow";
    stage = "Em contato";
  } else {
    status = "cyan";
  }
  const limitReached = Boolean(maxMonths && usedMonths >= maxMonths);
  if ((rule.blocked || limitReached) && !rule.indefinite) status = "red";
  const actionDate = normalized.end ? addDays(normalized.end, -alertDays) : "";
  const limitLabel = rule.indefinite ? "Prazo indeterminado com controle anual" : maxMonths ? `${maxMonths} meses` : "Conforme edital/contrato";
  return {
    regime: normalized.legalRegime,
    title: rule.title,
    reference: rule.reference,
    status,
    stage,
    daysRemaining: noEnd ? "-" : daysRemaining,
    usedMonths,
    maxMonths,
    limitLabel,
    actionDate,
    checklist: rule.checklist,
    message: legalMessage(normalized, rule, { daysRemaining, usedMonths, maxMonths, limitReached }),
  };
}

function legalRuleForContract(contract) {
  const regime = inferLegalRegime(contract);
  const nature = normalizeText(contract.contractNature);
  if (regime === "Outro") {
    return legalRule("Regime informado no contrato", "Controle contratual manual", 0, "Depende de justificativa", [
      "Conferir a legislação aplicável indicada no contrato.",
      "Validar prazo máximo, hipótese de prorrogação e documentação obrigatória.",
      "Registrar justificativa e autorização antes do vencimento.",
    ]);
  }
  if (regime === "Lei 8.666/1993") {
    if (nature.includes("aluguel") || nature.includes("software")) {
      return legalRule("Lei 8.666/1993 - art. 57, IV", "Aluguel de equipamentos e software", 48, "Depende de justificativa", [
        "Confirmar previsão no instrumento convocatório/contrato.",
        "Validar interesse da Administração e manutenção da vantagem.",
        "Preparar termo aditivo antes do fim da vigência.",
      ]);
    }
    if (nature.includes("continu")) {
      return legalRule("Lei 8.666/1993 - art. 57, II e §4º", "Serviços contínuos", 60, "Sim", [
        "Confirmar previsão de prorrogação no edital/contrato.",
        "Demonstrar preço e condições mais vantajosas para a Administração.",
        "Justificar por escrito e obter autorização prévia da autoridade competente.",
        "Controlar limite de 60 meses e exceção justificada de até 12 meses.",
      ]);
    }
    return legalRule("Lei 8.666/1993 - art. 57", "Vigência vinculada aos créditos orçamentários", 12, "Depende de justificativa", [
      "Verificar disponibilidade orçamentária.",
      "Confirmar hipótese legal de prorrogação.",
      "Formalizar justificativa e autorização antes do vencimento.",
    ]);
  }
  if (nature.includes("emergencial") || nature.includes("calamidade")) {
    return { ...legalRule("Lei 14.133/2021 - art. 75, VIII", "Emergencial/calamidade", 12, "Nao", [
      "Contratação emergencial/calamidade tem limite operacional de 1 ano.",
      "Evitar prorrogação quando vedada pela hipótese legal.",
      "Planejar nova contratação se a necessidade continuar.",
    ]), blocked: true };
  }
  if (nature.includes("monopolio")) {
    return { ...legalRule("Lei 14.133/2021 - art. 109", "Serviço público em monopólio", 0, "Sim", [
      "Comprovar créditos orçamentários a cada exercício financeiro.",
      "Manter documentação anual de vantagem/necessidade.",
      "Registrar controle de vigência por acompanhamento anual.",
    ]), indefinite: true };
  }
  if (nature.includes("escopo")) {
    return legalRule("Lei 14.133/2021 - art. 111", "Escopo predefinido", 0, "Depende de justificativa", [
      "Controlar conclusão do objeto/escopo contratado.",
      "Se o objeto não foi concluído, avaliar prorrogação automática da vigência.",
      "Se houver culpa do contratado, registrar mora e providências cabíveis.",
    ]);
  }
  if (nature.includes("receita") || nature.includes("eficiencia")) {
    return legalRule("Lei 14.133/2021 - art. 110", "Receita/eficiência", 120, "Depende de justificativa", [
      "Verificar se há investimento pelo contratado.",
      "Sem investimento, controlar limite de até 10 anos.",
      "Com investimento, avaliar prazo especial de até 35 anos.",
    ]);
  }
  if (nature.includes("continu")) {
    return legalRule("Lei 14.133/2021 - arts. 106 e 107", "Serviços/fornecimentos contínuos", 120, "Sim", [
      "Confirmar previsão de prorrogação no edital/contrato.",
      "Atestar vantagem econômica e preços vantajosos para a Administração.",
      "Verificar créditos orçamentários no início e a cada exercício.",
      "Negociar condições e formalizar termo aditivo antes do vencimento.",
      "Controlar vigência máxima decenal.",
    ]);
  }
  return legalRule("Lei 14.133/2021 - art. 105", "Regra geral de duração", 0, "Depende de justificativa", [
    "Observar prazo previsto em edital/contrato.",
    "Verificar disponibilidade de créditos orçamentários.",
    "Quando ultrapassar exercício financeiro, conferir previsão no PPA.",
  ]);
}

function legalRule(reference, title, maxMonths, prorrogable, checklist) {
  return { reference, title, maxMonths, prorrogable, checklist };
}

function legalMessage(contract, rule, stats) {
  if (!contract.end) return "Informe a data fim para ativar o alerta de vigência.";
  if (rule.blocked) return "A natureza informada exige atenção: a prorrogação pode ser vedada ou excepcional. Planeje nova contratação.";
  if (stats.daysRemaining < 0) return "Contrato vencido. Regularize o histórico e avalie providências antes de qualquer renovação.";
  if (stats.limitReached && stats.maxMonths) return "Prazo máximo estimado já foi atingido. Avalie nova contratação ou parecer jurídico.";
  if (stats.daysRemaining <= 30) return "Vencimento crítico. Priorize autorização, documentação e termo aditivo.";
  if (stats.daysRemaining <= Number(contract.renewalAlertDays || 120)) return "Dentro da janela de renovação. Inicie checklist, negociação e minuta do aditivo.";
  return "Contrato monitorado. O sistema abrirá alerta quando entrar na janela de renovação.";
}

function inferLegalRegime(contract) {
  const explicit = cleanImport(contract.legalRegime);
  if (explicit) {
    const normalized = normalizeText(explicit);
    if (normalized.includes("8666") || normalized.includes("8.666")) return "Lei 8.666/1993";
    if (normalized.includes("14133") || normalized.includes("14.133")) return "Lei 14.133/2021";
    if (normalized === "outro") return "Outro";
    if (["Lei 14.133/2021", "Lei 8.666/1993"].includes(explicit)) return explicit;
  }
  const text = normalizeText(`${contract.legalBasis || ""} ${contract.notes || ""}`);
  if (text.includes("8666") || text.includes("8.666")) return "Lei 8.666/1993";
  if (text.includes("14133") || text.includes("14.133")) return "Lei 14.133/2021";
  return "Lei 14.133/2021";
}

function inferContractNature(contract) {
  const text = normalizeText(`${contract.object || ""} ${contract.notes || ""}`);
  if (text.includes("software") || text.includes("saas") || text.includes("licenca") || text.includes("manutencao") || text.includes("continu")) return "Servicos continuos";
  if (text.includes("fornecimento")) return "Fornecimento continuo";
  if (text.includes("emergencial") || text.includes("calamidade")) return "Emergencial/calamidade";
  return "Servicos continuos";
}

function nextAddendumLabel(contract) {
  const count = Number(contract.addendumCount || 0) + 1;
  return `${count}º Termo Aditivo`;
}

function normalizeProrrogable(value) {
  const raw = normalizeText(value);
  if (!raw) return "";
  if (["sim", "s", "true", "1"].includes(raw)) return "Sim";
  if (["nao", "n", "false", "0"].includes(raw)) return "Nao";
  if (raw.includes("depende") || raw.includes("justific")) return "Depende de justificativa";
  return "";
}

function clientRelations(client) {
  const contracts = (db.contratos || []).filter((item) => contractBelongsToClient(item, client));
  const renewals = (db.renovacoes || []).filter((item) => renewalBelongsToClient(item, client, contracts));
  const proposals = (db.propostas || []).filter((item) => itemBelongsToClient(item, client));
  const bids = (db.licitacoes || []).filter((item) => itemBelongsToClient(item, client) || sameText(item.agency, client.name));
  return {
    contracts,
    renewals,
    proposals,
    bids,
    products: productsFromContracts(contracts),
  };
}

function contractBelongsToClient(contract, client) {
  return contract.clientId === client.id || itemBelongsToClient(contract, client) || sameText(contract.agency, client.name) || sameText(contract.agency, client.originalName);
}

function renewalBelongsToClient(renewal, client, contracts) {
  return itemBelongsToClient(renewal, client) || contracts.some((contract) => sameText(renewal.contract, contract.name));
}

function itemBelongsToClient(item, client) {
  return item.clientId === client.id || sameText(item.client, client.name) || sameText(item.client, client.originalName);
}

function productsFromContracts(contracts) {
  const grouped = new Map();
  contracts.forEach((contract) => {
    const name = cleanImport(contract.object).slice(0, 90) || "Objeto nao informado";
    const key = normalizeText(name);
    const current = grouped.get(key) || { name, count: 0, revenue: 0 };
    current.count += 1;
    current.revenue += Number(contract.monthly || 0);
    grouped.set(key, current);
  });
  return [...grouped.values()];
}

function openClientLinkedForm(moduleKey, clientId) {
  const client = (db.clientes || []).find((item) => item.id === clientId);
  if (!client) return;
  const defaults = linkedDefaults(moduleKey, client);
  openForm(moduleKey, null, defaults);
}

function linkedDefaults(moduleKey, client) {
  const base = {
    client: client.name,
    clientId: client.id,
    owner: client.owner || currentUserLabel(),
    status: "green",
  };
  if (moduleKey === "contratos") {
    return {
      ...base,
      agency: client.name,
      agencyType: client.segment,
      region: client.region,
      legalRegime: "Lei 14.133/2021",
      contractNature: "Servicos continuos",
      prorrogable: "Sim",
      maxTermMonths: 120,
      renewalAlertDays: 120,
      addendumCount: 0,
      monthly: 0,
      value: 0,
    };
  }
  if (moduleKey === "licitacoes") {
    return { ...base, agency: client.name, modality: "Pregao eletronico", stage: "Oportunidade", value: 0 };
  }
  if (moduleKey === "propostas") {
    return { ...base, name: `Proposta ${client.name}`, value: 0, margin: 0, status: "yellow" };
  }
  if (moduleKey === "documentos") {
    return { ...base, name: "CND / Atestado", type: "CND", status: "yellow" };
  }
  return base;
}

function openContractRenewalForm(contractId) {
  const contract = (db.contratos || []).find((item) => item.id === contractId);
  if (!contract) return;
  const assessment = contractLegalAssessment(contract);
  const contacts = renewalContacts({}, contract);
  openForm("renovacoes", null, {
    name: `Renovacao ${contract.name || ""}`.trim(),
    client: contract.client,
    clientId: contract.clientId,
    contract: contract.name,
    contractId: contract.id,
    value: contract.monthly,
    legalRegime: assessment.regime,
    addendumType: "Prorrogacao de prazo",
    currentEnd: contract.end,
    proposedEnd: "",
    addendumNumber: nextAddendumLabel(contract),
    regularityChecklist: assessment.checklist.join("\n"),
    clientEmail: contacts.clientEmail,
    consultantEmail: contacts.consultantEmail,
    emailStatus: "pending",
    renewalDate: contract.renewal || contract.end,
    stage: assessment.stage,
    status: assessment.status,
    notes: assessment.message,
  });
}

async function generateClientRenewalLetter(clientId) {
  const client = (db.clientes || []).find((item) => item.id === clientId);
  if (!client) return;
  const contract = clientRelations(client).contracts[0];
  if (!contract) {
    toast("Cadastre um contrato para gerar a carta.");
    return;
  }
  await generateRenewalLetterForContractId(contract.id);
}

function ensureClientForContract(contract) {
  const clientName = cleanImport(contract.client) || cleanImport(contract.agency);
  if (!clientName) return null;
  db.clientes = db.clientes || [];
  let client = findClientForContract(contract, clientName);
  const potential = Number(contract.value || 0) || Number(contract.monthly || 0) * 12;
  if (client) {
    contract.clientId = client.id;
    contract.client = client.name;
    client.segment = client.segment || contract.agencyType || "Outro";
    client.region = client.region || contract.region || "";
    client.potential = Math.max(Number(client.potential || 0), potential || 0);
    client.owner = client.owner || contract.owner || currentUserLabel();
    client.status = client.status || contract.status || "green";
    client.updatedAt = now();
    return client;
  }
  client = record({
    name: clientName,
    segment: contract.agencyType || "Outro",
    cnpj: "",
    contact: "",
    email: "",
    phone: "",
    city: "",
    website: "",
    region: contract.region || "",
    originalName: contract.agency && contract.agency !== clientName ? contract.agency : "",
    sourceId: "",
    potential,
    status: contract.status || "green",
    owner: contract.owner || currentUserLabel() || "Equipe comercial",
    notes: `Criado automaticamente a partir do contrato ${contract.name || ""}.`.trim(),
  });
  db.clientes.unshift(client);
  contract.clientId = client.id;
  contract.client = client.name;
  return client;
}

function findClientForContract(contract, clientName) {
  return (db.clientes || []).find((client) => (
    (contract.clientId && client.id === contract.clientId) ||
    sameText(client.name, clientName) ||
    sameText(client.originalName, clientName) ||
    sameText(client.name, contract.agency) ||
    sameText(client.originalName, contract.agency)
  ));
}

function linkRecordToExistingClient(values) {
  const clientName = cleanImport(values.client) || cleanImport(values.agency);
  if (!clientName) return null;
  const client = (db.clientes || []).find((item) => sameText(item.name, clientName) || sameText(item.originalName, clientName));
  if (!client) return null;
  values.clientId = client.id;
  if (values.client !== undefined) values.client = client.name;
  return client;
}

function normalizeText(value) {
  return removeAccents(cleanImport(value)).toLowerCase().replace(/\s+/g, " ").trim();
}

function crudTable(moduleKey, rows) {
  const schema = schemas[moduleKey];
  const body = rows
    .map((item) => {
      const cells = schema.row(item);
      return `<tr>${cells.map((cell) => `<td>${cell}</td>`).join("")}<td>${rowActions(moduleKey, item.id)}</td></tr>`;
    })
    .join("");
  return `<table class="data-table"><thead><tr>${schema.columns.map((col) => `<th>${col}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table>`;
}

function renderReports() {
  const revenue = sum(db.contratos || [], "monthly");
  const pipelineValue = sum(db.licitacoes || [], "value") + sum(db.propostas || [], "value");
  const commissions = sum(db.comissoes || [], "value");
  const pendingDocs = (db.documentos || []).filter((i) => i.status === "red" || i.status === "yellow").length;
  const renewalValue = sum((db.renovacoes || []).filter((i) => i.status !== "green"), "value");
  const commissionRows = (db.comissoes || []).map((item) => [mainCell(item.name, item.contract), item.seller, item.client, money(item.value), badge(item.status), rowButton("comissoes", item.id)]);
  el.content.innerHTML = `
    <div class="metric-grid">
      ${metric("Receita mensal", money(revenue), "contratos ativos")}
      ${metric("Pipeline total", money(pipelineValue), "licitacoes + propostas")}
      ${metric("Renovacoes abertas", money(renewalValue), "valor em tratativa")}
      ${metric("Comissoes", money(commissions), "controle financeiro")}
    </div>
    <div class="report-grid">
      <section class="panel">
        <div class="panel-header"><div><h2>Relatorio de vendas</h2><p>Funil comercial e producao da equipe.</p></div></div>
        <div class="bars">
          ${bar("Oportunidades", (db.licitacoes || []).filter((i) => i.stage === "Oportunidade").length, 85)}
          ${bar("Editais", (db.licitacoes || []).filter((i) => i.stage === "Edital").length, 58)}
          ${bar("Documentos", (db.licitacoes || []).filter((i) => i.stage === "Documentos").length, 46)}
          ${bar("Propostas", (db.propostas || []).length, 64)}
          ${bar("Contratos", (db.contratos || []).length, 72)}
        </div>
      </section>
      <section class="panel">
        <div class="panel-header"><div><h2>Relatorio gerencial</h2><p>Resumo automatico para diretoria.</p></div></div>
        <div class="ai-grid">
          ${insight("01", `${(db.contratos || []).length} contratos monitorados com ${money(revenue)} de receita mensal.`)}
          ${insight("02", `${pendingDocs} documentos exigem acao da equipe.`)}
          ${insight("03", `${(db.marketing || []).length} campanhas alimentam ${(db.clientes || []).length} clientes na carteira.`)}
          ${insight("04", `${(db.renovacoes || []).length} renovacoes cadastradas, somando ${money(renewalValue)} em tratativas abertas.`)}
        </div>
      </section>
    </div>
    <section class="table-panel">
      <div class="table-toolbar"><div><h2>Relatorio de comissoes</h2><p>Valores pagos, previstos, a aprovar e atrasados.</p></div></div>
      ${simpleTable(["Comissao", "Vendedor", "Cliente", "Valor", "Status", "Acoes"], commissionRows)}
    </section>
    <section class="table-panel">
      <div class="table-toolbar"><div><h2>Historico de auditoria</h2><p>Ultimas acoes realizadas no sistema.</p></div></div>
      ${auditTable()}
    </section>
  `;
  bindDynamicActions();
}

function renderAi() {
  const modelName = cloud()?.aiModelName ? cloud().aiModelName() : "gemini-3.6-flash";
  const aiOnline = cloudEnabled() && Boolean(cloud()?.aiEnabled?.());
  const contracts = db.contratos || [];
  const selectedId = state.aiContractId || contracts[0]?.id || "";
  const selectedContract = contracts.find((item) => item.id === selectedId) || contracts[0] || null;
  if (!state.aiContractId && selectedContract) state.aiContractId = selectedContract.id;
  el.content.innerHTML = `
    <div class="metric-grid ai-metric-grid">
      ${metric("Status da IA", aiOnline ? "Preparada" : "Pendente", aiOnline ? "Firebase AI Logic no app" : "ative no Firebase Console")}
      ${metric("Modelo", modelName, "Gemini via Firebase")}
      ${metric("Contratos", contracts.length, "base disponivel para renovacao")}
      ${metric("PDF direto", "ate 18 MB", "limite operacional seguro")}
    </div>
    <div class="grid-2 ai-layout">
      <section class="panel ai-workbench">
        <div class="panel-header">
          <div>
            <h2>Ler contrato em PDF</h2>
            <p>Envie um PDF para extrair numero, orgao, objeto, valores, prazos, reajuste, obrigacoes e riscos.</p>
          </div>
        </div>
        ${aiSetupNotice(aiOnline)}
        <label class="ai-upload">
          <span>PDF do contrato</span>
          <input id="aiPdfInput" type="file" accept="application/pdf,.pdf,text/plain,.txt" />
        </label>
        <div class="drawer-actions">
          <button class="primary-button" data-ai-analyze-pdf type="button" ${state.aiBusy ? "disabled" : ""}>${state.aiBusy === "extract" ? "Lendo documento..." : "Ler documento com IA"}</button>
          ${state.aiDraftContract ? `<button class="secondary-button" data-ai-save-contract type="button">Cadastrar contrato extraido</button>` : ""}
        </div>
        ${aiExtractionResult()}
      </section>
      <section class="panel ai-workbench">
        <div class="panel-header">
          <div>
            <h2>Carta de renovacao</h2>
            <p>Gere uma carta pronta para iniciar ou formalizar uma renovacao contratual.</p>
          </div>
        </div>
        <label class="ai-upload">
          <span>Contrato base</span>
          <select id="aiContractSelect">
            ${contracts.length ? contracts.map((item) => `<option value="${escapeAttr(item.id)}" ${item.id === selectedId ? "selected" : ""}>${escapeHtml(item.name || item.client || item.id)}</option>`).join("") : `<option value="">Nenhum contrato cadastrado</option>`}
          </select>
        </label>
        <div class="ai-contract-preview">
          ${selectedContract ? `
            <strong>${escapeHtml(selectedContract.name || "Contrato")}</strong>
            <small>${escapeHtml(selectedContract.client || "-")} | ${money(selectedContract.value)} | vigencia ate ${date(selectedContract.end)}</small>
          ` : `<small>Cadastre ou importe contratos para gerar cartas.</small>`}
        </div>
        <div class="drawer-actions">
          <button class="primary-button" data-ai-generate-renewal type="button" ${!selectedContract || state.aiBusy ? "disabled" : ""}>${state.aiBusy === "letter" ? "Gerando carta..." : "Gerar carta de renovacao"}</button>
          ${state.aiLetter ? `<button class="secondary-button" data-ai-copy-letter type="button">Copiar carta</button>` : ""}
        </div>
        ${aiLetterResult()}
      </section>
    </div>
    <section class="table-panel">
      <div class="table-toolbar">
        <div>
          <h2>Como a IA entra na rotina</h2>
          <p>O VendeGov usa Gemini para transformar documentos e dados de contratos em registros e textos operacionais.</p>
        </div>
      </div>
      <div class="ai-flow">
        ${insight("01", "PDF entra na plataforma e a IA identifica campos contratuais.")}
        ${insight("02", "Voce confere o rascunho antes de salvar no Firebase.")}
        ${insight("03", "A carta de renovacao usa dados reais do contrato e da tratativa.")}
        ${insight("04", "Nenhuma chave Gemini fica exposta no codigo do site.")}
      </div>
    </section>
  `;
  bindDynamicActions();
}

function aiSetupNotice(aiOnline) {
  if (aiOnline) {
    return `<div class="ai-notice success"><strong>Conexao preparada</strong><span>O app esta pronto para usar Firebase AI Logic. Se a primeira chamada falhar, ative AI Logic e App Check no Console Firebase.</span></div>`;
  }
  return `<div class="ai-notice warn"><strong>Configuracao pendente</strong><span>Ative AI Services > AI Logic no Firebase e escolha Gemini Developer API. Depois publique novamente.</span></div>`;
}

function aiExtractionResult() {
  if (state.aiBusy === "extract") return `<div class="ai-result"><strong>Leitura em andamento</strong><p>A IA esta processando o documento. PDFs maiores podem levar alguns segundos.</p></div>`;
  if (!state.aiDraftContract) return `<div class="empty-state">Nenhum documento analisado nesta sessao.</div>`;
  const item = state.aiDraftContract;
  return `
    <div class="ai-result">
      <div class="ai-result-header">
        <strong>Contrato extraido</strong>
        <span>${badge(item.status || "cyan")}</span>
      </div>
      <div class="detail-grid">
        ${detailField("Contrato", escapeHtml(item.name))}
        ${detailField("Cliente/orgao", escapeHtml(item.client))}
        ${detailField("Valor total", money(item.value))}
        ${detailField("Vigencia", `${date(item.start)} a ${date(item.end)}`)}
        ${detailField("Renovacao", date(item.renewal))}
        ${detailField("Reajuste", escapeHtml(item.adjustment || "-"))}
      </div>
      <pre class="ai-json-preview">${escapeHtml(JSON.stringify(state.aiLastExtraction || {}, null, 2))}</pre>
    </div>
  `;
}

function aiLetterResult() {
  if (state.aiBusy === "letter") return `<div class="ai-result"><strong>Carta em producao</strong><p>A IA esta montando a carta com base nos dados do contrato.</p></div>`;
  if (!state.aiLetter) return `<div class="empty-state">A carta gerada aparecera aqui.</div>`;
  return `<div class="ai-result"><pre class="generated-text">${escapeHtml(state.aiLetter)}</pre></div>`;
}

function renderSettings() {
  const tabs = [
    ["empresas", "Empresas"],
    ["regioes", "Regioes"],
    ["documentosImportantes", "Documentos"],
    ["sistema", "Sistema"],
    ["usuarios", "Usuarios"],
    ["gruposUsuarios", "Grupos"],
    ["templates", "Templates"],
    ["audit", "Auditoria"],
  ];
  const active = state.configTab;
  const tabButtons = tabs
    .map(([key, label]) => `<button class="secondary-button config-tab${key === active ? " is-active" : ""}" data-config="${key}" type="button">${label}</button>`)
    .join("");
  const body = active === "audit" ? auditTable() : crudTable(active, filtered(db[active] || []));
  el.newButton.disabled = active === "audit";
  el.content.innerHTML = `
    <section class="table-panel">
      <div class="table-toolbar">
        <div><h2>Parametrizacao</h2><p>Empresas, regioes, documentos, sistema, usuarios, grupos, templates e auditoria.</p></div>
        <div class="toolbar-controls">${tabButtons}${active === "usuarios" ? `<button class="secondary-button" data-import-users type="button">Importar consultores CSV</button>` : ""}${active !== "audit" ? `<button class="primary-button" data-add="${active}" type="button">Novo</button>` : ""}</div>
      </div>
      ${body}
    </section>
    <div class="config-grid">
      <div class="config-card"><h3>Permissoes previstas</h3><ul><li>Administrador</li><li>Gestor</li><li>Comercial</li><li>Financeiro</li><li>Documentos</li></ul></div>
      <div class="config-card"><h3>Producao em nuvem</h3><ul><li>Banco de dados central</li><li>Login real por usuario</li><li>Anexos em armazenamento seguro</li><li>Backups e dominio proprio</li></ul></div>
    </div>
  `;
  bindDynamicActions();
}

function auditTable() {
  const rows = (db.audit || []).slice(0, 30).map((item) => [mainCell(item.action, item.detail), item.user, formatDateTime(item.at), "-", "-", ""]);
  return simpleTable(["Acao", "Usuario", "Data", "", "", ""], rows);
}

function simpleTable(headers, rows) {
  if (!rows.length) return `<div class="empty-state">Nenhum registro para exibir.</div>`;
  return `<table class="data-table"><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
}

function bindDynamicActions() {
  document.querySelectorAll("[data-jump]").forEach((button) => button.addEventListener("click", () => setView(button.dataset.jump)));
  document.querySelectorAll("[data-add]").forEach((button) => button.addEventListener("click", () => openForm(button.dataset.add)));
  document.querySelectorAll("[data-open]").forEach((button) => button.addEventListener("click", () => {
    if (button.dataset.module === "clientes") return openClientDetail(button.dataset.open);
    openDetail(button.dataset.module, button.dataset.open);
  }));
  document.querySelectorAll("[data-edit]").forEach((button) => button.addEventListener("click", () => openForm(button.dataset.module, button.dataset.edit)));
  document.querySelectorAll("[data-delete]").forEach((button) => button.addEventListener("click", () => askDelete(button.dataset.module, button.dataset.delete)));
  document.querySelectorAll("[data-client-back]").forEach((button) => button.addEventListener("click", () => setView("clientes")));
  document.querySelectorAll("[data-client-tab]").forEach((button) => button.addEventListener("click", () => {
    state.clientTab = button.dataset.clientTab;
    renderClientDetail();
  }));
  document.querySelectorAll("[data-client-edit]").forEach((button) => button.addEventListener("click", () => openForm("clientes", button.dataset.clientEdit)));
  document.querySelectorAll("[data-client-new-contract]").forEach((button) => button.addEventListener("click", () => openClientLinkedForm("contratos", button.dataset.clientNewContract)));
  document.querySelectorAll("[data-client-new-proposal]").forEach((button) => button.addEventListener("click", () => openClientLinkedForm("propostas", button.dataset.clientNewProposal)));
  document.querySelectorAll("[data-client-new-bid]").forEach((button) => button.addEventListener("click", () => openClientLinkedForm("licitacoes", button.dataset.clientNewBid)));
  document.querySelectorAll("[data-client-letter]").forEach((button) => button.addEventListener("click", () => generateClientRenewalLetter(button.dataset.clientLetter)));
  document.querySelectorAll("[data-client-add-renewal]").forEach((button) => button.addEventListener("click", () => openContractRenewalForm(button.dataset.clientAddRenewal)));
  document.querySelectorAll("[data-client-docs], [data-client-certificate]").forEach((button) => button.addEventListener("click", () => openClientLinkedForm("documentos", button.dataset.clientDocs || button.dataset.clientCertificate)));
  document.querySelectorAll("[data-ai]").forEach((button) => button.addEventListener("click", () => openAiWorkspace(button.dataset.ai)));
  document.querySelectorAll("[data-ai-analyze-pdf]").forEach((button) => button.addEventListener("click", analyzePdfFromPanel));
  document.querySelectorAll("[data-ai-save-contract]").forEach((button) => button.addEventListener("click", saveAiDraftContract));
  document.querySelectorAll("[data-ai-generate-renewal]").forEach((button) => button.addEventListener("click", () => generateRenewalLetterFromSelection()));
  document.querySelectorAll("[data-ai-copy-letter]").forEach((button) => button.addEventListener("click", copyAiLetter));
  document.querySelectorAll("[data-ai-read-contract]").forEach((button) => button.addEventListener("click", () => analyzeStoredContractPdf(button.dataset.aiReadContract)));
  document.querySelectorAll("[data-ai-letter-contract]").forEach((button) => button.addEventListener("click", () => generateRenewalLetterForContractId(button.dataset.aiLetterContract)));
  document.querySelectorAll("[data-ai-letter-renewal]").forEach((button) => button.addEventListener("click", () => generateRenewalLetterForRenewalId(button.dataset.aiLetterRenewal)));
  document.querySelectorAll("[data-run-renewal-automation]").forEach((button) => button.addEventListener("click", refreshRenewalAutomation));
  document.querySelectorAll("[data-renewal-generate]").forEach((button) => button.addEventListener("click", () => generateStoredRenewalLetter(button.dataset.renewalGenerate)));
  document.querySelectorAll("[data-renewal-email]").forEach((button) => button.addEventListener("click", () => emailRenewalLetter(button.dataset.renewalEmail)));
  document.querySelectorAll("[data-renewal-mark-sent]").forEach((button) => button.addEventListener("click", () => markRenewalLetterSent(button.dataset.renewalMarkSent)));
  const contractSelect = document.querySelector("#aiContractSelect");
  if (contractSelect) {
    contractSelect.addEventListener("change", (event) => {
      state.aiContractId = event.target.value;
      state.aiLetter = "";
      renderAi();
    });
  }
  document.querySelectorAll("[data-import-clients]").forEach((button) => button.addEventListener("click", () => {
    el.importFile.dataset.mode = "clientes";
    el.importFile.accept = ".csv,text/csv,application/vnd.ms-excel";
    el.importFile.click();
  }));
  document.querySelectorAll("[data-import-contracts]").forEach((button) => button.addEventListener("click", () => {
    el.importFile.dataset.mode = "contratos";
    el.importFile.accept = ".csv,text/csv,application/vnd.ms-excel";
    el.importFile.click();
  }));
  document.querySelectorAll("[data-import-users]").forEach((button) => button.addEventListener("click", () => {
    el.importFile.dataset.mode = "usuarios";
    el.importFile.accept = ".csv,text/csv,application/vnd.ms-excel";
    el.importFile.click();
  }));
  document.querySelectorAll("[data-config]").forEach((button) => button.addEventListener("click", () => {
    state.configTab = button.dataset.config;
    renderSettings();
  }));
}

async function refreshRenewalAutomation() {
  const changed = await processRenewalAutomation({ generateLetters: true });
  if (changed) {
    saveDb("Atualizou alertas de renovacao", `${changed} alteracao(oes) geradas`);
    toast("Alertas e cartas atualizados.");
  } else {
    toast("Renovacoes conferidas. Nenhuma nova pendencia.");
  }
  renderRenewals();
}

async function generateStoredRenewalLetter(id) {
  const renewal = (db.renovacoes || []).find((item) => item.id === id);
  if (!renewal) return;
  await generateAutomaticRenewalLetter(renewal, { force: true });
  saveDb("Gerou carta automatica", renewal.contract || renewal.name || id);
  render();
  toast(renewal.clientEmail ? "Carta pronta para envio." : "Carta gerada. Complete o e-mail do cliente.");
}

async function emailRenewalLetter(id) {
  let renewal = (db.renovacoes || []).find((item) => item.id === id);
  if (!renewal) return;
  if (!renewal.letterDraft) {
    await generateAutomaticRenewalLetter(renewal, { force: true });
    saveDb("Gerou carta automatica", renewal.contract || renewal.name || id);
  }
  renewal = (db.renovacoes || []).find((item) => item.id === id);
  if (!renewal.clientEmail) {
    renewal.emailStatus = "blocked";
    saveDb("Bloqueou envio de renovacao", "Cliente sem e-mail cadastrado");
    openForm("renovacoes", id);
    toast("Complete o e-mail do cliente para enviar.");
    return;
  }
  const link = renewalMailtoLink(renewal);
  if (!link) {
    toast("Nao foi possivel montar o e-mail.");
    return;
  }
  window.location.href = link;
  saveDb("Preparou envio de carta", renewal.contract || renewal.name || id);
  toast("E-mail aberto. Depois marque como enviada.");
}

function markRenewalLetterSent(id) {
  const renewal = (db.renovacoes || []).find((item) => item.id === id);
  if (!renewal) return;
  renewal.emailStatus = "sent";
  renewal.letterSentAt = today();
  renewal.followUpAt = today();
  if (["Mapeada", "Em contato"].includes(renewal.stage)) renewal.stage = "Proposta enviada";
  renewal.updatedAt = now();
  saveDb("Registrou envio de carta", renewal.contract || renewal.name || id);
  render();
  toast("Envio registrado na renovacao.");
}

function renewalMailtoLink(renewal) {
  const recipient = cleanImport(renewal.clientEmail);
  if (!recipient) return "";
  const cc = cleanImport(renewal.consultantEmail);
  const subject = cleanImport(renewal.letterSubject) || renewalLetterSubject(findContractForRenewal(renewal) || {}, renewal);
  const body = cleanImport(renewal.letterDraft);
  const params = [`subject=${encodeURIComponent(subject)}`, `body=${encodeURIComponent(body)}`];
  if (cc) params.unshift(`cc=${encodeURIComponent(cc)}`);
  return `mailto:${encodeURIComponent(recipient)}?${params.join("&")}`;
}

function openForm(moduleKey, id = null, defaults = {}) {
  const schema = schemas[moduleKey];
  if (!schema) return;
  closeDrawer();
  const item = id ? (db[moduleKey] || []).find((row) => row.id === id) : null;
  const values = item || defaults;
  state.editing = { moduleKey, id };
  state.contractFormAiBusy = false;
  state.contractFormAiFile = null;
  state.contractFormAiExtraction = null;
  el.modalKicker.textContent = schema.title;
  el.modalTitle.textContent = id ? `Editar ${schema.singular}` : `Novo ${schema.singular}`;
  el.form.innerHTML = `${contractAiScanner(moduleKey)}
    ${schema.fields.map((f) => inputFor(f, values ? values[f.name] : "")).join("")}
    <div class="form-actions">
      <button class="secondary-button" type="button" id="cancelForm">Cancelar</button>
      <button class="primary-button" type="submit">Salvar</button>
    </div>`;
  el.form.querySelector("#cancelForm").addEventListener("click", closeForm);
  bindContractAiScanner(moduleKey);
  el.modal.classList.remove("hidden");
  const firstInput = el.form.querySelector("input:not([type='file']), select, textarea");
  if (firstInput) firstInput.focus();
}

function closeForm() {
  el.modal.classList.add("hidden");
  state.editing = null;
  state.contractFormAiBusy = false;
  state.contractFormAiFile = null;
  state.contractFormAiExtraction = null;
  el.form.innerHTML = "";
}

function contractAiScanner(moduleKey) {
  if (moduleKey !== "contratos") return "";
  const aiOnline = cloudEnabled() && Boolean(cloud()?.analyzeContractFile);
  const status = aiOnline
    ? "Envie o PDF do contrato e confira os campos preenchidos antes de salvar."
    : "Ative Firebase AI Logic para liberar a leitura automatica de PDFs.";
  return `
    <section class="contract-ai-scan wide" data-contract-ai-card>
      <div class="contract-ai-copy">
        <span>IA</span>
        <div>
          <strong>Preenchimento automatico com IA</strong>
          <p>Escaneie o contrato para preencher numero, orgao, objeto, valores, vigencia, reajuste e observacoes.</p>
        </div>
      </div>
      <input class="hidden" id="contractAiScanFile" type="file" accept="application/pdf,.pdf,text/plain,.txt" />
      <button class="primary-button contract-ai-button" data-contract-ai-scan type="button" ${aiOnline ? "" : "disabled"}>Escanear contrato com IA</button>
      <div class="contract-ai-status" id="contractAiScanStatus">${status}</div>
    </section>`;
}

function bindContractAiScanner(moduleKey) {
  if (moduleKey !== "contratos") return;
  const button = el.form.querySelector("[data-contract-ai-scan]");
  const input = el.form.querySelector("#contractAiScanFile");
  if (!button || !input) return;
  button.addEventListener("click", () => input.click());
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (file) scanContractIntoForm(file);
  });
}

async function scanContractIntoForm(file) {
  if (!cloudEnabled() || !cloud()?.analyzeContractFile) {
    toast("Firebase AI Logic ainda nao esta configurado.");
    return;
  }
  const button = el.form.querySelector("[data-contract-ai-scan]");
  const status = el.form.querySelector("#contractAiScanStatus");
  state.contractFormAiBusy = true;
  if (button) {
    button.disabled = true;
    button.textContent = "Escaneando contrato...";
  }
  setContractAiFormStatus("Lendo documento com IA...", "Aguarde enquanto o VendeGov identifica os dados principais do contrato.");
  try {
    const extracted = await cloud().analyzeContractFile(file);
    const contract = applyContractLegalDefaults(contractFromAiExtraction(extracted, file.name));
    state.contractFormAiFile = file;
    state.contractFormAiExtraction = extracted;
    fillContractFormFromAi(contract, file.name);
    saveDb("Escaneou contrato por IA", file.name);
    setContractAiFormStatus(
      "Campos preenchidos pela IA",
      `${contract.name || "Contrato"} - ${contract.client || "cliente nao informado"} - vencimento ${date(contract.end)}`
    );
    toast("Contrato escaneado. Confira os campos antes de salvar.");
  } catch (error) {
    setContractAiFormStatus("Nao foi possivel escanear o contrato", aiErrorMessage(error));
    if (status) status.classList.add("is-error");
    toast(aiErrorMessage(error));
  } finally {
    state.contractFormAiBusy = false;
    if (button) {
      button.disabled = false;
      button.textContent = "Escanear contrato com IA";
    }
  }
}

function fillContractFormFromAi(contract, fileName) {
  const values = {
    name: contract.name,
    client: contract.client,
    agency: contract.agency,
    object: contract.object,
    legalBasis: contract.legalBasis,
    legalRegime: contract.legalRegime,
    contractNature: contract.contractNature,
    prorrogable: contract.prorrogable,
    maxTermMonths: contract.maxTermMonths,
    renewalAlertDays: contract.renewalAlertDays,
    addendumCount: contract.addendumCount,
    region: contract.region,
    agencyType: contract.agencyType,
    value: contract.value,
    monthly: contract.monthly,
    status: contract.status,
    start: contract.start,
    end: contract.end,
    renewal: contract.renewal,
    adjustment: contract.adjustment,
    fileRef: fileName,
    owner: contract.owner,
    notes: contract.notes,
  };
  Object.entries(values).forEach(([name, value]) => {
    const fieldEl = el.form.elements[name];
    if (!fieldEl || fieldEl.type === "file") return;
    fieldEl.value = value ?? "";
    fieldEl.dispatchEvent(new Event("input", { bubbles: true }));
    fieldEl.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

function setContractAiFormStatus(title, text) {
  const status = el.form.querySelector("#contractAiScanStatus");
  if (!status) return;
  status.classList.remove("is-error");
  status.innerHTML = `<strong>${escapeHtml(title)}</strong><span>${escapeHtml(text)}</span>`;
}

function inputFor(f, value) {
  const required = f.required ? "required" : "";
  const wide = f.type === "textarea" ? " wide" : "";
  if (f.type === "select") {
    const options = f.options
      .map((option) => {
        const valueOption = Array.isArray(option) ? option[0] : option;
        const labelOption = Array.isArray(option) ? option[1] : option;
        return `<option value="${escapeAttr(valueOption)}" ${String(value) === String(valueOption) ? "selected" : ""}>${labelOption}</option>`;
      })
      .join("");
    return `<label class="${wide}">${f.label}<select name="${f.name}" ${required}>${options}</select></label>`;
  }
  if (f.type === "textarea") {
    return `<label class="wide">${f.label}<textarea name="${f.name}" ${required}>${escapeHtml(value || "")}</textarea></label>`;
  }
  if (f.type === "file") {
    const accept = f.label.toLowerCase().includes("pdf") ? ` accept="application/pdf,.pdf"` : "";
    return `<label>${f.label}<input name="${f.name}" type="file"${accept} ${required} /></label>`;
  }
  return `<label>${f.label}<input name="${f.name}" type="${f.type}" value="${escapeAttr(value || "")}" ${required} /></label>`;
}

async function submitForm(event) {
  event.preventDefault();
  const { moduleKey, id } = state.editing || {};
  if (!moduleKey) return;
  const formData = new FormData(el.form);
  const values = {};
  let pendingFile = null;
  schemas[moduleKey].fields.forEach((f) => {
    if (f.type === "file") {
      const file = formData.get(f.name);
      if (file && file.name) pendingFile = file;
      return;
    }
    values[f.name] = formData.get(f.name) || "";
    if (f.type === "number") values[f.name] = Number(values[f.name] || 0);
  });
  if (moduleKey === "contratos") applyContractLegalDefaults(values);
  if (moduleKey !== "contratos") linkRecordToExistingClient(values);
  if (moduleKey === "renovacoes" && id) values.followUpAt = values.followUpAt || today();
  if (!pendingFile && moduleKey === "contratos" && state.contractFormAiFile) {
    pendingFile = state.contractFormAiFile;
  }
  const linkedClient = moduleKey === "contratos" ? ensureClientForContract(values) : null;
  const recordId = id || uid();
  if (pendingFile) {
    values.fileRef = pendingFile.name;
    if (cloudEnabled()) {
      try {
        const uploaded = await cloud().uploadFile(moduleKey, recordId, pendingFile);
        if (uploaded) {
          values.fileRef = uploaded.name;
          values.fileUrl = uploaded.url;
        }
      } catch {
        toast("Registro salvo, mas o anexo nao subiu para o Firebase.");
      }
    }
  }
  if (id) {
    const idx = db[moduleKey].findIndex((item) => item.id === id);
    db[moduleKey][idx] = { ...db[moduleKey][idx], ...values, updatedAt: now() };
    if (moduleKey === "contratos") {
      syncContractRenewal(db[moduleKey][idx]);
      await processRenewalAutomation({ generateLetters: true });
    }
    if (moduleKey === "renovacoes") await processRenewalAutomation({ generateLetters: true });
    saveDb(`Editou ${schemas[moduleKey].singular}`, linkedClient ? `${values.name || id} vinculado a ${linkedClient.name}` : values.name || id);
    toast("Registro atualizado.");
  } else {
    values.id = recordId;
    const created = record(values);
    db[moduleKey].unshift(created);
    if (moduleKey === "contratos") {
      syncContractRenewal(created);
      await processRenewalAutomation({ generateLetters: true });
    }
    if (moduleKey === "renovacoes") await processRenewalAutomation({ generateLetters: true });
    saveDb(`Criou ${schemas[moduleKey].singular}`, linkedClient ? `${values.name || "novo registro"} vinculado a ${linkedClient.name}` : values.name || "novo registro");
    toast("Registro criado.");
  }
  closeForm();
  updateLoginNumbers();
  render();
}

function askDelete(moduleKey, id) {
  const item = (db[moduleKey] || []).find((row) => row.id === id);
  state.deleteTarget = { moduleKey, id };
  el.confirmText.textContent = `Remover "${item?.name || "registro"}" da base do Firebase?`;
  el.confirmModal.classList.remove("hidden");
}

function closeConfirm() {
  el.confirmModal.classList.add("hidden");
  state.deleteTarget = null;
}

function deleteConfirmed() {
  const { moduleKey, id } = state.deleteTarget || {};
  if (!moduleKey) return;
  const item = db[moduleKey].find((row) => row.id === id);
  db[moduleKey] = db[moduleKey].filter((row) => row.id !== id);
  saveDb(`Removeu ${schemas[moduleKey].singular}`, item?.name || id);
  closeConfirm();
  closeDrawer();
  render();
  toast("Registro removido.");
}

function openDetail(moduleKey, id) {
  const schema = schemas[moduleKey];
  const item = (db[moduleKey] || []).find((row) => row.id === id);
  if (!schema || !item) return;
  el.drawerKicker.textContent = schema.title;
  el.drawerTitle.textContent = item.name || schema.singular;
  const fields = schema.fields
    .filter((f) => item[f.name] !== undefined && item[f.name] !== "")
    .map((f) => detailField(f.label, formatFieldValue(f, item[f.name])))
    .join("");
  el.drawerBody.innerHTML = `
    <section class="drawer-section">
      <div class="drawer-status">${badge(item.status || "cyan")}</div>
      <div class="detail-grid">${fields}</div>
    </section>
    ${contractPdfSection(moduleKey, item)}
    ${contractLegalSection(moduleKey, item)}
    <section class="drawer-section">
      <h3>Linha do tempo</h3>
      <div class="timeline">
        <div><span></span><strong>Criado</strong><small>${formatDateTime(item.createdAt)}</small></div>
        <div><span></span><strong>Atualizado</strong><small>${formatDateTime(item.updatedAt)}</small></div>
        <div><span></span><strong>Responsavel</strong><small>${escapeHtml(item.owner || item.manager || "Equipe")}</small></div>
      </div>
    </section>
    <section class="drawer-section">
      <h3>Operacao</h3>
      <div class="drawer-actions">
        <button class="primary-button" data-edit="${id}" data-module="${moduleKey}" type="button">Editar registro</button>
        ${moduleKey === "contratos" ? `<button class="secondary-button" data-ai-letter-contract="${id}" type="button">Gerar carta IA</button>` : ""}
        ${moduleKey === "renovacoes" ? renewalDrawerActions(item) : ""}
        <button class="secondary-button" data-ai="Diagnostico da carteira" type="button">Abrir IA Gemini</button>
        <button class="danger-button" data-delete="${id}" data-module="${moduleKey}" type="button">Excluir</button>
      </div>
    </section>
  `;
  el.drawer.classList.remove("hidden");
  el.drawerBackdrop.classList.remove("hidden");
  bindDynamicActions();
}

function renewalDrawerActions(item) {
  const generate = `<button class="secondary-button" data-ai-letter-renewal="${escapeAttr(item.id)}" type="button">Gerar carta IA</button>`;
  const send = item.letterDraft ? `<button class="secondary-button" data-renewal-email="${escapeAttr(item.id)}" type="button">Enviar carta</button>` : "";
  const mark = item.letterDraft && item.emailStatus !== "sent" ? `<button class="secondary-button" data-renewal-mark-sent="${escapeAttr(item.id)}" type="button">Marcar enviada</button>` : "";
  return `${generate}${send}${mark}`;
}

function closeDrawer() {
  el.drawer.classList.add("hidden");
  el.drawerBackdrop.classList.add("hidden");
}

function detailField(label, value) {
  return `<div class="detail-field"><span>${escapeHtml(label)}</span><strong>${value}</strong></div>`;
}

function contractPdfSection(moduleKey, item) {
  if (moduleKey !== "contratos" || (!item.fileUrl && !item.documentUrl)) return "";
  const internal = item.fileUrl
    ? `<a class="primary-button" href="${escapeAttr(item.fileUrl)}" target="_blank" rel="noreferrer">Abrir PDF no VendeGov</a>`
    : "";
  const source = item.documentUrl
    ? `<a class="secondary-button" href="${escapeAttr(item.documentUrl)}" target="_blank" rel="noreferrer">Abrir PDF origem</a>`
    : "";
  const readAi = `<button class="secondary-button" data-ai-read-contract="${escapeAttr(item.id)}" type="button">Ler PDF com IA</button>`;
  return `
    <section class="drawer-section">
      <h3>PDF do contrato</h3>
      <div class="drawer-actions">${internal}${source}${readAi}</div>
    </section>
  `;
}

function formatFieldValue(fieldDef, value) {
  if (fieldDef.type === "number") return money(value);
  if (fieldDef.type === "date") return date(value);
  if (fieldDef.name === "status") return badge(value);
  if (fieldDef.type === "url") {
    const label = fieldDef.name === "fileUrl"
      ? "Abrir PDF no VendeGov"
      : fieldDef.name === "documentUrl"
        ? "Abrir PDF origem"
        : fieldDef.name === "photoUrl"
          ? "Abrir foto"
          : value;
    return `<a href="${escapeAttr(value)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`;
  }
  return escapeHtml(value);
}

function activeCrudModule() {
  if (state.view === "configuracoes") return state.configTab === "audit" ? "usuarios" : state.configTab;
  return schemas[state.view] ? state.view : "clientes";
}

function filtered(rows) {
  return rows.filter((item) => {
    const queryOk = !state.query || JSON.stringify(item).toLowerCase().includes(state.query);
    const statusOk = state.status === "todos" || item.status === state.status;
    return queryOk && statusOk;
  });
}

function exportDb() {
  const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `vendegov-crm-backup-${today()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  saveDb("Exportou base", "Backup JSON gerado");
  toast("Backup exportado.");
}

function importDb(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const content = String(reader.result || "");
      if (isCsvFile(file) || el.importFile.dataset.mode) {
        importBase44Csv(content, file.name, el.importFile.dataset.mode);
        return;
      }
      const incoming = JSON.parse(content);
      db = { ...emptyDb(), ...incoming, audit: incoming.audit || [] };
      saveDb("Importou base", file.name);
      render();
      toast("Base importada.");
    } catch {
      toast("Nao foi possivel importar o arquivo.");
    } finally {
      el.importFile.dataset.mode = "";
      el.importFile.accept = ".json,.csv,application/json,text/csv";
    }
  };
  reader.readAsText(file, "utf-8");
  event.target.value = "";
}

function isCsvFile(file) {
  const name = (file.name || "").toLowerCase();
  const type = (file.type || "").toLowerCase();
  return name.endsWith(".csv") || type.includes("csv") || type.includes("excel");
}

function importBase44Csv(text, fileName, mode = "") {
  const rows = csvToObjects(text);
  if (!rows.length) throw new Error("CSV vazio");
  const headers = Object.keys(rows[0]);
  if (mode === "contratos" || headers.includes("numero_contrato")) return importContractsRows(rows, fileName);
  if (mode === "clientes" || (headers.includes("nome_exibicao") && headers.includes("municipio"))) return importClientsRows(rows, fileName);
  if (mode === "usuarios" || headers.includes("consultor_email")) return importConsultantsRows(rows, fileName);
  throw new Error("CSV Base44 nao reconhecido");
}

function importContractsCsv(text, fileName) {
  const rows = csvToObjects(text);
  return importContractsRows(rows, fileName);
}

function importContractsRows(rows, fileName) {
  if (!rows.length) throw new Error("CSV vazio");
  let created = 0;
  let updated = 0;
  let skipped = 0;
  const contracts = [...(db.contratos || [])];
  rows.forEach((row) => {
    const mapped = contractFromCsvRow(row);
    if (!mapped) {
      skipped += 1;
      return;
    }
    applyContractLegalDefaults(mapped);
    ensureClientForContract(mapped);
    const existingIndex = contracts.findIndex((item) => (
      mapped.sourceId
        ? item.sourceId === mapped.sourceId || item.id === mapped.sourceId
        : item.name === mapped.name && item.client === mapped.client && item.start === mapped.start
    ));
    if (existingIndex >= 0) {
      contracts[existingIndex] = {
        ...contracts[existingIndex],
        ...mapped,
        id: contracts[existingIndex].id,
        createdAt: contracts[existingIndex].createdAt || mapped.createdAt,
        updatedAt: now(),
      };
      updated += 1;
    } else {
      contracts.unshift(mapped);
      created += 1;
    }
  });
  db.contratos = contracts;
  contracts.forEach((contract) => syncContractRenewal(contract));
  saveDb("Importou contratos", `${created} novos, ${updated} atualizados, ${skipped} ignorados - ${fileName}`);
  updateLoginNumbers();
  setView("contratos");
  toast(`${created} contratos importados, ${updated} atualizados.`);
}

function contractFromCsvRow(row) {
  const sourceId = cleanImport(row.id);
  const number = cleanImport(row.numero_contrato);
  const agency = cleanImport(row.orgao_contratante);
  const client = agency || cleanImport(row.empresa_id);
  if (!sourceId && !number && !client) return null;
  const addendum = cleanImport(row.numero_aditivo);
  const name = addendum ? `Contrato ${number || sourceId} - ${addendum}` : `Contrato ${number || sourceId}`;
  const percent = cleanImport(row.percentual_reajuste);
  const adjustment = [cleanImport(row.indice_reajuste), percent ? `${percent}%` : ""].filter(Boolean).join(" ");
  return {
    id: sourceId || uid(),
    sourceId,
    createdAt: normalizeImportDate(row.created_date) || now(),
    updatedAt: normalizeImportDate(row.updated_date) || now(),
    name,
    client: client || "Cliente nao informado",
    agency,
    object: cleanImport(row.objeto),
    legalBasis: cleanImport(row.fundamento_legal),
    legalRegime: cleanImport(row.regime_legal),
    contractNature: cleanImport(row.natureza_contrato),
    prorrogable: cleanImport(row.prorrogavel) ? (importBool(row.prorrogavel) ? "Sim" : "Nao") : "",
    maxTermMonths: parseImportNumber(row.prazo_maximo_meses),
    renewalAlertDays: parseImportNumber(row.alerta_renovacao_dias),
    addendumCount: parseImportNumber(row.quantidade_aditivos || row.aditivos_realizados),
    region: cleanImport(row.regiao),
    agencyType: cleanImport(row.tipo_orgao),
    value: parseImportNumber(row.valor_total),
    monthly: parseImportNumber(row.valor_mensal),
    status: mapContractStatus(row.status, row.data_fim),
    start: normalizeImportDate(row.data_inicio),
    end: normalizeImportDate(row.data_fim),
    renewal: normalizeImportDate(row.data_renovacao),
    adjustment,
    documentUrl: cleanImport(row.arquivo_contrato),
    owner: mapConsultant(row.consultor_responsavel),
    notes: contractImportNotes(row),
  };
}

function contractImportNotes(row) {
  const parts = [
    cleanImport(row.observacoes) ? `Observacoes originais: ${cleanImport(row.observacoes)}` : "",
    cleanImport(row.vigencia_prazo) ? `Vigencia: ${cleanImport(row.vigencia_prazo)}` : "",
    cleanImport(row.prorrogavel) ? `Prorrogavel: ${importBool(row.prorrogavel) ? "Sim" : "Nao"}` : "",
    cleanImport(row.eh_aditivo) ? `Aditivo: ${importBool(row.eh_aditivo) ? "Sim" : "Nao"}` : "",
    cleanImport(row.contrato_aditivo_de) ? `Contrato aditivo de: ${cleanImport(row.contrato_aditivo_de)}` : "",
    cleanImport(row.resultado_renovacao) ? `Resultado renovacao: ${cleanImport(row.resultado_renovacao)}` : "",
    cleanImport(row.consultor_responsavel) ? `Consultor origem: ${cleanImport(row.consultor_responsavel)}` : "",
    cleanImport(row.pct_comissao_implantacao) ? `Comissao implantacao: ${cleanImport(row.pct_comissao_implantacao)}%` : "",
    cleanImport(row.pct_comissao_licenciamento) ? `Comissao licenciamento: ${cleanImport(row.pct_comissao_licenciamento)}%` : "",
    contractItemsSummary(row.itens_contrato),
  ];
  return parts.filter(Boolean).join("\n");
}

function importClientsRows(rows, fileName) {
  let created = 0;
  let updated = 0;
  let skipped = 0;
  const clients = [...(db.clientes || [])];
  rows.forEach((row) => {
    const mapped = clientFromCsvRow(row);
    if (!mapped) {
      skipped += 1;
      return;
    }
    const existingIndex = clients.findIndex((item) => (
      mapped.sourceId
        ? item.sourceId === mapped.sourceId || item.id === mapped.sourceId
        : item.name === mapped.name && item.city === mapped.city
    ));
    if (existingIndex >= 0) {
      clients[existingIndex] = {
        ...clients[existingIndex],
        ...mapped,
        id: clients[existingIndex].id,
        createdAt: clients[existingIndex].createdAt || mapped.createdAt,
        updatedAt: now(),
      };
      updated += 1;
    } else {
      clients.unshift(mapped);
      created += 1;
    }
  });
  db.clientes = clients;
  saveDb("Importou clientes", `${created} novos, ${updated} atualizados, ${skipped} ignorados - ${fileName}`);
  setView("clientes");
  toast(`${created} clientes importados, ${updated} atualizados.`);
}

function clientFromCsvRow(row) {
  const sourceId = cleanImport(row.id);
  const name = cleanImport(row.nome_exibicao) || cleanImport(row.orgao_original) || cleanImport(row.municipio);
  if (!sourceId && !name) return null;
  const contact = contactFromBase44(row.contatos);
  return {
    id: sourceId || uid(),
    sourceId,
    createdAt: normalizeImportDate(row.created_date) || now(),
    updatedAt: normalizeImportDate(row.updated_date) || now(),
    name: name || "Cliente nao informado",
    segment: mapOrganizationType(row.tipo_orgao),
    cnpj: "",
    contact: contact.name,
    email: contact.email,
    phone: contact.phone,
    city: cleanImport(row.municipio),
    website: cleanImport(row.dominio),
    region: cleanImport(row.regiao),
    originalName: cleanImport(row.orgao_original),
    potential: 0,
    status: "green",
    owner: "Equipe comercial",
    notes: clientImportNotes(row, contact),
  };
}

function clientImportNotes(row, contact) {
  const parts = [
    cleanImport(row.observacoes),
    cleanImport(row.orgao_original) ? `Orgao original: ${cleanImport(row.orgao_original)}` : "",
    cleanImport(row.tipo_orgao) ? `Tipo de orgao: ${cleanImport(row.tipo_orgao)}` : "",
    cleanImport(row.grupo_empresa_id) ? `Grupo empresa origem: ${cleanImport(row.grupo_empresa_id)}` : "",
    contact.summary,
  ];
  return parts.filter(Boolean).join("\n");
}

function contactFromBase44(value) {
  const fallback = { name: "", phone: "", email: "", summary: "" };
  const text = cleanImport(value);
  if (!text || text === "[]") return fallback;
  try {
    const contacts = JSON.parse(text);
    if (!Array.isArray(contacts)) return fallback;
    const parsed = contacts.map((item) => ({
      name: cleanImport(item.nome),
      type: cleanImport(item.tipo),
      value: cleanImport(item.valor),
    })).filter((item) => item.name || item.value);
    const first = parsed[0] || fallback;
    const email = parsed.find((item) => item.value.includes("@"))?.value || "";
    const phone = parsed.find((item) => !item.value.includes("@"))?.value || "";
    const summary = parsed.length ? `Contatos origem: ${parsed.map((item) => [item.name, item.type, item.value].filter(Boolean).join(" - ")).join("; ")}` : "";
    return { name: first.name, phone, email, summary };
  } catch {
    return { ...fallback, summary: `Contatos origem: ${text}` };
  }
}

function importConsultantsRows(rows, fileName) {
  let created = 0;
  let updated = 0;
  let skipped = 0;
  const users = [...(db.usuarios || [])];
  rows.forEach((row) => {
    const mapped = consultantFromCsvRow(row);
    if (!mapped) {
      skipped += 1;
      return;
    }
    const existingIndex = users.findIndex((item) => (
      mapped.sourceId
        ? item.sourceId === mapped.sourceId || item.id === mapped.sourceId
        : item.email === mapped.email
    ));
    if (existingIndex >= 0) {
      users[existingIndex] = {
        ...users[existingIndex],
        ...mapped,
        id: users[existingIndex].id,
        createdAt: users[existingIndex].createdAt || mapped.createdAt,
        updatedAt: now(),
      };
      updated += 1;
    } else {
      users.unshift(mapped);
      created += 1;
    }
  });
  db.usuarios = users;
  saveDb("Importou consultores", `${created} novos, ${updated} atualizados, ${skipped} ignorados - ${fileName}`);
  state.configTab = "usuarios";
  setView("configuracoes");
  toast(`${created} consultores importados, ${updated} atualizados.`);
}

function consultantFromCsvRow(row) {
  const sourceId = cleanImport(row.id);
  const email = cleanImport(row.consultor_email) || cleanImport(row.email_contato);
  const name = cleanImport(row.nome) || email;
  if (!sourceId && !email && !name) return null;
  return {
    id: sourceId || uid(),
    sourceId,
    createdAt: normalizeImportDate(row.created_date) || now(),
    updatedAt: normalizeImportDate(row.updated_date) || now(),
    name: name || "Consultor nao informado",
    email: email || cleanImport(row.email_contato),
    contactEmail: cleanImport(row.email_contato),
    role: mapConsultantRole(row.cargo),
    phone: cleanImport(row.telefone),
    photoUrl: cleanImport(row.foto_url),
    status: "green",
    lastAccess: normalizeImportDate(row.updated_date) || today(),
    notes: consultantImportNotes(row),
  };
}

function consultantImportNotes(row) {
  const parts = [
    cleanImport(row.cargo) ? `Cargo origem: ${cleanImport(row.cargo)}` : "",
    cleanImport(row.empresa_id) ? `Empresa origem: ${cleanImport(row.empresa_id)}` : "",
    cleanImport(row.grupo_empresa_id) ? `Grupo empresa origem: ${cleanImport(row.grupo_empresa_id)}` : "",
    cleanImport(row.created_by_id) ? `Criado por origem: ${cleanImport(row.created_by_id)}` : "",
  ];
  return parts.filter(Boolean).join("\n");
}

function contractItemsSummary(value) {
  const text = cleanImport(value);
  if (!text || text === "[]") return "";
  try {
    const items = JSON.parse(text);
    if (Array.isArray(items)) {
      const names = items.map((item) => cleanImport(item.nome)).filter(Boolean);
      return names.length ? `Itens do contrato: ${names.join("; ")}` : "";
    }
  } catch {
    return `Itens do contrato: ${text}`;
  }
  return "";
}

function csvToObjects(text) {
  const rows = parseCsv(text.replace(/^\uFEFF/, ""));
  if (!rows.length) return [];
  const headers = rows.shift().map((header) => cleanImport(header));
  return rows
    .map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""])))
    .filter((row) => Object.values(row).some((value) => cleanImport(value)));
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let fieldValue = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        fieldValue += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        fieldValue += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(fieldValue);
      fieldValue = "";
    } else if (char === "\n") {
      row.push(fieldValue);
      if (row.some((cell) => cell !== "")) rows.push(row);
      row = [];
      fieldValue = "";
    } else if (char !== "\r") {
      fieldValue += char;
    }
  }
  row.push(fieldValue);
  if (row.some((cell) => cell !== "")) rows.push(row);
  return rows;
}

function parseImportNumber(value) {
  const raw = cleanImport(value);
  if (!raw) return 0;
  const onlyNumber = raw.replace(/[^\d,.-]/g, "");
  const comma = onlyNumber.lastIndexOf(",");
  const dot = onlyNumber.lastIndexOf(".");
  const normalized = comma > dot ? onlyNumber.replace(/\./g, "").replace(",", ".") : onlyNumber.replace(/,/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeImportDate(value) {
  const raw = cleanImport(value);
  if (!raw) return "";
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const br = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (br) return `${br[3]}-${br[2]}-${br[1]}`;
  return raw.slice(0, 10);
}

function mapContractStatus(value, endDate) {
  const raw = removeAccents(cleanImport(value)).toLowerCase();
  if (raw.includes("arquivado") || raw.includes("encerrado") || raw.includes("cancelado") || raw.includes("perdido")) return "red";
  if (raw.includes("proximo") || raw.includes("vencimento")) return "yellow";
  if (raw.includes("renovado") || raw.includes("vigente")) return "green";
  const end = normalizeImportDate(endDate);
  if (end && end < today()) return "red";
  return "cyan";
}

function mapConsultant(value) {
  const raw = removeAccents(cleanImport(value)).toLowerCase();
  if (raw.includes("steven")) return "Steven Passos";
  if (raw.includes("diego")) return "Diego Pereira";
  if (raw.includes("digitalcompasso")) return "Digital Compasso";
  if (raw.includes("mariana")) return "Mariana Costa";
  if (raw.includes("rafael")) return "Rafael Lima";
  return "Equipe comercial";
}

function mapConsultantRole(value) {
  const raw = removeAccents(cleanImport(value)).toLowerCase();
  if (raw.includes("administr")) return "Administrador";
  if (raw.includes("gestor")) return "Gestor";
  if (raw.includes("comercial")) return "Consultor Comercial";
  if (raw.includes("negocio")) return "Consultor de Negocios";
  if (raw.includes("financeiro")) return "Financeiro";
  return "Consultor";
}

function mapOrganizationType(value) {
  const raw = removeAccents(cleanImport(value)).toLowerCase();
  if (raw.includes("prefeitura")) return "Prefeitura";
  if (raw.includes("camara")) return "Camara";
  if (raw.includes("consorcio")) return "Consorcio";
  if (raw.includes("instituto")) return "Instituto";
  if (raw.includes("autarquia")) return "Autarquia";
  if (raw.includes("fundacao")) return "Fundacao";
  return cleanImport(value) || "Outro";
}

function importBool(value) {
  const raw = removeAccents(cleanImport(value)).toLowerCase();
  return ["true", "sim", "s", "1", "yes"].includes(raw);
}

function cleanImport(value) {
  return String(value ?? "").trim();
}

function removeAccents(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function openAiWorkspace(action = "") {
  state.aiFocus = action;
  setView("ia");
  if (action) toast(`IA pronta para: ${action}.`);
}

async function analyzePdfFromPanel() {
  const input = document.querySelector("#aiPdfInput");
  const file = input?.files?.[0];
  if (!file) {
    toast("Selecione um PDF para a IA ler.");
    return;
  }
  await analyzeContractFile(file);
}

async function analyzeContractFile(file) {
  if (!cloudEnabled() || !cloud()?.analyzeContractFile) {
    toast("Firebase AI Logic ainda nao esta configurado.");
    return;
  }
  state.aiBusy = "extract";
  state.aiDraftContract = null;
  state.aiLastExtraction = null;
  renderAi();
  try {
    const extracted = await cloud().analyzeContractFile(file);
    state.aiLastExtraction = extracted;
    state.aiDraftContract = contractFromAiExtraction(extracted, file.name);
    saveDb("Executou IA", `Leitura de contrato: ${file.name}`);
    toast("Contrato lido pela IA. Confira antes de cadastrar.");
  } catch (error) {
    toast(aiErrorMessage(error));
  } finally {
    state.aiBusy = "";
    renderAi();
  }
}

function contractFromAiExtraction(data, fileName = "") {
  const number = cleanImport(data.numero_contrato);
  const name = number ? `Contrato ${number}` : cleanImport(data.nome) || cleanImport(fileName).replace(/\.[^.]+$/, "") || "Contrato extraido por IA";
  const agency = cleanImport(data.orgao_comprador) || cleanImport(data.contratante);
  const client = agency || cleanImport(data.contratada) || "Cliente nao informado";
  const obligations = Array.isArray(data.obrigacoes_principais) ? data.obrigacoes_principais.filter(Boolean) : [];
  const risks = Array.isArray(data.riscos) ? data.riscos.filter(Boolean) : [];
  const notes = [
    cleanImport(data.resumo),
    obligations.length ? `Obrigacoes principais:\n- ${obligations.join("\n- ")}` : "",
    risks.length ? `Riscos apontados pela IA:\n- ${risks.join("\n- ")}` : "",
    cleanImport(data.contratada) ? `Contratada: ${cleanImport(data.contratada)}` : "",
    cleanImport(data.cnpj_contratada) ? `CNPJ contratada: ${cleanImport(data.cnpj_contratada)}` : "",
    fileName ? `Fonte analisada: ${fileName}` : "",
  ];
  return {
    name,
    client,
    agency,
    object: cleanImport(data.objeto),
    legalBasis: cleanImport(data.fundamento_legal),
    legalRegime: cleanImport(data.regime_legal),
    contractNature: cleanImport(data.natureza_contrato),
    prorrogable: cleanImport(data.permite_prorrogacao) || cleanImport(data.prorrogavel),
    maxTermMonths: Number(data.prazo_maximo_meses || 0),
    renewalAlertDays: Number(data.alerta_renovacao_dias || 120),
    addendumCount: Number(data.quantidade_aditivos || 0),
    region: cleanImport(data.regiao),
    agencyType: cleanImport(data.tipo_orgao),
    value: Number(data.valor_total || 0),
    monthly: Number(data.valor_mensal || 0),
    status: mapContractStatus("", data.data_fim),
    start: normalizeImportDate(data.data_inicio),
    end: normalizeImportDate(data.data_fim),
    renewal: normalizeImportDate(data.renovacao_prevista),
    adjustment: cleanImport(data.indice_reajuste),
    owner: currentUserLabel() || "Equipe comercial",
    notes: notes.filter(Boolean).join("\n\n"),
  };
}

async function saveAiDraftContract() {
  if (!state.aiDraftContract) {
    toast("Nao ha contrato extraido para cadastrar.");
    return;
  }
  applyContractLegalDefaults(state.aiDraftContract);
  ensureClientForContract(state.aiDraftContract);
  const item = record(state.aiDraftContract);
  db.contratos.unshift(item);
  syncContractRenewal(item);
  await processRenewalAutomation({ generateLetters: true });
  state.aiContractId = item.id;
  state.aiDraftContract = null;
  saveDb("Cadastrou contrato por IA", item.name);
  updateLoginNumbers();
  setView("contratos");
  toast("Contrato cadastrado no Firebase.");
}

async function analyzeStoredContractPdf(id) {
  const contract = (db.contratos || []).find((item) => item.id === id);
  const url = contract?.fileUrl || contract?.documentUrl;
  if (!contract || !url) {
    toast("Este contrato ainda nao tem PDF para a IA ler.");
    return;
  }
  setView("ia");
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("PDF indisponivel.");
    const blob = await response.blob();
    const file = new File([blob], contract.fileRef || `${contract.name || "contrato"}.pdf`, { type: blob.type || "application/pdf" });
    await analyzeContractFile(file);
  } catch {
    toast("Nao consegui ler esse PDF automaticamente. Baixe o arquivo e envie pela tela IA Gemini.");
  }
}

async function generateRenewalLetterFromSelection(contractId = state.aiContractId) {
  const contract = (db.contratos || []).find((item) => item.id === contractId);
  if (!contract) {
    toast("Selecione um contrato para gerar a carta.");
    return;
  }
  if (!cloudEnabled() || !cloud()?.generateRenewalLetter) {
    toast("Firebase AI Logic ainda nao esta configurado.");
    return;
  }
  state.aiContractId = contract.id;
  state.aiBusy = "letter";
  state.aiLetter = "";
  renderAi();
  try {
    const renewal = findRenewalForContract(contract);
    state.aiLetter = await cloud().generateRenewalLetter(contract, renewal);
    if (renewal?.id) {
      const contacts = renewalContacts(renewal, contract);
      renewal.clientEmail = renewal.clientEmail || contacts.clientEmail;
      renewal.consultantEmail = renewal.consultantEmail || contacts.consultantEmail;
      renewal.letterSubject = renewalLetterSubject(contract, renewal);
      renewal.letterDraft = state.aiLetter;
      renewal.letterGeneratedAt = today();
      renewal.emailStatus = renewal.clientEmail ? "ready" : "blocked";
      renewal.updatedAt = now();
      ensureLetterNotification(renewal);
    }
    saveDb("Gerou carta de renovacao", contract.name || contract.id);
    toast("Carta de renovacao gerada.");
  } catch (error) {
    toast(aiErrorMessage(error));
  } finally {
    state.aiBusy = "";
    renderAi();
  }
}

async function generateRenewalLetterForContractId(id) {
  state.aiContractId = id;
  setView("ia");
  await generateRenewalLetterFromSelection(id);
}

async function generateRenewalLetterForRenewalId(id) {
  const renewal = (db.renovacoes || []).find((item) => item.id === id);
  const contract = findContractForRenewal(renewal || {});
  if (!contract) {
    setView("ia");
    toast("Nao encontrei o contrato vinculado a esta renovacao.");
    return;
  }
  await generateAutomaticRenewalLetter(renewal, { force: true });
  saveDb("Gerou carta de renovacao", contract.name || contract.id);
  state.aiContractId = contract.id;
  state.aiLetter = renewal.letterDraft || "";
  setView("ia");
  toast("Carta salva na renovacao.");
}

function findRenewalForContract(contract) {
  return (db.renovacoes || []).find((item) => (
    item.contractId === contract.id ||
    sameText(item.contract, contract.name) ||
    (sameText(item.client, contract.client) && sameText(item.currentEnd, contract.end))
  )) || {};
}

function sameText(a, b) {
  const left = normalizeText(a);
  const right = normalizeText(b);
  return Boolean(left && right && left === right);
}

async function copyAiLetter() {
  if (!state.aiLetter) return;
  try {
    await navigator.clipboard.writeText(state.aiLetter);
    toast("Carta copiada.");
  } catch {
    toast("Nao foi possivel copiar automaticamente.");
  }
}

function aiErrorMessage(error) {
  const message = String(error?.message || error || "");
  if (/AI Logic|Firebase AI|not configured|api key|permission|403|404|app check/i.test(message)) {
    return "Ative Firebase AI Logic e App Check no Console Firebase para usar o Gemini.";
  }
  if (/413|size|large|18 MB|20 MB/i.test(message)) return "PDF grande demais para leitura direta. Use um arquivo menor.";
  return "A IA nao conseguiu concluir esta acao agora.";
}

function metric(label, value, hint) {
  return `<article class="metric-card"><span>${label}</span><strong>${value}</strong><small>${hint}</small></article>`;
}

function aiButton(code, title, desc) {
  return `<button class="ai-action" type="button" data-ai="${title}"><span>${code}</span><div><strong>${title}</strong><small>${desc}</small></div></button>`;
}

function insight(code, text) {
  return `<div class="ai-action"><span>${code}</span><div><strong>${text}</strong><small>Resumo gerencial calculado pela base atual.</small></div></div>`;
}

function moduleCard(code, title, desc) {
  return `<article class="module-card"><span>${code}</span><div><strong>${title}</strong><small>${desc}</small></div></article>`;
}

function rowActions(moduleKey, id) {
  return `<div class="row-actions"><button class="mini-button" data-open="${id}" data-module="${moduleKey}" type="button">Abrir</button><button class="mini-button" data-edit="${id}" data-module="${moduleKey}" type="button">Editar</button><button class="mini-button danger" data-delete="${id}" data-module="${moduleKey}" type="button">Excluir</button></div>`;
}

function rowButton(moduleKey, id) {
  return `<button class="mini-button" data-open="${id}" data-module="${moduleKey}" type="button">Abrir</button>`;
}

function mainCell(title, subtitle) {
  return `<span class="record-title">${escapeHtml(title || "-")}</span>${subtitle ? `<span class="record-subtitle">${escapeHtml(subtitle)}</span>` : ""}`;
}

function badge(status) {
  const label = {
    green: "Ativo",
    cyan: "Em analise",
    yellow: "Atencao",
    red: "Risco",
  }[status] || status || "-";
  return `<span class="status status-${status || "cyan"}">${label}</span>`;
}

function bar(label, value, width) {
  return `<div class="bar-row"><strong>${label}</strong><div class="bar-track"><span style="width:${Math.max(8, width)}%"></span></div><b>${value}</b></div>`;
}

function money(value) {
  const number = Number(value || 0);
  return number.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function date(value) {
  if (!value) return "-";
  const [year, month, day] = String(value).slice(0, 10).split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

function parseDate(value) {
  if (!value) return null;
  const dt = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function daysUntil(value) {
  const target = parseDate(value);
  if (!target) return 0;
  const todayDate = parseDate(today());
  return Math.ceil((target.getTime() - todayDate.getTime()) / 86400000);
}

function addDays(value, amount) {
  const dt = parseDate(value);
  if (!dt) return "";
  dt.setDate(dt.getDate() + Number(amount || 0));
  return dt.toISOString().slice(0, 10);
}

function monthsBetween(start, end) {
  const startDate = parseDate(start);
  const endDate = parseDate(end);
  if (!startDate || !endDate) return 0;
  let months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
  if (endDate.getDate() >= startDate.getDate()) months += 1;
  return Math.max(0, months);
}

function formatDateTime(value) {
  if (!value) return "-";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return value;
  return `${date(dt.toISOString())} ${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
}

function sum(rows, key) {
  return rows.reduce((acc, item) => acc + Number(item[key] || 0), 0);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("'", "&#039;");
}

function toast(message) {
  el.toast.textContent = message;
  el.toast.classList.add("show");
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => el.toast.classList.remove("show"), 2600);
}

function updateLoginNumbers() {
  const revenue = document.querySelector("#loginRevenue");
  const contracts = document.querySelector("#loginContracts");
  if (revenue) revenue.textContent = money(sum(db.contratos, "monthly"));
  if (contracts) contracts.textContent = db.contratos.length;
}

init();
