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
      field("segment", "Segmento", "select", true, ["Construcao", "Saude", "Tecnologia", "Transporte", "Alimentos", "Servicos"]),
      field("cnpj", "CNPJ", "text"),
      field("contact", "Contato principal", "text"),
      field("email", "E-mail", "email"),
      field("phone", "Telefone", "text"),
      field("city", "Cidade/UF", "text"),
      field("potential", "Potencial", "number"),
      field("status", "Status", "select", true, statusOptions),
      field("owner", "Responsavel", "select", true, ["Mariana Costa", "Rafael Lima", "Steven Passos", "Equipe comercial"]),
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
      field("value", "Valor total", "number"),
      field("monthly", "Receita mensal", "number"),
      field("status", "Status", "select", true, [["green", "Ativo"], ["cyan", "Reajuste"], ["yellow", "Renovacao"], ["red", "Risco"]]),
      field("start", "Inicio", "date"),
      field("end", "Fim", "date"),
      field("renewal", "Renovacao prevista", "date"),
      field("adjustment", "Indice/reajuste", "text"),
      field("owner", "Responsavel", "select", true, ["Mariana Costa", "Rafael Lima", "Steven Passos", "Financeiro"]),
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
      field("role", "Perfil", "select", true, ["Administrador", "Gestor", "Comercial", "Documentos", "Financeiro"]),
      field("status", "Status", "select", true, [["green", "Ativo"], ["yellow", "Pendente"], ["red", "Bloqueado"]]),
      field("lastAccess", "Ultimo acesso", "date"),
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
    if (isDemoDb(remoteDb)) {
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
  el.importButton.addEventListener("click", () => el.importFile.click());
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
  el.newButton.disabled = state.view === "dashboard" || state.view === "relatorios";
  if (state.view === "dashboard") return renderDashboard();
  if (state.view === "relatorios") return renderReports();
  if (state.view === "configuracoes") return renderSettings();
  return renderCrud(state.view);
}

function viewMeta(view) {
  if (view === "dashboard") return { title: "Painel executivo", kicker: "Visao geral" };
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
        <div class="toolbar-controls">${tabButtons}${active !== "audit" ? `<button class="primary-button" data-add="${active}" type="button">Novo</button>` : ""}</div>
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
  document.querySelectorAll("[data-open]").forEach((button) => button.addEventListener("click", () => openDetail(button.dataset.module, button.dataset.open)));
  document.querySelectorAll("[data-edit]").forEach((button) => button.addEventListener("click", () => openForm(button.dataset.module, button.dataset.edit)));
  document.querySelectorAll("[data-delete]").forEach((button) => button.addEventListener("click", () => askDelete(button.dataset.module, button.dataset.delete)));
  document.querySelectorAll("[data-ai]").forEach((button) => button.addEventListener("click", () => simulateAi(button.dataset.ai)));
  document.querySelectorAll("[data-config]").forEach((button) => button.addEventListener("click", () => {
    state.configTab = button.dataset.config;
    renderSettings();
  }));
}

function openForm(moduleKey, id = null) {
  const schema = schemas[moduleKey];
  if (!schema) return;
  closeDrawer();
  const item = id ? (db[moduleKey] || []).find((row) => row.id === id) : null;
  state.editing = { moduleKey, id };
  el.modalKicker.textContent = schema.title;
  el.modalTitle.textContent = id ? `Editar ${schema.singular}` : `Novo ${schema.singular}`;
  el.form.innerHTML = `${schema.fields.map((f) => inputFor(f, item ? item[f.name] : "")).join("")}
    <div class="form-actions">
      <button class="secondary-button" type="button" id="cancelForm">Cancelar</button>
      <button class="primary-button" type="submit">Salvar</button>
    </div>`;
  el.form.querySelector("#cancelForm").addEventListener("click", closeForm);
  el.modal.classList.remove("hidden");
  const firstInput = el.form.querySelector("input, select, textarea");
  if (firstInput) firstInput.focus();
}

function closeForm() {
  el.modal.classList.add("hidden");
  state.editing = null;
  el.form.innerHTML = "";
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
    return `<label>${f.label}<input name="${f.name}" type="file" ${required} /></label>`;
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
    saveDb(`Editou ${schemas[moduleKey].singular}`, values.name || id);
    toast("Registro atualizado.");
  } else {
    values.id = recordId;
    db[moduleKey].unshift(record(values));
    saveDb(`Criou ${schemas[moduleKey].singular}`, values.name || "novo registro");
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
        <button class="secondary-button" data-ai="Diagnostico da carteira" type="button">Gerar resumo IA</button>
        <button class="danger-button" data-delete="${id}" data-module="${moduleKey}" type="button">Excluir</button>
      </div>
    </section>
  `;
  el.drawer.classList.remove("hidden");
  el.drawerBackdrop.classList.remove("hidden");
  bindDynamicActions();
}

function closeDrawer() {
  el.drawer.classList.add("hidden");
  el.drawerBackdrop.classList.add("hidden");
}

function detailField(label, value) {
  return `<div class="detail-field"><span>${escapeHtml(label)}</span><strong>${value}</strong></div>`;
}

function formatFieldValue(fieldDef, value) {
  if (fieldDef.type === "number") return money(value);
  if (fieldDef.type === "date") return date(value);
  if (fieldDef.name === "status") return badge(value);
  if (fieldDef.type === "url") return `<a href="${escapeAttr(value)}" target="_blank" rel="noreferrer">${escapeHtml(value)}</a>`;
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
      const incoming = JSON.parse(reader.result);
      db = { ...emptyDb(), ...incoming, audit: incoming.audit || [] };
      saveDb("Importou base", file.name);
      render();
      toast("Base importada.");
    } catch {
      toast("Nao foi possivel importar o arquivo.");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

function simulateAi(action) {
  const messages = {
    "Analisar edital": "IA simulada: edital analisado, 8 documentos e 3 riscos encontrados.",
    "Preparar documentos": "IA simulada: checklist de habilitacao montado e pendencias priorizadas.",
    "Gerar proposta": "IA simulada: proposta criada com base no template comercial.",
    "Analisar contrato": "IA simulada: vencimento, reajuste e obrigacoes identificados.",
    "Diagnostico da carteira": "IA simulada: carteira possui 3 alertas prioritarios.",
    "Diagnostico digital": "IA simulada: maturidade da operacao calculada com plano de melhoria.",
    "Relatorio de viagem": "IA simulada: visita registrada com resumo, custos e proximos passos.",
  };
  saveDb("Executou IA", action);
  render();
  toast(messages[action] || "Acao inteligente simulada.");
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
