# GestãoGOV! - Deploy com GitHub e Firebase

Esta pasta e a base pronta para transformar o GestãoGOV! em um sistema online.

## O que ja esta preparado

- Firebase Hosting para publicar o sistema.
- Firebase Authentication com e-mail e senha.
- Cloud Firestore para salvar os dados da operacao.
- Cloud Storage para anexos do modulo Entrega de Documentos.
- Regras de seguranca para separar dados por empresa/tenant.
- GitHub Actions para publicar automaticamente no Firebase Hosting.
- Estrutura SaaS multi-tenant em `tenants/{tenantId}`.
- Provisionamento de novos grupos em `provisionar.html`.
- Colecoes normalizadas por tenant para evoluir alem do snapshot inicial.
- Snapshot legado mantido apenas como compatibilidade/migracao.

## 1. Criar o projeto no Firebase

1. Acesse o Firebase Console.
2. Crie um projeto, por exemplo `vendegov-crm`.
3. Ative Authentication com o metodo E-mail/senha.
4. Crie o Cloud Firestore.
5. Ative Cloud Storage.
6. Ative Firebase Hosting.
7. Adicione um app Web no projeto e copie o objeto `firebaseConfig`.

## 2. Configurar o sistema

Abra `firebase-config.js` e troque os valores de exemplo pelos dados do Firebase:

```js
window.VENDEGOV_FIREBASE_CONFIG = {
  enabled: true,
  tenantId: "computeck-demo",
  allowSignup: false,
  fallbackLocal: true,
  firebase: {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    projectId: "SEU_PROJETO",
    storageBucket: "SEU_PROJETO.firebasestorage.app",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID",
  },
};
```

Tambem troque o projeto em `.firebaserc` e nos arquivos de `.github/workflows` se o ID nao for `vendegov-crm`.

## 3. Criar o primeiro administrador

No Firebase Authentication:

1. Crie o primeiro usuario administrador.
2. Copie o UID desse usuario.

No Cloud Firestore, crie:

- Colecao: `tenants`
- Documento: `computeck-demo`
- Campos sugeridos:
  - `name`: `Computeck`
  - `active`: `true`

Dentro desse documento, crie a subcolecao:

- Subcolecao: `members`
- Documento: o UID do usuario criado
- Campos:
  - `name`: nome do usuario
  - `email`: e-mail do usuario
  - `role`: `admin`
  - `active`: `true`

Sem esse membro, as regras de seguranca bloqueiam o acesso aos dados da empresa.

## 4. Publicar pelo Firebase direto

Com o Firebase CLI instalado e logado:

```bash
firebase login
firebase use vendegov-crm
firebase deploy
```

Ao final, o Firebase gera URLs parecidas com:

- `https://vendegov-crm.web.app`
- `https://vendegov-crm.firebaseapp.com`

## 5. Subir para o GitHub

1. Crie um repositorio no GitHub.
2. Envie esta pasta para o repositorio.
3. No terminal, dentro da pasta, rode:

```bash
firebase init hosting:github
```

Esse comando cria a conta de servico, grava o segredo no GitHub e configura a publicacao automatica.

Os arquivos de workflow ja estao em `.github/workflows`. Eles usam este segredo:

```text
FIREBASE_SERVICE_ACCOUNT_VENDEGOV_CRM
```

Se o Firebase criar outro nome de segredo, ajuste os workflows.

## Modelo SaaS multi-tenant

O GestãoGOV! usa tenants por grupo de empresas. Cada cliente/grupo acessa uma URL com identificador proprio:

```text
https://SEU_DOMINIO/?tenant=grupo-actcon
```

O superadmin `steven.passos@computeck.com.br` pode criar novos tenants pela tela:

```text
https://SEU_DOMINIO/provisionar.html
```

A tela de provisionamento cria:

- grupo/tenant;
- plano contratado e limites de usuarios/empresas;
- identidade visual e tela de login;
- primeira empresa interna;
- usuario administrador do grupo;
- snapshot inicial;
- colecoes SaaS normalizadas.

## Colecoes por tenant

O sistema ainda mantem `tenants/{tenantId}/snapshots/main` para compatibilidade, mas a evolucao principal esta em colecoes:

- clientes
- licitacoes
- propostas
- contratos
- documentos
- renovacoes
- comissoes
- auditoria

Para ativar em um tenant existente, entre como administrador e execute:

```text
Parametros > Importacao > Migrar para colecoes SaaS
```

Depois da migracao, os registros passam a carregar de `tenants/{tenantId}/{colecao}/{registroId}` quando `dataMode` estiver como `collections`.
