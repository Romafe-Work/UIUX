/* =========================================================
   app.js — seleção de capítulos e montagem do manual.
   O conteúdo vem de assets/conteudo/<id>.js, carregado só
   quando o capítulo é pedido (a página abre com ~30 KB).
   ========================================================= */
(function () {
  'use strict';

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const CAPITULOS = window.CONTEUDO || [];
  const CHAVE_SEL = 'uiux:selecao';
  const CHAVE_TEMA = 'uiux:tema';

  const el = {
    form:     $('#form-topicos'),
    busca:    $('#busca'),
    contador: $('#contador'),
    vazio:    $('#estado-vazio'),
    saida:    $('#saida'),
    secoes:   $('#secoes'),
    sumario:  $('#sumario'),
    rodapeN:  $('#rodape-n'),
    painel:   $('#painel'),
    toasts:   $('#toasts'),
    resultados: $('#resultados'),
    resultadosLista: $('#resultados-lista'),
    resultadosTitulo: $('#resultados-titulo')
  };

  /* ---------------- TEMA ---------------- */
  function aplicarTema(modo) {
    const raiz = document.documentElement;
    if (modo === 'auto') raiz.removeAttribute('data-theme');
    else raiz.setAttribute('data-theme', modo);
    try { localStorage.setItem(CHAVE_TEMA, modo); } catch (e) {}
    $$('.segmented__btn').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tema === modo)));
  }
  $$('.segmented__btn').forEach(b => b.addEventListener('click', () => aplicarTema(b.dataset.tema)));
  aplicarTema((() => { try { return localStorage.getItem(CHAVE_TEMA) || 'auto'; } catch (e) { return 'auto'; } })());

  /* ---------------- CARREGAMENTO DOS CAPÍTULOS ----------------
     Cada ficheiro em assets/conteudo/ chama registarCapitulo().
     É um <script> e não um fetch() para o site também funcionar
     aberto diretamente do disco (file://), sem servidor.        */
  const cache = {};
  const espera = {};

  window.registarCapitulo = function (id, html) {
    cache[id] = html;
    (espera[id] || []).forEach(fn => fn(html));
    delete espera[id];
  };

  function carregar(id) {
    return new Promise(resolve => {
      if (cache[id] !== undefined) return resolve(cache[id]);
      (espera[id] = espera[id] || []).push(resolve);
      if ($('script[data-cap="' + id + '"]')) return;
      const s = document.createElement('script');
      s.src = 'assets/conteudo/' + id + '.js';
      s.dataset.cap = id;
      s.onerror = () => window.registarCapitulo(id,
        '<p class="alerta alerta--erro">Não foi possível carregar este capítulo ' +
        '(<code>assets/conteudo/' + id + '.js</code>).</p>');
      document.head.appendChild(s);
    });
  }

  /* ---------------- PAINEL ---------------- */
  function construirPainel() {
    const grupos = [];
    CAPITULOS.forEach(c => {
      let g = grupos.find(x => x.nome === c.grupo);
      if (!g) { g = { nome: c.grupo, itens: [] }; grupos.push(g); }
      g.itens.push(c);
    });

    el.form.innerHTML = grupos.map(g => `
      <fieldset class="grupo" style="border:0;margin-inline:0;padding:0">
        <legend class="grupo__titulo">${g.nome}</legend>
        ${g.itens.map(c => `
          <label class="opcao" data-busca="${(c.titulo + ' ' + c.resumo + ' ' + c.id).toLowerCase()}">
            <input type="checkbox" value="${c.id}">
            <span>
              <span class="opcao__nome">${c.icone} ${c.titulo}</span>
              <span class="opcao__desc">${c.resumo}</span>
            </span>
          </label>`).join('')}
      </fieldset>`).join('');
  }

  const selecionados = () => $$('#form-topicos input:checked').map(i => i.value);

  function atualizarContador() {
    const n = selecionados().length;
    el.contador.textContent = n === 0 ? 'Nenhum capítulo selecionado'
      : n === 1 ? '1 capítulo selecionado' : n + ' capítulos selecionados';
    $('#btn-mostrar').disabled = n === 0;
  }

  function definirSelecao(ids) {
    $$('#form-topicos input').forEach(i => { i.checked = ids.indexOf(i.value) !== -1; });
    atualizarContador();
  }

  /* ---------------- MONTAGEM ---------------- */
  let aMontar = 0;

  function mostrar(irPara) {
    const ids = selecionados();
    if (!ids.length) return;

    const escolhidos = CAPITULOS.filter(c => ids.indexOf(c.id) !== -1); // ordem do manual
    const marca = ++aMontar;

    el.sumario.innerHTML = '<h2>Nesta leitura</h2><ol>' +
      escolhidos.map(c => `<li><a href="#s-${c.id}">${c.titulo}</a></li>`).join('') + '</ol>';

    el.secoes.innerHTML = escolhidos.map(c => `
      <section class="secao" id="s-${c.id}" aria-labelledby="h-${c.id}">
        <header class="secao__cabecalho">
          <span class="secao__icone" aria-hidden="true">${c.icone}</span>
          <div>
            <h2 id="h-${c.id}">${c.titulo}</h2>
            <p>${c.resumo}</p>
          </div>
        </header>
        <div class="secao__corpo" data-corpo="${c.id}">
          <div class="skeleton" style="width:90%"></div>
          <div class="skeleton" style="width:100%"></div>
          <div class="skeleton" style="width:70%"></div>
        </div>
      </section>`).join('');

    el.rodapeN.textContent = escolhidos.length;
    el.vazio.hidden = true;
    el.saida.hidden = false;

    escolhidos.forEach(c => carregar(c.id).then(html => {
      if (marca !== aMontar) return;                 // já há outra montagem a decorrer
      const alvo = $('[data-corpo="' + c.id + '"]');
      if (alvo) alvo.innerHTML = html;
      if (irPara === c.id) irParaSeccao(c.id);
    }));

    try {
      localStorage.setItem(CHAVE_SEL, ids.join(','));
      history.replaceState(null, '', '#' + ids.join(','));
    } catch (e) {}

    el.painel.classList.remove('aberto');
    $('#btn-abrir-menu').setAttribute('aria-expanded', 'false');

    if (!irPara) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      $('#conteudo').focus({ preventScroll: true });
    }
  }

  function irParaSeccao(id) {
    const alvo = $('#s-' + id);
    if (alvo) alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------------- TOASTS ---------------- */
  function toast(tipo, titulo, texto) {
    const t = document.createElement('div');
    t.className = 'toast toast--' + tipo;
    t.setAttribute('role', tipo === 'erro' ? 'alert' : 'status');
    t.innerHTML = `<span aria-hidden="true">${tipo === 'erro' ? '⛔' : '✅'}</span>
                   <div><strong>${titulo}</strong><span>${texto}</span></div>`;
    el.toasts.appendChild(t);
    setTimeout(() => t.remove(), 4500);
  }

  /* ---- ligações entre capítulos dentro do texto ----
     O manual remete constantemente para outros capítulos. Se o
     capítulo referido não estiver selecionado, junta-se à leitura. */
  el.secoes.addEventListener('click', ev => {
    const a = ev.target.closest('a[data-cap]');
    if (!a) return;
    const id = a.dataset.cap;
    const cap = CAPITULOS.find(c => c.id === id);
    if (!cap) return;
    ev.preventDefault();
    if (selecionados().indexOf(id) === -1) {
      $$('#form-topicos input').forEach(i => { if (i.value === id) i.checked = true; });
      atualizarContador();
      toast('ok', 'Capítulo acrescentado', cap.titulo + ' juntou-se a esta leitura.');
      mostrar(id);
    } else {
      irParaSeccao(id);
    }
  });


  /* =========================================================
     PESQUISA DE TEXTO INTEGRAL (palavra ou frase, como no VS Code)
     O índice (assets/js/pesquisa.js) só é descarregado quando
     alguém escreve na caixa — a página abre sem ele.
     ========================================================= */
  let INDICE = null, aCarregarIndice = false, consultaPendente = null;
  const MAX_POR_CAPITULO = 8;

  window.registarIndice = function (dados) {
    INDICE = dados;
    // versão sem acentos nem maiúsculas, para procurar como se escreve
    Object.keys(INDICE).forEach(cid => INDICE[cid].forEach(sec => {
      sec[3] = sec[2].map(normalizar);
    }));
    if (consultaPendente !== null) { const q = consultaPendente; consultaPendente = null; procurar(q); }
  };

  function normalizar(t) {
    return t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function carregarIndice() {
    if (INDICE || aCarregarIndice) return;
    aCarregarIndice = true;
    const s = document.createElement('script');
    s.src = 'assets/js/pesquisa.js';
    s.onerror = () => {
      el.resultadosLista.innerHTML =
        '<p class="alerta alerta--erro">Não foi possível carregar o índice de pesquisa.</p>';
    };
    document.head.appendChild(s);
  }

  const opcoes = { maiusculas: false, palavra: false };

  function ocorrencias(textoNorm, textoCru, alvo) {
    // devolve os índices de início de cada ocorrência
    const onde = [];
    const heno = opcoes.maiusculas ? textoCru : textoNorm;
    let i = heno.indexOf(alvo);
    while (i !== -1) {
      const antes = heno[i - 1], depois = heno[i + alvo.length];
      const limite = c => c === undefined || !/[\p{L}\p{N}]/u.test(c);
      if (!opcoes.palavra || (limite(antes) && limite(depois))) onde.push(i);
      i = heno.indexOf(alvo, i + alvo.length);
    }
    return onde;
  }

  function excerto(texto, pos, comprimento) {
    const antes = Math.max(0, pos - 60);
    const inicio = antes > 0 ? '…' : '';
    const fim = pos + comprimento + 90 < texto.length ? '…' : '';
    const bruto = texto.slice(antes, pos + comprimento + 90);
    const rel = pos - antes;
    const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return inicio + esc(bruto.slice(0, rel)) + '<mark>' + esc(bruto.slice(rel, rel + comprimento)) +
           '</mark>' + esc(bruto.slice(rel + comprimento)) + fim;
  }

  function procurar(consulta) {
    const q = consulta.trim();
    if (q.length < 2) return fecharPesquisa();

    if (!INDICE) { consultaPendente = q; carregarIndice(); mostrarPesquisa();
      el.resultadosLista.innerHTML = '<div class="skeleton" style="width:60%"></div>' +
        '<div class="skeleton" style="width:90%"></div><div class="skeleton" style="width:75%"></div>';
      el.resultadosTitulo.textContent = 'A preparar a pesquisa…';
      return;
    }

    const alvo = opcoes.maiusculas ? q : normalizar(q);
    let totalOcor = 0, capsComResultado = 0;
    const partes = [];

    // 1) capítulos cujo título ou resumo corresponde
    const porTitulo = CAPITULOS.filter(c =>
      normalizar(c.titulo + ' ' + c.resumo).indexOf(normalizar(q)) !== -1);
    if (porTitulo.length) {
      partes.push('<div class="res-grupo"><h3 class="res-grupo__titulo">Capítulos</h3>' +
        porTitulo.map(c => `<button type="button" class="res-cap" data-abrir="${c.id}">
            <span aria-hidden="true">${c.icone}</span> ${c.titulo}
            <small>${c.resumo}</small></button>`).join('') + '</div>');
    }

    // 2) ocorrências no texto, capítulo a capítulo, pela ordem do manual
    CAPITULOS.forEach(c => {
      const seccoes = INDICE[c.id] || [];
      let nCap = 0;
      const linhas = [];
      seccoes.forEach(sec => {
        const [secId, secTitulo, textos, normais] = sec;
        textos.forEach((texto, k) => {
          const onde = ocorrencias(normais[k], texto, alvo);
          nCap += onde.length;
          onde.forEach(pos => {
            if (linhas.length >= MAX_POR_CAPITULO) return;
            linhas.push(`<button type="button" class="res-linha" data-abrir="${c.id}"
                data-sec="${secId}" data-pos="${linhas.length}">
                <span class="res-linha__sec">${secTitulo || 'Início'}</span>
                <span class="res-linha__txt">${excerto(texto, pos, q.length)}</span>
              </button>`);
          });
        });
      });
      if (!nCap) return;
      capsComResultado++; totalOcor += nCap;
      const escondidas = nCap - linhas.length;
      partes.push(`<div class="res-grupo">
        <h3 class="res-grupo__titulo"><span aria-hidden="true">${c.icone}</span> ${c.titulo}
          <span class="badge">${nCap}</span></h3>
        ${linhas.join('')}
        ${escondidas > 0 ? `<button type="button" class="res-mais" data-abrir="${c.id}">
             + ${escondidas} ocorrência${escondidas > 1 ? 's' : ''} neste capítulo — abrir</button>` : ''}
      </div>`);
    });

    mostrarPesquisa();
    el.resultadosTitulo.textContent = totalOcor
      ? `${totalOcor} ocorrência${totalOcor > 1 ? 's' : ''} de «${q}» em ${capsComResultado} capítulo${capsComResultado > 1 ? 's' : ''}`
      : `Sem resultados para «${q}»`;
    el.resultadosLista.innerHTML = partes.length ? partes.join('')
      : `<p class="res-vazio">Nada encontrado. Experimenta menos palavras, ou desliga as opções
         <strong>Aa</strong> / <strong>|ab|</strong>.</p>`;
  }

  function mostrarPesquisa() {
    el.resultados.hidden = false;
    el.vazio.hidden = true;
    el.saida.hidden = true;
  }

  function fecharPesquisa() {
    el.resultados.hidden = true;
    const temLeitura = !!$('#secoes .secao');
    el.saida.hidden = !temLeitura;
    el.vazio.hidden = temLeitura;
  }

  /* --- realçar as ocorrências dentro do capítulo aberto --- */
  function realcar(raiz, q) {
    $$('mark.achado', raiz).forEach(m => m.replaceWith(document.createTextNode(m.textContent)));
    if (!q) return [];
    const alvo = opcoes.maiusculas ? q : normalizar(q);
    const marcas = [];
    const andarilho = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, {
      acceptNode: n => (n.parentNode.closest('mark') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT)
    });
    const nos = [];
    for (let n = andarilho.nextNode(); n; n = andarilho.nextNode()) nos.push(n);
    nos.forEach(no => {
      const texto = no.nodeValue;
      const onde = ocorrencias(normalizar(texto), texto, alvo);
      if (!onde.length) return;
      const frag = document.createDocumentFragment();
      let cursor = 0;
      onde.forEach(pos => {
        frag.appendChild(document.createTextNode(texto.slice(cursor, pos)));
        const m = document.createElement('mark');
        m.className = 'achado';
        m.textContent = texto.slice(pos, pos + q.length);
        frag.appendChild(m); marcas.push(m);
        cursor = pos + q.length;
      });
      frag.appendChild(document.createTextNode(texto.slice(cursor)));
      no.parentNode.replaceChild(frag, no);
    });
    return marcas;
  }

  function abrirResultado(cid, secId, ordem) {
    const q = el.busca.value.trim();
    if (selecionados().indexOf(cid) === -1) {
      $$('#form-topicos input').forEach(i => { if (i.value === cid) i.checked = true; });
      atualizarContador();
    }
    fecharPesquisa();
    mostrar(cid);
    carregar(cid).then(() => setTimeout(() => {
      const secao = $('#s-' + cid);
      if (!secao) return;
      const marcas = realcar(secao, q);
      const destino = (secId && $('#' + CSS.escape(secId))) || marcas[ordem || 0] || secao;
      destino.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const primeira = marcas[ordem || 0];
      if (primeira) primeira.classList.add('achado--foco');
    }, 60));
  }

  /* ---------------- ARRANQUE ---------------- */
  construirPainel();

  el.form.addEventListener('change', atualizarContador);

  let temporizador;
  el.busca.addEventListener('input', () => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => procurar(el.busca.value), 120);
  });
  el.busca.addEventListener('focus', carregarIndice);
  el.busca.addEventListener('keydown', ev => {
    if (ev.key === 'Escape') { el.busca.value = ''; fecharPesquisa(); el.busca.blur(); }
    if (ev.key === 'Enter') {
      const primeiro = $('#resultados-lista [data-abrir]');
      if (primeiro) primeiro.click();
    }
  });
  document.addEventListener('keydown', ev => {
    const aEscrever = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if ((ev.key === '/' && !aEscrever) || (ev.key === 'k' && (ev.ctrlKey || ev.metaKey))) {
      ev.preventDefault(); el.busca.focus(); el.busca.select();
    }
  });
  [['#opt-maiusculas', 'maiusculas'], ['#opt-palavra', 'palavra']].forEach(([sel, chave]) => {
    $(sel).addEventListener('click', function () {
      opcoes[chave] = !opcoes[chave];
      this.setAttribute('aria-pressed', String(opcoes[chave]));
      procurar(el.busca.value);
    });
  });
  el.resultadosLista.addEventListener('click', ev => {
    const b = ev.target.closest('[data-abrir]');
    if (b) abrirResultado(b.dataset.abrir, b.dataset.sec, Number(b.dataset.pos || 0));
  });
  $('#btn-fechar-pesquisa').addEventListener('click', () => {
    el.busca.value = ''; fecharPesquisa();
  });

  $('#btn-todos').addEventListener('click', () => definirSelecao(CAPITULOS.map(c => c.id)));
  $('#btn-limpar').addEventListener('click', () => {
    definirSelecao([]);
    el.saida.hidden = true; el.vazio.hidden = false;
    try { localStorage.removeItem(CHAVE_SEL); history.replaceState(null, '', location.pathname); } catch (e) {}
  });
  $('#btn-mostrar').addEventListener('click', () => mostrar());
  $('#btn-abrir-menu').addEventListener('click', function () {
    const aberto = el.painel.classList.toggle('aberto');
    this.setAttribute('aria-expanded', String(aberto));
  });
  $$('[data-preset]').forEach(b => b.addEventListener('click', () => {
    definirSelecao(b.dataset.preset.split(','));
    mostrar();
  }));

  // seleção inicial: URL (#tabelas,cor) → localStorage → nada
  const doHash = location.hash.replace('#', '').split(',').filter(Boolean);
  const guardado = (() => { try { return (localStorage.getItem(CHAVE_SEL) || '').split(',').filter(Boolean); } catch (e) { return []; } })();
  const inicial = (doHash.length ? doHash : guardado).filter(id => CAPITULOS.some(c => c.id === id));

  atualizarContador();
  if (inicial.length) { definirSelecao(inicial); mostrar(); }

  /* Alturas do que fica colado ao topo.
     A barra de cima e o cabeçalho do capítulo ficam ambos fixos, e as duas
     alturas dependem do texto que lá está e da largura da janela — a 900px o
     título do capítulo passa a duas linhas e cresce 30px. Escritas à mão, o
     salto para uma âncora aterrava por baixo delas e a primeira linha ficava
     cortada. Medem-se aqui e vão para o CSS. */
  function medirTopos() {
    const topo = document.querySelector('.topbar');
    const cabecalho = document.querySelector('.secao__cabecalho');
    const raiz = document.documentElement;
    if (topo) raiz.style.setProperty('--h-topo', Math.round(topo.offsetHeight) + 'px');
    if (cabecalho) raiz.style.setProperty('--h-cabecalho', Math.round(cabecalho.offsetHeight) + 'px');
  }
  medirTopos();
  window.addEventListener('resize', medirTopos);
  /* O cabeçalho só existe depois de haver capítulos na leitura, e o seu tamanho
     muda com o capítulo que está no topo. */
  if (window.ResizeObserver && el.secoes) {
    new ResizeObserver(medirTopos).observe(el.secoes);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(medirTopos);
})();
