# API — Páginas de Segmento (Expo MultiMix Site)

**Para:** Time de Backend  
**De:** Time de Frontend  
**Contexto:** O site já consome `GET /public/fairs/{id}` e a coleção Firestore `exhibitors`. Precisamos de dados novos para criar **5 páginas de segmento** com SEO otimizado e conteúdo dinâmico em tempo real (expositores por categoria, logos, descrição do segmento).

---

## 1. O que o frontend precisa fazer

Criar 5 páginas estáticas com conteúdo dinâmico:

| Rota no site | Segmento |
|---|---|
| `/brinquedos-puericultura` | Brinquedos e Puericultura |
| `/utilidades-domesticas` | Utilidades Domésticas |
| `/artigos-de-festa-descartaveis` | Artigos de Festa e Descartáveis |
| `/presentes-decoracao` | Presentes e Decoração |
| `/papelaria-variedades` | Papelaria e Variedades |

Cada página exibe:
- Título, descrição e palavras-chave SEO do segmento
- Lista de expositores **daquele segmento** com logo, nome, cidade(s) e link
- Em quais edições (Belém / Manaus) o segmento está presente
- Contador: quantos expositores confirmados no segmento

---

## 2. Mudanças necessárias nos dados existentes

### 2.1 Firestore — coleção `exhibitors`

Cada documento já tem: `name`, `logoUrl`, `bgColor`, `link`, `cities[]`.

**Adicionar o campo:**

```ts
sectors: string[]  // slugs dos segmentos em que o expositor atua
```

**Exemplo de documento atualizado:**
```json
{
  "name": "Nathor",
  "logoUrl": "https://cdn.../nathor.png",
  "bgColor": "white",
  "link": "https://nathor.com.br",
  "cities": ["manaus", "belem"],
  "sectors": ["brinquedos-puericultura", "presentes-decoracao"]
}
```

**Slugs válidos para o campo `sectors`:**
```
brinquedos-puericultura
utilidades-domesticas
artigos-de-festa-descartaveis
presentes-decoracao
papelaria-variedades
```

> Um expositor pode estar em vários segmentos. O campo é um array.

---

### 2.2 API REST — modelo `ExhibitorBrand` (retornado em `/public/fairs/{id}`)

Hoje retorna: `{ name, logoUrl }`

**Adicionar:**
```ts
{
  name: string
  logoUrl: string
  sectors?: string[]   // mesmo padrão de slugs acima
  link?: string        // URL do site do expositor (opcional)
}
```

---

## 3. Novos endpoints necessários

### 3.1 `GET /public/segments`

Lista todos os segmentos com metadados para o site.

**Response:**
```json
[
  {
    "slug": "brinquedos-puericultura",
    "name": "Brinquedos e Puericultura",
    "description": "Os maiores fornecedores de brinquedos, pelúcias, jogos educativos e artigos de puericultura do Brasil reunidos para lojistas da Região Norte.",
    "shortDescription": "Fornecedores de brinquedos e puericultura no atacado",
    "h1": "Brinquedos e puericultura no atacado para lojistas do Norte",
    "metaTitle": "Fornecedores de brinquedos e puericultura no atacado | Norte Brasil | Expo MultiMix",
    "metaDescription": "Encontre os melhores fornecedores de brinquedos e puericultura no atacado para lojistas do Norte do Brasil. Compre direto das fábricas na Expo MultiMix em Belém e Manaus.",
    "keywords": [
      "fornecedor brinquedos atacado Belém",
      "fornecedor brinquedos atacado Manaus",
      "atacadista brinquedos Pará"
    ],
    "iconUrl": "https://cdn.../icon-brinquedos.svg",
    "bannerUrl": "https://cdn.../banner-brinquedos.jpg",
    "cities": ["belem", "manaus"],
    "exhibitorCount": 24,
    "featured": true
  },
  {
    "slug": "utilidades-domesticas",
    ...
  }
]
```

---

### 3.2 `GET /public/segments/{slug}`

Retorna um segmento específico **com a lista de expositores daquele segmento**.

**Parâmetros de query opcionais:**
```
?city=belem          → filtra expositores por cidade
?city=manaus
?fairId={uuid}       → filtra expositores confirmados em uma edição específica
?limit=50            → paginação (padrão: 50)
?offset=0
```

**Response:**
```json
{
  "slug": "brinquedos-puericultura",
  "name": "Brinquedos e Puericultura",
  "description": "...",
  "shortDescription": "...",
  "h1": "Brinquedos e puericultura no atacado para lojistas do Norte",
  "metaTitle": "...",
  "metaDescription": "...",
  "keywords": ["..."],
  "iconUrl": "https://cdn.../icon-brinquedos.svg",
  "bannerUrl": "https://cdn.../banner-brinquedos.jpg",
  "cities": ["belem", "manaus"],
  "exhibitorCount": 24,
  "exhibitors": [
    {
      "id": "uuid",
      "name": "Nathor",
      "logoUrl": "https://cdn.../nathor.png",
      "link": "https://nathor.com.br",
      "cities": ["manaus", "belem"],
      "sectors": ["brinquedos-puericultura"],
      "bgColor": "white",
      "featured": false
    },
    {
      "id": "uuid",
      "name": "ArkToys",
      "logoUrl": "https://cdn.../arktoys.png",
      "link": null,
      "cities": ["manaus"],
      "sectors": ["brinquedos-puericultura"],
      "bgColor": "white",
      "featured": true
    }
  ],
  "fairs": [
    {
      "id": "uuid-fair-manaus",
      "city": "manaus",
      "startDate": "2026-06-09",
      "endDate": "2026-06-11",
      "venue": "Centro de Convenções Vasco Vasques"
    },
    {
      "id": "uuid-fair-belem",
      "city": "belem",
      "startDate": "2026-08-18",
      "endDate": "2026-08-20",
      "venue": "Estação das Docas"
    }
  ]
}
```

**Erro 404 — segmento não encontrado:**
```json
{ "error": "Segment not found", "slug": "slug-invalido" }
```

---

### 3.3 `GET /public/fairs/{fairId}/segments`

Quais segmentos têm expositores confirmados **em uma edição específica**. Usado para montar a navegação dinâmica nas páginas de Belém e Manaus.

**Response:**
```json
[
  {
    "slug": "brinquedos-puericultura",
    "name": "Brinquedos e Puericultura",
    "exhibitorCount": 14,
    "iconUrl": "https://cdn.../icon-brinquedos.svg"
  },
  {
    "slug": "utilidades-domesticas",
    "name": "Utilidades Domésticas",
    "exhibitorCount": 9,
    "iconUrl": "https://cdn.../icon-utilidades.svg"
  }
]
```

---

## 4. Como o frontend vai consumir

```
Render da página /brinquedos-puericultura:

1. GET /public/segments/brinquedos-puericultura
   → metadados SEO (title, description, h1, keywords)
   → lista de expositores com logo e nome
   → em quais feiras o segmento aparece

2. Complementar com Firestore onSnapshot("exhibitors")
   → mantém lista de logos atualizada em tempo real
   → merge: Firestore tem prioridade (dados mais ricos)
   → expositores da API que não estão no Firestore são adicionados ao final
```

O padrão de merge já existe no componente `ExhibitorsSection.tsx` — vamos reutilizá-lo filtrando por `sectors`.

---

## 5. Ordem de prioridade de entrega

| Prioridade | Entrega |
|---|---|
| 🔴 P0 — Bloqueante | Campo `sectors[]` nos documentos Firestore `exhibitors` (pode ser preenchido manualmente pelo admin) |
| 🟠 P1 — Alta | `GET /public/segments/{slug}` com `exhibitors[]` |
| 🟡 P2 — Média | `GET /public/segments` (lista completa) |
| 🟢 P3 — Baixa | `GET /public/fairs/{fairId}/segments` (para navegação dinâmica) |

> **P0 desbloqueia o frontend imediatamente.** Com o campo `sectors[]` no Firestore, o frontend já consegue renderizar as páginas filtrando por segmento via Firestore, sem precisar esperar os endpoints da API REST.

---

## 6. Slugs fixos (não mudar depois de publicar)

Os slugs abaixo são usados nas URLs do site. Uma vez publicados, **não podem ser renomeados** sem configurar redirecionamentos 301.

```
brinquedos-puericultura
utilidades-domesticas
artigos-de-festa-descartaveis
presentes-decoracao
papelaria-variedades
```

---

## 7. Revalidação e cache

As páginas de segmento são geradas server-side com ISR (Incremental Static Regeneration) do Next.js. O frontend vai configurar `revalidate: 3600` (1 hora) para o endpoint de segmento — mesmo padrão do endpoint de feiras hoje.

Se o backend quiser forçar uma revalidação imediata (ex: novo expositor adicionado), pode chamar:
```
POST https://www.expomultimix.com.br/api/revalidate
Body: { "path": "/brinquedos-puericultura", "secret": "REVALIDATE_TOKEN" }
```
> O frontend implementa esse endpoint de revalidação. Apenas precisamos combinar o `REVALIDATE_TOKEN`.

---

## 8. Resumo do que muda no backend

| O que fazer | Onde | Urgência |
|---|---|---|
| Adicionar campo `sectors: string[]` nos docs Firestore `exhibitors` | Firestore | 🔴 Imediato |
| Adicionar campo `sectors[]` e `link` no model `ExhibitorBrand` da API | API REST | 🟠 Alta |
| Novo endpoint `GET /public/segments/{slug}` | API REST | 🟠 Alta |
| Novo endpoint `GET /public/segments` | API REST | 🟡 Média |
| Novo endpoint `GET /public/fairs/{fairId}/segments` | API REST | 🟢 Baixa |

**Dúvidas:** abrir issue no repositório ou contato direto com o frontend.
