# Inventario Base44 -> GestãoGOV!

Data: 2026-08-30  
App Base44 analisado: `Gestor de Contratos Publicos` (`698b6feebebc4ef347551478`)  
Sistema destino: GestãoGOV! no Firebase (`vendegov-crm-computeck`)

## Observacao importante

O acesso aos modelos de dados e a amostras da base Base44 esta disponivel. O acesso ao codigo-fonte/sandbox da app Base44 esta bloqueado pelo plano atual do Base44, com retorno `PREMIUM_REQUIRED`. Por isso este inventario compara modelo de dados, regras e funcionalidades observadas, mas ainda nao replica codigo interno/telas reais da app Base44 linha por linha.

## O que ja existe no GestãoGOV!

- Deploy em Firebase Hosting com GitHub Actions.
- Firebase Authentication ativo.
- Estrutura inicial multi-tenant em `tenants/{tenantId}`.
- URL por tenant via query/path (`tenant`, `grupo`, `/t/...`, `/grupo/...`).
- Tela `provisionar.html` para superadmin criar ambientes.
- Planos basico/intermediario/enterprise/custom no adaptador Firebase.
- Configuracao publica de tenant para logo, cores e tela de login.
- Firestore rules com superadmin `steven.passos@computeck.com.br`.
- Storage rules por tenant.
- Snapshot principal por tenant em `tenants/{tenantId}/snapshots/main`.
- Upload de arquivos no Storage por tenant/modulo/registro.
- Cadastro de usuarios com foto.
- Cadastro de empresas internas com upload de logo/timbre.
- Parametros com abas de empresas, importacao, IA, regioes, documentos, sistema, usuarios, grupos, templates e auditoria.
- Importacao centralizada de JSON, contratos CSV, clientes CSV e consultores CSV.
- Cadastro de contrato em pagina dedicada `NovoContratoPage`.
- Criacao automatica/relacionamento basico de cliente ao cadastrar/importar contrato.
- Campos principais de contrato: numero, cliente, orgao, empresa responsavel, objeto, fundamento, regime legal, natureza, prorrogacao, prazo legal, alertas, valores, datas, reajuste, PDF, responsavel e observacoes.
- Modulo de renovacoes com contratos a vencer, cartas, status de envio e acoes manuais.
- Geracao, visualizacao, edicao, PDF e fila de envio de carta de renovacao.
- Dashboard com KPIs, notificacoes, graficos e proximos vencimentos.
- Visao de cliente com contratos, produtos, cartas, propostas, licitacoes e diagnostico IA.
- Restricao visual para consultor ver apenas dados vinculados ao seu usuario.
- Painel de IA em Parametros com provedores configuraveis.
- Inicio de integracao direta com Mistral e Gemini no navegador.
- Marca visual atualizada para GestãoGOV!.

## Limite tecnico atual

Hoje a maior parte dos dados do GestãoGOV! fica dentro de um unico documento de snapshot (`db`). Isso e pratico para MVP, mas nao e suficiente para escalar o sistema como SaaS multi-tenant completo. Para chegar ao nivel do Base44, precisamos migrar para colecoes normalizadas por entidade dentro do tenant:

`tenants/{tenantId}/{colecao}/{registroId}`

Isso permite:

- regras por registro;
- filtros reais por consultor;
- consultas e dashboards mais rapidos;
- importacao incremental;
- auditoria robusta;
- rotinas agendadas;
- limites por plano;
- integracao com IA e email sem salvar tudo em um unico documento.

## Entidades Base44 identificadas

O Base44 informou 31 schemas no total. Foram identificados nominalmente estes modelos principais:

- `GrupoEmpresa`
- `Empresa`
- `User`
- `Plano`
- `GrupoUsuario`
- `PerfilConsultor`
- `Regiao`
- `ClienteInfo`
- `Contrato`
- `CartaRenovacao`
- `PlanilhaRenovacao`
- `ProcessoLicitacao`
- `PropostaComercial`
- `TemplateProposta`
- `EntregaDocumento`
- `DocumentoEmpresa`
- `DocumentoImportante`
- `CND`
- `Atestado`
- `TermoReferencia`
- `ModeloDocumento`
- `GrupoServico`
- `Compromisso`
- `RoteiroViagem`
- `Comissao`
- `ConfiguracaoSMTP`
- `LogAuditoria`

Restam ate 4 schemas menores ainda nao identificados nominalmente porque o sandbox/codigo Base44 esta bloqueado pelo plano Builder. Eles nao impedem a implementacao do nucleo do sistema.

## Comparativo por modulo

| Area Base44 | Existe no GestãoGOV! | Situacao | O que falta |
| --- | --- | --- | --- |
| GrupoEmpresa / Tenant | Parcial | Em andamento | transformar provisionamento em cadastro completo de grupo, assinatura, slug, tema, login, limites e status |
| Empresa | Parcial | Em andamento | separar empresas internas do grupo, aplicar limites de plano, logo/timbre por empresa e vinculo nos contratos |
| User | Parcial | Em andamento | criar usuario administrador pelo provisionamento e sincronizar perfil/claims/permissoes |
| Plano | Parcial | Em andamento | tela de planos, limites reais por quantidade de usuarios/empresas/contratos/documentos |
| GrupoUsuario | Parcial | Em andamento | permissoes granulares por modulo e funcao |
| PerfilConsultor | Parcial | Falta consolidar | perfil separado do usuario, foto, cidade base, regioes atribuidas, dados comerciais |
| Regiao | Parcial | Simples | mapa/lista de municipios, cor, estado, consultor responsavel |
| ClienteInfo | Parcial | Simples | contatos multiplos, dominio, municipio, orgao original, tipo/regiao normalizados |
| Contrato | Parcial | Prioritario | aditivos como relacao real, itens de contrato, comissoes por implantacao/licenciamento, status e resultado no padrao Base44 |
| CartaRenovacao | Parcial | Prioritario | entidade propria, anexos selecionados, resposta do orgao, status Aceita/Recusada/Respondida |
| PlanilhaRenovacao | Parcial | Basico | historico de planilhas importadas e dados extraidos preservados |
| ProcessoLicitacao | Parcial | Muito simples | edital, IA de analise, checklist, declaracoes, itens de proposta e arquivos do processo |
| PropostaComercial | Parcial | Muito simples | servicos, ativacao, mensalidade, contrato total, HTML da proposta, QR code consultor |
| TemplateProposta | Parcial | Simples | secoes estruturadas de proposta, por empresa/grupo |
| EntregaDocumento | Parcial | Simples | fluxo Solicitado/Cotado/Aguardando CT/Entregue vinculado a compromisso/contrato |
| DocumentoEmpresa | Parcial | Falta | pasta documental da empresa com validade, socios/procuradores e tipos legais |
| CND | Parcial | Falta entidade propria | certidoes por tipo, validade, status e alertas |
| Atestado | Parcial | Falta entidade propria | cadastro completo com dados extraidos por IA |
| DocumentoImportante | Parcial | Simples | dados extraidos por IA e classificacao de TR/ETP/DFD/Edital |
| TermoReferencia | Nao | Faltando | gerador/cadastro de TR com secoes, tabela de itens e grupos de servico |
| ModeloDocumento | Nao | Faltando | upload de modelos, extracao por IA e reaproveitamento no TR |
| GrupoServico | Nao | Faltando | catalogo de servicos/modulos/funcionalidades para propostas e TR |
| Compromisso | Parcial | Simples | data/hora completa, geolocalizacao, resultado de prospeccao e roteiro |
| RoteiroViagem | Nao | Faltando | planejamento de viagens, origem, periodo, status e feedback |
| Comissao | Parcial | Simples | separar implantacao/licenciamento, mes referencia, relatorio financeiro e RLS por consultor |
| ConfiguracaoSMTP | Nao | Faltando | envio real por SMTP ou provedor transacional, com credenciais seguras |
| LogAuditoria | Parcial | Local | transformar auditoria em colecao real por tenant |

## Ordem recomendada de implementacao

### Fase 1 - Fundacao de dados e seguranca

1. Migrar o modelo de snapshot unico para colecoes por tenant.
2. Criar camada de compatibilidade para ler dados antigos e gravar no novo formato.
3. Implementar regras Firestore por `grupo_empresa_id`, `empresa_id`, `consultor_responsavel` e papel do usuario.
4. Criar auditoria real em `tenants/{tenantId}/logs`.
5. Garantir que consultor nao veja dados de outros consultores no servidor, nao apenas na interface.

### Fase 2 - Multi-tenant comercial

1. Finalizar `GrupoEmpresa` como tenant principal.
2. Finalizar `Empresa` como empresas internas do grupo.
3. Finalizar `Plano` com limites de usuarios, empresas, contratos, documentos e armazenamento.
4. Finalizar tela de provisionamento: grupo, plano, cores, login, logomarca e usuario admin.
5. Criar validacoes de limite por plano antes de salvar registros.

### Fase 3 - Carteira, contratos e renovacoes

1. Normalizar `ClienteInfo`, `Contrato`, `CartaRenovacao` e `PlanilhaRenovacao`.
2. Fazer cadastro de contrato criar ou relacionar cliente automaticamente.
3. Implementar aditivos e historico como dados relacionais.
4. Aplicar regras de vigencia conforme Lei 14.133/2021 e Lei 8.666/1993.
5. Manter alertas de 60, 45, 30 e 15 dias.
6. Aos 15 dias sem acompanhamento, gerar carta e colocar envio em fila.

### Fase 4 - IA e documentos

1. Finalizar hub de IA com Mistral, Gemini e endpoint personalizado.
2. Padronizar prompt de extracao de contrato.
3. Salvar PDF, texto extraido, JSON bruto e campos aprovados.
4. Criar leitura de edital, documentos importantes, CNDs, atestados e modelos.
5. Criar revisao humana obrigatoria antes de gravar dados sensiveis extraidos por IA.

### Fase 5 - Licitacoes e propostas

1. Evoluir `ProcessoLicitacao` com edital, checklist, arquivos, requisitos e pontos de atencao.
2. Criar geracao de proposta comercial com servicos, ativacao, mensalidade e HTML/PDF.
3. Criar catalogo `GrupoServico`.
4. Criar templates de proposta por empresa/grupo.
5. Gerar declaracoes e anexos do processo.

### Fase 6 - Documentos, CNDs e atestados

1. Criar pasta documental por empresa.
2. Criar entidades proprias para `DocumentoEmpresa`, `CND` e `Atestado`.
3. Criar alertas de validade de CNDs.
4. Permitir anexar documentos automaticamente nas cartas e propostas.

### Fase 7 - Agenda, viagens e comercial

1. Evoluir `Compromisso`.
2. Criar `RoteiroViagem`.
3. Ligar regioes/municipios ao consultor.
4. Criar acompanhamento de prospeccao por resultado.

### Fase 8 - Financeiro, comissoes e dashboard

1. Normalizar `Comissao`.
2. Calcular implantacao/licenciamento por contrato.
3. Criar metas de renovacao por mes.
4. Atualizar dashboards com dados das novas colecoes.
5. Criar notificacoes persistentes por usuario.

## Backlog imediato recomendado

1. Criar `data-model.js` com definicoes de colecoes e mapeamento Base44 -> GestãoGOV!.
2. Criar adaptador Firebase com `listRecords`, `createRecord`, `updateRecord`, `deleteRecord` por colecao.
3. Migrar primeiro `clientes`, `empresas`, `usuarios`, `contratos` e `renovacoes`.
4. Ajustar regras Firestore para colecoes normalizadas.
5. Criar rotina de migracao do snapshot atual para colecoes.
6. So depois migrar licitacoes, propostas, documentos, CND, atestados, agenda, comissoes e TR.

## Modelo de dados alvo no Firebase

Estrutura recomendada:

```text
tenants/{tenantId}
tenants/{tenantId}/public/config
tenants/{tenantId}/members/{uid}
tenants/{tenantId}/clientes/{clienteId}
tenants/{tenantId}/empresas/{empresaId}
tenants/{tenantId}/usuarios/{usuarioId}
tenants/{tenantId}/contratos/{contratoId}
tenants/{tenantId}/contratos/{contratoId}/aditivos/{aditivoId}
tenants/{tenantId}/renovacoes/{renovacaoId}
tenants/{tenantId}/cartasRenovacao/{cartaId}
tenants/{tenantId}/planilhasRenovacao/{planilhaId}
tenants/{tenantId}/licitacoes/{processoId}
tenants/{tenantId}/propostas/{propostaId}
tenants/{tenantId}/documentosEmpresa/{documentoId}
tenants/{tenantId}/cnds/{cndId}
tenants/{tenantId}/atestados/{atestadoId}
tenants/{tenantId}/documentosImportantes/{documentoId}
tenants/{tenantId}/modelosDocumento/{modeloId}
tenants/{tenantId}/termosReferencia/{termoId}
tenants/{tenantId}/gruposServico/{grupoServicoId}
tenants/{tenantId}/agenda/{compromissoId}
tenants/{tenantId}/roteirosViagem/{roteiroId}
tenants/{tenantId}/comissoes/{comissaoId}
tenants/{tenantId}/notificacoes/{notificacaoId}
tenants/{tenantId}/outbox/{mensagemId}
tenants/{tenantId}/logs/{logId}
```

Colecoes globais restritas ao superadmin:

```text
platform/plans/items/{planId}
platform/tenants/index/{tenantId}
platform/audit/{logId}
```

## Mapeamento de campos prioritarios

### GrupoEmpresa -> Tenant

| Base44 | GestãoGOV! atual | Acao |
| --- | --- | --- |
| `nome` | `tenants/{tenantId}.name` | manter |
| `slug` | `tenantId` / URL | manter como chave amigavel |
| `descricao` | nao estruturado | criar |
| `responsavel` | parcialmente no provisionamento | criar campo oficial |
| `email_contato` | parcialmente no provisionamento | criar campo oficial |
| `telefone` | nao estruturado | criar |
| `logo_url` | `branding.logoUrl` | manter |
| `app_title` | `loginCustomization.productName` | mapear |
| `cor_primaria` | `branding.primaryColor` | manter |
| `login_titulo` | `loginCustomization.title` | manter |
| `login_subtitulo` | `loginCustomization.subtitle` | manter |
| `login_slogan` | `loginCustomization.note` | manter |
| `plano_id` | `plan.id` | manter |
| `status_assinatura` | `subscriptionStatus` | criar |
| `status` | `status` | manter |

### Empresa -> Empresa interna do grupo

| Base44 | GestãoGOV! atual | Acao |
| --- | --- | --- |
| `razao_social` | `empresas.name` | mapear |
| `cnpj` | `empresas.cnpj` | manter |
| `grupo_empresa_id` | tenant atual | manter por path |
| `status_assinatura` | nao estruturado | criar, se cada empresa puder ser bloqueada |
| `plano` | plano no tenant | usar apenas se houver plano por empresa |
| `endereco` | `empresas.address` | manter |
| `telefone` | `empresas.phone` | manter |
| `email` | `empresas.email` | manter |
| `responsavel` | `empresas.manager` | mapear |
| `logo_url` | `empresas.logoUrl` | manter |
| `carimbo_url` | nao existe | criar |
| preferencias visuais por empresa | nao existe | criar depois, se necessario |

### User / PerfilConsultor -> Usuarios

| Base44 | GestãoGOV! atual | Acao |
| --- | --- | --- |
| `role` | `usuarios.role` | padronizar enum: SuperAdmin, AdminGrupo, UsuarioEmpresa |
| `empresa_id` | nao forte | criar |
| `grupo_empresa_id` / `active_grupo_id` | tenant atual | sincronizar no member |
| `empresas_vinculadas` | nao existe | criar |
| `grupo_id` | gruposUsuarios simples | criar relacao real |
| `modulos_permitidos` | gruposUsuarios texto | transformar em array |
| `telefone` | `usuarios.phone` | manter |
| `regioes_atribuidas` | nao existe | criar |
| `consultor_email` | `usuarios.email` | mapear |
| `foto_url` | `usuarios.photoUrl` | manter |
| `municipio_residencia` | nao existe | criar para roteiros |

### ClienteInfo -> Clientes

| Base44 | GestãoGOV! atual | Acao |
| --- | --- | --- |
| `orgao_original` | `clientes.originalName` / `name` | manter como chave de deduplicacao |
| `nome_exibicao` | `clientes.name` | manter |
| `municipio` | `clientes.city` | mapear |
| `dominio` | `clientes.website` | mapear |
| `tipo_orgao` | `clientes.segment` | padronizar enum |
| `regiao` | `clientes.region` | manter |
| `contatos[]` | contato unico | criar lista de contatos |
| `observacoes` | `clientes.notes` | manter |
| `grupo_empresa_id` | tenant atual | manter por path e/ou campo |

### Contrato -> Contratos

| Base44 | GestãoGOV! atual | Acao |
| --- | --- | --- |
| `numero_contrato` | `contratos.name` | manter numero limpo e display separado |
| `empresa_id` | `responsibleCompany` textual | criar `empresaId` e manter nome derivado |
| `orgao_contratante` | `client` / `agency` | separar cliente/orgao comprador |
| `tipo_orgao` | `agencyType` | manter |
| `regiao` | `region` | manter |
| `objeto` | `object` | manter |
| `valor_mensal` | `monthly` | manter |
| `valor_total` | `value` | manter |
| `data_inicio` | `start` | manter |
| `data_fim` | `end` | manter |
| `data_renovacao` | `renewal` | manter |
| `indice_reajuste` | `adjustment` | manter, separar de percentual |
| `percentual_reajuste` | nao existe | criar |
| `status` | `status` com cores | padronizar enum textual + status visual |
| `resultado_renovacao` | renovacoes separado | criar no contrato tambem |
| `contrato_aditivo_de` | nao relacional | criar subcolecao/relacao |
| `eh_aditivo` | nao existe | criar |
| `numero_aditivo` | `addendumNumber` em renovacao | criar no aditivo |
| `arquivo_contrato` | `fileUrl` / `documentUrl` | manter |
| `fundamento_legal` | `legalBasis` | manter |
| `vigencia_prazo` | nao existe | criar |
| `prorrogavel` | `prorrogable` textual | normalizar boolean + justificativa |
| `pct_comissao_implantacao` | nao existe | criar |
| `pct_comissao_licenciamento` | nao existe | criar |
| `itens_contrato[]` | nao existe | criar lista de itens/produtos |
| `consultor_responsavel` | `owner` textual | criar `consultantEmail` |

### CartaRenovacao -> Cartas de renovacao

| Base44 | GestãoGOV! atual | Acao |
| --- | --- | --- |
| `contrato_id` | texto do contrato em renovacoes | criar `contractId` |
| `tipo` | inferido pela carta | criar enum Com reajuste/Sem reajuste |
| `data_envio` | `letterSentAt` | manter |
| `destinatario` | nao estruturado | criar |
| `cargo_destinatario` | nao estruturado | criar |
| `valor_atual` | `value` / `monthly` | criar campos especificos |
| `valor_reajustado` | nao estruturado | criar |
| `percentual_aplicado` | nao estruturado | criar |
| `indice_aplicado` | `adjustment` | mapear |
| `conteudo_carta` | `letterDraft` | manter em entidade propria |
| `documentos_anexos[]` | nao existe | criar |
| `status` | `emailStatus` parcial | padronizar Rascunho/Enviada/Respondida/Aceita/Recusada |
| `data_resposta` | nao existe | criar |
| `observacoes_resposta` | nao existe | criar |

### ProcessoLicitacao -> Licitacoes

| Base44 | GestãoGOV! atual | Acao |
| --- | --- | --- |
| `numero_processo` | `licitacoes.name` | separar numero/display |
| `orgao` | `agency` | manter |
| `objeto` | `object` | manter |
| `modalidade` | `modality` | padronizar enum |
| `valor_estimado` | `value` | manter |
| `data_abertura` | `deadline` parcial | criar campo proprio |
| `hora_abertura` | nao existe | criar |
| `data_limite_proposta` | `deadline` | manter |
| `status` | `stage`/`status` parcial | padronizar pipeline |
| `link_edital` | `source` | mapear |
| `plataforma_licitation` | nao existe | criar |
| `arquivo_edital` | nao existe | criar upload/link |
| `analise_edital` | nao existe | criar |
| `requisitos_edital` | nao existe | criar |
| `dados_edital_extraidos` | nao existe | criar objeto IA |
| checklist e observacoes | parcial | criar checklist real |
| `arquivos_processo[]` | nao existe | criar anexos |
| `declaracoes_geradas[]` | nao existe | criar |
| `itens_proposta[]` | nao existe | criar |

### PropostaComercial -> Propostas

| Base44 | GestãoGOV! atual | Acao |
| --- | --- | --- |
| `numero_proposta` | `propostas.name` | separar numero/display |
| `cliente` | `client` | manter |
| `atencao_de` | nao existe | criar |
| `populacao_estimada` | nao existe | criar |
| `servicos[]` | nao existe | criar itens de proposta |
| `valor_total_ativacao` | nao existe | criar |
| `valor_total_mensal` | nao existe | criar |
| `valor_total_contrato` | `value` | mapear |
| `validade_proposta` | `validUntil` | manter |
| `conteudo_html` | nao existe | criar |
| `incluir_qrcode_consultor` | nao existe | criar |
| `status` | `status` parcial | padronizar enum |
| `consultor_responsavel` | `owner` textual | criar `consultantEmail` |

## Primeiros tickets tecnicos

### Ticket 1 - Criar camada de modelo

Criar `data-model.js` contendo:

- nomes das colecoes;
- aliases Base44;
- campos obrigatorios;
- campos de escopo (`tenantId`, `empresaId`, `consultantEmail`);
- mapeadores de importacao Base44 -> GestãoGOV!;
- enums oficiais.

### Ticket 2 - Adaptador Firestore por colecao

Adicionar em `firebase-adapter.js`:

- `listRecords(collectionKey, filters)`;
- `getRecord(collectionKey, id)`;
- `createRecord(collectionKey, data)`;
- `updateRecord(collectionKey, id, data)`;
- `deleteRecord(collectionKey, id)`;
- `migrateSnapshotToCollections(db)`.

### Ticket 3 - Regras de seguranca por registro

Atualizar `firestore.rules` para:

- superadmin acessar tudo;
- AdminGrupo acessar tudo do tenant;
- UsuarioEmpresa acessar conforme empresas vinculadas;
- Consultor acessar registros com `consultantEmail == request.auth.token.email` ou criados por ele;
- leitura publica apenas em `tenants/{tenantId}/public/config`.

### Ticket 4 - Contratos e clientes normalizados

Migrar primeiro:

- `clientes`;
- `empresas`;
- `usuarios`;
- `contratos`;
- `renovacoes`;
- `cartasRenovacao`.

Essas colecoes sustentam dashboard, renovacoes, IA, PDF e permissao por consultor.

### Ticket 5 - Migracao Base44 inicial

Criar importador para:

- `GrupoEmpresa`;
- `Empresa`;
- `User`;
- `PerfilConsultor`;
- `ClienteInfo`;
- `Contrato`;
- `CartaRenovacao`;
- `PlanilhaRenovacao`.

O importador deve preservar o `id` de origem em `source.base44Id` e salvar o registro original bruto em `source.raw` quando necessario.

## Riscos e decisoes pendentes

- Chaves de IA salvas diretamente na plataforma funcionam, mas ficam expostas a usuarios autorizados que abrem o navegador. Para MVP controlado pode seguir assim; para SaaS comercial, o ideal e migrar para Cloud Functions/Secret Manager.
- Envio real de e-mail nao deve sair apenas do navegador. O correto e `outbox` + funcao backend/SMTP.
- O controle por consultor ja foi iniciado nas colecoes do Firestore, mas o CRUD ainda precisa evoluir para usar colecoes como fonte primaria em todos os fluxos.
- Importar arquivos hospedados no Base44 exige baixar e reenviar para Firebase Storage, ou manter links externos como referencia temporaria.
- Alguns registros antigos do Base44 estao sem `grupo_empresa_id`; sera necessario escolher tenant padrao durante a migracao.
- Os nomes tecnicos antigos `vendegov-crm` ainda aparecem em repo, Firebase project, secrets e arquivos. Podem ser renomeados depois, mas nao devem ser alterados sem planejamento para nao quebrar deploy.

## Decisao tecnica recomendada

Nao vale a pena tentar copiar o Base44 como uma tela estatica. O caminho certo e transformar o GestãoGOV! em um produto SaaS proprio, usando o Base44 como especificacao funcional e fonte de dados. Isso reduz dependencia do Base44, melhora seguranca e deixa a plataforma pronta para vender por tenant/plano.

## Implementado nesta rodada

Data: 2026-08-31

- Criado `data-model.js` como contrato tecnico do SaaS, com definicoes de colecoes, aliases Base44 e mapeadores para as entidades principais.
- `index.html` e `provisionar.html` passaram a carregar o modelo de dados antes do adaptador Firebase.
- `firebase-adapter.js` ganhou CRUD generico por colecao: listar, buscar, criar, atualizar, salvar, excluir e migrar snapshot para colecoes.
- O carregamento do banco agora reconhece `dataMode: "collections"` e pode montar o app a partir de colecoes normalizadas por tenant.
- A tela de provisionamento cria novos tenants ja em modo SaaS, com `dataMode`, `dataModelVersion`, plano, identidade visual, usuario administrador, snapshot inicial e colecoes semeadas.
- Novos tenants passam a ser indexados em `platform/tenants/index/{tenantId}` e os planos em `platform/plans/items/{planId}`, ambos restritos ao superadmin.
- `Parametrizacao > Importacao` ganhou a acao "Migrar para colecoes SaaS" para ativar o novo modelo em tenants existentes.
- Criacao, edicao, exclusao e importacoes principais agora sincronizam snapshot e colecoes SaaS quando executadas por administrador.
- Registros enviados para colecoes recebem `tenantId`, `consultantEmail` e `ownerEmail` sempre que o responsavel pode ser resolvido.
- Notificacoes de renovacao passam a herdar o consultor da renovacao/contrato relacionado.
- `firestore.rules` passou a reconhecer colecoes normalizadas por tenant, com leitura por admin, colecoes compartilhadas e registros vinculados ao usuario; em tenants migrados, snapshot passa a ser protegido para administradores.
- A tela de provisionamento foi renomeada visualmente para GestãoGOV!.

## Proximo bloco recomendado

1. Publicar as regras e arquivos quando aprovado.
2. Entrar como superadmin e executar `Parametros > Importacao > Migrar para colecoes SaaS` no tenant atual.
3. Conferir Firestore em `tenants/{tenantId}/contratos`, `clientes`, `renovacoes`, `usuarios` e `empresas`.
4. Testar login com usuario consultor para validar a visao filtrada.
5. Depois disso, evoluir o CRUD para gravar direto nas colecoes, deixando o snapshot apenas como fallback temporario.
