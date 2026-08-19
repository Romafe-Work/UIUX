# UIUX — Manual de UI/UX interativo

Manual de UI/UX em **HTML + CSS + JavaScript puro** (sem dependências, sem build).
O utilizador **escolhe os tópicos que quer ver** — por exemplo *Tabelas* + *Temas* — e a
página monta um manual só com essas secções, com explicação, boas práticas, exemplos ao
vivo e código.

## Como usar

Abre o `index.html` no browser. Não é preciso instalar nada.

```bash
# opcional, para servir com um servidor local
python3 -m http.server 8000
# depois abre http://localhost:8000
```

1. Seleciona um ou mais tópicos no painel da esquerda (há pesquisa e atalhos rápidos).
2. Carrega em **Mostrar conteúdo**.
3. O manual aparece com sumário, todas as secções escolhidas e demos interativas.

## Funcionalidades

- **Seleção múltipla** de tópicos com pesquisa, "selecionar todos" e presets.
- **Sumário automático** com ligações para cada secção.
- **Tema claro / escuro / automático**, guardado em `localStorage`.
- **Ligação partilhável**: a seleção fica no URL (`index.html#tabelas,temas`).
- **Demos ao vivo**: verificador de contraste, pré-visualização de tema, tabela ordenável
  e filtrável, validação de formulário, toasts, modal `<dialog>`, abas, skeletons.
- **Imprimir / PDF** só com o conteúdo selecionado.
- Acessível: navegação por teclado, foco visível, `aria-*`, `prefers-reduced-motion`.

## Tópicos

| Grupo | Tópicos |
|---|---|
| Fundamentos | Cores & Paleta · Temas (claro/escuro) · Tipografia · Espaçamento & Grelha |
| Componentes | Botões & Ações · Formulários & Inputs · Tabelas de dados · Navegação · Feedback & Estados · Modais & Overlays |
| Práticas | Acessibilidade · Responsividade · Microcopy · Heurísticas & Leis de UX |

## Estrutura

```
UIUX/
├── index.html              # estrutura da página
├── assets/
│   ├── css/style.css       # tokens de design + componentes + responsivo/print
│   └── js/
│       ├── content.js      # TODO o conteúdo do manual (um objeto por tópico)
│       └── app.js          # seleção, montagem do manual e demos interativas
└── README.md
```

## Acrescentar um tópico novo

Basta juntar um objeto ao array em `assets/js/content.js` — o painel, o sumário e a
pesquisa atualizam-se sozinhos:

```js
{
  id: 'icones',
  grupo: 'Componentes',
  icone: '⭐',
  titulo: 'Ícones',
  resumo: 'Estilo, tamanho e significado.',
  html: `<h3>...</h3><p>...</p>`
}
```

## Deploy

Site 100% estático (sem build). O repositório é privado, por isso o GitHub Pages não serve
(exige plano Pro/Team). Qualquer um destes serviços publica repositórios privados no plano
gratuito — basta ligar o repo uma vez e cada `git push` volta a publicar.

### Cloudflare Pages (recomendado)

1. <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Autorizar o GitHub e escolher a organização **Romafe-Work** e o repositório **UIUX**
3. Configuração:
   - Production branch: `main`
   - Framework preset: **None**
   - Build command: *(vazio)*
   - Build output directory: `/`
4. **Save and Deploy** → fica em `https://uiux.pages.dev`

### Netlify

Já existe `netlify.toml` (publica a raiz, sem build).
<https://app.netlify.com> → **Add new site** → **Import an existing project** → GitHub → `UIUX` → Deploy.

Ou pela linha de comandos:

```bash
npx netlify-cli deploy --prod --dir .
```

### Vercel

Já existe `vercel.json`. <https://vercel.com/new> → importar `Romafe-Work/UIUX` →
Framework Preset **Other** → Deploy. Ou `npx vercel --prod`.

### GitHub Pages (só se o repo passar a público)

```bash
gh repo edit Romafe-Work/UIUX --visibility public --accept-visibility-change-consequences
gh api -X POST repos/Romafe-Work/UIUX/pages -f "source[branch]=main" -f "source[path]=/"
# fica em https://romafe-work.github.io/UIUX/
```

## Licença

MIT.
