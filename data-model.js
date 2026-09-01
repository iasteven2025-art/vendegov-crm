(function () {
  const SaaS_VERSION = "2026-08-30-collections-v1";

  const collectionDefinitions = {
    clientes: {
      collection: "clientes",
      snapshotKey: "clientes",
      base44Entity: "ClienteInfo",
      required: ["name"],
      tenantScoped: true,
    },
    empresas: {
      collection: "empresas",
      snapshotKey: "empresas",
      base44Entity: "Empresa",
      required: ["name", "cnpj"],
      tenantScoped: true,
    },
    usuarios: {
      collection: "usuarios",
      snapshotKey: "usuarios",
      base44Entity: "User",
      required: ["email"],
      tenantScoped: true,
    },
    perfisConsultor: {
      collection: "perfisConsultor",
      base44Entity: "PerfilConsultor",
      required: ["email", "name"],
      tenantScoped: true,
    },
    contratos: {
      collection: "contratos",
      snapshotKey: "contratos",
      base44Entity: "Contrato",
      required: ["name", "client", "object"],
      tenantScoped: true,
      consultantScoped: true,
    },
    aditivos: {
      collection: "aditivos",
      base44Entity: "Contrato",
      required: ["contractId", "name"],
      tenantScoped: true,
      consultantScoped: true,
    },
    renovacoes: {
      collection: "renovacoes",
      snapshotKey: "renovacoes",
      required: ["contract"],
      tenantScoped: true,
      consultantScoped: true,
    },
    cartasRenovacao: {
      collection: "cartasRenovacao",
      base44Entity: "CartaRenovacao",
      required: ["contractId", "type"],
      tenantScoped: true,
      consultantScoped: true,
    },
    planilhasRenovacao: {
      collection: "planilhasRenovacao",
      base44Entity: "PlanilhaRenovacao",
      required: ["referenceMonth", "fileUrl"],
      tenantScoped: true,
    },
    licitacoes: {
      collection: "licitacoes",
      snapshotKey: "licitacoes",
      base44Entity: "ProcessoLicitacao",
      required: ["name", "agency", "object"],
      tenantScoped: true,
    },
    propostas: {
      collection: "propostas",
      snapshotKey: "propostas",
      base44Entity: "PropostaComercial",
      required: ["name", "client"],
      tenantScoped: true,
    },
    documentos: {
      collection: "documentos",
      snapshotKey: "documentos",
      base44Entity: "EntregaDocumento",
      required: ["name"],
      tenantScoped: true,
    },
    documentosEmpresa: {
      collection: "documentosEmpresa",
      base44Entity: "DocumentoEmpresa",
      required: ["empresaId", "type"],
      tenantScoped: true,
    },
    documentosImportantes: {
      collection: "documentosImportantes",
      snapshotKey: "documentosImportantes",
      base44Entity: "DocumentoImportante",
      required: ["name", "type"],
      tenantScoped: true,
    },
    cnds: {
      collection: "cnds",
      base44Entity: "CND",
      required: ["empresaId", "type", "validUntil"],
      tenantScoped: true,
    },
    atestados: {
      collection: "atestados",
      base44Entity: "Atestado",
      required: ["empresaId", "issuer"],
      tenantScoped: true,
    },
    termosReferencia: {
      collection: "termosReferencia",
      base44Entity: "TermoReferencia",
      required: ["title", "city", "agency"],
      tenantScoped: true,
    },
    modelosDocumento: {
      collection: "modelosDocumento",
      base44Entity: "ModeloDocumento",
      required: ["title", "type"],
      tenantScoped: true,
    },
    gruposServico: {
      collection: "gruposServico",
      base44Entity: "GrupoServico",
      required: ["name"],
      tenantScoped: true,
    },
    agenda: {
      collection: "agenda",
      snapshotKey: "agenda",
      base44Entity: "Compromisso",
      required: ["name", "date"],
      tenantScoped: true,
      consultantScoped: true,
    },
    roteirosViagem: {
      collection: "roteirosViagem",
      base44Entity: "RoteiroViagem",
      required: ["title", "start"],
      tenantScoped: true,
    },
    marketing: {
      collection: "marketing",
      snapshotKey: "marketing",
      required: ["name"],
      tenantScoped: true,
    },
    financeiro: {
      collection: "financeiro",
      snapshotKey: "financeiro",
      tenantScoped: true,
    },
    comissoes: {
      collection: "comissoes",
      snapshotKey: "comissoes",
      base44Entity: "Comissao",
      required: ["contractId", "type", "referenceMonth"],
      tenantScoped: true,
      consultantScoped: true,
    },
    templates: {
      collection: "templates",
      snapshotKey: "templates",
      base44Entity: "TemplateProposta",
      required: ["name"],
      tenantScoped: true,
    },
    regioes: {
      collection: "regioes",
      snapshotKey: "regioes",
      base44Entity: "Regiao",
      required: ["name"],
      tenantScoped: true,
    },
    sistema: {
      collection: "sistema",
      snapshotKey: "sistema",
      tenantScoped: true,
    },
    gruposUsuarios: {
      collection: "gruposUsuarios",
      snapshotKey: "gruposUsuarios",
      base44Entity: "GrupoUsuario",
      required: ["name"],
      tenantScoped: true,
    },
    notificacoes: {
      collection: "notificacoes",
      snapshotKey: "notificacoes",
      tenantScoped: true,
      userScoped: true,
    },
    logs: {
      collection: "logs",
      snapshotKey: "audit",
      base44Entity: "LogAuditoria",
      tenantScoped: true,
    },
  };

  const base44Aliases = Object.fromEntries(
    Object.entries(collectionDefinitions)
      .filter(([, definition]) => definition.base44Entity)
      .map(([key, definition]) => [definition.base44Entity, key])
  );

  const snapshotCollections = Object.entries(collectionDefinitions)
    .filter(([, definition]) => definition.snapshotKey)
    .map(([key]) => key);

  const statusMaps = {
    contract: {
      "vigente": "green",
      "proximo ao vencimento": "yellow",
      "próximo ao vencimento": "yellow",
      "vencido": "red",
      "renovado": "green",
      "encerrado": "closed",
      "arquivado": "closed",
    },
    renewalResult: {
      "pendente": "pending",
      "renovado": "sent",
      "perdido": "blocked",
      "licitado": "queued",
    },
  };

  function text(value) {
    return value === null || value === undefined ? "" : String(value).trim();
  }

  function firstText(...values) {
    return values.map(text).find(Boolean) || "";
  }

  function number(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function bool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    const clean = text(value).toLowerCase();
    if (["sim", "true", "1", "yes"].includes(clean)) return true;
    if (["nao", "não", "false", "0", "no"].includes(clean)) return false;
    return fallback;
  }

  function date(value) {
    const clean = text(value);
    if (!clean) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;
    const parsed = new Date(clean);
    return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
  }

  function email(value) {
    return text(value).toLowerCase();
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text(value));
  }

  function cleanObject(value) {
    if (Array.isArray(value)) return value.map(cleanObject);
    if (!value || typeof value !== "object") return value;
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entry]) => entry !== undefined)
        .map(([key, entry]) => [key, cleanObject(entry)])
    );
  }

  function collectionName(key) {
    return collectionDefinitions[key]?.collection || key;
  }

  function snapshotKey(key) {
    return collectionDefinitions[key]?.snapshotKey || key;
  }

  function collectionKeyForBase44(entityName) {
    return base44Aliases[entityName] || "";
  }

  function base44Source(entityName, row) {
    return cleanObject({
      provider: "base44",
      entity: entityName,
      base44Id: text(row.id),
      importedAt: new Date().toISOString(),
      raw: row,
    });
  }

  function normalizedScope(row = {}, context = {}) {
    const tenantId = firstText(context.tenantId, row.tenantId, row.grupo_empresa_id, row.groupTenantId);
    const empresaId = firstText(row.empresaId, row.companyId, row.empresa_id, row.responsibleCompanyId);
    const consultantEmail = firstText(row.consultantEmail, row.consultor_responsavel, isEmail(row.owner) ? row.owner : "");
    return cleanObject({ tenantId, empresaId, consultantEmail });
  }

  function normalizeSnapshotRecord(collectionKey, row = {}, context = {}) {
    const sourceKey = snapshotKey(collectionKey);
    const base = {
      ...row,
      ...normalizedScope(row, context),
      sourceModule: sourceKey,
    };
    if (!base.consultantEmail && isEmail(base.email)) base.consultantEmail = email(base.email);
    if (collectionKey === "contratos") {
      base.numeroContrato = firstText(base.numeroContrato, base.numero_contrato, base.name);
      base.orgaoContratante = firstText(base.orgaoContratante, base.agency, base.client);
      base.valorMensal = number(base.monthly, 0);
      base.valorTotal = number(base.value, 0);
      base.dataInicio = date(base.start);
      base.dataFim = date(base.end);
      base.dataRenovacao = date(base.renewal);
    }
    if (collectionKey === "clientes") {
      base.orgaoOriginal = firstText(base.orgaoOriginal, base.originalName, base.name);
      base.nomeExibicao = firstText(base.nomeExibicao, base.name);
      base.tipoOrgao = firstText(base.tipoOrgao, base.segment);
    }
    return cleanObject(base);
  }

  function fromBase44(entityName, row = {}, context = {}) {
    const collectionKey = collectionKeyForBase44(entityName);
    const mapper = base44Mappers[entityName];
    if (!mapper) {
      return cleanObject({
        id: text(row.id) || undefined,
        ...row,
        ...normalizedScope(row, context),
        source: base44Source(entityName, row),
      });
    }
    return cleanObject({
      ...mapper(row, context),
      source: base44Source(entityName, row),
      sourceCollection: collectionKey,
    });
  }

  function contractStatus(status) {
    return statusMaps.contract[text(status).toLowerCase()] || "green";
  }

  function renewalEmailStatus(status) {
    return statusMaps.renewalResult[text(status).toLowerCase()] || "pending";
  }

  const base44Mappers = {
    GrupoEmpresa(row) {
      return {
        id: text(row.slug) || text(row.id),
        base44Id: text(row.id),
        name: text(row.nome),
        slug: text(row.slug),
        description: text(row.descricao),
        responsibleName: text(row.responsavel),
        contactEmail: email(row.email_contato),
        phone: text(row.telefone),
        address: text(row.endereco),
        subscriptionStatus: text(row.status_assinatura) || "Trial",
        status: text(row.status) || "Ativo",
        planId: text(row.plano_id),
        branding: {
          logoUrl: text(row.logo_url),
          primaryColor: text(row.cor_primaria) || "#305FB0",
          navyColor: "#102139",
        },
        loginCustomization: {
          productName: text(row.app_title) || "GestãoGOV!",
          title: firstText(row.login_titulo, row.nome),
          subtitle: text(row.login_subtitulo),
          note: text(row.login_slogan || row.login_rodape_custom),
        },
      };
    },
    Empresa(row, context) {
      return {
        id: text(row.id) || undefined,
        ...normalizedScope(row, context),
        name: text(row.razao_social),
        cnpj: text(row.cnpj),
        email: email(row.email),
        phone: text(row.telefone),
        address: text(row.endereco),
        manager: text(row.responsavel),
        logoUrl: text(row.logo_url),
        stampUrl: text(row.carimbo_url),
        portfolio: text(row.plano),
        subscriptionStatus: text(row.status_assinatura),
        status: row.status_assinatura === "Bloqueada" || row.status_assinatura === "Cancelada" ? "red" : "green",
      };
    },
    User(row, context) {
      return {
        id: text(row.id) || undefined,
        ...normalizedScope(row, context),
        name: firstText(row.full_name, row.name, row.email),
        email: email(row.email),
        role: text(row.role) || "UsuarioEmpresa",
        companyId: text(row.empresa_id),
        groupId: text(row.grupo_id),
        linkedCompanies: row.empresas_vinculadas || [],
        allowedModules: row.modulos_permitidos || [],
        phone: text(row.telefone),
        assignedRegions: row.regioes_atribuidas || [],
        status: row.ativo === false ? "red" : "green",
      };
    },
    PerfilConsultor(row, context) {
      return {
        id: text(row.id) || email(row.consultor_email) || undefined,
        ...normalizedScope(row, context),
        name: text(row.nome),
        email: email(row.consultor_email),
        contactEmail: email(row.email_contato),
        phone: text(row.telefone),
        photoUrl: text(row.foto_url),
        role: text(row.cargo) || "Consultor",
        homeCity: text(row.municipio_residencia),
        status: "green",
      };
    },
    ClienteInfo(row, context) {
      const displayName = firstText(row.nome_exibicao, row.orgao_original);
      return {
        id: text(row.id) || undefined,
        ...normalizedScope(row, context),
        name: displayName,
        originalName: text(row.orgao_original),
        municipality: text(row.municipio),
        city: text(row.municipio),
        website: text(row.dominio),
        segment: text(row.tipo_orgao),
        agencyType: text(row.tipo_orgao),
        region: text(row.regiao),
        contacts: row.contatos || [],
        contact: firstText((row.contatos || [])[0]?.nome, ""),
        phone: firstText(...(row.contatos || []).filter((item) => /tel/i.test(text(item.tipo))).map((item) => item.valor)),
        email: firstText(...(row.contatos || []).filter((item) => /mail/i.test(text(item.tipo))).map((item) => item.valor)),
        status: "green",
        notes: text(row.observacoes),
      };
    },
    Contrato(row, context) {
      return {
        id: text(row.id) || undefined,
        ...normalizedScope(row, context),
        name: text(row.numero_contrato),
        numeroContrato: text(row.numero_contrato),
        client: text(row.orgao_contratante),
        agency: text(row.orgao_contratante),
        orgaoContratante: text(row.orgao_contratante),
        agencyType: text(row.tipo_orgao),
        region: text(row.regiao),
        object: text(row.objeto),
        monthly: number(row.valor_mensal, 0),
        value: number(row.valor_total, 0),
        start: date(row.data_inicio),
        end: date(row.data_fim),
        renewal: date(row.data_renovacao),
        adjustment: text(row.indice_reajuste),
        adjustmentPercent: number(row.percentual_reajuste, 0),
        status: contractStatus(row.status),
        statusText: text(row.status),
        renewalResult: text(row.resultado_renovacao),
        originalContractId: text(row.contrato_aditivo_de),
        isAddendum: bool(row.eh_aditivo, false),
        addendumNumber: text(row.numero_aditivo),
        consultantEmail: email(row.consultor_responsavel),
        fileUrl: text(row.arquivo_contrato),
        documentUrl: text(row.arquivo_contrato),
        legalBasis: text(row.fundamento_legal),
        legalRegime: /8\.666|8666/.test(text(row.fundamento_legal)) ? "Lei 8.666/1993" : "Lei 14.133/2021",
        termText: text(row.vigencia_prazo),
        prorrogable: bool(row.prorrogavel, true) ? "Sim" : "Nao",
        implementationCommissionPercent: number(row.pct_comissao_implantacao, 0),
        licensingCommissionPercent: number(row.pct_comissao_licenciamento, 0),
        contractItems: row.itens_contrato || [],
        notes: text(row.observacoes),
      };
    },
    CartaRenovacao(row, context) {
      return {
        id: text(row.id) || undefined,
        ...normalizedScope(row, context),
        contractId: text(row.contrato_id),
        type: text(row.tipo),
        sentAt: date(row.data_envio),
        recipient: text(row.destinatario),
        recipientRole: text(row.cargo_destinatario),
        currentValue: number(row.valor_atual, 0),
        adjustedValue: number(row.valor_reajustado, 0),
        appliedPercent: number(row.percentual_aplicado, 0),
        appliedIndex: text(row.indice_aplicado),
        letterDraft: text(row.conteudo_carta),
        attachments: row.documentos_anexos || [],
        status: text(row.status) || "Rascunho",
        emailStatus: renewalEmailStatus(row.status),
        consultantEmail: email(row.consultor_responsavel),
        consultantName: text(row.nome_consultor),
        responseAt: date(row.data_resposta),
        responseNotes: text(row.observacoes_resposta),
      };
    },
    PlanilhaRenovacao(row, context) {
      return {
        id: text(row.id) || undefined,
        ...normalizedScope(row, context),
        referenceMonth: text(row.mes_referencia),
        fileUrl: text(row.arquivo_url),
        importedAt: date(row.data_importacao),
        consultantEmail: email(row.consultor_responsavel),
        extractedRows: row.dados_extraidos || [],
      };
    },
    ProcessoLicitacao(row, context) {
      return {
        id: text(row.id) || undefined,
        ...normalizedScope(row, context),
        name: text(row.numero_processo),
        processNumber: text(row.numero_processo),
        agency: text(row.orgao),
        object: text(row.objeto),
        modality: text(row.modalidade),
        value: number(row.valor_estimado, 0),
        openingDate: date(row.data_abertura),
        openingTime: text(row.hora_abertura),
        deadline: date(row.data_limite_proposta || row.data_abertura),
        stage: text(row.status) || "Aguardando Edital",
        status: row.status === "Vencido" || row.status === "Perdido" ? "red" : "cyan",
        source: text(row.link_edital),
        platform: text(row.plataforma_licitation),
        fileUrl: text(row.arquivo_edital),
        aiAnalysis: text(row.analise_edital),
        requirements: text(row.requisitos_edital),
        extractedNotice: row.dados_edital_extraidos || {},
        checklist: {
          proposal: bool(row.checklist_proposta, false),
          documents: bool(row.checklist_documentacao, false),
          certificates: bool(row.checklist_atestados, false),
          declarations: bool(row.checklist_declaracoes, false),
        },
        generatedDeclarations: row.declaracoes_geradas || [],
        processFiles: row.arquivos_processo || [],
        proposalItems: row.itens_proposta || [],
        consultantEmail: email(row.consultor_responsavel),
        notes: text(row.observacoes),
      };
    },
    PropostaComercial(row, context) {
      return {
        id: text(row.id) || undefined,
        ...normalizedScope(row, context),
        name: text(row.numero_proposta),
        proposalNumber: text(row.numero_proposta),
        client: text(row.cliente),
        attentionTo: text(row.atencao_de),
        estimatedPopulation: number(row.populacao_estimada, 0),
        services: row.servicos || [],
        activationValue: number(row.valor_total_ativacao, 0),
        monthlyValue: number(row.valor_total_mensal, 0),
        value: number(row.valor_total_contrato, 0),
        validUntil: date(row.validade_proposta),
        htmlContent: text(row.conteudo_html),
        includeConsultantQrCode: bool(row.incluir_qrcode_consultor, true),
        status: text(row.status) || "Rascunho",
        sentAt: date(row.data_envio),
        consultantEmail: email(row.consultor_responsavel),
        notes: text(row.observacoes),
      };
    },
    Regiao(row, context) {
      return {
        id: text(row.id) || undefined,
        ...normalizedScope(row, context),
        name: text(row.nome),
        state: text(row.estado),
        color: text(row.cor) || "#305FB0",
        owner: email(row.consultor_responsavel),
        municipalities: row.municipios || [],
        status: "green",
        notes: text(row.observacoes),
      };
    },
    GrupoUsuario(row, context) {
      return {
        id: text(row.id) || undefined,
        ...normalizedScope(row, context),
        name: text(row.nome),
        description: text(row.descricao),
        defaultRole: text(row.cargo_padrao),
        allowedModules: row.modulos_permitidos || [],
        specificPermissions: row.permissoes_especificas || [],
        status: row.ativo === false ? "red" : "green",
      };
    },
    Comissao(row, context) {
      return {
        id: text(row.id) || undefined,
        ...normalizedScope(row, context),
        contractId: text(row.contrato_id),
        client: text(row.cliente),
        type: text(row.tipo_comissao),
        referenceMonth: text(row.mes_referencia),
        baseValue: number(row.valor_base, 0),
        percentage: number(row.percentual, 0),
        value: number(row.valor_comissao, 0),
        paidAt: date(row.data_pagamento),
        status: row.status === "Pago" ? "green" : row.status === "Inadimplente" ? "red" : "yellow",
        reportFileUrl: text(row.arquivo_relatorio),
        consultantEmail: email(row.consultor_responsavel),
        notes: text(row.observacoes),
      };
    },
  };

  window.GestaoGovDataModel = {
    version: SaaS_VERSION,
    collectionDefinitions,
    base44Aliases,
    snapshotCollections,
    statusMaps,
    collectionName,
    snapshotKey,
    collectionKeyForBase44,
    normalizeSnapshotRecord,
    fromBase44,
    normalizedScope,
    cleanObject,
  };
})();
