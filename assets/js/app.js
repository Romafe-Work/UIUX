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
    toasts:   $('#toasts')
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

  /* ---------------- ARRANQUE ---------------- */
  construirPainel();

  el.form.addEventListener('change', atualizarContador);

  el.busca.addEventListener('input', () => {
    const q = el.busca.value.trim().toLowerCase();
    $$('.opcao').forEach(o => { o.hidden = q && o.dataset.busca.indexOf(q) === -1; });
    $$('.grupo').forEach(g => { g.hidden = !$$('.opcao:not([hidden])', g).length; });
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
})();
