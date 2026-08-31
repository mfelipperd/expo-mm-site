# API — Notificações Push (Expo MultiMix Site)

**Para:** Time de Backend
**De:** Time de Frontend
**Contexto:** O site captura Web Push subscriptions dos visitantes (API nativa do navegador, **sem Firebase nem nenhum provedor terceiro** — só o padrão W3C Push API + chaves VAPID). Falta o backend guardar a subscription e, depois, disparar a notificação a partir do painel de campanhas (`credenciamento-frontend` → `/push-marketing`).

> Revisão 2026-08-31: a primeira versão deste doc usava Firebase Cloud Messaging. Trocamos para Web Push nativo (biblioteca `web-push`) para não depender de nenhum provedor externo — o contrato dos endpoints é o mesmo em espírito, só o formato da subscription mudou (token FCM → endpoint + chaves).

---

## 1. O que já existe e está funcionando

- `public/sw-push.js` — service worker simples que escuta o evento `push` e mostra a notificação nativa do navegador. Sem SDK nenhum.
- `src/hooks/useNotifications.ts` — ao permitir, registra o service worker, chama `PushManager.subscribe()` e manda a subscription pro backend via `src/lib/pushApi.ts` → `registerPushSubscription()`.
- `src/components/ConsentBanner.tsx` — ao aceitar o banner de privacidade, o visitante já é convidado a permitir notificações.
- Chave pública VAPID já gerada e configurada: `NEXT_PUBLIC_VAPID_PUBLIC_KEY` no `.env.local` do site.

**O que falta:** `registerPushSubscription` já está chamando `POST /push/subscribe`, mas o backend real precisa usar o mesmo par de chaves VAPID pra conseguir enviar depois — ver seção 2.

---

## 2. Chaves VAPID — geradas, não inventar novas

Já geramos o par de chaves com `npx web-push generate-vapid-keys` (biblioteca `web-push`, MIT, sem conta em nenhum serviço):

```
VAPID_SUBJECT=mailto:gerencia@expomultimix.com.br
VAPID_PUBLIC_KEY=BElPaLdMw48WPaVUx3h3CqF9WE0N-ckRI2VKIhuHw6JVm70R0Nq2dYijDc1zt4zYbaX-XAPQ1lzUsd32tvJiWgk
VAPID_PRIVATE_KEY=k_v7INveGPmAbOAXbHkyv1thzCvHy_YSiTwjTQvyEqc
```

**A pública** já está no frontend (`NEXT_PUBLIC_VAPID_PUBLIC_KEY`). **A privada** só existe no backend — nunca deve ir pro frontend nem ser logada. Usar exatamente este par (não gerar um novo — subscriptions já criadas com a chave pública acima só funcionam com a privada correspondente).

---

## 3. Novo endpoint — `POST /push/subscribe`

Chamado pelo site público sempre que um visitante permite notificações. **Sem autenticação** — visitante anônimo.

**Request** (é exatamente o retorno de `PushSubscription.toJSON()` do navegador):
```json
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/xyz123...",
  "keys": {
    "p256dh": "BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls0VJXg7A8u-Ts1XbjhazAkj7I99e8QcYP7DkM",
    "auth": "tBHItJI5svbpez7KI4CCXg"
  }
}
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `endpoint` | string (URL) | sim | URL única do serviço de push do navegador do visitante (Chrome, Firefox, Edge... cada um aponta pra um serviço diferente, mas o formato é sempre uma URL) |
| `keys.p256dh` | string | sim | Chave pública de criptografia da subscription |
| `keys.auth` | string | sim | Segredo de autenticação da subscription |

**Comportamento esperado:**
- Guardar numa tabela `push_subscriptions` (`endpoint`, `p256dh`, `auth`, `createdAt`), com dedupe por `endpoint` — o mesmo navegador pode chamar de novo.
- Não vincula a um visitante/CNPJ — é anônimo por natureza.

**Response:** `201` em sucesso, `400` se faltar `endpoint` ou `keys`.

---

## 4. Novo endpoint — `POST /push/send` (usado pelo `credenciamento-frontend`, não pelo site público)

**Autenticação:** JWT-auth, igual aos outros endpoints administrativos.

**Request:**
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
| `url` | string | não | Pra onde o clique leva. Se omitido, abre `https://www.expomultimix.com.br` |

**Implementação — server-side, com a biblioteca `web-push` (Node, `npm install web-push`):**
```ts
import webpush from "web-push";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

await webpush.sendNotification(
  { endpoint, keys: { p256dh, auth } },
  JSON.stringify({ title, body, url })
);
```

**Limpeza de subscriptions inválidas:** quando `sendNotification` falhar com `statusCode` `404` ou `410`, a subscription está morta (navegador desinstalado/dados limpos) — apagar da tabela, reenviar pra ela sempre vai falhar.

**Response sugerida:**
```json
{ "sent": 812, "failed": 3 }
```

---

## 5. Segmentação (opcional, v2)

Hoje o frontend manda só `{ endpoint, keys }` — sem cidade ou feira associada, então o v1 do disparo é sempre "todo mundo que já permitiu notificação". Se no futuro quiserem segmentar por cidade, o frontend precisa mandar um campo `city` opcional junto — **isso ainda não está implementado**.

---

## 6. Ordem de prioridade de entrega

| Prioridade | Entrega |
|---|---|
| 🔴 P0 — Bloqueante | `POST /push/subscribe` — sem isso, nenhuma subscription é capturada |
| 🟠 P1 — Alta | `POST /push/send` com `web-push` + as chaves VAPID da seção 2 |
| 🟢 P2 — Baixa | Segmentação por cidade/feira (seção 5) |

> **P0 desbloqueia tudo.** O site já está no ar com esse código — assim que `POST /push/subscribe` existir, ele começa a acumular subscriptions sozinho, sem novo deploy do frontend.

---

## 7. Resumo do que muda no backend

| O que fazer | Onde | Urgência |
|---|---|---|
| Criar tabela `push_subscriptions` (`endpoint` único, `p256dh`, `auth`, `createdAt`) | Banco | 🔴 Imediato |
| Novo endpoint `POST /push/subscribe` (público, sem auth) | API REST | 🔴 Imediato |
| Configurar `VAPID_SUBJECT`/`VAPID_PUBLIC_KEY`/`VAPID_PRIVATE_KEY` (seção 2, já geradas) | Env vars | 🟠 Alta |
| `npm install web-push` e novo endpoint `POST /push/send` (JWT-auth) | API REST | 🟠 Alta |
| Apagar subscription quando o envio retornar `404`/`410` | API REST | 🟠 Alta |
| Campo opcional `city` no subscribe, pra segmentação futura | API REST + Frontend | 🟢 Baixa |

**Dúvidas:** abrir issue no repositório ou contato direto com o frontend.
