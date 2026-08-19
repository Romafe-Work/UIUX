/* =========================================================
   app.js — seleção de tópicos, montagem do manual e demos
   ========================================================= */
(function () {
  'use strict';

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const TOPICOS = window.CONTEUDO || [];
  const CHAVE_SEL = 'uiux:selecao';
  const CHAVE_TEMA = 'uiux:tema';

  const el = {
    form:      $('#form-topicos'),
    busca:     $('#busca'),
    contador:  $('#contador'),
    vazio:     $('#estado-vazio'),
    saida:     $('#saida'),
    secoes:    $('#secoes'),
    sumario:   $('#sumario'),
    rodapeN:   $('#rodape-n'),
    painel:    $('#painel'),
    toasts:    $('#toasts')
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

  /* ---------------- PAINEL DE TÓPICOS ---------------- */
  function construirPainel() {
    const grupos = [];
    TOPICOS.forEach(t => {
      let g = grupos.find(x => x.nome === t.grupo);
      if (!g) { g = { nome: t.grupo, itens: [] }; grupos.push(g); }
      g.itens.push(t);
    });

    el.form.innerHTML = grupos.map(g => `
      <fieldset class="grupo" style="border:0;margin-inline:0;padding:0">
        <legend class="grupo__titulo">${g.nome}</legend>
        ${g.itens.map(t => `
          <label class="opcao" data-busca="${(t.titulo + ' ' + t.resumo + ' ' + t.id).toLowerCase().replace(/&amp;/g, '&')}">
            <input type="checkbox" value="${t.id}">
            <span>
              <span class="opcao__nome">${t.icone} ${t.titulo}</span>
              <span class="opcao__desc">${t.resumo}</span>
            </span>
          </label>`).join('')}
      </fieldset>`).join('');
  }

  const selecionados = () => $$('#form-topicos input:checked').map(i => i.value);

  function atualizarContador() {
    const n = selecionados().length;
    el.contador.textContent = n === 0 ? 'Nenhum tópico selecionado'
      : n === 1 ? '1 tópico selecionado' : n + ' tópicos selecionados';
    $('#btn-mostrar').disabled = n === 0;
  }

  function definirSelecao(ids) {
    $$('#form-topicos input').forEach(i => { i.checked = ids.indexOf(i.value) !== -1; });
    atualizarContador();
  }

  /* ---------------- MONTAGEM DO MANUAL ---------------- */
  function mostrar() {
    const ids = selecionados();
    if (!ids.length) return;

    const escolhidos = TOPICOS.filter(t => ids.indexOf(t.id) !== -1); // mantém a ordem canónica

    el.sumario.innerHTML = '<h2>Neste manual</h2><ol>' +
      escolhidos.map(t => `<li><a href="#s-${t.id}">${t.titulo}</a></li>`).join('') + '</ol>';

    el.secoes.innerHTML = escolhidos.map(t => `
      <section class="secao" id="s-${t.id}" aria-labelledby="h-${t.id}">
        <header class="secao__cabecalho">
          <span class="secao__icone" aria-hidden="true">${t.icone}</span>
          <div>
            <h2 id="h-${t.id}">${t.titulo}</h2>
            <p>${t.resumo}</p>
          </div>
        </header>
        <div class="secao__corpo">${t.html}</div>
      </section>`).join('');

    el.rodapeN.textContent = escolhidos.length;
    el.vazio.hidden = true;
    el.saida.hidden = false;

    try {
      localStorage.setItem(CHAVE_SEL, ids.join(','));
      history.replaceState(null, '', '#' + ids.join(','));
    } catch (e) {}

    iniciarDemos();
    el.painel.classList.remove('aberto');
    $('#btn-abrir-menu').setAttribute('aria-expanded', 'false');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    $('#conteudo').focus({ preventScroll: true });
    toast('ok', 'Manual atualizado', escolhidos.length + ' secções carregadas.');
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

  /* =========================================================
     DEMOS INTERATIVAS — só correm se a secção estiver visível
     ========================================================= */

  /* --- contraste --- */
  function lum(hex) {
    const c = [1, 3, 5].map(i => parseInt(hex.substr(i, 2), 16) / 255)
      .map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function initContraste(raiz) {
    const frente = $('[data-cor="frente"]', raiz), fundo = $('[data-cor="fundo"]', raiz);
    const amostra = $('[data-cor="amostra"]', raiz), racio = $('[data-cor="racio"]', raiz);
    function calc() {
      const a = lum(frente.value), b = lum(fundo.value);
      const r = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      amostra.style.color = frente.value;
      amostra.style.background = fundo.value;
      const v = r.toFixed(2) + ':1';
      if (r >= 4.5)      { racio.className = 'badge badge--ok';    racio.textContent = v + ' · AA para texto normal ✔'; }
      else if (r >= 3)   { racio.className = 'badge badge--aviso'; racio.textContent = v + ' · só texto grande / bordas'; }
      else               { racio.className = 'badge badge--erro';  racio.textContent = v + ' · reprova ✘'; }
    }
    frente.addEventListener('input', calc); fundo.addEventListener('input', calc); calc();
  }

  /* --- pré-visualização de tema --- */
  function initTema(raiz) {
    const alvo = $('[data-preview-alvo]', raiz);
    $$('[data-preview-tema]', raiz).forEach(b =>
      b.addEventListener('click', () => alvo.setAttribute('data-theme', b.dataset.previewTema)));
  }

  /* --- botão com loading --- */
  function initLoading(btn) {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      const original = btn.textContent;
      btn.disabled = true; btn.setAttribute('aria-busy', 'true'); btn.textContent = 'A guardar…';
      setTimeout(() => {
        btn.disabled = false; btn.removeAttribute('aria-busy'); btn.textContent = original;
        toast('ok', 'Guardado', 'As alterações foram guardadas.');
      }, 1400);
    });
  }

  /* --- formulário com validação --- */
  function initForm(form) {
    function erro(campo, msg) {
      limpar(campo);
      campo.setAttribute('aria-invalid', 'true');
      const p = document.createElement('span');
      p.className = 'campo__erro'; p.setAttribute('role', 'alert'); p.textContent = '⛔ ' + msg;
      campo.parentNode.appendChild(p);
    }
    function limpar(campo) {
      campo.removeAttribute('aria-invalid');
      const antigo = campo.parentNode.querySelector('.campo__erro');
      if (antigo) antigo.remove();
    }
    function validar(campo) {
      const v = campo.value.trim();
      if (campo.required && !v) { erro(campo, 'Este campo é obrigatório.'); return false; }
      if (campo.type === 'email' && v && v.indexOf('@') === -1) { erro(campo, 'Falta o @ no endereço de email.'); return false; }
      if (campo.name === 'pass' && v && v.length < 8) { erro(campo, 'A palavra-passe precisa de pelo menos 8 caracteres.'); return false; }
      limpar(campo); return true;
    }
    $$('input', form).forEach(c => {
      c.addEventListener('blur', () => validar(c));
      c.addEventListener('input', () => { if (c.getAttribute('aria-invalid')) validar(c); });
    });
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      const campos = $$('input', form);
      const maus = campos.filter(c => !validar(c));
      if (maus.length) { maus[0].focus(); toast('erro', 'Faltam dados', 'Corrige os campos assinalados.'); }
      else toast('ok', 'Conta criada', 'Demonstração — nada foi enviado.');
    });
    form.addEventListener('reset', () => setTimeout(() => $$('input', form).forEach(limpar), 0));
  }

  /* --- tabela ordenável e filtrável --- */
  const DADOS = [
    { nome: 'Padaria Central',   plano: 'Pro',        estado: 'ativo',    valor: 149,  data: '2026-09-14' },
    { nome: 'Clínica Sorriso',   plano: 'Empresa',    estado: 'ativo',    valor: 890,  data: '2026-10-02' },
    { nome: 'Oficina do Zé',     plano: 'Básico',     estado: 'pendente', valor: 39,   data: '2026-08-30' },
    { nome: 'Livraria Norte',    plano: 'Pro',        estado: 'ativo',    valor: 149,  data: '2027-01-05' },
    { nome: 'Ginásio Atlas',     plano: 'Empresa',    estado: 'suspenso', valor: 890,  data: '2026-08-21' },
    { nome: 'Café da Praça',     plano: 'Básico',     estado: 'ativo',    valor: 39,   data: '2026-11-11' },
    { nome: 'Studio Marés',      plano: 'Pro',        estado: 'pendente', valor: 149,  data: '2026-09-01' }
  ];
  const EUR = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
  const DATA = new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
  const CLASSE_ESTADO = { ativo: 'badge--ok', pendente: 'badge--aviso', suspenso: 'badge--erro' };

  function initTabela(raiz) {
    const corpo = $('[data-tab="corpo"]', raiz);
    const filtro = $('[data-tab="filtro"]', raiz);
    const contagem = $('[data-tab="contagem"]', raiz);
    let coluna = 'nome', dir = 1;

    function pintar() {
      const q = filtro.value.trim().toLowerCase();
      const linhas = DADOS
        .filter(d => !q || (d.nome + ' ' + d.plano + ' ' + d.estado).toLowerCase().indexOf(q) !== -1)
        .sort((a, b) => {
          const x = a[coluna], y = b[coluna];
          return (typeof x === 'number' ? x - y : String(x).localeCompare(String(y), 'pt')) * dir;
        });

      contagem.textContent = linhas.length + ' de ' + DADOS.length + ' registos';

      corpo.innerHTML = linhas.length ? linhas.map(d => `
        <tr>
          <th scope="row" style="font-weight:600">${d.nome}</th>
          <td>${d.plano}</td>
          <td><span class="badge ${CLASSE_ESTADO[d.estado]}">${d.estado}</span></td>
          <td class="num">${EUR.format(d.valor)}</td>
          <td>${DATA.format(new Date(d.data))}</td>
        </tr>`).join('')
        : `<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--c-texto-2)">
             Sem resultados para <strong>«${filtro.value}»</strong>.<br>
             <button class="btn btn--sm btn--ghost" data-tab="limpar" style="margin-top:12px">Limpar filtro</button>
           </td></tr>`;
    }

    $$('th[data-ordenar]', raiz).forEach(th => th.addEventListener('click', () => {
      const c = th.dataset.ordenar;
      dir = (c === coluna) ? -dir : 1;
      coluna = c;
      $$('th[data-ordenar]', raiz).forEach(o => o.setAttribute('aria-sort', 'none'));
      th.setAttribute('aria-sort', dir === 1 ? 'ascending' : 'descending');
      pintar();
    }));
    filtro.addEventListener('input', pintar);
    raiz.addEventListener('click', ev => {
      if (ev.target.dataset && ev.target.dataset.tab === 'limpar') { filtro.value = ''; pintar(); filtro.focus(); }
    });
    pintar();
  }

  /* --- abas --- */
  function initAbas(raiz) {
    const botoes = $$('[data-aba]', raiz);
    botoes.forEach(b => b.addEventListener('click', () => {
      botoes.forEach(o => o.setAttribute('aria-selected', String(o === b)));
      $$('[data-painel]', raiz).forEach(p => { p.hidden = p.dataset.painel !== b.dataset.aba; });
    }));
  }

  /* --- modal --- */
  function initModal(raiz) {
    const dlg = $('[data-demo="modal"]', raiz);
    const abrir = $('[data-demo="abrir-modal"]', raiz);
    abrir.addEventListener('click', () => dlg.showModal());
    $$('[data-fechar]', dlg).forEach(b => b.addEventListener('click', () => dlg.close()));
    dlg.addEventListener('close', () => abrir.focus());
  }

  /* --- registo de demos --- */
  function iniciarDemos() {
    const d = sel => $('[data-demo="' + sel + '"]');
    if (d('contraste')) initContraste(d('contraste'));
    if (d('tema'))      initTema(d('tema').parentNode);
    if (d('loading'))   initLoading(d('loading'));
    if (d('form'))      initForm(d('form'));
    if (d('tabela'))    initTabela(d('tabela'));
    if (d('abas'))      initAbas(d('abas'));
    if (d('modal'))     initModal(d('modal').parentNode);
    $$('[data-toast]').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.toast === 'ok') toast('ok', 'Guardado', 'A tua alteração foi aplicada.');
      else toast('erro', 'Não foi possível guardar', 'A ligação falhou. Tenta de novo.');
    }));
  }

  /* ---------------- ARRANQUE ---------------- */
  construirPainel();

  el.form.addEventListener('change', atualizarContador);

  el.busca.addEventListener('input', () => {
    const q = el.busca.value.trim().toLowerCase();
    $$('.opcao').forEach(o => { o.hidden = q && o.dataset.busca.indexOf(q) === -1; });
    $$('.grupo').forEach(g => { g.hidden = !$$('.opcao:not([hidden])', g).length; });
  });

  $('#btn-todos').addEventListener('click', () => definirSelecao(TOPICOS.map(t => t.id)));
  $('#btn-limpar').addEventListener('click', () => {
    definirSelecao([]);
    el.saida.hidden = true; el.vazio.hidden = false;
    try { localStorage.removeItem(CHAVE_SEL); history.replaceState(null, '', location.pathname); } catch (e) {}
  });
  $('#btn-mostrar').addEventListener('click', mostrar);
  $('#btn-imprimir').addEventListener('click', () => {
    if (el.saida.hidden) { toast('erro', 'Nada para imprimir', 'Seleciona tópicos e carrega em Mostrar conteúdo.'); return; }
    window.print();
  });
  $('#btn-abrir-menu').addEventListener('click', function () {
    const aberto = el.painel.classList.toggle('aberto');
    this.setAttribute('aria-expanded', String(aberto));
  });
  $$('[data-preset]').forEach(b => b.addEventListener('click', () => {
    definirSelecao(b.dataset.preset.split(','));
    mostrar();
  }));

  // seleção inicial: URL (#tabelas,temas) → localStorage → nada
  const doHash = location.hash.replace('#', '').split(',').filter(Boolean);
  const guardado = (() => { try { return (localStorage.getItem(CHAVE_SEL) || '').split(',').filter(Boolean); } catch (e) { return []; } })();
  const inicial = (doHash.length ? doHash : guardado).filter(id => TOPICOS.some(t => t.id === id));

  atualizarContador();
  if (inicial.length) { definirSelecao(inicial); mostrar(); }
})();
