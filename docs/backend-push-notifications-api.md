# API — Notificações Push (Expo MultiMix Site)

**Para:** Time de Backend
**De:** Time de Frontend
**Contexto:** O site já tem toda a parte de captura de push pronta e ativa (Firebase Cloud Messaging), reaproveitando um projeto Firebase que já existia (`expo-mm-site`) e que já é usado hoje para o login do `/admin`. Falta só o backend guardar o token e, depois, disparar a notificação a partir do painel de campanhas (`credenciamento-frontend` → `/marketing`).

Isso é a continuação de um trabalho que já tinha sido iniciado e pausado (commit `7330ff5` do frontend, depois revertido para stub no commit `deca5e2` esperando exatamente esses endpoints).

---

## 1. O que já existe e está funcionando

- Projeto Firebase real, já configurado: `expo-mm-site` (mesmo projeto do Google Auth do `/admin`).
- `src/lib/firebase.ts` inicializa Firebase Messaging no navegador.
- `public/firebase-messaging-sw.js` — service worker que recebe push em background.
- `src/components/ConsentBanner.tsx` — ao aceitar o banner de privacidade, o visitante já é convidado a permitir notificações do navegador.
- `src/hooks/useNotifications.ts` — ao permitir, pega o token FCM do navegador e chama `src/lib/pushApi.ts` → `registerPushToken(token)`.

**O que falta:** `registerPushToken` já está chamando `POST /push/subscribe`, mas esse endpoint não existe ainda — a chamada falha silenciosamente (só loga um aviso no console) até o backend subir.

---

## 2. Novo endpoint — `POST /push/subscribe`

Chamado pelo site público (`expomultimix.com.br`) sempre que um visitante permite notificações no navegador. **Sem autenticação** — é um visitante anônimo, não um admin logado.

**Request:**
```json
{
  "token": "eyJhbGciOiJSU..."
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `token` | string | sim | Token FCM do navegador do visitante, gerado pelo Firebase Messaging |

**Response esperada:**
- `201 Created` (ou `200 OK`) em caso de sucesso — corpo livre, o frontend não lê o retorno hoje.
- Qualquer status de erro é tolerado pelo frontend (fica só no console, não quebra a página) — mas o ideal é `400` para token ausente/vazio.

**Comportamento esperado no backend:**
- Guardar o token numa tabela (ex.: `push_subscriptions`), com dedupe por `token` (o mesmo navegador pode chamar de novo — não deve duplicar).
- Não é necessário vincular a um visitante/CNPJ específico — é anônimo por natureza (browser push, não é a mesma pessoa que se credencia).
- Guardar `createdAt` para poder limpar tokens muito antigos/inativos depois.

---

## 3. Novo endpoint — disparo de notificação (usado pelo `credenciamento-frontend`, não pelo site público)

Sugestão de contrato — ajustar o nome/rota conforme o padrão que o backend já usa para `/emails/marketing/send` e `/whatsapp/campaigns/send`:

```
POST /push/send
```

**Autenticação:** igual aos outros endpoints administrativos (`JWT-auth`, Bearer token) — só admin logado dispara.

**Request sugerido (mesma lógica do envio de email/WhatsApp que já existe):**
```json
{
  "title": "Últimos dias para garantir seu stand!",
  "body": "A Expo MultiMix 2026 está chegando. Fale com a gente e garanta sua vaga.",
  "url": "https://www.expomultimix.com.br/quero-expor"
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `title` | string | sim | Título da notificação |
| `body` | string | sim | Corpo/texto da notificação |
| `url` | string | não | Para onde o clique na notificação deve levar. Se omitido, abre `https://www.expomultimix.com.br` |

**Implementação — server-side, com Firebase Admin SDK:**
1. Gerar uma **service account key** do mesmo projeto Firebase `expo-mm-site` (Console do Firebase → Configurações do Projeto → Contas de Serviço → Gerar nova chave privada). É uma chave nova, específica de servidor — nunca reaproveitar a `NEXT_PUBLIC_FIREBASE_*` do frontend, que é pública por design.
2. `npm install firebase-admin` no backend.
3. Buscar todos os tokens salvos em `push_subscriptions` e enviar em lote com `admin.messaging().sendEachForMulticast({ tokens, notification: { title, body }, webpush: { fcmOptions: { link: url } } })`.
4. **Limpeza de tokens inválidos:** quando o envio para um token retornar erro `messaging/registration-token-not-registered` ou `messaging/invalid-registration-token`, apagar esse token da tabela — navegadores que desinstalaram o app/limparam dados invalidam o token permanentemente, e reenviar pra eles sempre vai falhar.

**Response sugerida:**
```json
{
  "sent": 812,
  "failed": 3
}
```

---

## 4. Segmentação (opcional, v2)

Hoje o frontend manda só `{ token }` — sem cidade ou feira associada, então o v1 do disparo é sempre "todo mundo que já permitiu notificação". Se no futuro quiserem segmentar por cidade (Belém vs. Manaus) como já existe no envio de email, o frontend precisa ser ajustado para mandar um campo `city` opcional junto do token (ex.: baseado na página em que o visitante estava, ou na cidade detectada) — **isso ainda não está implementado**, avisar o frontend antes de depender disso.

---

## 5. Ordem de prioridade de entrega

| Prioridade | Entrega |
|---|---|
| 🔴 P0 — Bloqueante | `POST /push/subscribe` — sem isso, nenhum token é capturado e não há pra quem mandar depois |
| 🟠 P1 — Alta | `POST /push/send` com Firebase Admin SDK (service account da própria `expo-mm-site`) |
| 🟢 P2 — Baixa | Segmentação por cidade/feira (seção 4) |

> **P0 desbloqueia tudo.** Assim que `POST /push/subscribe` existir, o site (que já está no ar com esse código) começa a acumular tokens sozinho, sem precisar de novo deploy do frontend.

---

## 6. Resumo do que muda no backend

| O que fazer | Onde | Urgência |
|---|---|---|
| Criar tabela `push_subscriptions` (`token`, `createdAt`) | Banco | 🔴 Imediato |
| Novo endpoint `POST /push/subscribe` (público, sem auth) | API REST | 🔴 Imediato |
| Gerar service account key do projeto Firebase `expo-mm-site` | Firebase Console | 🟠 Alta |
| Novo endpoint `POST /push/send` (JWT-auth, usa Firebase Admin SDK) | API REST | 🟠 Alta |
| Limpar token da tabela quando o envio retornar `registration-token-not-registered` | API REST | 🟠 Alta |
| Campo opcional `city` no subscribe, pra segmentação futura | API REST + Frontend | 🟢 Baixa |

**Dúvidas:** abrir issue no repositório ou contato direto com o frontend.
