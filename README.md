# Manual de UI — Romafe (versão web)

Leitor web do **Manual de UI da Romafe**. O utilizador escolhe os capítulos que quer ler —
por exemplo *11 Tabelas* + *02 Cor e temas* — e a página monta o documento só com esses,
pela ordem do manual, com as imagens e os valores tal como estão na versão oficial.

HTML, CSS e JavaScript puro: sem dependências, sem build, sem framework.

## Fonte do conteúdo

O conteúdo **não se edita aqui**. A fonte são os ficheiros Markdown do manual, em
`/home/tguedes/projects/UiUx/` (`00-INDICE-UI.md` … `20-COMPONENTES-DE-TOQUE.md`).
Depois de alterar o manual, regenera-se o site:

```bash
python3 ferramentas/gerar-conteudo.py            # usa a pasta por omissão
python3 ferramentas/gerar-conteudo.py /outra/pasta
```

O gerador (requer `pandoc`) converte cada capítulo para HTML, reescreve as ligações entre
capítulos, copia as imagens e escreve:

| Ficheiro | O que é |
| --- | --- |
| `assets/js/content.js` | índice dos 21 capítulos (id, título, grupo, resumo) — carregado sempre |
| `assets/conteudo/<id>.js` | HTML de um capítulo — carregado só quando é pedido |
| `assets/img/` | imagens do manual |

## Como funciona

- **Carregamento sob demanda:** a página abre com o índice (~30 KB). Cada capítulo
  (14–59 KB) só é descarregado quando entra na leitura. São `<script>` e não `fetch()`,
  para o site também funcionar aberto diretamente do disco (`file://`), sem servidor.
- **Ligações entre capítulos:** o manual remete constantemente para outros capítulos
  (419 ligações). Clicar numa delas junta esse capítulo à leitura e salta para lá.
- **Ligação partilhável:** a seleção fica no endereço — `index.html#tabelas,cor` abre
  logo com esses capítulos. A última leitura também fica guardada no `localStorage`.
- **Tema** claro / escuro / automático (segue o sistema).
- **Pesquisa** por título e resumo no painel, com "selecionar todos" e atalhos.
- Acessível: navegação por teclado, foco visível, `aria-*`, `prefers-reduced-motion`.

## Capítulos

| Grupo | Capítulos |
| --- | --- |
| Introdução | 00 Índice e âmbito |
| Fundamentos | 01 Padrão de painel · 02 Cor e temas · 03 Bordas, raios e sombras · 04 Tipografia · 05 Ícones |
| Estrutura | 06 Menu e navegação · 07 Layout e posição · 08 Cartões e superfícies |
| Componentes | 09 Botões · 10 Formulários · 11 Tabelas · 12 Gráficos e mapas · 13 Modais e sobreposições |
| Comportamento | 14 Estados e feedback · 15 Movimento e carregamento · 16 Exportações e impressão |
| Regras e casos | 17 Acessibilidade e regras de revisão · 18 Ficheiros e anexos · 19 Entrada e sessão · 20 Componentes de toque |

## Estrutura

```
UIUX/
├── index.html
├── assets/
│   ├── css/style.css           # tokens, componentes, tipografia do manual
│   ├── js/content.js           # gerado — índice dos capítulos
│   ├── js/app.js               # seleção, montagem e carregamento
│   ├── conteudo/*.js           # gerado — um ficheiro por capítulo
│   └── img/                    # gerado — imagens do manual
├── ferramentas/gerar-conteudo.py
└── README.md
```

## Deploy — GitHub Pages

Já está ativo: o site é servido do branch `main`, na raiz, em
**<https://romafe-work.github.io/UIUX/>**. Cada `git push` para `main` republica.

O repositório tem de continuar **público** — o GitHub Pages só serve repositórios privados
em planos Pro/Team, e a organização está no plano Free. O `.nojekyll` na raiz garante que
os ficheiros são servidos tal como estão.

```bash
gh api repos/Romafe-Work/UIUX/pages --jq '{status, url: .html_url}'   # estado do site
```
