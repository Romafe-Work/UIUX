#!/usr/bin/env python3
"""
Gera o conteúdo do site a partir do Manual de UI da Romafe (ficheiros .md).

    python3 ferramentas/gerar-conteudo.py [pasta-do-manual]

Produz:
    assets/js/content.js        índice dos capítulos (metadados, carregado sempre)
    assets/conteudo/<id>.js     HTML de cada capítulo (carregado sob demanda)
    assets/img/                 cópia das imagens do manual

Requer: pandoc
"""
import json, re, shutil, subprocess, sys
from pathlib import Path

ORIGEM = Path(sys.argv[1] if len(sys.argv) > 1 else '/home/tguedes/projects/UiUx')
DESTINO = Path(__file__).resolve().parent.parent

# id, ficheiro, ícone, grupo, título, resumo
CAPITULOS = [
 ('indice','00-INDICE-UI.md','📘','Introdução','Índice e âmbito',
  'Para que serve o manual, o que muda para cada pessoa e como se lê.'),
 ('painel','01-PADRAO-DE-PAINEL.md','🗂️','Fundamentos','01 — O padrão de painel',
  'Barra lateral escura, barra superior clara, conteúdo em cartões.'),
 ('cor','02-COR-E-TEMAS.md','🎨','Fundamentos','02 — Cor e temas',
  'Paleta da marca, cores de estado, superfícies e tema escuro.'),
 ('bordas','03-BORDAS-RAIOS-E-SOMBRAS.md','🔲','Fundamentos','03 — Bordas, raios e sombras',
  'Onde acaba, que tipo de coisa é e a que altura está.'),
 ('tipografia','04-TIPOGRAFIA.md','🔤','Fundamentos','04 — Tipografia',
  'Escala, pesos e o que é título, etiqueta ou dado.'),
 ('icones','05-ICONES.md','✳️','Fundamentos','05 — Ícones',
  'Servem para encontrar mais depressa, não para explicar.'),
 ('menu','06-MENU-E-NAVEGACAO.md','🧭','Estrutura','06 — Menu e navegação',
  'Onde estou e onde mais posso ir — por esta ordem.'),
 ('layout','07-LAYOUT-E-POSICAO.md','📐','Estrutura','07 — Layout e posição',
  'Esqueleto, molduras e distâncias entre blocos.'),
 ('cartoes','08-CARTOES.md','🃏','Estrutura','08 — Cartões e superfícies',
  'A unidade de conteúdo do produto — e quando não a usar.'),
 ('botoes','09-BOTOES.md','🔘','Componentes','09 — Botões',
  'Hierarquia, tamanhos e a pergunta: qual deles é o laranja?'),
 ('formularios','10-FORMULARIOS.md','📝','Componentes','10 — Formulários',
  'Onde escrever, o que escrever e o que correu mal.'),
 ('tabelas','11-TABELAS.md','🧮','Componentes','11 — Tabelas',
  'O ecrã principal do produto: encontrar uma linha depressa.'),
 ('graficos','12-GRAFICOS.md','📊','Componentes','12 — Gráficos e mapas',
  'Um gráfico responde a uma pergunta. Só uma.'),
 ('modais','13-MODAIS-E-SOBREPOSICOES.md','🪟','Componentes','13 — Modais e sobreposições',
  'Antes do aspeto: tem mesmo de abrir por cima?'),
 ('estados','14-ESTADOS-E-FEEDBACK.md','🚦','Comportamento','14 — Estados e feedback',
  'Selos, alertas e o que aconteceu depois do clique.'),
 ('movimento','15-MOVIMENTO-E-CARREGAMENTO.md','🎞️','Comportamento','15 — Movimento e carregamento',
  'O movimento explica o que mudou — e mais nada.'),
 ('exportacoes','16-EXPORTACOES-E-IMPRESSAO.md','📄','Comportamento','16 — Exportações e impressão',
  'O único ecrã que alguém vê sem abrir a aplicação.'),
 ('acessibilidade','17-ACESSIBILIDADE-E-REGRAS.md','♿','Regras e casos','17 — Acessibilidade e regras de revisão',
  'Contraste, teclado, alvos e a lista de revisão.'),
 ('ficheiros','18-FICHEIROS-E-ANEXOS.md','📎','Regras e casos','18 — Ficheiros e anexos',
  'Os ficheiros que entram: livretes, fotografias, talões.'),
 ('sessao','19-ENTRADA-E-SESSAO.md','🔐','Regras e casos','19 — Entrada e sessão',
  'Cartão de sessão, palavra-passe e credenciais erradas.'),
 ('toque','20-COMPONENTES-DE-TOQUE.md','👆','Regras e casos','20 — Componentes de toque',
  'Os mesmos componentes, de pé, com luvas e ao sol.'),
]

POR_FICHEIRO = {c[1]: c[0] for c in CAPITULOS}

RE_H1        = re.compile(r'<h1[^>]*>.*?</h1>\s*', re.S)
RE_MIGALHA   = re.compile(r'<p><strong>Manual de UI Romafe</strong>.*?</p>\s*', re.S)
RE_ANCORA_CB = re.compile(r'<a href="#[^"]*" aria-hidden="true" tabindex="-1"></a>')
RE_LINK_MD   = re.compile(r'href="([0-9]{2}-[A-ZÇÃÕÉ-]+\.md)"')
RE_IMG       = re.compile(r'<img src="img/([^"]+)"([^>]*)>')
RE_TABELA    = re.compile(r'<table>(.*?)</table>', re.S)


def converter(md: Path, cid: str) -> str:
    html = subprocess.run(
        ['pandoc', str(md), '-f', 'gfm', '-t', 'html', '--wrap=none', f'--id-prefix={cid}-'],
        capture_output=True, text=True, check=True).stdout

    html = RE_H1.sub('', html, count=1)          # o título vai no cabeçalho da secção
    html = RE_MIGALHA.sub('', html, count=1)     # migalha de navegação do .md
    html = RE_ANCORA_CB.sub('', html)            # âncoras por linha de código

    def link(m):
        destino = POR_FICHEIRO.get(m.group(1))
        return f'href="#s-{destino}" data-cap="{destino}"' if destino else m.group(0)
    html = RE_LINK_MD.sub(link, html)

    html = RE_IMG.sub(r'<img src="assets/img/\1" loading="lazy"\2>', html)
    html = RE_TABELA.sub(lambda m: f'<div class="tabela-wrap"><table>{m.group(1)}</table></div>', html)
    return html.strip()


def main():
    if not ORIGEM.is_dir():
        sys.exit(f'Pasta do manual não encontrada: {ORIGEM}')

    (DESTINO / 'assets' / 'conteudo').mkdir(parents=True, exist_ok=True)
    indice, total = [], 0

    for cid, ficheiro, icone, grupo, titulo, resumo in CAPITULOS:
        md = ORIGEM / ficheiro
        if not md.exists():
            print(f'  ! em falta: {ficheiro}')
            continue
        html = converter(md, cid)
        alvo = DESTINO / 'assets' / 'conteudo' / f'{cid}.js'
        alvo.write_text(
            f'registarCapitulo({json.dumps(cid)}, {json.dumps(html, ensure_ascii=False)});\n',
            encoding='utf-8')
        total += len(html)
        indice.append({'id': cid, 'grupo': grupo, 'icone': icone,
                       'titulo': titulo, 'resumo': resumo, 'fonte': ficheiro})
        print(f'  {ficheiro:34} → assets/conteudo/{cid}.js  ({len(html)//1024} KB)')

    (DESTINO / 'assets' / 'js' / 'content.js').write_text(
        '/* Gerado por ferramentas/gerar-conteudo.py — não editar à mão.\n'
        '   A fonte é o Manual de UI da Romafe (ficheiros .md). */\n'
        'window.CONTEUDO = ' + json.dumps(indice, ensure_ascii=False, indent=2) + ';\n',
        encoding='utf-8')

    origem_img = ORIGEM / 'img'
    if origem_img.is_dir():
        destino_img = DESTINO / 'assets' / 'img'
        destino_img.mkdir(parents=True, exist_ok=True)
        n = 0
        for f in sorted(origem_img.glob('*.png')):
            shutil.copy2(f, destino_img / f.name); n += 1
        print(f'  {n} imagens copiadas para assets/img/')

    print(f'\n{len(indice)} capítulos · {total//1024} KB de HTML')


if __name__ == '__main__':
    main()
