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

## Deploy — GitHub Pages

Site 100% estático (sem build), servido a partir da raiz do repositório.

> **Pré-requisito:** o GitHub Pages só publica repositórios **privados** em planos
> Pro/Team/Enterprise. A organização `Romafe-Work` está no plano Free, por isso o
> repositório tem de ser **público** para o site ficar online.

```bash
# 1. tornar o repositório público (o código passa a estar visível para todos)
gh repo edit Romafe-Work/UIUX --visibility public --accept-visibility-change-consequences

# 2. ativar o Pages a partir do branch main, na raiz
gh api -X POST repos/Romafe-Work/UIUX/pages -f "source[branch]=main" -f "source[path]=/"

# 3. confirmar o estado (status: built quando estiver no ar)
gh api repos/Romafe-Work/UIUX/pages --jq '{status, url: .html_url}'
```

Em alternativa, pela interface: **Settings → Pages → Source: Deploy from a branch →
`main` / `/ (root)` → Save**.

O site fica em **<https://romafe-work.github.io/UIUX/>** (o primeiro build demora 1–2 minutos).
A partir daí, cada `git push` para `main` republica automaticamente.

O ficheiro `.nojekyll` na raiz garante que o GitHub serve os ficheiros tal como estão,
sem os processar com o Jekyll.

## Licença

MIT.
