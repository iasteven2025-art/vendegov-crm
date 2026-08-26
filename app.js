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
  ["relatorios", "10", "Relatorios", "Relatorios"],
  ["configuracoes", "11", "Parametros", "Parametrizacao"],
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
      field("responsibleCompany", "Empresa responsavel", "text"),
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
      field("responsibleCompany", "Empresa responsavel", "text"),
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
      field("photoUpload", "Upload da foto", "file", false, null, { accept: "image/*", refField: "photoRef", urlField: "photoUrl" }),
      field("photoUrl", "Foto", "url"),
      field("contactEmail", "E-mail de contato", "email"),
      field("sourceId", "ID origem", "text"),
      field("status", "Status", "select", true, [["green", "Ativo"], ["yellow", "Pendente"], ["red", "Bloqueado"]]),
      field("lastAccess", "Ultimo acesso", "date"),
      field("notes", "Observacoes", "textarea"),
    ],
    row: (r) => [mediaCell(r.name, r.email, r.photoUrl), r.role, badge(r.status), r.email, date(r.lastAccess)],
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
      field("cnpj", "CNPJ", "text"),
      field("email", "E-mail do timbre", "email"),
      field("phone", "Telefone do timbre", "text"),
      field("address", "Endereco do timbre", "text"),
      field("city", "Cidade/UF", "text"),
      field("logoUpload", "Upload da logo do timbre", "file", false, null, { accept: "image/*", refField: "logoRef", urlField: "logoUrl" }),
      field("logoUrl", "Logo do timbre", "url"),
      field("portfolio", "Carteira", "text"),
      field("manager", "Gestor", "text"),
      field("status", "Status", "select", true, [["green", "Ativa"], ["yellow", "Implantacao"], ["red", "Inativa"]]),
      field("notes", "Observacoes", "textarea"),
    ],
    row: (r) => [mediaCell(r.name, r.portfolio, r.logoUrl), r.region, badge(r.status), r.manager, r.portfolio],
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
  dashboardNotificationsOpen: false,
  aiBusy: "",
  aiFocus: "",
  aiContractId: "",
  aiDraftContract: null,
  aiLastExtraction: null,
  aiLetter: "",
  contractFormAiBusy: false,
  contractFormAiFile: null,
  contractFormAiExtraction: null,
  renewalTab: "vencer",
  letterRenewalId: "",
  letterTab: "preview",
};

let db = emptyDb();

const el = {
  loginScreen: document.querySelector("#loginScreen"),
  appShell: document.querySelector("#appShell"),
  loginForm: document.querySelector("#loginForm"),
  resetPasswordButton: document.querySelector("#resetPasswordButton"),
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
  letterModal: document.querySelector("#letterModal"),
  letterModalKicker: document.querySelector("#letterModalKicker"),
  letterModalTitle: document.querySelector("#letterModalTitle"),
  letterModalTabs: document.querySelector("#letterModalTabs"),
  letterModalBody: document.querySelector("#letterModalBody"),
  letterModalFooter: document.querySelector("#letterModalFooter"),
  closeLetterModal: document.querySelector("#closeLetterModal"),
  confirmModal: document.querySelector("#confirmModal"),
  confirmText: document.querySelector("#confirmText"),
  closeConfirm: document.querySelector("#closeConfirm"),
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

function field(name, label, type, required = false, options = null, extra = {}) {
  return { name, label, type, required, options, ...extra };
}

function defaultAiConfig() {
  return {
    enabled: true,
    provider: "firebase-ai-logic",
    model: "gemini-3.6-flash",
    connectionMode: "firebase-ai-logic",
    apiKey: "",
    endpointUrl: "",
    secretRef: "Firebase AI Logic",
    status: "green",
    updatedAt: today(),
    notes: "Use Firebase AI Logic ou cadastre uma chave direta para testes controlados. Chaves diretas ficam visiveis para usuarios com acesso aos parametros.",
  };
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
      record({ name: "Contrato 021/2026", client: "Construtora Vale Norte", agency: "Secretaria de Obras", responsibleCompany: "Computeck Solucoes Inteligentes", value: 1800000, monthly: 150000, status: "green", start: "2026-02-01", end: "2027-01-31", renewal: "2026-12-10", adjustment: "IPCA", owner: "Mariana Costa", notes: "Contrato principal da carteira." }),
      record({ name: "Contrato 114/2025", client: "MedSupply Brasil", agency: "Hospital Regional Norte", responsibleCompany: "Computeck Solucoes Inteligentes", value: 742000, monthly: 61833, status: "yellow", start: "2025-10-01", end: "2026-09-30", renewal: "2026-09-05", adjustment: "IGP-M", owner: "Rafael Lima", notes: "Renovacao em andamento." }),
      record({ name: "Contrato 044/2026", client: "Alfa Mobilidade", agency: "Consorcio de Transporte", responsibleCompany: "Grupo Actcon", value: 964000, monthly: 80333, status: "cyan", start: "2026-01-15", end: "2026-12-15", renewal: "2026-11-01", adjustment: "IPCA + 2%", owner: "Financeiro", notes: "Reajuste pendente de validacao." }),
      record({ name: "Contrato 087/2024", client: "Nutriplan Alimentos", agency: "Prefeitura Municipal", responsibleCompany: "Grupo Actcon", value: 526000, monthly: 43833, status: "red", start: "2024-09-01", end: "2026-08-31", renewal: "2026-08-24", adjustment: "Sem indice definido", owner: "Equipe docs", notes: "Risco por pendencia documental." }),
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
      record({ name: "Computeck Solucoes Inteligentes", region: "Nacional", cnpj: "00.000.000/0001-00", email: "steven.passos@computeck.com.br", phone: "", address: "", city: "Governador Valadares/MG", logoUrl: "./assets/vendegov-crm-logo-horizontal.svg", portfolio: "Gestao B2G", manager: "Steven Passos", status: "green", notes: "Empresa proprietaria do produto." }),
      record({ name: "Grupo Actcon", region: "Sudeste", cnpj: "", email: "steven.passos@computeck.com.br", phone: "", address: "", city: "Minas Gerais", logoUrl: "./assets/vendegov-crm-logo-horizontal.svg", portfolio: "Consultoria publica", manager: "Mariana Costa", status: "green", notes: "Carteira demonstrativa." }),
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
      record({ name: "Modelo de IA", area: "IA", value: "Assistente documental", status: "cyan", updatedAt: "2026-08-12", notes: "Assistente preparado para leitura de contratos e cartas." }),
      record({ name: "Integracao portal de compras", area: "Integracoes", value: "Planejada", status: "yellow", updatedAt: "2026-08-10", notes: "Etapa futura para SaaS." }),
    ],
    aiConfig: defaultAiConfig(),
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
  clean.aiConfig = defaultAiConfig();
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

function currentUserRecord() {
  const email = String(cloud()?.currentUser?.()?.email || "").toLowerCase();
  if (!email) return null;
  return (db.usuarios || []).find((item) => String(item.email || item.contactEmail || "").toLowerCase() === email) || null;
}

function updateUserProfileButton() {
  if (!el.logoutButton) return;
  const profile = currentUserRecord();
  const email = cloud()?.currentUser?.()?.email || "";
  const name = profile?.name || email.split("@")[0] || "Usuario";
  const avatar = profile?.photoUrl
    ? `<img src="${escapeAttr(profile.photoUrl)}" alt="">`
    : `<span>${escapeHtml(initials(name))}</span>`;
  el.logoutButton.innerHTML = `${avatar}<strong>${escapeHtml(firstName(name))}</strong>`;
}

function firstName(name) {
  return cleanImport(name).split(/\s+/)[0] || "Usuario";
}

function initials(name) {
  const parts = cleanImport(name).split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? [parts[0], parts[parts.length - 1]] : [parts[0] || "VG"];
  return letters.map((part) => part[0] || "").join("").slice(0, 2).toUpperCase();
}

function getAiConfig() {
  return { ...defaultAiConfig(), ...(db.aiConfig || {}) };
}

function aiProviderLabel(provider = getAiConfig().provider) {
  return {
    "firebase-ai-logic": "Firebase AI Logic",
    openai: "OpenAI",
    anthropic: "Anthropic Claude",
    "azure-openai": "Azure OpenAI",
    "google-gemini": "Google Gemini API",
    mistral: "Mistral",
    "custom-endpoint": "Endpoint personalizado",
  }[provider] || provider || "IA personalizada";
}

function syncCloudAiConfig() {
  if (cloud()?.setAiConfig) cloud().setAiConfig(getAiConfig());
}

function consultantScopeActive() {
  const profile = currentUserRecord();
  const role = normalizeText(profile?.role || "");
  return Boolean(profile && (role.includes("consultor") || role === "comercial"));
}

function currentUserScope() {
  const firebaseUser = cloud()?.currentUser?.() || {};
  const profile = currentUserRecord() || {};
  const names = [
    profile.name,
    profile.email,
    profile.contactEmail,
    firebaseUser.email,
    firstName(profile.name || firebaseUser.email || ""),
  ].filter(Boolean);
  return {
    restricted: consultantScopeActive(),
    profile,
    emails: new Set(names.filter((value) => String(value).includes("@")).map((value) => String(value).toLowerCase())),
    labels: new Set(names.map((value) => normalizeText(value)).filter(Boolean)),
  };
}

function canAccessModule(moduleKey) {
  if (!consultantScopeActive()) return true;
  return !["configuracoes", "usuarios", "empresas", "regioes", "documentosImportantes", "sistema", "gruposUsuarios", "templates", "audit"].includes(moduleKey);
}

function valueMatchesUser(value, scope = currentUserScope()) {
  if (!scope.restricted || value === undefined || value === null) return !scope.restricted;
  if (Array.isArray(value)) return value.some((entry) => valueMatchesUser(entry, scope));
  const raw = cleanImport(value);
  if (!raw) return false;
  const lower = raw.toLowerCase();
  if ([...scope.emails].some((email) => lower.includes(email))) return true;
  const normalized = normalizeText(raw);
  return [...scope.labels].some((label) => label.length >= 4 && (normalized === label || normalized.includes(label) || label.includes(normalized)));
}

function recordHasUserReference(item, scope = currentUserScope()) {
  if (!scope.restricted) return true;
  const fields = [
    "owner",
    "ownerEmail",
    "responsible",
    "responsavel",
    "responsibleEmail",
    "manager",
    "seller",
    "consultant",
    "consultor",
    "consultantEmail",
    "email",
    "contactEmail",
    "createdBy",
    "updatedBy",
    "user",
    "userEmail",
  ];
  return fields.some((fieldName) => valueMatchesUser(item?.[fieldName], scope));
}

function clientNameMatches(client, value) {
  return sameText(value, client.name) || sameText(value, client.originalName);
}

function relatedRecordBelongsToClient(item, moduleKey, client) {
  if (moduleKey === "contratos") return contractBelongsToClient(item, client);
  if (moduleKey === "renovacoes") {
    const contracts = db.contratos || [];
    return renewalBelongsToClient(item, client, contracts);
  }
  return itemBelongsToClient(item, client) || clientNameMatches(client, item.agency);
}

function clientHasVisibleRelationship(client, scope = currentUserScope()) {
  if (!scope.restricted) return true;
  if (recordHasUserReference(client, scope)) return true;
  const relatedModules = ["contratos", "renovacoes", "propostas", "licitacoes", "documentos", "agenda", "financeiro", "comissoes"];
  return relatedModules.some((moduleKey) => (db[moduleKey] || []).some((item) => (
    relatedRecordBelongsToClient(item, moduleKey, client) && recordHasUserReference(item, scope)
  )));
}

function clientNameHasVisibleRelationship(clientName, scope = currentUserScope()) {
  if (!scope.restricted) return true;
  const raw = cleanImport(clientName);
  if (!raw) return false;
  const client = (db.clientes || []).find((item) => sameText(item.name, raw) || sameText(item.originalName, raw));
  return client ? clientHasVisibleRelationship(client, scope) : false;
}

function canSeeRecord(moduleKey, item, scope = currentUserScope()) {
  if (!scope.restricted) return true;
  if (!item) return false;
  if (moduleKey === "usuarios") return recordHasUserReference(item, scope);
  if (["audit", "sistema", "gruposUsuarios", "empresas", "regioes", "documentosImportantes", "templates"].includes(moduleKey)) return false;
  if (recordHasUserReference(item, scope)) return true;
  if (moduleKey === "clientes") return clientHasVisibleRelationship(item, scope);
  if (moduleKey === "renovacoes") {
    const contract = findContractForRenewal(item);
    return contract ? canSeeRecord("contratos", contract, scope) : clientNameHasVisibleRelationship(item.client, scope);
  }
  if (moduleKey === "notificacoes") {
    const contractId = item.contractId || item.referenceId;
    const renewalId = item.renewalId;
    if (contractId && canSeeRecord("contratos", (db.contratos || []).find((row) => row.id === contractId), scope)) return true;
    if (renewalId && canSeeRecord("renovacoes", (db.renovacoes || []).find((row) => row.id === renewalId), scope)) return true;
    return clientNameHasVisibleRelationship(item.client, scope);
  }
  if (item.client || item.agency) return clientNameHasVisibleRelationship(item.client || item.agency, scope);
  return false;
}

function visibleRows(moduleKey, rows = db[moduleKey] || []) {
  const source = rows || [];
  if (!consultantScopeActive()) return source;
  const scope = currentUserScope();
  return source.filter((item) => canSeeRecord(moduleKey, item, scope));
}

function visibleDbRows(moduleKey) {
  return visibleRows(moduleKey, db[moduleKey] || []);
}

function applyUserScopeDefaults(moduleKey, values) {
  if (!consultantScopeActive()) return values;
  const profile = currentUserRecord() || {};
  const owner = profile.name || cloud()?.currentUser?.()?.email || currentUserLabel();
  if (schemas[moduleKey]?.fields?.some((fieldDef) => fieldDef.name === "owner")) values.owner = values.owner || owner;
  if (moduleKey === "renovacoes") values.consultantEmail = values.consultantEmail || profile.email || cloud()?.currentUser?.()?.email || "";
  if (moduleKey === "comissoes" && !values.seller) values.seller = owner;
  return values;
}

function visibleDbSnapshot() {
  const snapshot = emptyDb();
  Object.keys(snapshot).forEach((key) => {
    if (Array.isArray(snapshot[key])) snapshot[key] = visibleDbRows(key);
  });
  return snapshot;
}

async function enterSystem(email, password) {
  if (!cloudEnabled()) {
    setCloudStatus("Firebase obrigatorio. Verifique a configuracao do projeto.");
    toast("O sistema roda somente no Firebase.");
    return false;
  }
  setCloudStatus("Conectando ao Firebase...");
  let loggedUser = null;
  let shouldReplaceDemoDb = false;
  try {
    loggedUser = await cloud().signIn(email, password);
    const remoteDb = await cloud().loadDb(emptyDb());
    shouldReplaceDemoDb = isDemoDb(remoteDb);
    db = shouldReplaceDemoDb ? emptyDb() : { ...emptyDb(), ...remoteDb };
    syncCloudAiConfig();
    updateUserProfileButton();
    setCloudStatus(`Firebase conectado: ${loggedUser.email || "usuario autenticado"}.`);
    toast("Firebase conectado. Dados carregados.");
  } catch (error) {
    const message = firebaseLoginMessage(error);
    console.error("Firebase login/load error", error);
    setCloudStatus(message);
    toast(message);
    return false;
  }
  try {
    if (consultantScopeActive()) {
      if (shouldReplaceDemoDb) await cloud().saveDb(db);
    } else {
      const renewed = syncAllContractRenewals();
      const automated = await processRenewalAutomation({ generateLetters: true });
      if (shouldReplaceDemoDb || renewed || automated) await cloud().saveDb(db);
    }
  } catch (error) {
    console.warn("Firebase post-login sync warning", error);
    setCloudStatus("Firebase conectado. Sincronizacao automatica sera conferida depois.");
  }
  el.loginScreen.classList.add("hidden");
  el.appShell.classList.remove("hidden");
  setView("dashboard");
  return true;
}

function firebaseLoginMessage(error) {
  const code = String(error?.code || "");
  const message = String(error?.message || "");
  if (code.includes("invalid-credential") || code.includes("wrong-password")) {
    return "Senha incorreta ou ainda nao redefinida. Use o link recebido por e-mail.";
  }
  if (code.includes("user-not-found")) {
    return "Usuario nao encontrado no Firebase Authentication.";
  }
  if (code.includes("operation-not-allowed")) {
    return "Login por e-mail e senha nao esta ativado no Firebase.";
  }
  if (code.includes("too-many-requests")) {
    return "Muitas tentativas. Aguarde alguns minutos e redefina a senha.";
  }
  if (code.includes("network-request-failed")) {
    return "Falha de conexao com o Firebase. Confira a internet e tente novamente.";
  }
  if (code.includes("permission-denied") || /permission|insufficient/i.test(message)) {
    return "Usuario autenticou, mas falta permissao na base do Firebase.";
  }
  return `Nao foi possivel entrar pelo Firebase${code ? ` (${code})` : ""}.`;
}

function firebaseResetMessage(error) {
  const code = String(error?.code || "");
  if (code.includes("user-not-found")) return "Esse e-mail nao esta cadastrado no Firebase.";
  if (code.includes("invalid-email")) return "Informe um e-mail valido para redefinir a senha.";
  if (code.includes("operation-not-allowed")) return "Redefinicao por e-mail nao esta ativada no Firebase.";
  if (code.includes("too-many-requests")) return "Muitas tentativas. Aguarde alguns minutos antes de reenviar.";
  return "Nao foi possivel enviar o e-mail de redefinicao.";
}

async function requestPasswordReset() {
  if (!cloudEnabled() || !cloud()?.resetPassword) {
    toast("Firebase nao esta pronto para redefinir senha.");
    return;
  }
  const form = new FormData(el.loginForm);
  const email = String(form.get("email") || "").trim();
  if (!email) {
    toast("Digite o e-mail para receber o link de redefinicao.");
    return;
  }
  setCloudStatus("Enviando e-mail de redefinicao de senha...");
  try {
    await cloud().resetPassword(email);
    setCloudStatus(`E-mail de redefinicao enviado para ${email}.`);
    toast("Link de redefinicao enviado para o e-mail.");
  } catch (error) {
    const message = firebaseResetMessage(error);
    console.error("Firebase reset password error", error);
    setCloudStatus(message);
    toast(message);
  }
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
  el.resetPasswordButton.addEventListener("click", requestPasswordReset);
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
  el.closeLetterModal.addEventListener("click", closeLetterModal);
  el.letterModal.addEventListener("click", handleLetterModalClick);
  el.form.addEventListener("submit", submitForm);
  if (el.exportButton) el.exportButton.addEventListener("click", exportDb);
  if (el.importButton) {
    el.importButton.addEventListener("click", () => {
      startImport("", ".json,.csv,application/json,text/csv");
    });
  }
  el.importFile.addEventListener("change", importDb);
  if (el.closeConfirm) el.closeConfirm.addEventListener("click", closeConfirm);
  el.confirmDelete.addEventListener("click", deleteConfirmed);
  el.closeDrawer.addEventListener("click", closeDrawer);
}

function renderNav() {
  let currentGroup = "";
  el.nav.innerHTML = modules
    .filter(([key]) => canAccessModule(key))
    .map(([key, code, label, group]) => {
      const groupTitle = group && group !== currentGroup ? `<span class="nav-group">${group}</span>` : "";
      currentGroup = group || currentGroup;
      return `${groupTitle}<button class="nav-item" data-view="${key}" type="button"><span class="nav-code">${code}</span><span>${label}</span></button>`;
    })
    .join("");
}

function setView(view) {
  state.view = canAccessModule(view) ? view : "dashboard";
  if (view !== "cliente") state.clientDetailId = "";
  state.status = "todos";
  state.query = "";
  el.search.value = "";
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === state.view));
  render();
}

function render() {
  if (!canAccessModule(state.view)) {
    state.view = "dashboard";
  }
  const meta = viewMeta(state.view);
  el.title.textContent = meta.title;
  el.kicker.textContent = meta.kicker;
  el.newButton.disabled = ["dashboard", "relatorios", "cliente"].includes(state.view);
  if (state.view === "dashboard") return renderDashboard();
  if (state.view === "cliente") return renderClientDetail();
  if (state.view === "renovacoes") return renderRenewals();
  if (state.view === "relatorios") return renderReports();
  if (state.view === "configuracoes") return renderSettings();
  return renderCrud(state.view);
}

function viewMeta(view) {
  if (view === "dashboard") return { title: "Visao Geral", kicker: "Contratos e renovacoes" };
  if (view === "cliente") return { title: "Ficha do cliente", kicker: "Carteira" };
  if (view === "renovacoes") return { title: "Renovacoes de Contratos", kicker: "Acompanhamento" };
  if (view === "relatorios") return { title: "Relatorios", kicker: "Vendas, gestao e comissoes" };
  if (view === "configuracoes") return { title: "Parametrizacao", kicker: "Administracao" };
  return { title: schemas[view].title, kicker: "Modulo" };
}

function renderDashboard() {
  const data = dashboardOverviewData();
  el.content.innerHTML = `
    <section class="overview-dashboard">
      <div class="overview-head">
        <div>
          <h2>Visao Geral</h2>
          <p>Visao geral dos seus contratos e renovacoes</p>
        </div>
        ${dashboardNotificationBell(data.notifications)}
      </div>
      <div class="overview-kpis">
        ${overviewKpi("Contratos ativos", data.activeContracts, `de ${data.totalContracts} total`, "DOC")}
        ${overviewKpi("Empresas", data.companies, "cadastradas", "EMP")}
        ${overviewKpi("Proximos a vencer", data.upcomingContracts.length, "nos proximos 90 dias", "90", "attention")}
        ${overviewKpi("Valor mensal total", compactMoney(data.monthlyTotal), `${compactMoney(data.monthlyTotal * 12)}/ano`, "MRR")}
      </div>
      ${dashboardDeadlineAlert(data.expiredContracts.length, data.upcomingContracts.length)}
      <h3 class="overview-section-title">Desempenho</h3>
      <div class="overview-performance">
        <section class="overview-card ticket-card">
          <div class="overview-card-head">
            <div><span>Ticket medio</span><strong>${moneyCents(data.averageTicket)}</strong><small>por contrato ativo / mes</small></div>
            <b>R$</b>
          </div>
          <p class="${data.ticketDelta >= 0 ? "positive" : "negative"}">${data.ticketDelta >= 0 ? "↑" : "↓"} ${Math.abs(data.ticketDelta).toFixed(1)}% vs mes anterior</p>
          ${sparklineChart(data.ticketSeries)}
        </section>
        <section class="overview-card mrr-card">
          <div class="overview-card-title"><h3>Novo MRR por mes</h3><p>Receita recorrente de novos contratos nos ultimos 12 meses</p></div>
          ${lineAreaChart(data.months, data.newMrrSeries, { money: true })}
        </section>
      </div>
      <div class="overview-grid-2">
        <section class="overview-card">
          <div class="overview-card-title"><h3>Clientes novos (12 meses)</h3><p>Orgaos unicos contratados por mes</p></div>
          ${barChart(data.months, data.newClientsSeries)}
        </section>
        <section class="overview-card">
          <div class="overview-card-title"><h3>Reajustes aplicados (12 meses)</h3><p>Valor anterior vs. valor reajustado por mes</p></div>
          ${groupedBarChart(data.months, data.adjustmentBeforeSeries, data.adjustmentAfterSeries)}
        </section>
        <section class="overview-card">
          <div class="overview-card-title"><h3>Proximos vencimentos</h3></div>
          ${dashboardDueList(data.dueContracts)}
        </section>
        <section class="overview-card">
          <div class="overview-card-title"><h3>Valor por regiao</h3></div>
          ${horizontalBarChart(data.regionValues, { money: true })}
        </section>
        <section class="overview-card">
          <div class="overview-card-title"><h3>Valor por tipo de orgao</h3></div>
        ${donutChart(data.typeValues)}
      </section>
        <section class="overview-card">
          <div class="overview-card-title"><h3>Contratos por tipo de orgao</h3></div>
          ${dashboardTypeList(data.typeCounts)}
        </section>
      </div>
      <section class="overview-card renewal-goal-card">
        <div class="overview-card-title"><h3>Meta de Renovacao &mdash; ${monthTitle(today())}</h3>${dashboardGoalText(data.goal)}</div>
        ${consultantScopeActive() ? "" : `<button class="link-action" data-dashboard-goal type="button">Definir meta</button>`}
      </section>
      <section class="overview-card latest-letters-card">
        <div class="overview-card-title"><h3>Ultimas cartas geradas</h3></div>
        ${dashboardLatestLetters(data.latestLetters)}
      </section>
    </section>
  `;
  bindDynamicActions();
}

function dashboardOverviewData() {
  const contracts = visibleDbRows("contratos");
  const activeRows = contracts.filter(dashboardContractIsActive);
  const expiredContracts = contracts.filter((contract) => {
    const days = contractDueDays(contract);
    return Number.isFinite(days) && days < 0;
  });
  const upcomingContracts = contracts
    .filter((contract) => {
      const days = contractDueDays(contract);
      return Number.isFinite(days) && days >= 0 && days <= 90;
    })
    .sort((a, b) => contractDueDays(a) - contractDueDays(b));
  const dueContracts = contracts
    .filter((contract) => Number.isFinite(contractDueDays(contract)))
    .sort((a, b) => contractDueDays(a) - contractDueDays(b))
    .slice(0, 5);
  const monthlyTotal = activeRows.reduce((total, contract) => total + dashboardContractMonthly(contract), 0);
  const averageTicket = activeRows.length ? monthlyTotal / activeRows.length : 0;
  const months = lastTwelveMonths();
  const ticketSeries = months.map((month) => dashboardTicketAtMonth(contracts, month.key));
  const previousTicket = ticketSeries.length > 1 ? ticketSeries[ticketSeries.length - 2] : averageTicket;
  const ticketDelta = previousTicket ? ((averageTicket - previousTicket) / previousTicket) * 100 : 0;
  return {
    totalContracts: contracts.length,
    activeContracts: activeRows.length,
    expiredContracts,
    upcomingContracts,
    dueContracts,
    companies: visibleDbRows("clientes").length,
    monthlyTotal,
    averageTicket,
    ticketDelta,
    ticketSeries,
    months,
    newMrrSeries: months.map((month) => monthlyNewMrr(contracts, month.key)),
    newClientsSeries: months.map((month) => monthlyNewClients(contracts, month.key)),
    adjustmentBeforeSeries: months.map((month) => monthlyAdjustmentValue(contracts, month.key, "before")),
    adjustmentAfterSeries: months.map((month) => monthlyAdjustmentValue(contracts, month.key, "after")),
    regionValues: groupedContractValues(contracts, dashboardContractRegion),
    typeValues: groupedContractValues(contracts, dashboardContractType),
    typeCounts: groupedContractCounts(contracts, dashboardContractType),
    notifications: dashboardNotifications(upcomingContracts),
    latestLetters: dashboardLatestLetterRows(),
    goal: dashboardRenewalGoal(),
  };
}

function overviewKpi(label, value, hint, icon, tone = "") {
  return `
    <article class="overview-kpi ${tone}">
      <div><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong><small>${escapeHtml(hint)}</small></div>
      <b>${escapeHtml(icon)}</b>
    </article>
  `;
}

function dashboardNotificationBell(notifications) {
  const count = notifications.length;
  return `
    <div class="notification-wrap">
      <button class="notification-bell" data-dashboard-notifications type="button" aria-label="Notificacoes">
        <span>AL</span>${count ? `<b>${count > 99 ? "99+" : count}</b>` : ""}
      </button>
      ${state.dashboardNotificationsOpen ? dashboardNotificationMenu(notifications) : ""}
    </div>
  `;
}

function dashboardNotificationMenu(notifications) {
  const rows = notifications.slice(0, 5).map((item) => `
    <button class="notification-row" data-open="${escapeAttr(item.id)}" data-module="contratos" type="button">
      <span><strong>${escapeHtml(shortText(item.client || item.agency || item.name, 34))}</strong><small>${date(dashboardContractEnd(item))}</small></span>
      <em>${daysLabel(contractDueDays(item))}</em>
      <i>&gt;</i>
    </button>
  `).join("");
  return `
    <div class="notification-menu">
      <header><strong>Notificacoes</strong><span>${notifications.length} no total</span></header>
      <p>Vencimento de Contratos <b>(${notifications.length})</b></p>
      ${rows || `<div class="notification-empty">Nenhum contrato vencendo nos proximos 90 dias.</div>`}
    </div>
  `;
}

function dashboardDeadlineAlert(expired, upcoming) {
  const critical = expired || upcoming;
  if (!critical) {
    return `<div class="overview-alert is-ok"><strong>Prazos em dia.</strong><span>Nenhum contrato vencido ou vencendo nos proximos 90 dias.</span></div>`;
  }
  return `
    <div class="overview-alert">
      <strong>Atencao aos prazos!</strong>
      <span>${expired} contrato(s) vencido(s). ${upcoming} contrato(s) vencem nos proximos 90 dias.</span>
    </div>
  `;
}

function dashboardDueList(rows) {
  if (!rows.length) return `<div class="empty-state">Nenhum vencimento encontrado.</div>`;
  return `<div class="due-list">${rows.map((contract) => {
    const days = contractDueDays(contract);
    const isLate = days < 0;
    return `
      <button class="due-list-row" data-open="${escapeAttr(contract.id)}" data-module="contratos" type="button">
        <b>!</b>
        <span><strong>${escapeHtml(renewalContractNumber({ contract: contract.name }) || contract.name || "-")}</strong><small>${escapeHtml(contract.client || contract.agency || "-")}</small></span>
        <em class="${isLate ? "late" : ""}">${isLate ? "Vencido" : daysLabel(days)}</em>
        <small>${date(dashboardContractEnd(contract))}</small>
      </button>
    `;
  }).join("")}</div>`;
}

function dashboardTypeList(entries) {
  if (!entries.length) return `<div class="empty-state">Nenhum tipo de orgao informado.</div>`;
  return `<div class="type-list">${entries.slice(0, 7).map(([label, count]) => `
    <div><strong>${escapeHtml(label)}</strong><span>${count} contrato(s)</span></div>
  `).join("")}</div>`;
}

function dashboardLatestLetters(rows) {
  if (!rows.length) return `<div class="empty-state">Nenhuma carta gerada ainda.</div>`;
  return `<div class="latest-letter-list">${rows.map((item) => `
    <button class="latest-letter-row" data-letter-view="${escapeAttr(item.id)}" type="button">
      <span><strong>${escapeHtml(renewalContractNumber(item) || item.contract || item.name || "-")}</strong><small>${escapeHtml(item.adjustmentLabel)} &bull; ${escapeHtml(item.statusLabel)}</small></span>
      <span><strong>${moneyCents(item.value || 0)}</strong><small>${date(item.date)}</small></span>
    </button>
  `).join("")}</div>`;
}

function dashboardGoalText(goal) {
  if (!goal) return `<p>Nenhuma meta definida para este mes.</p>`;
  return `<p><strong>${escapeHtml(goal.value || goal.name)}</strong>${goal.notes ? ` ${escapeHtml(goal.notes)}` : ""}</p>`;
}

function dashboardContractIsActive(contract) {
  const days = contractDueDays(contract);
  if (Number.isFinite(days)) return days >= 0 && contract.status !== "red";
  return contract.status === "green" || contract.status === "cyan" || contract.status === "yellow";
}

function dashboardContractMonthly(contract) {
  const monthly = Number(contract.monthly || 0);
  if (monthly) return monthly;
  const value = Number(contract.value || 0);
  const months = monthsBetween(contract.start, contract.end);
  return months ? value / months : value;
}

function dashboardContractEnd(contract) {
  return contract.end || contract.currentEnd || contract.renewal || contract.renewalDate || "";
}

function contractDueDays(contract) {
  const end = dashboardContractEnd(contract);
  return parseDate(end) ? daysUntil(end) : Number.POSITIVE_INFINITY;
}

function dashboardTicketAtMonth(contracts, monthKey) {
  const active = contracts.filter((contract) => contractActiveInMonth(contract, monthKey));
  const total = active.reduce((sumValue, contract) => sumValue + dashboardContractMonthly(contract), 0);
  return active.length ? total / active.length : 0;
}

function contractActiveInMonth(contract, monthKey) {
  const bounds = monthBounds(monthKey);
  const start = parseDate(contract.start) || parseDate(contract.createdAt) || new Date(0);
  const end = parseDate(dashboardContractEnd(contract)) || new Date(8640000000000000);
  return start <= bounds.end && end >= bounds.start;
}

function monthlyNewMrr(contracts, monthKey) {
  return contracts
    .filter((contract) => monthKeyFromValue(contract.start || contract.createdAt) === monthKey)
    .reduce((total, contract) => total + dashboardContractMonthly(contract), 0);
}

function monthlyNewClients(contracts, monthKey) {
  const names = new Set();
  contracts.forEach((contract) => {
    if (monthKeyFromValue(contract.start || contract.createdAt) !== monthKey) return;
    const name = normalizeText(contract.client || contract.agency || contract.name);
    if (name) names.add(name);
  });
  return names.size;
}

function monthlyAdjustmentValue(contracts, monthKey, mode) {
  return contracts
    .filter((contract) => monthKeyFromValue(contract.renewal || contract.updatedAt || contract.start) === monthKey)
    .filter((contract) => cleanImport(contract.adjustment) || /reajuste/i.test(cleanImport(contract.notes)))
    .reduce((total, contract) => {
      const adjusted = dashboardContractMonthly(contract);
      const percent = adjustmentPercent(contract);
      const previous = percent ? adjusted / (1 + percent / 100) : adjusted;
      return total + (mode === "before" ? previous : adjusted);
    }, 0);
}

function adjustmentPercent(contract) {
  const match = cleanImport(`${contract.adjustment || ""} ${contract.notes || ""}`).match(/(\d+(?:[,.]\d+)?)\s*%/);
  return match ? Number(match[1].replace(",", ".")) : 0;
}

function groupedContractValues(contracts, labeler) {
  const map = new Map();
  contracts.forEach((contract) => {
    const label = labeler(contract);
    map.set(label, (map.get(label) || 0) + dashboardContractMonthly(contract));
  });
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
}

function groupedContractCounts(contracts, labeler) {
  const map = new Map();
  contracts.forEach((contract) => {
    const label = labeler(contract);
    map.set(label, (map.get(label) || 0) + 1);
  });
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
}

function dashboardContractRegion(contract) {
  return cleanImport(contract.region) || "Nao informada";
}

function dashboardContractType(contract) {
  const explicit = cleanImport(contract.agencyType);
  if (explicit) return titleCaseText(explicit);
  const text = normalizeText(`${contract.agency || ""} ${contract.client || ""}`);
  if (text.includes("prefeitura") || text.includes("municipio") || text.includes("municipal")) return "Prefeitura";
  if (text.includes("camara")) return "Camara";
  if (text.includes("autarquia")) return "Autarquia";
  if (text.includes("instituto")) return "Instituto";
  if (text.includes("fundacao")) return "Fundacao";
  if (text.includes("consorcio")) return "Consorcio";
  return "Nao informado";
}

function dashboardNotifications(upcomingContracts) {
  return upcomingContracts.slice(0, 8);
}

function dashboardLatestLetterRows() {
  return visibleDbRows("renovacoes")
    .filter((item) => item.letterDraft || item.letterGeneratedAt || item.emailStatus === "sent")
    .map((item) => ({
      ...item,
      date: item.letterSentAt || item.letterGeneratedAt || item.updatedAt || item.createdAt,
      adjustmentLabel: /reajuste/i.test(`${item.addendumType || ""} ${item.notes || ""}`) ? "Com reajuste" : "Sem reajuste",
      statusLabel: item.emailStatus === "sent" ? "Enviada" : item.stage === "Renovada" ? "Aceita" : "Rascunho",
    }))
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
    .slice(0, 5);
}

function dashboardRenewalGoal() {
  if (consultantScopeActive()) return null;
  const month = normalizeText(monthTitle(today()));
  return (db.sistema || []).find((item) => {
    const name = normalizeText(item.name);
    return name.includes("meta") && name.includes("renovacao") && (name.includes(month) || item.updatedAt?.slice(0, 7) === today().slice(0, 7));
  }) || null;
}

function openDashboardGoalForm() {
  openForm("sistema", null, {
    name: `Meta de Renovacao - ${monthTitle(today())}`,
    area: "Carteira",
    value: "",
    status: "cyan",
    updatedAt: today(),
    notes: "Informe a meta mensal de renovacao.",
  });
}

function sparklineChart(series) {
  const values = series.some((value) => value > 0) ? series : [8, 7, 7, 9, 8, 7, 4, 7, 6, 8, 7, 7];
  const width = 330;
  const height = 92;
  const points = linePoints(values, width, height, 8);
  return `<svg class="sparkline" viewBox="0 0 ${width} ${height}" role="img" aria-label="Ticket medio por mes"><polyline points="${points}" fill="none" stroke="#4b50ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function lineAreaChart(months, series, options = {}) {
  const width = 780;
  const height = 300;
  const pad = { left: 72, right: 28, top: 20, bottom: 42 };
  const max = niceMax(series);
  const points = series.map((value, index) => {
    const x = pad.left + (index * (width - pad.left - pad.right)) / Math.max(1, series.length - 1);
    const y = pad.top + (1 - Number(value || 0) / max) * (height - pad.top - pad.bottom);
    return [x, y];
  });
  const line = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${pad.left},${height - pad.bottom} ${line} ${width - pad.right},${height - pad.bottom}`;
  const grid = [0, 0.25, 0.5, 0.75, 1].map((step) => {
    const y = pad.top + (1 - step) * (height - pad.top - pad.bottom);
    const label = options.money ? compactMoney(max * step) : String(Math.round(max * step));
    return `<g><line x1="${pad.left}" x2="${width - pad.right}" y1="${y}" y2="${y}" /><text x="${pad.left - 10}" y="${y + 4}">${escapeHtml(label)}</text></g>`;
  }).join("");
  const dots = points.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" />`).join("");
  const labels = months.map((month, index) => {
    const x = pad.left + (index * (width - pad.left - pad.right)) / Math.max(1, months.length - 1);
    return `<text x="${x}" y="${height - 12}" text-anchor="middle">${month.label}</text>`;
  }).join("");
  return `<svg class="line-chart" viewBox="0 0 ${width} ${height}" role="img"><g class="chart-grid">${grid}</g><polygon class="line-area" points="${area}"/><polyline class="line-stroke" points="${line}"/>${dots}<g class="chart-labels">${labels}</g></svg>`;
}

function barChart(months, series) {
  const width = 640;
  const height = 300;
  const pad = { left: 36, right: 18, top: 22, bottom: 42 };
  const max = niceMax(series);
  const chartHeight = height - pad.top - pad.bottom;
  const slot = (width - pad.left - pad.right) / months.length;
  const bars = series.map((value, index) => {
    const barHeight = (Number(value || 0) / max) * chartHeight;
    const x = pad.left + index * slot + slot * 0.18;
    const y = pad.top + chartHeight - barHeight;
    const tone = index >= months.length - 2 ? "strong" : index >= months.length - 6 ? "mid" : "light";
    return `<rect class="${tone}" x="${x}" y="${y}" width="${slot * 0.64}" height="${barHeight}" rx="6"/>`;
  }).join("");
  return `<svg class="bar-chart" viewBox="0 0 ${width} ${height}" role="img">${chartAxis(width, height, pad, max, false)}${bars}${chartMonthLabels(months, width, height, pad)}</svg>`;
}

function groupedBarChart(months, beforeSeries, afterSeries) {
  const width = 640;
  const height = 300;
  const pad = { left: 70, right: 18, top: 22, bottom: 52 };
  const max = niceMax([...beforeSeries, ...afterSeries]);
  const chartHeight = height - pad.top - pad.bottom;
  const slot = (width - pad.left - pad.right) / months.length;
  const bars = months.map((month, index) => {
    const before = beforeSeries[index] || 0;
    const after = afterSeries[index] || 0;
    const beforeHeight = (before / max) * chartHeight;
    const afterHeight = (after / max) * chartHeight;
    const x = pad.left + index * slot + slot * 0.18;
    return `
      <rect class="before" x="${x}" y="${pad.top + chartHeight - beforeHeight}" width="${slot * 0.28}" height="${beforeHeight}" rx="4"/>
      <rect class="after" x="${x + slot * 0.34}" y="${pad.top + chartHeight - afterHeight}" width="${slot * 0.28}" height="${afterHeight}" rx="4"/>
    `;
  }).join("");
  return `<svg class="grouped-bar-chart" viewBox="0 0 ${width} ${height}" role="img">${chartAxis(width, height, pad, max, true)}${bars}${chartMonthLabels(months, width, height, pad)}<g class="chart-legend"><circle cx="248" cy="284" r="7" class="before-dot"/><text x="260" y="288">Valor Anterior</text><circle cx="370" cy="284" r="7" class="after-dot"/><text x="382" y="288">Valor Reajustado</text></g></svg>`;
}

function horizontalBarChart(entries, options = {}) {
  if (!entries.length) return `<div class="empty-state">Nenhum valor por regiao.</div>`;
  const max = Math.max(...entries.map((entry) => entry[1]), 1);
  return `<div class="hbar-chart">${entries.slice(0, 6).map(([label, value], index) => `
    <div class="hbar-row">
      <span>${escapeHtml(label)}</span>
      <b style="width:${Math.max(5, (value / max) * 100)}%" class="tone-${index}"></b>
      <em>${options.money ? compactMoney(value) : value}</em>
    </div>
  `).join("")}</div>`;
}

function donutChart(entries) {
  if (!entries.length) return `<div class="empty-state">Nenhum valor por tipo de orgao.</div>`;
  const total = entries.reduce((sumValue, [, value]) => sumValue + value, 0) || 1;
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const colors = ["#2443bf", "#3d83f1", "#72b8ff", "#b8dafd", "#dcecff", "#0f9b70"];
  const slices = entries.slice(0, 6).map(([label, value], index) => {
    const length = (value / total) * circumference;
    const circle = `<circle r="${radius}" cx="90" cy="90" stroke="${colors[index % colors.length]}" stroke-width="28" fill="none" stroke-dasharray="${length} ${circumference - length}" stroke-dashoffset="${-offset}" transform="rotate(-90 90 90)"/>`;
    offset += length;
    return circle;
  }).join("");
  const legend = entries.slice(0, 6).map(([label, value], index) => `<li><i style="background:${colors[index % colors.length]}"></i><span>${escapeHtml(label)} (${Math.round((value / total) * 100)}%)</span></li>`).join("");
  return `<div class="donut-wrap"><svg viewBox="0 0 180 180" role="img"><circle r="${radius}" cx="90" cy="90" stroke="#eef3f8" stroke-width="28" fill="none"/>${slices}<circle r="36" cx="90" cy="90" fill="#ffffff"/></svg><ul>${legend}</ul></div>`;
}

function chartAxis(width, height, pad, max, moneyAxis) {
  return [0, 0.25, 0.5, 0.75, 1].map((step) => {
    const y = pad.top + (1 - step) * (height - pad.top - pad.bottom);
    const label = moneyAxis ? compactMoney(max * step) : String(Math.round(max * step));
    return `<g class="chart-grid"><line x1="${pad.left}" x2="${width - pad.right}" y1="${y}" y2="${y}" /><text x="${pad.left - 10}" y="${y + 4}">${escapeHtml(label)}</text></g>`;
  }).join("");
}

function chartMonthLabels(months, width, height, pad) {
  const slot = (width - pad.left - pad.right) / months.length;
  return `<g class="chart-labels">${months.map((month, index) => `<text x="${pad.left + index * slot + slot / 2}" y="${height - 14}" text-anchor="middle">${month.label}</text>`).join("")}</g>`;
}

function linePoints(values, width, height, pad) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  return values.map((value, index) => {
    const x = pad + (index * (width - pad * 2)) / Math.max(1, values.length - 1);
    const y = pad + (1 - (value - min) / range) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

function niceMax(values) {
  const max = Math.max(...values.map((value) => Number(value || 0)), 1);
  const pow = 10 ** Math.floor(Math.log10(max));
  return Math.ceil(max / pow) * pow;
}

function lastTwelveMonths() {
  const current = parseDate(today()) || new Date();
  const start = new Date(current.getFullYear(), current.getMonth() - 11, 1);
  return Array.from({ length: 12 }, (_, index) => {
    const dt = new Date(start.getFullYear(), start.getMonth() + index, 1);
    return { key: `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`, label: monthShort(dt.getMonth()) };
  });
}

function monthBounds(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return {
    start: new Date(year, month - 1, 1),
    end: new Date(year, month, 0, 23, 59, 59),
  };
}

function monthKeyFromValue(value) {
  const parsed = parseDate(value);
  return parsed ? `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}` : "";
}

function monthShort(index) {
  return ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"][index] || "";
}

function monthTitle(value) {
  const parsed = parseDate(value) || new Date();
  const label = ["Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][parsed.getMonth()];
  return `${label} de ${parsed.getFullYear()}`;
}

function compactMoney(value) {
  const number = Number(value || 0);
  const abs = Math.abs(number);
  if (abs >= 1000000) return `R$ ${decimalPt(number / 1000000, 1)} mi`;
  if (abs >= 1000) return `R$ ${decimalPt(number / 1000, abs >= 100000 ? 0 : 1)} mil`;
  return moneyCents(number);
}

function decimalPt(value, digits) {
  return Number(value || 0).toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits }).replace(",0", "");
}

function shortText(value, max = 32) {
  const text = cleanImport(value);
  return text.length > max ? `${text.slice(0, max - 3)}...` : text;
}

function titleCaseText(value) {
  return cleanImport(value)
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word ? `${word[0].toUpperCase()}${word.slice(1)}` : "")
    .join(" ");
}

function renderKanban() {
  const stages = ["Oportunidade", "Edital", "Documentos", "Proposta", "Resultado"];
  return stages
    .map((stage) => {
      const cards = visibleDbRows("licitacoes").filter((item) => item.stage === stage).slice(0, 3);
      return `<div class="kanban-column"><strong>${stage}</strong>${cards
        .map((item) => `<div class="kanban-card"><b>${item.name}</b>${item.client}<br>${money(item.value)}</div>`)
        .join("") || `<div class="kanban-card">Sem registros nesta etapa.</div>`}</div>`;
    })
    .join("");
}

function upcomingRows() {
  return [
    ...visibleDbRows("documentos").filter((item) => item.status === "red" || item.status === "yellow").map((item) => [mainCell(item.name, item.fileRef), item.client, "Entrega docs", date(item.dueDate), badge(item.status), rowButton("documentos", item.id)]),
    ...visibleDbRows("renovacoes").filter((item) => item.status === "red" || item.status === "yellow").map((item) => [mainCell(item.name, item.stage), item.client, "Renovacoes", date(item.renewalDate), badge(item.status), rowButton("renovacoes", item.id)]),
    ...visibleDbRows("contratos").filter((item) => item.status === "yellow" || item.status === "red").map((item) => [mainCell(item.name, item.agency), item.client, "Contratos", date(item.renewal || item.end), badge(item.status), rowButton("contratos", item.id)]),
    ...visibleDbRows("licitacoes").filter((item) => item.status === "yellow").map((item) => [mainCell(item.name, item.stage), item.client, "Licitacoes", date(item.deadline), badge(item.status), rowButton("licitacoes", item.id)]),
    ...visibleDbRows("comissoes").filter((item) => item.status === "yellow" || item.status === "red").map((item) => [mainCell(item.name, item.seller), item.client, "Comissoes", date(item.dueDate), badge(item.status), rowButton("comissoes", item.id)]),
    ...visibleDbRows("agenda").filter((item) => item.status === "yellow").map((item) => [mainCell(item.name, item.city), item.client, "Agenda", date(item.date), badge(item.status), rowButton("agenda", item.id)]),
  ].slice(0, 10);
}

function renderCrud(moduleKey) {
  const schema = schemas[moduleKey];
  const rows = filtered(db[moduleKey] || [], moduleKey);
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
          <button class="primary-button" data-add="${moduleKey}" type="button">Novo ${schema.singular}</button>
        </div>
      </div>
      ${rows.length ? crudTable(moduleKey, rows) : `<div class="empty-state">Nenhum registro encontrado.</div>`}
    </section>
    <div class="module-grid">
      ${moduleCard("AI", "Acao inteligente", "Cria resumo e proxima acao para o registro selecionado.")}
      ${moduleCard("LOG", "Auditoria", "Todas as mudancas entram no historico do sistema.")}
      ${moduleCard("IMP", "Importacao centralizada", "Backups e planilhas ficam em Parametros > Importacao.")}
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
  const active = state.renewalTab || "vencer";
  const renewals = visibleDbRows("renovacoes");
  const pending90Raw = visibleRows("renovacoes", pendingRenewals(90));
  const pending90 = filtered(pending90Raw);
  const expiring = filtered(pending90Raw.filter((item) => renewalDaysRemaining(item) >= 0));
  const sheetIssuesRaw = renewals.filter(renewalSheetIssue);
  const sheetIssues = filtered(sheetIssuesRaw);
  const renewed = renewals.filter(renewalIsDone);
  const letters = filtered(renewals.filter((item) => item.letterDraft || (item.emailStatus || "pending") !== "pending" || renewalDaysRemaining(item) <= 15));
  const notifications = visibleRows("notificacoes", db.notificacoes || []).slice(0, 12);
  const riskValue = renewalRiskValue(pending90Raw);
  const tabs = [
    ["pendencias", "Pendencias da Planilha", sheetIssuesRaw.length],
    ["vencer", "Contratos a Vencer", pending90Raw.length],
    ["planilhas", "Planilhas", renewals.length],
    ["cartas", "Cartas de Renovacao", letters.length],
  ];
  el.content.innerHTML = `
    <section class="renewal-dashboard">
      <div class="renewal-header">
        <div>
          <h2><span class="renewal-title-icon">RN</span>Renovacoes de Contratos</h2>
          <p>Acompanhe pendencias da planilha e contratos a vencer, integrados com cartas e aditivos.</p>
        </div>
        <div class="renewal-header-actions">
          <button class="secondary-button" data-run-renewal-automation type="button">Atualizar alertas</button>
        </div>
      </div>
      <div class="renewal-kpi-grid">
        ${renewalMetric("Pendencias (Planilha)", sheetIssuesRaw.length, "dados a revisar", "blue")}
        ${renewalMetric("Contratos a Vencer", pending90Raw.length, "proximos 90 dias", "amber")}
        ${renewalMetric("Renovadas", renewed.length, "tratativas concluidas", "green")}
        ${renewalMetric("Valor em Risco (90d)", moneyCents(riskValue), "renovacoes abertas", "red")}
      </div>
      <nav class="renewal-tabs" aria-label="Renovacoes">
        ${tabs.map(([key, label, count]) => renewalTabButton(key, label, count, active)).join("")}
      </nav>
      <div class="renewal-tab-panel">
        ${renewalTabBody(active, { sheetIssues, pending90, expiring, renewals: filtered(renewals), letters, notifications })}
      </div>
    </section>
  `;
  bindDynamicActions();
}

function renewalTabBody(active, data) {
  if (active === "pendencias") {
    return `
      <section class="table-panel renewal-table-panel">
        <div class="table-toolbar">
          <div><h2>Pendencias da Planilha</h2><p>Campos importados que precisam de complemento para a automacao funcionar sem bloqueio.</p></div>
        </div>
        ${data.sheetIssues.length ? simpleTable(["Pendencia", "Cliente", "Contrato", "Prazo", "Acoes"], data.sheetIssues.map(renewalIssueRow)) : `<div class="empty-state">Nenhuma pendencia critica encontrada na planilha.</div>`}
      </section>
    `;
  }
  if (active === "vencer") {
    return `
      <section class="table-panel renewal-table-panel">
        <div class="table-toolbar">
          <div><h2>Contratos a Vencer</h2><p>Lista operacional dos contratos com renovacao aberta nos proximos 90 dias.</p></div>
          <div class="toolbar-controls"><button class="secondary-button" data-run-renewal-automation type="button">Atualizar alertas</button><button class="primary-button" data-add="renovacoes" type="button">Nova Renovacao</button></div>
        </div>
        ${data.pending90.length ? simpleTable(["Orgao / Contrato", "Vencimento", "Valor Mensal", "Status", "Carta de Renovacao", "Aditivos", "Resultado", ""], data.pending90.map(renewalContractDueRow)) : `<div class="empty-state">Nenhum contrato a vencer nos proximos 90 dias.</div>`}
      </section>
      <div class="grid-2 renewal-support-grid">
        <section class="panel renewal-rules">
          <div class="panel-header"><div><h2>Regra automatica</h2><p>O sistema monitora a vigencia e prepara a comunicacao antes do vencimento.</p></div></div>
          <div class="automation-steps">
            ${automationStep("60", "Primeiro aviso", "abre notificacao preventiva")}
            ${automationStep("45", "Segundo aviso", "reforca tratativa comercial")}
            ${automationStep("30", "Aviso critico", "prioriza decisao e documentos")}
            ${automationStep("15", "Carta automatica", "gera minuta se nao houver acompanhamento")}
          </div>
        </section>
        <section class="panel">
          <div class="panel-header"><div><h2>Notificacoes geradas</h2><p>Historico dos avisos criados pela rotina de renovacao.</p></div></div>
          ${renewalNotificationsTable(data.notifications)}
        </section>
      </div>
    `;
  }
  if (active === "planilhas") {
    return `
      <section class="table-panel renewal-table-panel">
        <div class="table-toolbar">
          <div><h2>Planilhas Importadas</h2><p>Base de renovacoes criada a partir dos contratos importados ou cadastrados.</p></div>
          <div class="toolbar-controls"><button class="primary-button" data-add="renovacoes" type="button">Nova Renovacao</button></div>
        </div>
        ${data.renewals.length ? simpleTable(["Registro", "Cliente", "Contrato", "Vigencia", "Status", "Acoes"], data.renewals.map(renewalSpreadsheetRow)) : `<div class="empty-state">Nenhuma planilha importada para renovacoes.</div>`}
      </section>
    `;
  }
  return `
    <section class="table-panel renewal-table-panel">
      <div class="table-toolbar">
        <div><h2>Cartas de Renovacao</h2><p>Cartas geradas automaticamente ou prontas para envio ao cliente com copia ao consultor.</p></div>
        <div class="toolbar-controls"><button class="secondary-button" data-run-renewal-automation type="button">Gerar pendentes</button></div>
      </div>
      ${data.letters.length ? simpleTable(["Cliente", "Contrato", "Carta", "Envio", "Acoes"], data.letters.map(renewalLetterRow)) : `<div class="empty-state">Nenhuma carta de renovacao gerada ainda.</div>`}
    </section>
  `;
}

function renewalMetric(label, value, hint, tone) {
  return `<article class="renewal-kpi ${tone}"><div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(hint)}</small></div><b>${renewalMetricIcon(tone)}</b></article>`;
}

function renewalMetricIcon(tone) {
  return { blue: "PL", amber: "90", green: "OK", red: "!" }[tone] || "RN";
}

function renewalTabButton(key, label, count, active) {
  return `<button class="${key === active ? "active" : ""}" data-renewal-tab="${key}" type="button">${escapeHtml(label)}<span>${count}</span></button>`;
}

function renewalSheetIssue(renewal) {
  return Boolean(renewalIssueSummary(renewal));
}

function renewalIssueSummary(renewal) {
  const issues = [];
  if (!cleanImport(renewal.client)) issues.push("cliente");
  if (!cleanImport(renewal.contract)) issues.push("contrato");
  if (!cleanImport(renewal.currentEnd || renewal.renewalDate)) issues.push("vigencia");
  if (!cleanImport(renewal.clientEmail)) issues.push("e-mail do cliente");
  if (!cleanImport(renewal.consultantEmail)) issues.push("consultor");
  return issues.join(", ");
}

function renewalIssueRow(item) {
  return [
    mainCell("Completar dados", renewalIssueSummary(item)),
    item.client || "-",
    item.contract || item.name || "-",
    date(item.currentEnd || item.renewalDate),
    `<div class="row-actions"><button class="mini-button" data-edit="${escapeAttr(item.id)}" data-module="renovacoes" type="button">Corrigir</button><button class="mini-button" data-open="${escapeAttr(item.id)}" data-module="renovacoes" type="button">Abrir</button></div>`,
  ];
}

function renewalSpreadsheetRow(item) {
  return [
    mainCell(item.name, item.addendumNumber || item.stage),
    item.client || "-",
    item.contract || "-",
    `${date(item.currentEnd || item.renewalDate)}<br><span class="record-subtitle">${daysLabel(renewalDaysRemaining(item))}</span>`,
    badge(item.status || "cyan"),
    rowButton("renovacoes", item.id),
  ];
}

function renewalLetterRow(item) {
  const hasDraft = Boolean(item.letterDraft);
  return [
    mainCell(item.client, item.clientEmail || "sem e-mail do cliente"),
    mainCell(item.contract || item.name, date(item.currentEnd || item.renewalDate)),
    hasDraft ? mainCell(item.letterSubject || "Carta de renovacao", item.letterGeneratedAt ? `gerada em ${date(item.letterGeneratedAt)}` : "gerada") : `<span class="status status-cyan">Nao gerada</span>`,
    emailStatusBadge(item.emailStatus || "pending"),
    renewalRowActions(item),
  ];
}

function renewalIsDone(item) {
  return item.stage === "Renovada" || item.status === "green" || item.emailStatus === "sent";
}

function renewalRiskValue(rows) {
  return rows.reduce((total, item) => total + Number(item.value || 0), 0);
}

function renewalContractDueRow(item) {
  return [
    mainCell(item.client || "-", renewalContractNumber(item)),
    renewalDueCell(item),
    `<strong>${moneyCents(item.value || 0)}</strong>`,
    renewalContractStatusPill(item),
    renewalLetterAction(item),
    renewalAddendumBadge(item),
    renewalResultSelect(item),
    `<button class="chevron-button" data-open="${escapeAttr(item.id)}" data-module="renovacoes" type="button">&gt;</button>`,
  ];
}

function renewalContractNumber(item) {
  const raw = cleanImport(item.contract || item.name);
  return raw.replace(/^contrato\s+/i, "").replace(/\s+-\s+.+$/, "") || "-";
}

function renewalDueCell(item) {
  const endDate = item.currentEnd || item.renewalDate;
  const parsed = parseDate(endDate);
  if (!parsed) {
    return `<span>-</span><span class="due-status invalid">Data invalida</span>`;
  }
  const days = renewalDaysRemaining(item);
  const label = days < 0 ? "Vencido" : days <= 15 ? "Critico" : days <= 30 ? "30 dias" : days <= 60 ? "60 dias" : "90 dias";
  const tone = days < 0 || days <= 30 ? "red" : "yellow";
  return `<span>${date(endDate)}</span><span class="due-status ${tone}">${label}</span>`;
}

function renewalContractStatusPill(item) {
  if (item.stage === "Renovada" || item.emailStatus === "sent") return `<span class="soft-pill green">Renovado</span>`;
  if (item.stage === "Perdida") return `<span class="soft-pill red">Perdido</span>`;
  return `<span class="soft-pill">Vigente</span>`;
}

function renewalLetterAction(item) {
  return `
    <div class="letter-action-stack">
      ${emailStatusBadge(item.emailStatus || (item.letterDraft ? "ready" : "pending"))}
      ${renewalLetterManualActions(item)}
    </div>
  `;
}

function renewalAddendumBadge(item) {
  const count = renewalAddendumCount(item);
  if (!count) return `<span class="record-subtitle">-</span>`;
  return `<span class="addendum-pill">${count} aditivo(s)</span>`;
}

function renewalAddendumCount(item) {
  const direct = Number(item.addendumCount || 0);
  if (direct) return direct;
  const contract = findContractForRenewal(item) || {};
  const fromContract = Number(contract.addendumCount || 0);
  if (fromContract) return fromContract;
  const match = cleanImport(item.addendumNumber).match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function renewalResultSelect(item) {
  const value = renewalResultValue(item);
  const options = ["Pendente", "Em contato", "Proposta enviada", "Renovada", "Perdida"]
    .map((option) => `<option value="${escapeAttr(option)}" ${option === value ? "selected" : ""}>${escapeHtml(option)}</option>`)
    .join("");
  return `<select class="renewal-result-select" data-renewal-result="${escapeAttr(item.id)}" aria-label="Resultado da renovacao">${options}</select>`;
}

function renewalResultValue(item) {
  if (item.stage === "Renovada") return "Renovada";
  if (item.stage === "Perdida") return "Perdida";
  if (item.stage === "Proposta enviada") return "Proposta enviada";
  if (item.stage === "Em contato" || item.stage === "Negociacao") return "Em contato";
  return "Pendente";
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
    ? `<button class="mini-button" data-letter-send="${escapeAttr(item.id)}" type="button">Enviar</button>`
    : `<button class="mini-button" data-letter-generate="${escapeAttr(item.id)}" type="button">Gerar carta</button>`;
  const sentAction = item.letterDraft && item.emailStatus !== "sent"
    ? `<button class="mini-button" data-letter-mark-sent="${escapeAttr(item.id)}" type="button">Marcar enviada</button>`
    : "";
  return `<div class="row-actions"><button class="mini-button" data-open="${escapeAttr(item.id)}" data-module="renovacoes" type="button">Abrir</button>${emailAction}<button class="mini-button" data-letter-view="${escapeAttr(item.id)}" type="button">Visualizar</button><button class="mini-button" data-letter-edit="${escapeAttr(item.id)}" type="button">Editar</button>${sentAction}</div>`;
}

function renewalLetterManualActions(item) {
  const id = escapeAttr(item.id);
  return `
    <div class="letter-action-group">
      <button class="letter-action" data-letter-generate="${id}" type="button">Gerar</button>
      <button class="letter-action" data-letter-view="${id}" type="button">Ver</button>
      <button class="letter-action" data-letter-edit="${id}" type="button">Editar</button>
      <button class="letter-action" data-letter-send="${id}" type="button">Enviar</button>
    </div>
  `;
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
  const client = visibleDbRows("clientes").find((item) => item.id === state.clientDetailId);
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
      <button class="primary-button" data-ai="Diagnostico do cliente ${escapeAttr(client.name || "")}" type="button">Abrir IA</button>
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
    responsibleCompany: existing.responsibleCompany || contract.responsibleCompany || "",
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
  const contracts = visibleDbRows("contratos").filter((item) => contractBelongsToClient(item, client));
  const renewals = visibleDbRows("renovacoes").filter((item) => renewalBelongsToClient(item, client, contracts));
  const proposals = visibleDbRows("propostas").filter((item) => itemBelongsToClient(item, client));
  const bids = visibleDbRows("licitacoes").filter((item) => itemBelongsToClient(item, client) || sameText(item.agency, client.name));
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
  const client = visibleDbRows("clientes").find((item) => item.id === clientId);
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
  const contract = visibleDbRows("contratos").find((item) => item.id === contractId);
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
  const client = visibleDbRows("clientes").find((item) => item.id === clientId);
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
  const contracts = visibleDbRows("contratos");
  const bids = visibleDbRows("licitacoes");
  const proposals = visibleDbRows("propostas");
  const commissionsRowsRaw = visibleDbRows("comissoes");
  const documents = visibleDbRows("documentos");
  const renewals = visibleDbRows("renovacoes");
  const marketing = visibleDbRows("marketing");
  const clients = visibleDbRows("clientes");
  const revenue = sum(contracts, "monthly");
  const pipelineValue = sum(bids, "value") + sum(proposals, "value");
  const commissions = sum(commissionsRowsRaw, "value");
  const pendingDocs = documents.filter((i) => i.status === "red" || i.status === "yellow").length;
  const renewalValue = sum(renewals.filter((i) => i.status !== "green"), "value");
  const commissionRows = commissionsRowsRaw.map((item) => [mainCell(item.name, item.contract), item.seller, item.client, money(item.value), badge(item.status), rowButton("comissoes", item.id)]);
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
          ${bar("Oportunidades", bids.filter((i) => i.stage === "Oportunidade").length, 85)}
          ${bar("Editais", bids.filter((i) => i.stage === "Edital").length, 58)}
          ${bar("Documentos", bids.filter((i) => i.stage === "Documentos").length, 46)}
          ${bar("Propostas", proposals.length, 64)}
          ${bar("Contratos", contracts.length, 72)}
        </div>
      </section>
      <section class="panel">
        <div class="panel-header"><div><h2>Relatorio gerencial</h2><p>Resumo automatico para diretoria.</p></div></div>
        <div class="ai-grid">
          ${insight("01", `${contracts.length} contratos monitorados com ${money(revenue)} de receita mensal.`)}
          ${insight("02", `${pendingDocs} documentos exigem acao da equipe.`)}
          ${insight("03", `${marketing.length} campanhas alimentam ${clients.length} clientes na carteira.`)}
          ${insight("04", `${renewals.length} renovacoes cadastradas, somando ${money(renewalValue)} em tratativas abertas.`)}
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
  el.content.innerHTML = aiWorkspaceHtml();
  bindDynamicActions();
}

function aiWorkspaceHtml() {
  syncCloudAiConfig();
  const config = getAiConfig();
  const modelName = cloud()?.aiModelName ? cloud().aiModelName() : "gemini-3.6-flash";
  const aiOnline = cloudEnabled() && Boolean(cloud()?.aiEnabled?.());
  const contracts = visibleDbRows("contratos");
  const selectedId = state.aiContractId || contracts[0]?.id || "";
  const selectedContract = contracts.find((item) => item.id === selectedId) || contracts[0] || null;
  if (!state.aiContractId && selectedContract) state.aiContractId = selectedContract.id;
  return `
    <div class="metric-grid ai-metric-grid">
      ${metric("Status da IA", aiOnline ? "Preparada" : "Pendente", aiOnline ? aiProviderLabel(config.provider) : "configure em Parametros")}
      ${metric("Modelo", modelName, aiProviderLabel(config.provider))}
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
          <p>O VendeGov usa a IA configurada para transformar documentos e dados de contratos em registros e textos operacionais.</p>
        </div>
      </div>
      <div class="ai-flow">
        ${insight("01", "PDF entra na plataforma e a IA identifica campos contratuais.")}
        ${insight("02", "Voce confere o rascunho antes de salvar no Firebase.")}
        ${insight("03", "A carta de renovacao usa dados reais do contrato e da tratativa.")}
        ${insight("04", "Chaves privadas devem ficar no Firebase ou em um endpoint seguro, nunca no codigo do site.")}
      </div>
    </section>
  `;
}

function aiSetupNotice(aiOnline) {
  const config = getAiConfig();
  if (aiOnline) {
    return `<div class="ai-notice success"><strong>Conexao preparada</strong><span>Provedor ativo: ${escapeHtml(aiProviderLabel(config.provider))}. Modelo: ${escapeHtml(config.model || "padrao")}.</span></div>`;
  }
  return `<div class="ai-notice warn"><strong>Configuracao pendente</strong><span>Configure a IA em Parametros > IA. Para Gemini, voce pode usar chave direta; para outros provedores, endpoint seguro pode ser necessario.</span></div>`;
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
  if (!canAccessModule("configuracoes")) {
    setView("dashboard");
    return;
  }
  const tabs = [
    ["empresas", "Empresas"],
    ["importacao", "Importacao"],
    ["ia", "IA"],
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
  const isCustomPanel = ["audit", "importacao", "ia"].includes(active);
  const body = active === "audit"
    ? auditTable()
    : active === "importacao"
      ? renderImportExportCenter()
      : active === "ia"
        ? renderAiSettingsPanel()
        : crudTable(active, filtered(db[active] || [], active));
  el.newButton.disabled = isCustomPanel;
  el.content.innerHTML = `
    <section class="table-panel">
      <div class="table-toolbar">
        <div><h2>Parametrizacao</h2><p>Empresas, importacao, IA, usuarios, grupos, templates e auditoria.</p></div>
        <div class="toolbar-controls">${tabButtons}${!isCustomPanel ? `<button class="primary-button" data-add="${active}" type="button">Novo</button>` : ""}</div>
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

function renderImportExportCenter() {
  return `
    <div class="import-center">
      <article class="import-card">
        <span>JSON</span>
        <div>
          <h3>Base completa</h3>
          <p>Importe um backup JSON ou exporte uma copia atual da base no Firebase.</p>
          <div class="drawer-actions">
            <button class="primary-button" data-import-full type="button">Importar base</button>
            <button class="secondary-button" data-export-db type="button">Exportar backup</button>
          </div>
        </div>
      </article>
      <article class="import-card">
        <span>CSV</span>
        <div>
          <h3>Contratos</h3>
          <p>Importa planilhas CSV de contratos e cria ou relaciona os clientes automaticamente.</p>
          <button class="secondary-button" data-import-contracts type="button">Importar contratos CSV</button>
        </div>
      </article>
      <article class="import-card">
        <span>CLI</span>
        <div>
          <h3>Clientes</h3>
          <p>Importa a base de clientes, orgaos, contatos, regioes e dados comerciais.</p>
          <button class="secondary-button" data-import-clients type="button">Importar clientes CSV</button>
        </div>
      </article>
      <article class="import-card">
        <span>USR</span>
        <div>
          <h3>Consultores</h3>
          <p>Importa usuarios/consultores exportados, incluindo nome, e-mail, telefone e foto por URL.</p>
          <button class="secondary-button" data-import-users type="button">Importar consultores CSV</button>
        </div>
      </article>
    </div>
  `;
}

function renderAiSettingsPanel() {
  const config = getAiConfig();
  return `
    <div class="ai-settings-panel">
      <form class="ai-settings-form" id="aiConfigForm">
        <label>Provedor de IA
          <select name="provider">
            ${aiProviderOptions().map(([value, label]) => `<option value="${value}" ${config.provider === value ? "selected" : ""}>${label}</option>`).join("")}
          </select>
        </label>
        <label>Modelo
          <input name="model" type="text" value="${escapeAttr(config.model || "")}" placeholder="ex: gemini-3.6-flash, gemini-2.5-pro..." />
        </label>
        <label>Modo de conexao
          <select name="connectionMode">
            <option value="firebase-ai-logic" ${config.connectionMode === "firebase-ai-logic" ? "selected" : ""}>Firebase AI Logic</option>
            <option value="direct-api-key" ${config.connectionMode === "direct-api-key" ? "selected" : ""}>Chave direta no navegador</option>
            <option value="secure-endpoint" ${config.connectionMode === "secure-endpoint" ? "selected" : ""}>Endpoint seguro</option>
          </select>
        </label>
        <label>Chave da API
          <input name="apiKey" type="password" value="${escapeAttr(config.apiKey || "")}" placeholder="Cole a chave da API" autocomplete="off" />
        </label>
        <label class="wide">Endpoint seguro
          <input name="endpointUrl" type="url" value="${escapeAttr(config.endpointUrl || "")}" placeholder="https://sua-funcao.cloudfunctions.net/ai" />
        </label>
        <label>Referencia da chave
          <input name="secretRef" type="text" value="${escapeAttr(config.secretRef || "")}" placeholder="ex: Secret Manager / Cloud Function" />
        </label>
        <label>Status
          <select name="status">
            <option value="green" ${config.status === "green" ? "selected" : ""}>Ativa</option>
            <option value="cyan" ${config.status === "cyan" ? "selected" : ""}>Em teste</option>
            <option value="yellow" ${config.status === "yellow" ? "selected" : ""}>Configurar</option>
            <option value="red" ${config.status === "red" ? "selected" : ""}>Inativa</option>
          </select>
        </label>
        <label class="wide">Observacoes
          <textarea name="notes">${escapeHtml(config.notes || "")}</textarea>
        </label>
        <div class="form-actions">
          <button class="primary-button" type="submit">Salvar configuracao de IA</button>
        </div>
      </form>
      <div class="ai-notice ${config.provider === "firebase-ai-logic" ? "success" : "warn"}">
        <strong>${escapeHtml(aiProviderLabel(config.provider))}</strong>
        <span>${config.provider === "firebase-ai-logic"
          ? "Este provedor usa Firebase AI Logic e nao expoe chave de API no navegador."
          : config.connectionMode === "direct-api-key"
            ? "Modo direto ativo. Para usar sem endpoint, selecione Google Gemini API. A chave fica salva no Firebase e pode ser lida por usuarios autorizados da plataforma."
            : "Para este provedor, cadastre um endpoint seguro ou use chave direta quando suportado pelo navegador."}</span>
      </div>
      ${aiWorkspaceHtml()}
    </div>
  `;
}

function aiProviderOptions() {
  return [
    ["firebase-ai-logic", "Firebase AI Logic"],
    ["google-gemini", "Google Gemini API"],
    ["openai", "OpenAI"],
    ["anthropic", "Anthropic Claude"],
    ["azure-openai", "Azure OpenAI"],
    ["mistral", "Mistral"],
    ["custom-endpoint", "Endpoint personalizado"],
  ];
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
  document.querySelectorAll("[data-dashboard-notifications]").forEach((button) => button.addEventListener("click", () => {
    state.dashboardNotificationsOpen = !state.dashboardNotificationsOpen;
    renderDashboard();
  }));
  document.querySelectorAll("[data-dashboard-goal]").forEach((button) => button.addEventListener("click", openDashboardGoalForm));
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
  document.querySelectorAll("[data-letter-generate]").forEach((button) => button.addEventListener("click", () => generateAndOpenRenewalLetter(button.dataset.letterGenerate, "preview")));
  document.querySelectorAll("[data-letter-view]").forEach((button) => button.addEventListener("click", () => openRenewalLetterModal(button.dataset.letterView, "preview")));
  document.querySelectorAll("[data-letter-edit]").forEach((button) => button.addEventListener("click", () => openRenewalLetterModal(button.dataset.letterEdit, "edit")));
  document.querySelectorAll("[data-letter-send]").forEach((button) => button.addEventListener("click", () => openRenewalLetterModal(button.dataset.letterSend, "email")));
  document.querySelectorAll("[data-letter-mark-sent]").forEach((button) => button.addEventListener("click", () => markRenewalLetterSent(button.dataset.letterMarkSent)));
  document.querySelectorAll("[data-renewal-result]").forEach((select) => select.addEventListener("change", () => updateRenewalResult(select.dataset.renewalResult, select.value)));
  document.querySelectorAll("[data-renewal-tab]").forEach((button) => button.addEventListener("click", () => {
    state.renewalTab = button.dataset.renewalTab;
    renderRenewals();
  }));
  document.querySelectorAll("[data-export-db]").forEach((button) => button.addEventListener("click", exportDb));
  document.querySelectorAll("[data-import-full]").forEach((button) => button.addEventListener("click", () => {
    startImport("", ".json,.csv,application/json,text/csv");
  }));
  document.querySelectorAll("[data-import-renewal-sheet]").forEach((button) => button.addEventListener("click", () => {
    startImport("renovacoes", ".csv,text/csv,application/vnd.ms-excel");
  }));
  const contractSelect = document.querySelector("#aiContractSelect");
  if (contractSelect) {
    contractSelect.addEventListener("change", (event) => {
      state.aiContractId = event.target.value;
      state.aiLetter = "";
      refreshAiSurface();
    });
  }
  document.querySelectorAll("[data-import-clients]").forEach((button) => button.addEventListener("click", () => {
    startImport("clientes", ".csv,text/csv,application/vnd.ms-excel");
  }));
  document.querySelectorAll("[data-import-contracts]").forEach((button) => button.addEventListener("click", () => {
    startImport("contratos", ".csv,text/csv,application/vnd.ms-excel");
  }));
  document.querySelectorAll("[data-import-users]").forEach((button) => button.addEventListener("click", () => {
    startImport("usuarios", ".csv,text/csv,application/vnd.ms-excel");
  }));
  document.querySelectorAll("[data-config]").forEach((button) => button.addEventListener("click", () => {
    state.configTab = button.dataset.config;
    renderSettings();
  }));
  const aiConfigForm = document.querySelector("#aiConfigForm");
  if (aiConfigForm) aiConfigForm.addEventListener("submit", saveAiConfigForm);
}

function startImport(mode, accept) {
  el.importFile.dataset.mode = mode || "";
  el.importFile.accept = accept || ".json,.csv,application/json,text/csv";
  el.importFile.click();
}

function refreshAiSurface() {
  if (state.view === "configuracoes" && state.configTab === "ia") return renderSettings();
  return renderAi();
}

function saveAiConfigForm(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  db.aiConfig = {
    ...getAiConfig(),
    provider: String(form.get("provider") || "firebase-ai-logic"),
    model: String(form.get("model") || "").trim() || "gemini-3.6-flash",
    connectionMode: String(form.get("connectionMode") || "firebase-ai-logic"),
    apiKey: String(form.get("apiKey") || "").trim(),
    endpointUrl: String(form.get("endpointUrl") || "").trim(),
    secretRef: String(form.get("secretRef") || "").trim(),
    status: String(form.get("status") || "yellow"),
    notes: String(form.get("notes") || "").trim(),
    updatedAt: today(),
  };
  syncCloudAiConfig();
  saveDb("Atualizou configuracao de IA", `${aiProviderLabel(db.aiConfig.provider)} - ${db.aiConfig.model}`);
  renderSettings();
  toast("Configuracao de IA salva.");
}

async function refreshRenewalAutomation() {
  if (consultantScopeActive()) {
    toast("A rotina global de renovacoes fica restrita aos administradores.");
    return;
  }
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
  if (!canSeeRecord("renovacoes", renewal)) {
    toast("Esta renovacao nao esta vinculada ao seu usuario.");
    return;
  }
  await generateAutomaticRenewalLetter(renewal, { force: true });
  saveDb("Gerou carta automatica", renewal.contract || renewal.name || id);
  render();
  toast(renewal.clientEmail ? "Carta pronta para envio." : "Carta gerada. Complete o e-mail do cliente.");
}

async function emailRenewalLetter(id) {
  let renewal = (db.renovacoes || []).find((item) => item.id === id);
  if (!renewal) return;
  if (!canSeeRecord("renovacoes", renewal)) {
    toast("Esta renovacao nao esta vinculada ao seu usuario.");
    return;
  }
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
  if (!canSeeRecord("renovacoes", renewal)) {
    toast("Esta renovacao nao esta vinculada ao seu usuario.");
    return;
  }
  renewal.emailStatus = "sent";
  renewal.letterSentAt = today();
  renewal.followUpAt = today();
  if (["Mapeada", "Em contato"].includes(renewal.stage)) renewal.stage = "Proposta enviada";
  renewal.updatedAt = now();
  saveDb("Registrou envio de carta", renewal.contract || renewal.name || id);
  render();
  toast("Envio registrado na renovacao.");
}

async function generateAndOpenRenewalLetter(id, tab = "preview") {
  const renewal = await ensureRenewalLetterDraft(id, true);
  if (!renewal) return;
  openRenewalLetterModal(id, tab);
  toast(renewal.clientEmail ? "Carta gerada com timbre." : "Carta gerada. Complete o e-mail antes do envio.");
}

async function openRenewalLetterModal(id, tab = "preview") {
  const renewal = await ensureRenewalLetterDraft(id, false);
  if (!renewal) return;
  if (!canSeeRecord("renovacoes", renewal)) {
    toast("Esta renovacao nao esta vinculada ao seu usuario.");
    return;
  }
  state.letterRenewalId = id;
  state.letterTab = tab;
  renderLetterModal();
  el.letterModal.classList.remove("hidden");
}

function closeLetterModal() {
  state.letterRenewalId = "";
  state.letterTab = "preview";
  el.letterModal.classList.add("hidden");
}

async function ensureRenewalLetterDraft(id, force = false) {
  const renewal = (db.renovacoes || []).find((item) => item.id === id);
  if (!renewal) return null;
  if (!canSeeRecord("renovacoes", renewal)) {
    toast("Esta renovacao nao esta vinculada ao seu usuario.");
    return null;
  }
  if (!renewal.letterDraft || force) {
    await generateAutomaticRenewalLetter(renewal, { force: true });
    saveDb("Gerou carta de renovacao", renewal.contract || renewal.name || id);
    render();
  }
  return (db.renovacoes || []).find((item) => item.id === id) || renewal;
}

function handleLetterModalClick(event) {
  const tabButton = event.target.closest("[data-letter-modal-tab]");
  if (tabButton) {
    state.letterTab = tabButton.dataset.letterModalTab;
    renderLetterModal();
    return;
  }
  const saveButton = event.target.closest("[data-letter-save]");
  if (saveButton) {
    saveLetterDraftFromModal();
    return;
  }
  const emailButton = event.target.closest("[data-letter-email-now]");
  if (emailButton) {
    emailRenewalLetter(emailButton.dataset.letterEmailNow);
    renderLetterModal();
    return;
  }
  const sentButton = event.target.closest("[data-letter-modal-sent]");
  if (sentButton) {
    markRenewalLetterSent(sentButton.dataset.letterModalSent);
    state.letterRenewalId = sentButton.dataset.letterModalSent;
    renderLetterModal();
    return;
  }
  const unsentButton = event.target.closest("[data-letter-modal-unsent]");
  if (unsentButton) {
    markRenewalLetterNotSent(unsentButton.dataset.letterModalUnsent);
    renderLetterModal();
    return;
  }
  const printButton = event.target.closest("[data-letter-print]");
  if (printButton) {
    printRenewalLetter(printButton.dataset.letterPrint);
  }
}

function renderLetterModal() {
  const renewal = (db.renovacoes || []).find((item) => item.id === state.letterRenewalId);
  if (!renewal) return;
  if (!canSeeRecord("renovacoes", renewal)) {
    closeLetterModal();
    toast("Esta renovacao nao esta vinculada ao seu usuario.");
    return;
  }
  const contract = findContractForRenewal(renewal) || {};
  const company = responsibleCompanyForRenewal(renewal, contract);
  const active = state.letterTab || "preview";
  el.letterModalKicker.textContent = renewal.client || "Carta de renovacao";
  el.letterModalTitle.textContent = `Carta de Renovacao - ${renewalContractNumber(renewal)}`;
  el.letterModalTabs.innerHTML = [
    ["preview", "Visualizar"],
    ["edit", "Editar"],
    ["email", "Enviar E-mail"],
  ].map(([key, label]) => `<button class="${key === active ? "active" : ""}" data-letter-modal-tab="${key}" type="button">${label}</button>`).join("");
  if (active === "edit") {
    el.letterModalBody.innerHTML = renewalLetterEditHtml(renewal, company);
    el.letterModalFooter.innerHTML = `
      <button class="primary-button" data-letter-save type="button">Salvar Carta</button>
    `;
    return;
  }
  if (active === "email") {
    el.letterModalBody.innerHTML = renewalLetterEmailHtml(renewal, company);
    el.letterModalFooter.innerHTML = `
      <button class="secondary-button" data-letter-modal-unsent="${escapeAttr(renewal.id)}" type="button">Marcar nao enviada</button>
      <button class="secondary-button" data-letter-modal-sent="${escapeAttr(renewal.id)}" type="button">Marcar enviada</button>
      <button class="primary-button" data-letter-email-now="${escapeAttr(renewal.id)}" type="button">Abrir E-mail</button>
    `;
    return;
  }
  el.letterModalBody.innerHTML = renewalLetterPreviewHtml(renewal, company);
  el.letterModalFooter.innerHTML = `
    <button class="primary-button" data-letter-print="${escapeAttr(renewal.id)}" type="button">Gerar PDF</button>
  `;
}

function renewalLetterPreviewHtml(renewal, company) {
  return `
    <div class="letter-preview-shell">
      ${letterDocumentHtml(renewal, company)}
    </div>
  `;
}

function renewalLetterEditHtml(renewal, company) {
  return `
    <div class="letter-editor-grid">
      <section class="letter-config-card">
        <h3>Timbre utilizado</h3>
        <div class="letter-company-mini">
          ${company.logoUrl ? `<img src="${escapeAttr(company.logoUrl)}" alt="">` : `<span>${escapeHtml(initials(company.name || "VG"))}</span>`}
          <div>
            <strong>${escapeHtml(company.name || "Empresa responsavel")}</strong>
            <small>${escapeHtml(companyLine(company) || "Configure endereco, e-mail e CNPJ em Parametros > Empresas.")}</small>
          </div>
        </div>
      </section>
      <label class="letter-field">
        Assunto
        <input id="letterSubjectInput" value="${escapeAttr(renewal.letterSubject || renewalLetterSubject(findContractForRenewal(renewal) || {}, renewal))}" />
      </label>
      <label class="letter-field">
        E-mail do cliente
        <input id="letterClientEmailInput" type="email" value="${escapeAttr(renewal.clientEmail || "")}" />
      </label>
      <label class="letter-field">
        Copia para consultor
        <input id="letterConsultantEmailInput" type="email" value="${escapeAttr(renewal.consultantEmail || "")}" />
      </label>
      <label class="letter-field wide">
        Texto da carta
        <textarea id="letterDraftInput" rows="18">${escapeHtml(renewal.letterDraft || "")}</textarea>
      </label>
    </div>
  `;
}

function renewalLetterEmailHtml(renewal, company) {
  const blocked = !cleanImport(renewal.clientEmail);
  return `
    <div class="letter-email-grid">
      <section class="letter-email-card ${blocked ? "blocked" : ""}">
        <span>Status</span>
        <strong>${emailStatusBadge(renewal.emailStatus || (renewal.letterDraft ? "ready" : "pending"))}</strong>
        <p>${blocked ? "Inclua o e-mail do cliente antes de abrir o envio." : "O envio abre no e-mail do seu computador para revisao final."}</p>
      </section>
      <section class="letter-email-card">
        <span>Destinatario</span>
        <strong>${escapeHtml(renewal.clientEmail || "Nao informado")}</strong>
        <p>Cliente: ${escapeHtml(renewal.client || "-")}</p>
      </section>
      <section class="letter-email-card">
        <span>Copia</span>
        <strong>${escapeHtml(renewal.consultantEmail || "Sem copia")}</strong>
        <p>Consultor vinculado ao contrato.</p>
      </section>
      <section class="letter-email-card">
        <span>Timbre</span>
        <strong>${escapeHtml(company.name || "Empresa responsavel")}</strong>
        <p>${escapeHtml(companyLine(company) || "Sem dados complementares.")}</p>
      </section>
      <section class="letter-email-card wide">
        <span>Assunto</span>
        <strong>${escapeHtml(renewal.letterSubject || renewalLetterSubject(findContractForRenewal(renewal) || {}, renewal))}</strong>
      </section>
    </div>
  `;
}

function saveLetterDraftFromModal() {
  const renewal = (db.renovacoes || []).find((item) => item.id === state.letterRenewalId);
  if (!renewal) return;
  if (!canSeeRecord("renovacoes", renewal)) {
    closeLetterModal();
    toast("Esta renovacao nao esta vinculada ao seu usuario.");
    return;
  }
  renewal.letterSubject = document.querySelector("#letterSubjectInput")?.value.trim() || renewalLetterSubject(findContractForRenewal(renewal) || {}, renewal);
  renewal.clientEmail = document.querySelector("#letterClientEmailInput")?.value.trim() || "";
  renewal.consultantEmail = document.querySelector("#letterConsultantEmailInput")?.value.trim() || "";
  renewal.letterDraft = document.querySelector("#letterDraftInput")?.value.trim() || "";
  renewal.letterGeneratedAt = renewal.letterGeneratedAt || today();
  renewal.emailStatus = renewal.clientEmail ? "ready" : "blocked";
  renewal.updatedAt = now();
  saveDb("Editou carta de renovacao", renewal.contract || renewal.name || renewal.id);
  render();
  state.letterRenewalId = renewal.id;
  state.letterTab = "preview";
  renderLetterModal();
  toast("Carta salva.");
}

function markRenewalLetterNotSent(id) {
  const renewal = (db.renovacoes || []).find((item) => item.id === id);
  if (!renewal) return;
  if (!canSeeRecord("renovacoes", renewal)) {
    toast("Esta renovacao nao esta vinculada ao seu usuario.");
    return;
  }
  renewal.emailStatus = renewal.clientEmail ? (renewal.letterDraft ? "ready" : "pending") : "blocked";
  renewal.letterSentAt = "";
  renewal.updatedAt = now();
  saveDb("Marcou carta como nao enviada", renewal.contract || renewal.name || id);
  render();
  state.letterRenewalId = id;
  toast("Carta marcada como nao enviada.");
}

function printRenewalLetter(id) {
  const renewal = (db.renovacoes || []).find((item) => item.id === id);
  if (!renewal) return;
  if (!canSeeRecord("renovacoes", renewal)) {
    toast("Esta renovacao nao esta vinculada ao seu usuario.");
    return;
  }
  const company = responsibleCompanyForRenewal(renewal, findContractForRenewal(renewal) || {});
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${escapeHtml(renewal.letterSubject || "Carta de renovacao")}</title><style>${letterPrintCss()}</style></head><body>${letterDocumentHtml(renewal, company)}</body></html>`;
  const popup = window.open("", "_blank");
  if (!popup) {
    toast("Permita pop-ups para gerar PDF.");
    return;
  }
  popup.document.open();
  popup.document.write(html);
  popup.document.close();
  popup.focus();
  setTimeout(() => popup.print(), 300);
}

function letterDocumentHtml(renewal, company) {
  const body = letterBodyWithoutSubject(renewal.letterDraft || renewalLetterTemplate(findContractForRenewal(renewal) || {}, renewal));
  const paragraphs = body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("");
  return `
    <article class="letter-paper">
      <header class="letterhead">
        ${company.logoUrl ? `<img src="${escapeAttr(company.logoUrl)}" alt="${escapeAttr(company.name || "Logo")}">` : `<div class="letter-logo-fallback">${escapeHtml(initials(company.name || "VG"))}</div>`}
        <h3>${escapeHtml(company.name || "Empresa responsavel")}</h3>
        ${companyLine(company) ? `<p>${escapeHtml(companyLine(company))}</p>` : ""}
        ${companyContactLine(company) ? `<p>${escapeHtml(companyContactLine(company))}</p>` : ""}
        ${company.cnpj ? `<p>CNPJ: ${escapeHtml(company.cnpj)}</p>` : ""}
      </header>
      <div class="letter-reference">
        <p>${escapeHtml(company.city || "Brasil")}, ${longDate(today())}.</p>
        <p><strong>Ref.:</strong> ${escapeHtml(renewal.letterSubject || renewalLetterSubject(findContractForRenewal(renewal) || {}, renewal))}</p>
      </div>
      <section class="letter-body">${paragraphs}</section>
    </article>
  `;
}

function letterBodyWithoutSubject(text) {
  return cleanImport(text).replace(/^Assunto:\s*.+(\n+)?/i, "").trim();
}

function responsibleCompanyForRenewal(renewal = {}, contract = {}) {
  const candidates = [
    renewal.responsibleCompany,
    contract.responsibleCompany,
    renewal.company,
    contract.company,
    renewal.ownerCompany,
    contract.ownerCompany,
  ].map(cleanImport).filter(Boolean);
  const companies = db.empresas || [];
  const exact = companies.find((company) => candidates.some((candidate) => sameText(company.id, candidate) || sameText(company.name, candidate) || sameText(company.portfolio, candidate)));
  const active = companies.find((company) => company.status === "green") || companies[0];
  return {
    name: "Computeck Solucoes Inteligentes",
    logoUrl: "./assets/vendegov-crm-logo-horizontal.svg",
    email: "steven.passos@computeck.com.br",
    city: "Governador Valadares/MG",
    ...(active || {}),
    ...(exact || {}),
  };
}

function companyLine(company = {}) {
  return [company.address, company.city].map(cleanImport).filter(Boolean).join(" - ");
}

function companyContactLine(company = {}) {
  return [company.phone, company.email].map(cleanImport).filter(Boolean).join(" | ");
}

function longDate(value) {
  const parsed = parseDate(value);
  if (!parsed) return date(value);
  return parsed.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
}

function letterPrintCss() {
  return `
    body { margin: 0; background: #fff; color: #08172b; font: 14px/1.6 Arial, sans-serif; }
    .letter-paper { width: 190mm; min-height: 267mm; margin: 0 auto; padding: 18mm; box-sizing: border-box; }
    .letterhead { text-align: center; border-bottom: 1px solid #d8e1eb; padding-bottom: 14px; margin-bottom: 28px; }
    .letterhead img { max-width: 160px; max-height: 72px; object-fit: contain; margin-bottom: 12px; }
    .letterhead h3 { margin: 0 0 6px; font-size: 18px; }
    .letterhead p { margin: 2px 0; color: #30445d; }
    .letter-reference { margin-bottom: 22px; }
    .letter-reference p { margin: 0 0 16px; }
    .letter-body p { margin: 0 0 14px; text-align: justify; }
    .letter-logo-fallback { display: inline-grid; place-items: center; width: 68px; height: 68px; border-radius: 14px; background: #102139; color: #fff; font-weight: 800; margin-bottom: 12px; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  `;
}

function updateRenewalResult(id, result) {
  const renewal = (db.renovacoes || []).find((item) => item.id === id);
  if (!renewal) return;
  const map = {
    "Pendente": ["Mapeada", "yellow"],
    "Em contato": ["Em contato", "yellow"],
    "Proposta enviada": ["Proposta enviada", "cyan"],
    "Renovada": ["Renovada", "green"],
    "Perdida": ["Perdida", "red"],
  };
  const [stage, status] = map[result] || map.Pendente;
  renewal.stage = stage;
  renewal.status = status;
  renewal.followUpAt = today();
  renewal.updatedAt = now();
  saveDb("Atualizou resultado da renovacao", `${renewal.contract || renewal.name || id}: ${result}`);
  renderRenewals();
  toast("Resultado atualizado.");
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
  if (!canAccessModule(moduleKey)) {
    toast("Seu perfil nao tem acesso a este modulo.");
    return;
  }
  closeDrawer();
  const item = id ? (db[moduleKey] || []).find((row) => row.id === id) : null;
  if (id && !canSeeRecord(moduleKey, item)) {
    toast("Este registro nao esta vinculado ao seu usuario.");
    return;
  }
  const values = item || applyUserScopeDefaults(moduleKey, { ...defaults });
  state.editing = { moduleKey, id };
  state.contractFormAiBusy = false;
  state.contractFormAiFile = null;
  state.contractFormAiExtraction = null;
  el.modalKicker.textContent = schema.title;
  el.modalTitle.textContent = id ? `Editar ${schema.singular}` : `Novo ${schema.singular}`;
  el.form.innerHTML = `${contractAiScanner(moduleKey)}
    ${schema.fields.map((f) => inputFor(f, values ? values[f.name] : "", values || {})).join("")}
    <div class="form-actions">
      <button class="primary-button" type="submit">Salvar</button>
    </div>`;
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
    responsibleCompany: contract.responsibleCompany,
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

function inputFor(f, value, context = {}) {
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
    const acceptValue = f.accept || (f.label.toLowerCase().includes("pdf") ? "application/pdf,.pdf" : "");
    const accept = acceptValue ? ` accept="${escapeAttr(acceptValue)}"` : "";
    const currentUrl = f.urlField ? context[f.urlField] : context.fileUrl;
    const currentFile = f.refField ? context[f.refField] : context.fileRef;
    const preview = currentUrl
      ? `<small class="field-preview"><a href="${escapeAttr(currentUrl)}" target="_blank" rel="noreferrer">${escapeHtml(currentFile || "Arquivo atual")}</a></small>`
      : "";
    return `<label>${f.label}<input name="${f.name}" type="file"${accept} ${required} />${preview}</label>`;
  }
  return `<label>${f.label}<input name="${f.name}" type="${f.type}" value="${escapeAttr(value || "")}" ${required} /></label>`;
}

async function submitForm(event) {
  event.preventDefault();
  const { moduleKey, id } = state.editing || {};
  if (!moduleKey) return;
  const formData = new FormData(el.form);
  const values = {};
  const pendingUploads = [];
  schemas[moduleKey].fields.forEach((f) => {
    if (f.type === "file") {
      const file = formData.get(f.name);
      if (file && file.name) pendingUploads.push({ field: f, file });
      return;
    }
    values[f.name] = formData.get(f.name) || "";
    if (f.type === "number") values[f.name] = Number(values[f.name] || 0);
  });
  if (id) {
    const existing = (db[moduleKey] || []).find((item) => item.id === id);
    if (!canSeeRecord(moduleKey, existing)) {
      toast("Este registro nao esta vinculado ao seu usuario.");
      return;
    }
  }
  applyUserScopeDefaults(moduleKey, values);
  if (moduleKey === "contratos") applyContractLegalDefaults(values);
  if (moduleKey !== "contratos") linkRecordToExistingClient(values);
  if (moduleKey === "renovacoes" && id) values.followUpAt = values.followUpAt || today();
  if (!pendingUploads.length && moduleKey === "contratos" && state.contractFormAiFile) {
    pendingUploads.push({ field: schemas.contratos.fields.find((fieldDef) => fieldDef.name === "attachment") || {}, file: state.contractFormAiFile });
  }
  const linkedClient = moduleKey === "contratos" ? ensureClientForContract(values) : null;
  const recordId = id || uid();
  if (pendingUploads.length) {
    for (const upload of pendingUploads) {
      const refField = upload.field.refField || "fileRef";
      const urlField = upload.field.urlField || "fileUrl";
      values[refField] = upload.file.name;
      if (cloudEnabled()) {
        try {
          const uploaded = await cloud().uploadFile(moduleKey, recordId, upload.file);
          if (uploaded) {
            values[refField] = uploaded.name;
            values[urlField] = uploaded.url;
          }
        } catch {
          toast("Registro salvo, mas um arquivo nao subiu para o Firebase.");
        }
      }
    }
  }
  if (id) {
    const idx = db[moduleKey].findIndex((item) => item.id === id);
    db[moduleKey][idx] = { ...db[moduleKey][idx], ...values, updatedAt: now() };
    if (moduleKey === "contratos") {
      syncContractRenewal(db[moduleKey][idx]);
      if (!consultantScopeActive()) await processRenewalAutomation({ generateLetters: true });
    }
    if (moduleKey === "renovacoes" && !consultantScopeActive()) await processRenewalAutomation({ generateLetters: true });
    saveDb(`Editou ${schemas[moduleKey].singular}`, linkedClient ? `${values.name || id} vinculado a ${linkedClient.name}` : values.name || id);
    updateUserProfileButton();
    toast("Registro atualizado.");
  } else {
    values.id = recordId;
    const created = record(values);
    db[moduleKey].unshift(created);
    if (moduleKey === "contratos") {
      syncContractRenewal(created);
      if (!consultantScopeActive()) await processRenewalAutomation({ generateLetters: true });
    }
    if (moduleKey === "renovacoes" && !consultantScopeActive()) await processRenewalAutomation({ generateLetters: true });
    saveDb(`Criou ${schemas[moduleKey].singular}`, linkedClient ? `${values.name || "novo registro"} vinculado a ${linkedClient.name}` : values.name || "novo registro");
    updateUserProfileButton();
    toast("Registro criado.");
  }
  closeForm();
  updateLoginNumbers();
  render();
}

function askDelete(moduleKey, id) {
  const item = (db[moduleKey] || []).find((row) => row.id === id);
  if (!canSeeRecord(moduleKey, item)) {
    toast("Este registro nao esta vinculado ao seu usuario.");
    return;
  }
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
  if (!canSeeRecord(moduleKey, item)) {
    closeConfirm();
    toast("Este registro nao esta vinculado ao seu usuario.");
    return;
  }
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
  if (!canSeeRecord(moduleKey, item)) {
    toast("Este registro nao esta vinculado ao seu usuario.");
    return;
  }
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
        <button class="secondary-button" data-ai="Diagnostico da carteira" type="button">Abrir IA</button>
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
          : fieldDef.name === "logoUrl"
            ? "Abrir logo"
            : value;
    return `<a href="${escapeAttr(value)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`;
  }
  return escapeHtml(value);
}

function activeCrudModule() {
  if (state.view === "configuracoes") return state.configTab === "audit" ? "usuarios" : state.configTab;
  return schemas[state.view] ? state.view : "clientes";
}

function filtered(rows, moduleKey = "") {
  const scopedRows = moduleKey ? visibleRows(moduleKey, rows) : rows;
  return scopedRows.filter((item) => {
    const queryOk = !state.query || JSON.stringify(item).toLowerCase().includes(state.query);
    const statusOk = state.status === "todos" || item.status === state.status;
    return queryOk && statusOk;
  });
}

function exportDb() {
  const blob = new Blob([JSON.stringify(consultantScopeActive() ? visibleDbSnapshot() : db, null, 2)], { type: "application/json" });
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
  if (mode === "renovacoes") return importContractsRows(rows, fileName, "renovacoes");
  if (mode === "contratos" || headers.includes("numero_contrato")) return importContractsRows(rows, fileName);
  if (mode === "clientes" || (headers.includes("nome_exibicao") && headers.includes("municipio"))) return importClientsRows(rows, fileName);
  if (mode === "usuarios" || headers.includes("consultor_email")) return importConsultantsRows(rows, fileName);
  throw new Error("CSV Base44 nao reconhecido");
}

function importContractsCsv(text, fileName) {
  const rows = csvToObjects(text);
  return importContractsRows(rows, fileName);
}

function importContractsRows(rows, fileName, targetView = "contratos") {
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
  processRenewalAutomation({ generateLetters: true }).then((changed) => {
    if (changed) saveDb("Atualizou alertas de renovacao", `${changed} alteracao(oes) apos importacao`);
    if (state.view === targetView) render();
  }).catch(() => {});
  saveDb("Importou contratos", `${created} novos, ${updated} atualizados, ${skipped} ignorados - ${fileName}`);
  updateLoginNumbers();
  if (targetView === "renovacoes") state.renewalTab = "vencer";
  setView(targetView);
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
  const responsibleCompany = cleanImport(row.empresa_responsavel || row.empresa_responsavel_id || row.empresa_interna || row.contratada || row.fornecedor || row.company);
  return {
    id: sourceId || uid(),
    sourceId,
    createdAt: normalizeImportDate(row.created_date) || now(),
    updatedAt: normalizeImportDate(row.updated_date) || now(),
    name,
    client: client || "Cliente nao informado",
    agency,
    responsibleCompany,
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
  state.configTab = "ia";
  setView("configuracoes");
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
  refreshAiSurface();
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
    refreshAiSurface();
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
    responsibleCompany: cleanImport(data.empresa_responsavel) || cleanImport(data.contratada),
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
  applyUserScopeDefaults("contratos", state.aiDraftContract);
  applyContractLegalDefaults(state.aiDraftContract);
  ensureClientForContract(state.aiDraftContract);
  const item = record(state.aiDraftContract);
  db.contratos.unshift(item);
  syncContractRenewal(item);
  if (!consultantScopeActive()) await processRenewalAutomation({ generateLetters: true });
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
  if (!canSeeRecord("contratos", contract)) {
    toast("Este contrato nao esta vinculado ao seu usuario.");
    return;
  }
  openAiWorkspace();
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("PDF indisponivel.");
    const blob = await response.blob();
    const file = new File([blob], contract.fileRef || `${contract.name || "contrato"}.pdf`, { type: blob.type || "application/pdf" });
    await analyzeContractFile(file);
  } catch {
    toast("Nao consegui ler esse PDF automaticamente. Baixe o arquivo e envie pela tela de IA.");
  }
}

async function generateRenewalLetterFromSelection(contractId = state.aiContractId) {
  const contract = (db.contratos || []).find((item) => item.id === contractId);
  if (!contract) {
    toast("Selecione um contrato para gerar a carta.");
    return;
  }
  if (!canSeeRecord("contratos", contract)) {
    toast("Este contrato nao esta vinculado ao seu usuario.");
    return;
  }
  if (!cloudEnabled() || !cloud()?.generateRenewalLetter) {
    toast("Firebase AI Logic ainda nao esta configurado.");
    return;
  }
  state.aiContractId = contract.id;
  state.aiBusy = "letter";
  state.aiLetter = "";
  refreshAiSurface();
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
    refreshAiSurface();
  }
}

async function generateRenewalLetterForContractId(id) {
  state.aiContractId = id;
  openAiWorkspace();
  await generateRenewalLetterFromSelection(id);
}

async function generateRenewalLetterForRenewalId(id) {
  const renewal = (db.renovacoes || []).find((item) => item.id === id);
  if (!canSeeRecord("renovacoes", renewal)) {
    toast("Esta renovacao nao esta vinculada ao seu usuario.");
    return;
  }
  const contract = findContractForRenewal(renewal || {});
  if (!contract) {
    openAiWorkspace();
    toast("Nao encontrei o contrato vinculado a esta renovacao.");
    return;
  }
  await generateAutomaticRenewalLetter(renewal, { force: true });
  saveDb("Gerou carta de renovacao", contract.name || contract.id);
  state.aiContractId = contract.id;
  state.aiLetter = renewal.letterDraft || "";
  openAiWorkspace();
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
    return "Configure a IA em Parametros > IA e confira o provedor ativo.";
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

function mediaCell(title, subtitle, imageUrl) {
  const cleanTitle = title || "-";
  const media = imageUrl
    ? `<img src="${escapeAttr(imageUrl)}" alt="">`
    : `<span>${escapeHtml(initials(cleanTitle))}</span>`;
  return `<div class="record-media">${media}<div>${mainCell(cleanTitle, subtitle)}</div></div>`;
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

function moneyCents(value) {
  const number = Number(value || 0);
  return number.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
  const visibleContracts = visibleDbRows("contratos");
  if (revenue) revenue.textContent = money(sum(visibleContracts, "monthly"));
  if (contracts) contracts.textContent = visibleContracts.length;
}

init();
