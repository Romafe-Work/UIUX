/* =========================================================
   content.js — todo o conteúdo do manual.
   Cada tópico: { id, grupo, icone, titulo, resumo, html }
   Para acrescentar um tópico novo basta juntar um objeto aqui.
   ========================================================= */
window.CONTEUDO = [

/* ---------------- FUNDAMENTOS ---------------- */
{
  id: 'cores',
  grupo: 'Fundamentos',
  icone: '🎨',
  titulo: 'Cores &amp; Paleta',
  resumo: 'Escala de cor, contraste e uso semântico.',
  html: `
    <h3>Como construir a paleta</h3>
    <p>Uma paleta de produto não é "as cores de que gosto": é um sistema pequeno e previsível.
       Regra prática — <strong>1 cor de marca, 1 escala de neutros, 4 cores semânticas</strong>.</p>
    <ul>
      <li><strong>Marca (primária):</strong> ações principais, links e estados ativos. Uma só. Se tudo é destaque, nada é.</li>
      <li><strong>Neutros:</strong> 6 a 10 tons entre o fundo e o texto. Fazem 90% do ecrã.</li>
      <li><strong>Semânticas:</strong> sucesso, aviso, erro e informação — cada uma com versão forte (texto/ícone) e suave (fundo).</li>
      <li><strong>Proporção 60/30/10:</strong> 60% neutro de fundo, 30% superfícies e texto, 10% cor de marca.</li>
    </ul>

    <div class="demo">
      <p class="demo__titulo">Paleta deste manual</p>
      <div class="paleta">
        <div class="paleta__item"><div class="paleta__cor" style="background:var(--c-marca)"></div><div class="paleta__nome">Marca<code>--c-marca</code></div></div>
        <div class="paleta__item"><div class="paleta__cor" style="background:var(--c-ok)"></div><div class="paleta__nome">Sucesso<code>--c-ok</code></div></div>
        <div class="paleta__item"><div class="paleta__cor" style="background:var(--c-aviso)"></div><div class="paleta__nome">Aviso<code>--c-aviso</code></div></div>
        <div class="paleta__item"><div class="paleta__cor" style="background:var(--c-erro)"></div><div class="paleta__nome">Erro<code>--c-erro</code></div></div>
        <div class="paleta__item"><div class="paleta__cor" style="background:var(--c-texto)"></div><div class="paleta__nome">Texto<code>--c-texto</code></div></div>
        <div class="paleta__item"><div class="paleta__cor" style="background:var(--c-borda)"></div><div class="paleta__nome">Borda<code>--c-borda</code></div></div>
      </div>
    </div>

    <h3>Contraste (o ponto inegociável)</h3>
    <ul>
      <li>Texto normal: <strong>4.5:1</strong> mínimo. Texto grande (≥24px ou ≥19px bold): <strong>3:1</strong>.</li>
      <li>Elementos de interface (bordas de input, ícones com significado): <strong>3:1</strong>.</li>
      <li>Nunca uses <strong>só</strong> a cor para transmitir informação — junta ícone, texto ou padrão.</li>
    </ul>

    <div class="demo">
      <p class="demo__titulo">Verificador de contraste ao vivo</p>
      <div class="demo__linha" data-demo="contraste">
        <label class="campo">
          <span class="campo__label">Texto</span>
          <input type="color" class="input" value="#16191d" data-cor="frente" style="min-width:80px;padding:4px">
        </label>
        <label class="campo">
          <span class="campo__label">Fundo</span>
          <input type="color" class="input" value="#ffffff" data-cor="fundo" style="min-width:80px;padding:4px">
        </label>
        <div style="flex:1;min-width:200px">
          <div data-cor="amostra" style="padding:12px;border-radius:8px;border:1px solid var(--c-borda)">Exemplo de texto</div>
          <p style="margin:8px 0 0"><span class="badge" data-cor="racio">—</span></p>
        </div>
      </div>
    </div>

    <div class="regras">
      <div class="regras__caixa regras--faz"><h4>✔ Faz</h4><ul>
        <li>Define a cor em <em>tokens</em> (variáveis), nunca hex solto nos componentes.</li>
        <li>Nomeia por função (<code>--c-erro</code>) e não por aparência (<code>--vermelho</code>).</li>
        <li>Testa a paleta em cinzento (simula daltonismo/impressão).</li>
      </ul></div>
      <div class="regras__caixa regras--evita"><h4>✘ Evita</h4><ul>
        <li>Cinco cores de marca "porque a apresentação ficava bonita".</li>
        <li>Texto cinzento claro sobre branco (#aaa em #fff = 2.3:1, reprova).</li>
        <li>Vermelho/verde como única diferença entre dois estados.</li>
      </ul></div>
    </div>

    <pre class="codigo"><code><span class="com">/* tokens semânticos, não literais */</span>
:root {
  <span class="prop">--c-marca</span>: #3b5bfd;
  <span class="prop">--c-erro</span>:  #b3261e;
  <span class="prop">--c-texto</span>: #16191d;
}
.btn-primario { background: <span class="prop">var(--c-marca)</span>; color: #fff; }</code></pre>
  `
},

{
  id: 'temas',
  grupo: 'Fundamentos',
  icone: '🌗',
  titulo: 'Temas (claro / escuro)',
  resumo: 'Tokens, troca de tema e persistência.',
  html: `
    <h3>A regra de ouro</h3>
    <p>Tema não se faz "invertendo as cores". Faz-se com uma <strong>camada de tokens semânticos</strong>:
       os componentes falam só com os tokens; o tema decide o valor de cada token.</p>
    <ol>
      <li><strong>Tokens primitivos</strong> — a paleta bruta (<code>--azul-500</code>).</li>
      <li><strong>Tokens semânticos</strong> — a função (<code>--c-superficie</code>, <code>--c-texto</code>). É o que os componentes usam.</li>
      <li><strong>Tema</strong> — um bloco que redefine os semânticos: <code>[data-theme="dark"] { … }</code>.</li>
    </ol>

    <div class="nota">
      <strong>Três estados, não dois:</strong> claro, escuro e <em>automático</em> (segue o sistema).
      O automático deve ser o valor por omissão — é o que o utilizador já escolheu no SO.
    </div>

    <div class="demo">
      <p class="demo__titulo">Pré-visualização isolada — troca só esta caixa</p>
      <div class="demo__linha" style="margin-bottom:12px" data-demo="tema">
        <button class="btn btn--sm" data-preview-tema="light">☀️ Claro</button>
        <button class="btn btn--sm" data-preview-tema="dark">🌙 Escuro</button>
      </div>
      <div class="preview-tema" data-preview-alvo>
        <div class="cartao">
          <h4 style="margin:0 0 4px">Cartão de exemplo</h4>
          <p style="margin:0 0 12px;color:var(--c-texto-2);font-size:.875rem">Superfície, texto secundário e botão, todos por token.</p>
          <button class="btn btn--primario btn--sm">Ação principal</button>
          <button class="btn btn--ghost btn--sm">Secundária</button>
        </div>
      </div>
    </div>

    <h3>Escuro não é só "fundo preto"</h3>
    <ul>
      <li>Usa <strong>#0e1117 – #161b22</strong>, não <code>#000</code>: preto puro cria halos e cansa a vista.</li>
      <li><strong>Elevação por luminosidade:</strong> no escuro, o que está "mais acima" é mais claro (as sombras quase não se veem).</li>
      <li><strong>Dessatura</strong> as cores fortes — um azul vivo no escuro vibra e fica ilegível.</li>
      <li>Imagens e ilustrações precisam de variante ou de um véu (<code>filter: brightness(.9)</code>).</li>
    </ul>

    <pre class="codigo"><code><span class="com">/* 1. tema por atributo + respeito pelo sistema */</span>
:root { <span class="prop">--c-superficie</span>: #fff;    <span class="prop">--c-texto</span>: #16191d; }
[data-theme="dark"] { <span class="prop">--c-superficie</span>: #161b22; <span class="prop">--c-texto</span>: #e8edf4; }

<span class="com">/* 2. sem escolha explícita, segue o SO */</span>
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { <span class="prop">--c-superficie</span>: #161b22; <span class="prop">--c-texto</span>: #e8edf4; }
}</code></pre>

    <pre class="codigo"><code><span class="com">// 3. aplicar + guardar a preferência</span>
function aplicarTema(modo) {            <span class="com">// 'light' | 'dark' | 'auto'</span>
  const raiz = document.documentElement;
  if (modo === 'auto') raiz.removeAttribute('data-theme');
  else raiz.setAttribute('data-theme', modo);
  localStorage.setItem('tema', modo);
}
aplicarTema(localStorage.getItem('tema') || 'auto');</code></pre>

    <div class="regras">
      <div class="regras__caixa regras--faz"><h4>✔ Faz</h4><ul>
        <li>Aplicar o tema <em>antes</em> do primeiro paint (script no <code>&lt;head&gt;</code>) para evitar o flash branco.</li>
        <li>Declarar <code>color-scheme: light dark</code> para os controlos nativos acompanharem.</li>
        <li>Testar contraste nos <strong>dois</strong> temas — passar num não garante o outro.</li>
      </ul></div>
      <div class="regras__caixa regras--evita"><h4>✘ Evita</h4><ul>
        <li><code>filter: invert(1)</code> na página inteira.</li>
        <li>Hex fixos dentro dos componentes — o tema deixa de funcionar.</li>
        <li>Assumir escuro = poupa bateria em LCD (só em OLED).</li>
      </ul></div>
    </div>
  `
},

{
  id: 'tipografia',
  grupo: 'Fundamentos',
  icone: '🔤',
  titulo: 'Tipografia',
  resumo: 'Escala, hierarquia e legibilidade.',
  html: `
    <h3>Escala modular</h3>
    <p>Define <strong>5 a 7 tamanhos</strong> a partir de uma base de 16px com um rácio fixo (1.125, 1.2 ou 1.25).
       Tamanhos escolhidos "a olho" tornam-se 14 tamanhos diferentes ao fim de três sprints.</p>

    <div class="demo">
      <p class="demo__titulo">Escala em uso (rácio 1.25)</p>
      <div class="escala-tipo">
        <p style="font-size:2.25rem;font-weight:650">Título de página <span>36px / 650</span></p>
        <p style="font-size:1.75rem;font-weight:650">Título de secção <span>28px / 650</span></p>
        <p style="font-size:1.125rem;font-weight:600">Subtítulo <span>18px / 600</span></p>
        <p style="font-size:1rem">Corpo de texto — o tamanho a que se lê tudo o resto. <span>16px / 400</span></p>
        <p style="font-size:.875rem;color:var(--c-texto-2)">Texto de apoio e legendas <span>14px / 400</span></p>
        <p style="font-size:.75rem;color:var(--c-texto-3)">Metadados, etiquetas <span>12px / 400</span></p>
      </div>
    </div>

    <h3>Legibilidade</h3>
    <ul>
      <li><strong>Corpo nunca abaixo de 16px</strong> em web (e 14px é o mínimo absoluto para apoio).</li>
      <li><strong>Medida de linha: 45–75 caracteres</strong> (<code>max-width: 65ch</code>). Linhas largas perdem o leitor no regresso.</li>
      <li><strong>Altura de linha:</strong> 1.5–1.6 no corpo, 1.2–1.3 nos títulos. Quanto maior o texto, menor o <em>line-height</em>.</li>
      <li><strong>Pesos:</strong> chegam 2–3 (400, 600, 700). Evita itálico + bold + maiúsculas ao mesmo tempo.</li>
      <li>Alinha à <strong>esquerda</strong>. Justificado na web cria "rios" de espaço; centrado só em blocos curtos.</li>
    </ul>

    <div class="regras">
      <div class="regras__caixa regras--faz"><h4>✔ Faz</h4><ul>
        <li>Usar <code>rem</code> para o texto respeitar o zoom do utilizador.</li>
        <li><code>font-display: swap</code> e uma stack de fallback próxima.</li>
        <li>Hierarquia por tamanho <em>e</em> peso <em>e</em> cor — não só uma delas.</li>
      </ul></div>
      <div class="regras__caixa regras--evita"><h4>✘ Evita</h4><ul>
        <li>Mais de duas famílias tipográficas.</li>
        <li>MAIÚSCULAS em frases longas (–20% de velocidade de leitura).</li>
        <li>Texto sobre fotografia sem véu ou caixa de contraste.</li>
      </ul></div>
    </div>

    <pre class="codigo"><code>:root {
  <span class="prop">--t-sm</span>: .875rem; <span class="prop">--t-md</span>: 1rem; <span class="prop">--t-lg</span>: 1.125rem;
  <span class="prop">--t-xl</span>: 1.375rem; <span class="prop">--t-2xl</span>: 1.75rem;
}
body { font-size: <span class="prop">var(--t-md)</span>; line-height: 1.6; }
h1, h2 { line-height: 1.25; letter-spacing: -.01em; }
article p { max-width: 65ch; }</code></pre>
  `
},

{
  id: 'espacamento',
  grupo: 'Fundamentos',
  icone: '📏',
  titulo: 'Espaçamento &amp; Grelha',
  resumo: 'Escala de 4pt, ritmo vertical e agrupamento.',
  html: `
    <h3>Escala de 4 pontos</h3>
    <p>Todos os espaços são múltiplos de 4px: <strong>4, 8, 12, 16, 24, 32, 48, 64</strong>.
       Se um valor não está na escala, provavelmente estás a compensar outro problema.</p>

    <div class="demo">
      <p class="demo__titulo">A escala</p>
      <div class="espaco-barra" style="width:4px">&nbsp;</div><small>4 — entre ícone e texto</small>
      <div class="espaco-barra" style="width:8px;margin-top:8px">&nbsp;</div><small>8 — dentro de um componente</small>
      <div class="espaco-barra" style="width:16px;margin-top:8px">&nbsp;</div><small>16 — padding padrão</small>
      <div class="espaco-barra" style="width:24px;margin-top:8px">&nbsp;</div><small>24 — entre componentes</small>
      <div class="espaco-barra" style="width:48px;margin-top:8px">&nbsp;</div><small>48 — entre secções</small>
    </div>

    <h3>Proximidade = significado</h3>
    <p>A lei de Gestalt da proximidade diz que o que está junto é lido como um grupo.
       O espaço <strong>dentro</strong> de um grupo tem de ser menor do que o espaço <strong>entre</strong> grupos —
       a maior parte dos layouts confusos falha exatamente aqui.</p>
    <ul>
      <li>Label ↔ campo: <strong>4px</strong>. Campo ↔ campo seguinte: <strong>16–24px</strong>.</li>
      <li>Aplica o espaço numa só direção (ex.: <code>margin-bottom</code>) para não colapsar margens.</li>
      <li>Prefere <code>gap</code> em flex/grid a margens nos filhos.</li>
    </ul>

    <h3>Grelha e largura</h3>
    <ul>
      <li>Grelha de <strong>12 colunas</strong> em desktop, 4–6 em tablet, 1 em telemóvel.</li>
      <li>Largura máxima de conteúdo de leitura: <strong>720–900px</strong>. Painéis de dados podem ir a full-width.</li>
      <li>Alinha tudo a um número reduzido de "linhas de guia" verticais — o olho nota o desalinhamento de 3px.</li>
    </ul>

    <pre class="codigo"><code>:root { <span class="prop">--e-1</span>:4px; <span class="prop">--e-2</span>:8px; <span class="prop">--e-4</span>:16px; <span class="prop">--e-5</span>:24px; <span class="prop">--e-7</span>:48px; }

.cartao   { padding: <span class="prop">var(--e-4)</span>; }
.lista    { display: grid; gap: <span class="prop">var(--e-5)</span>; }
.grelha   { display: grid; grid-template-columns: repeat(12, 1fr); gap: <span class="prop">var(--e-5)</span>; }</code></pre>

    <div class="regras">
      <div class="regras__caixa regras--faz"><h4>✔ Faz</h4><ul>
        <li>Espaçar por tokens e não por números mágicos.</li>
        <li>Dar mais ar à volta do que é importante.</li>
      </ul></div>
      <div class="regras__caixa regras--evita"><h4>✘ Evita</h4><ul>
        <li><code>margin: 13px 7px</code> — ninguém consegue repetir isso.</li>
        <li>Encher todo o espaço branco: o vazio é estrutura, não desperdício.</li>
      </ul></div>
    </div>
  `
},

/* ---------------- COMPONENTES ---------------- */
{
  id: 'botoes',
  grupo: 'Componentes',
  icone: '🔘',
  titulo: 'Botões &amp; Ações',
  resumo: 'Hierarquia, estados e tamanhos de toque.',
  html: `
    <h3>Hierarquia visual</h3>
    <p>Por ecrã (ou por bloco), <strong>uma ação primária</strong>. As restantes descem de peso.
       Se há dois botões azuis lado a lado, o utilizador para para pensar.</p>

    <div class="demo">
      <p class="demo__titulo">Variantes</p>
      <div class="demo__linha">
        <button class="btn btn--primario">Primária</button>
        <button class="btn">Secundária</button>
        <button class="btn btn--ghost">Terciária</button>
        <button class="btn btn--perigo">Destrutiva</button>
        <button class="btn btn--primario" disabled>Desativada</button>
      </div>
    </div>

    <h3>Estados obrigatórios</h3>
    <p>Um botão não é uma caixa com texto: são <strong>seis</strong> estados desenhados.</p>
    <ul>
      <li><strong>Normal</strong> · <strong>Hover</strong> (feedback de ponteiro) · <strong>Focus</strong> (anel visível, teclado)</li>
      <li><strong>Active</strong> (pressionado) · <strong>Loading</strong> (bloqueia duplo clique) · <strong>Disabled</strong></li>
    </ul>

    <div class="demo">
      <p class="demo__titulo">Estado de carregamento (clica)</p>
      <div class="demo__linha">
        <button class="btn btn--primario" data-demo="loading">Guardar alterações</button>
        <span style="font-size:.875rem;color:var(--c-texto-2)">bloqueia novo clique e anuncia o resultado</span>
      </div>
    </div>

    <h3>Regras práticas</h3>
    <ul>
      <li><strong>Alvo mínimo de 44×44px</strong> em toque (WCAG 2.5.5 / iOS HIG). Em rato, 32px é aceitável.</li>
      <li><strong>Rótulo = verbo + objeto:</strong> "Guardar alterações", não "OK". O utilizador deve saber o que acontece sem ler o resto.</li>
      <li><strong>Botão vs. link:</strong> botão <em>faz</em> alguma coisa, link <em>navega</em>. Isto muda o teclado (Espaço vs. Enter) e o leitor de ecrã.</li>
      <li><strong>Destrutivo</strong> nunca ao lado do primário sem confirmação — e a confirmação diz o que se perde.</li>
      <li>Ícone sozinho precisa sempre de <code>aria-label</code>.</li>
    </ul>

    <pre class="codigo"><code><span class="tag">&lt;button</span> class="btn btn--primario" type="submit"<span class="tag">&gt;</span>Guardar alterações<span class="tag">&lt;/button&gt;</span>

<span class="com">&lt;!-- ícone sem texto: nome acessível obrigatório --&gt;</span>
<span class="tag">&lt;button</span> class="btn" aria-label="Eliminar ficheiro"<span class="tag">&gt;</span>🗑<span class="tag">&lt;/button&gt;</span>

<span class="com">&lt;!-- carregar --&gt;</span>
<span class="tag">&lt;button</span> class="btn" disabled aria-busy="true"<span class="tag">&gt;</span>A guardar…<span class="tag">&lt;/button&gt;</span></code></pre>

    <div class="regras">
      <div class="regras__caixa regras--faz"><h4>✔ Faz</h4><ul>
        <li>Ação principal à direita em modais, à esquerda em formulários longos.</li>
        <li>Manter a largura estável entre estados (evita saltos de layout).</li>
      </ul></div>
      <div class="regras__caixa regras--evita"><h4>✘ Evita</h4><ul>
        <li><code>&lt;div onclick&gt;</code> a fingir de botão — sem teclado, sem semântica.</li>
        <li>Desativar o botão de submissão até o formulário estar "perfeito" sem explicar porquê.</li>
        <li>Remover o <code>outline</code> de foco sem pôr nada no lugar.</li>
      </ul></div>
    </div>
  `
},

{
  id: 'formularios',
  grupo: 'Componentes',
  icone: '📝',
  titulo: 'Formulários &amp; Inputs',
  resumo: 'Labels, validação e mensagens de erro.',
  html: `
    <h3>Anatomia de um campo</h3>
    <p>Label sempre visível → campo → texto de ajuda → erro. O <em>placeholder</em> não substitui a label:
       desaparece ao escrever, tem contraste baixo e destrói a revisão do formulário preenchido.</p>

    <div class="demo">
      <p class="demo__titulo">Formulário exemplo — experimenta submeter vazio</p>
      <form data-demo="form" novalidate style="display:grid;gap:16px;max-width:420px">
        <label class="campo">
          <span class="campo__label">Email <span aria-hidden="true" style="color:var(--c-erro)">*</span></span>
          <input type="email" class="input" name="email" placeholder="nome@empresa.pt" autocomplete="email" required>
          <span class="campo__ajuda">Usamos apenas para a confirmação da conta.</span>
        </label>
        <label class="campo">
          <span class="campo__label">Palavra-passe <span aria-hidden="true" style="color:var(--c-erro)">*</span></span>
          <input type="password" class="input" name="pass" autocomplete="new-password" required minlength="8">
          <span class="campo__ajuda">Mínimo 8 caracteres.</span>
        </label>
        <label class="campo">
          <span class="campo__label">País</span>
          <select class="input" name="pais">
            <option>Portugal</option><option>Brasil</option><option>Espanha</option>
          </select>
        </label>
        <div class="demo__linha">
          <button class="btn btn--primario" type="submit">Criar conta</button>
          <button class="btn btn--ghost" type="reset">Limpar</button>
        </div>
      </form>
    </div>

    <h3>Validação</h3>
    <ul>
      <li><strong>Valida na saída do campo</strong> (blur), não a cada tecla — corrigir alguém a meio da escrita é hostil.</li>
      <li>Depois de haver erro, revalida <strong>enquanto escreve</strong> para o erro desaparecer assim que fica certo.</li>
      <li>A mensagem fica <strong>junto ao campo</strong>, não num alerta no topo (ou nos dois, com link).</li>
      <li>Diz <strong>o que fazer</strong>: "A palavra-passe precisa de 8 caracteres" &gt; "Valor inválido".</li>
      <li>Erro = cor + ícone + texto. Nunca só a borda vermelha.</li>
    </ul>

    <h3>Reduzir o esforço</h3>
    <ul>
      <li>Pede <strong>o mínimo</strong>. Cada campo extra custa conversões — pergunta "o que fazemos com isto?".</li>
      <li><code>autocomplete</code> correto e <code>inputmode</code> adequado (teclado numérico para NIF/telefone).</li>
      <li>Formata por ti: espaços no IBAN, maiúsculas no código postal. Nunca rejeites por causa de um espaço.</li>
      <li>Marca o que é <strong>opcional</strong> se a maioria for obrigatório (ou vice-versa) — não os dois.</li>
      <li>Um formulário longo → passos com progresso visível e guardar rascunho.</li>
    </ul>

    <pre class="codigo"><code><span class="tag">&lt;label</span> for="email"<span class="tag">&gt;</span>Email<span class="tag">&lt;/label&gt;</span>
<span class="tag">&lt;input</span> id="email" type="email" autocomplete="email"
       aria-describedby="email-ajuda email-erro" aria-invalid="true"<span class="tag">&gt;</span>
<span class="tag">&lt;p</span> id="email-ajuda"<span class="tag">&gt;</span>Usamos para a confirmação.<span class="tag">&lt;/p&gt;</span>
<span class="tag">&lt;p</span> id="email-erro" role="alert"<span class="tag">&gt;</span>Falta o @ no endereço.<span class="tag">&lt;/p&gt;</span></code></pre>
  `
},

{
  id: 'tabelas',
  grupo: 'Componentes',
  icone: '🧮',
  titulo: 'Tabelas de dados',
  resumo: 'Densidade, ordenação, filtros e estados.',
  html: `
    <h3>Para que serve uma tabela</h3>
    <p>Tabela é para <strong>comparar</strong> registos por atributos. Se o utilizador só quer ver "o que aconteceu",
       uma lista ou cartões servem melhor. Só usa tabela quando as colunas são realmente comparáveis entre si.</p>

    <div class="demo">
      <p class="demo__titulo">Tabela ao vivo — ordena pelas colunas e filtra</p>
      <div data-demo="tabela">
        <div class="demo__linha" style="margin-bottom:12px">
          <input type="search" class="input" data-tab="filtro" placeholder="Filtrar por nome ou plano…" style="max-width:280px">
          <span class="badge badge--marca" data-tab="contagem">—</span>
        </div>
        <div class="tabela-wrap">
          <table class="tabela">
            <caption class="sr-only">Clientes e faturação</caption>
            <thead>
              <tr>
                <th data-ordenar="nome" aria-sort="none">Cliente</th>
                <th data-ordenar="plano" aria-sort="none">Plano</th>
                <th data-ordenar="estado" aria-sort="none">Estado</th>
                <th data-ordenar="valor" aria-sort="none" class="num">Valor mensal</th>
                <th data-ordenar="data" aria-sort="none">Renovação</th>
              </tr>
            </thead>
            <tbody data-tab="corpo"></tbody>
          </table>
        </div>
        <p style="font-size:.75rem;color:var(--c-texto-3);margin:8px 0 0">Cabeçalho fixo, números alinhados à direita, estado com etiqueta + texto.</p>
      </div>
    </div>

    <h3>Regras de leitura</h3>
    <ul>
      <li><strong>Texto à esquerda, números à direita</strong>, com <code>font-variant-numeric: tabular-nums</code> para as casas alinharem.</li>
      <li><strong>Cabeçalho fixo</strong> (<code>position: sticky</code>) — sem ele, ao 15.º registo já ninguém sabe que coluna é qual.</li>
      <li>Primeira coluna = <strong>identificador</strong> do registo. É por ela que a pessoa se orienta.</li>
      <li><strong>Densidade:</strong> 40–48px por linha (confortável) ou 32px (compacta). Oferece a escolha em tabelas de trabalho.</li>
      <li>Linhas zebradas <em>ou</em> separadores — não os dois. Hover na linha inteira ajuda a seguir na horizontal.</li>
      <li>Máximo <strong>5–7 colunas</strong> visíveis; o resto vai para "ver detalhe" ou um seletor de colunas.</li>
    </ul>

    <h3>Interações essenciais</h3>
    <ul>
      <li><strong>Ordenação:</strong> indicador visível na coluna ativa (↑/↓) e <code>aria-sort</code> para leitores de ecrã. A ordem por omissão deve ser a mais útil, não a do ID.</li>
      <li><strong>Filtro e pesquisa:</strong> acima da tabela, com contagem de resultados ("12 de 340").</li>
      <li><strong>Paginação vs. scroll infinito:</strong> em dados de trabalho, paginação — o utilizador precisa de saber onde está e de voltar.</li>
      <li><strong>Seleção múltipla:</strong> checkbox na 1.ª coluna + barra de ações que aparece com a seleção, sempre com "Selecionar tudo" explícito.</li>
      <li><strong>Ações por linha</strong> à direita; se forem mais de duas, menu "⋯".</li>
    </ul>

    <h3>Os três estados que se esquecem</h3>
    <ul>
      <li><strong>Vazio inicial:</strong> explica o que aparecerá aqui e dá a ação para criar o primeiro registo.</li>
      <li><strong>Vazio por filtro:</strong> "Sem resultados para «x»" + botão para limpar o filtro. Nunca a mesma mensagem do vazio inicial.</li>
      <li><strong>A carregar:</strong> esqueleto com o formato das linhas (não um spinner centrado que rebenta o layout).</li>
    </ul>

    <div class="demo">
      <p class="demo__titulo">Estado "a carregar" (skeleton)</p>
      <div class="tabela-wrap" style="padding:16px">
        <div class="skeleton" style="width:100%"></div>
        <div class="skeleton" style="width:92%"></div>
        <div class="skeleton" style="width:96%"></div>
        <div class="skeleton" style="width:70%;margin-bottom:0"></div>
      </div>
    </div>

    <h3>Em telemóvel</h3>
    <ul>
      <li>Scroll horizontal com a 1.ª coluna fixa, <strong>ou</strong> transformar cada linha num cartão (label + valor).</li>
      <li>Nunca encolher a fonte para caber tudo: 11px numa tabela é ilegível.</li>
    </ul>

    <pre class="codigo"><code><span class="tag">&lt;table</span> class="tabela"<span class="tag">&gt;</span>
  <span class="tag">&lt;caption&gt;</span>Clientes e faturação<span class="tag">&lt;/caption&gt;</span>
  <span class="tag">&lt;thead&gt;&lt;tr&gt;</span>
    <span class="tag">&lt;th</span> scope="col" aria-sort="ascending"<span class="tag">&gt;</span>Cliente<span class="tag">&lt;/th&gt;</span>
    <span class="tag">&lt;th</span> scope="col" class="num"<span class="tag">&gt;</span>Valor<span class="tag">&lt;/th&gt;</span>
  <span class="tag">&lt;/tr&gt;&lt;/thead&gt;</span>
  <span class="tag">&lt;tbody&gt;&lt;tr&gt;</span>
    <span class="tag">&lt;th</span> scope="row"<span class="tag">&gt;</span>Padaria Central<span class="tag">&lt;/th&gt;</span>
    <span class="tag">&lt;td</span> class="num"<span class="tag">&gt;</span>149,00 €<span class="tag">&lt;/td&gt;</span>
  <span class="tag">&lt;/tr&gt;&lt;/tbody&gt;</span>
<span class="tag">&lt;/table&gt;</span></code></pre>

    <div class="regras">
      <div class="regras__caixa regras--faz"><h4>✔ Faz</h4><ul>
        <li><code>&lt;th scope&gt;</code> e <code>&lt;caption&gt;</code> — é o que dá sentido à tabela sem visão.</li>
        <li>Manter o filtro e a ordenação no URL (partilhável, sobrevive ao refresh).</li>
        <li>Alinhar unidades e casas decimais de forma consistente.</li>
      </ul></div>
      <div class="regras__caixa regras--evita"><h4>✘ Evita</h4><ul>
        <li>Tabelas para <em>layout</em>. Isso é grid/flex.</li>
        <li>Truncar sem tooltip nem forma de ver o valor completo.</li>
        <li>Ações destrutivas em ícone minúsculo colado ao "editar".</li>
      </ul></div>
    </div>
  `
},

{
  id: 'navegacao',
  grupo: 'Componentes',
  icone: '🧭',
  titulo: 'Navegação',
  resumo: 'Menus, breadcrumbs, abas e estado ativo.',
  html: `
    <h3>Três perguntas</h3>
    <p>Boa navegação responde sempre a: <strong>onde estou?</strong>, <strong>o que posso fazer?</strong>,
       <strong>como volto atrás?</strong></p>

    <div class="demo">
      <p class="demo__titulo">Breadcrumbs — "onde estou"</p>
      <nav class="breadcrumbs" aria-label="Trilho de navegação">
        <a href="#">Início</a><span>/</span><a href="#">Clientes</a><span>/</span>
        <span aria-current="page" style="color:var(--c-texto);font-weight:600">Padaria Central</span>
      </nav>
    </div>

    <div class="demo">
      <p class="demo__titulo">Abas — conteúdo irmão, mesmo nível</p>
      <div data-demo="abas">
        <div class="abas" role="tablist">
          <button role="tab" aria-selected="true" data-aba="1">Resumo</button>
          <button role="tab" aria-selected="false" data-aba="2">Faturação</button>
          <button role="tab" aria-selected="false" data-aba="3">Histórico</button>
        </div>
        <div data-painel="1">Dados gerais do cliente.</div>
        <div data-painel="2" hidden>Faturas e método de pagamento.</div>
        <div data-painel="3" hidden>Registo de alterações.</div>
      </div>
    </div>

    <h3>Regras</h3>
    <ul>
      <li><strong>Estado ativo sempre visível</strong> — e não apenas por cor (peso, barra lateral, fundo).</li>
      <li><strong>Máximo 7 itens</strong> no nível principal; acima disso o utilizador deixa de os ver como conjunto.</li>
      <li><strong>Rótulos do domínio do utilizador</strong>: "Faturas", não "Módulo financeiro v2".</li>
      <li><strong>Profundidade ≤ 3 níveis.</strong> Ao quarto nível, ninguém sabe onde está.</li>
      <li>O <strong>logo liga sempre ao início</strong>. Convenção que já não se discute.</li>
      <li>Em telemóvel, as 3–5 ações mais usadas ficam numa barra inferior alcançável pelo polegar.</li>
      <li>Abas ≠ passos. Passos têm ordem e progresso; abas não.</li>
    </ul>

    <div class="regras">
      <div class="regras__caixa regras--faz"><h4>✔ Faz</h4><ul>
        <li>Marcar a página atual com <code>aria-current="page"</code>.</li>
        <li>Manter a navegação no mesmo sítio em todos os ecrãs.</li>
        <li>Pesquisa visível quando há muito conteúdo.</li>
      </ul></div>
      <div class="regras__caixa regras--evita"><h4>✘ Evita</h4><ul>
        <li>Menu hambúrguer em desktop — esconde o que devia convidar.</li>
        <li>Submenus que abrem só em hover (impossíveis em toque).</li>
        <li>Ícones sem texto na navegação principal.</li>
      </ul></div>
    </div>
  `
},

{
  id: 'feedback',
  grupo: 'Componentes',
  icone: '💬',
  titulo: 'Feedback &amp; Estados',
  resumo: 'Alertas, toasts, loading, vazio e erro.',
  html: `
    <h3>O sistema tem de responder sempre</h3>
    <p>Primeira heurística de Nielsen: <em>visibilidade do estado do sistema</em>.
       Toda a ação tem resposta em <strong>menos de 100ms</strong>; acima de 1s precisa de indicador; acima de 10s, de progresso real.</p>

    <div class="demo">
      <p class="demo__titulo">Alertas — persistentes, no contexto</p>
      <div class="alerta alerta--info"><span>ℹ️</span><div>A tua subscrição renova a 14 de setembro.</div></div>
      <div class="alerta alerta--ok"><span>✅</span><div>Perfil atualizado com sucesso.</div></div>
      <div class="alerta alerta--aviso"><span>⚠️</span><div>Faltam dados de faturação para emitir recibo.</div></div>
      <div class="alerta alerta--erro" style="margin-bottom:0"><span>⛔</span><div>Não foi possível guardar. <a href="#">Tentar de novo</a>.</div></div>
    </div>

    <div class="demo">
      <p class="demo__titulo">Toasts — efémeros, para confirmar ações</p>
      <div class="demo__linha">
        <button class="btn btn--sm" data-toast="ok">Mostrar sucesso</button>
        <button class="btn btn--sm" data-toast="erro">Mostrar erro</button>
      </div>
    </div>

    <h3>Qual usar</h3>
    <ul>
      <li><strong>Inline</strong> (junto ao campo/linha): erro de validação, aviso específico daquele item.</li>
      <li><strong>Alerta na página</strong>: estado que persiste e condiciona o que a pessoa pode fazer.</li>
      <li><strong>Toast</strong>: confirmação de ação bem-sucedida. 4–6s, dispensável, nunca para erros que exigem ação.</li>
      <li><strong>Modal</strong>: só quando é preciso interromper (confirmar destruição, perda de dados).</li>
    </ul>

    <h3>Estados de carregamento</h3>
    <ul>
      <li><strong>Skeleton</strong> quando conheces o formato do que vem — mantém o layout estável.</li>
      <li><strong>Spinner</strong> apenas para esperas curtas e localizadas (dentro do botão).</li>
      <li><strong>Otimista</strong>: mostra já o resultado e reverte com aviso se falhar. Ótimo para "gostar", mau para pagamentos.</li>
      <li>Reserva o espaço antes de chegar o conteúdo — nada salta.</li>
    </ul>

    <h3>Mensagens de erro que servem para alguma coisa</h3>
    <ol>
      <li><strong>O que falhou</strong>, em linguagem humana.</li>
      <li><strong>Porquê</strong>, se ajudar.</li>
      <li><strong>O que fazer agora</strong> — com o botão para o fazer.</li>
    </ol>
    <div class="nota">
      <strong>Mau:</strong> "Erro 500: unexpected token" · <strong>Bom:</strong>
      "Não conseguimos guardar as alterações. A ligação caiu — as tuas alterações estão guardadas em rascunho. [Tentar de novo]"
    </div>

    <h3>Estados vazios</h3>
    <ul>
      <li>Explica o que aparece ali, mostra a ação principal e, se possível, um exemplo ou dados de demonstração.</li>
      <li>Distingue <strong>vazio inicial</strong> (oportunidade) de <strong>vazio por filtro</strong> (com "limpar filtros") e de <strong>erro</strong>.</li>
    </ul>
  `
},

{
  id: 'modais',
  grupo: 'Componentes',
  icone: '🪟',
  titulo: 'Modais &amp; Overlays',
  resumo: 'Quando interromper e como fazê-lo bem.',
  html: `
    <h3>Antes de abrir, pergunta se é preciso</h3>
    <p>Um modal <strong>bloqueia</strong> a pessoa. Justifica-se quando: é preciso confirmar algo irreversível,
       falta uma decisão para continuar, ou é uma tarefa curta e focada. Não se justifica para mostrar informação
       que cabia na página, nem para marketing.</p>

    <div class="demo">
      <p class="demo__titulo">Modal de confirmação destrutiva</p>
      <div class="demo__linha">
        <button class="btn btn--perigo" data-demo="abrir-modal">Eliminar conta</button>
      </div>
      <dialog class="modal" data-demo="modal">
        <div class="modal__cab"><h3>Eliminar a conta?</h3></div>
        <div class="modal__corpo">
          Esta ação é <strong>permanente</strong>. Perdes 3 projetos, 128 ficheiros e o histórico de faturação.
          Não é possível recuperar.
        </div>
        <div class="modal__pe">
          <button class="btn btn--ghost" data-fechar>Cancelar</button>
          <button class="btn btn--perigo" data-fechar>Eliminar definitivamente</button>
        </div>
      </dialog>
    </div>

    <h3>Comportamento obrigatório</h3>
    <ul>
      <li><strong>Foco entra</strong> no modal ao abrir (no título ou no primeiro controlo).</li>
      <li><strong>Foco fica preso</strong> lá dentro enquanto estiver aberto (Tab não sai para trás).</li>
      <li><strong>Esc fecha</strong>, e o foco <strong>volta</strong> ao elemento que o abriu.</li>
      <li>O fundo <strong>não faz scroll</strong>. Se o conteúdo do modal for longo, ele é que rola.</li>
      <li><code>&lt;dialog&gt;</code> com <code>showModal()</code> dá quase tudo isto de graça — usa-o.</li>
    </ul>

    <h3>Escrita</h3>
    <ul>
      <li>Título = a pergunta ("Eliminar a conta?"). Corpo = a consequência concreta, com números.</li>
      <li>Botão = a ação ("Eliminar definitivamente"), não "Sim"/"OK".</li>
      <li>A ação destrutiva não pode ser a que está debaixo do dedo por omissão.</li>
    </ul>

    <pre class="codigo"><code><span class="tag">&lt;dialog</span> id="confirmar" aria-labelledby="t"<span class="tag">&gt;</span>
  <span class="tag">&lt;h2</span> id="t"<span class="tag">&gt;</span>Eliminar a conta?<span class="tag">&lt;/h2&gt;</span>
  …
<span class="tag">&lt;/dialog&gt;</span>

<span class="com">// abre com foco preso e Esc a fechar, sem bibliotecas</span>
confirmar.showModal();</code></pre>

    <div class="regras">
      <div class="regras__caixa regras--faz"><h4>✔ Faz</h4><ul>
        <li>Um modal de cada vez. Nunca empilhar.</li>
        <li>Preferir painel lateral (drawer) para tarefas em que o contexto de fundo interessa.</li>
      </ul></div>
      <div class="regras__caixa regras--evita"><h4>✘ Evita</h4><ul>
        <li>Modal que aparece sozinho ao fim de 3 segundos.</li>
        <li>X minúsculo como única forma de fechar.</li>
        <li>Formulários enormes dentro de um modal.</li>
      </ul></div>
    </div>
  `
},

/* ---------------- PRÁTICAS ---------------- */
{
  id: 'acessibilidade',
  grupo: 'Práticas',
  icone: '♿',
  titulo: 'Acessibilidade',
  resumo: 'Teclado, contraste, semântica e leitores de ecrã.',
  html: `
    <h3>Não é uma camada extra</h3>
    <p>Acessibilidade é qualidade de base: legendas ajudam quem vê num sítio barulhento, contraste ajuda ao sol,
       teclado ajuda quem trabalha depressa. Em Portugal e na UE é ainda obrigação legal
       (<strong>EN 301 549 / WCAG 2.1 AA</strong>).</p>

    <h3>Checklist mínima (dá para fazer hoje)</h3>
    <ol>
      <li><strong>Navega o ecrã só com Tab.</strong> Chegas a tudo? A ordem faz sentido? Vês sempre onde estás?</li>
      <li><strong>HTML semântico</strong>: <code>button</code>, <code>nav</code>, <code>main</code>, <code>h1…h3</code> em ordem. ARIA só quando o HTML não chega.</li>
      <li><strong>Contraste</strong> 4.5:1 no texto, 3:1 em bordas e ícones com significado.</li>
      <li><strong>Labels</strong> ligadas por <code>for</code>/<code>id</code>; ícones sozinhos com <code>aria-label</code>.</li>
      <li><strong>Alt</strong> descritivo nas imagens com conteúdo; <code>alt=""</code> nas decorativas.</li>
      <li><strong>Zoom a 200%</strong> sem perder conteúdo nem scroll horizontal.</li>
      <li><strong>Erros anunciados</strong> com <code>role="alert"</code> / <code>aria-live</code>.</li>
      <li><strong>Respeita <code>prefers-reduced-motion</code></strong> — animações grandes provocam náusea a algumas pessoas.</li>
    </ol>

    <div class="demo">
      <p class="demo__titulo">Foco visível — carrega Tab até chegar aqui</p>
      <div class="demo__linha">
        <button class="btn foco-demo">Primeiro</button>
        <button class="btn foco-demo">Segundo</button>
        <a href="#acessibilidade" class="btn btn--ghost foco-demo">Link</a>
      </div>
      <p style="font-size:.75rem;color:var(--c-texto-3);margin:12px 0 0">Anel de 3px com afastamento — visível nos dois temas.</p>
    </div>

    <div class="nota">
      <strong>Nunca faças</strong> <code>*:focus { outline: none }</code> sem substituto.
      É a forma mais rápida de tornar um produto inutilizável para quem usa teclado.
    </div>

    <h3>Alvos, movimento e tempo</h3>
    <ul>
      <li>Alvos de toque ≥ <strong>44×44px</strong> com espaço entre eles.</li>
      <li>Nada depende só de <em>hover</em> — em toque não existe.</li>
      <li>Se há tempo limite, avisa e permite estender.</li>
      <li>Nada pisca mais de 3× por segundo (risco de convulsão).</li>
    </ul>

    <pre class="codigo"><code><span class="com">&lt;!-- semântica primeiro; ARIA só a preencher lacunas --&gt;</span>
<span class="tag">&lt;nav</span> aria-label="Principal"<span class="tag">&gt;…&lt;/nav&gt;</span>
<span class="tag">&lt;button</span> aria-expanded="false" aria-controls="menu"<span class="tag">&gt;</span>Menu<span class="tag">&lt;/button&gt;</span>
<span class="tag">&lt;p</span> role="alert"<span class="tag">&gt;</span>Falta o @ no endereço.<span class="tag">&lt;/p&gt;</span>

<span class="com">/* respeitar quem pediu menos movimento */</span>
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}</code></pre>
  `
},

{
  id: 'responsivo',
  grupo: 'Práticas',
  icone: '📱',
  titulo: 'Responsividade',
  resumo: 'Mobile-first, breakpoints e toque.',
  html: `
    <h3>Mobile-first a sério</h3>
    <p>Começar pelo ecrã pequeno obriga a decidir o que é essencial. O caminho inverso — desenhar em desktop
       e depois "encolher" — produz sempre menus escondidos e tabelas espremidas.</p>

    <h3>Breakpoints</h3>
    <ul>
      <li>Define-os pelo <strong>conteúdo</strong>, não pelos modelos de telemóvel do ano. Quando o layout parte, há um breakpoint.</li>
      <li>Referência habitual: <strong>&lt;600px</strong> telemóvel · <strong>600–1024px</strong> tablet · <strong>&gt;1024px</strong> desktop.</li>
      <li>Prefere layout fluido a saltos: <code>clamp()</code>, <code>minmax()</code>, <code>auto-fit</code> resolvem sem media queries.</li>
      <li><strong>Container queries</strong> quando o componente deve reagir ao espaço que tem, não ao ecrã.</li>
    </ul>

    <pre class="codigo"><code><span class="com">/* grelha fluida sem media queries */</span>
.cartoes { display: grid; gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }

<span class="com">/* tipografia que acompanha o ecrã, com limites */</span>
h1 { font-size: clamp(1.75rem, 1.2rem + 2vw, 2.75rem); }

<span class="com">/* o componente reage ao seu contentor */</span>
.painel { container-type: inline-size; }
@container (min-width: 480px) { .painel .linha { display: flex; } }</code></pre>

    <h3>Toque</h3>
    <ul>
      <li>Alvos ≥ 44px e 8px de espaço entre eles.</li>
      <li>Ações principais na <strong>zona do polegar</strong> (metade inferior).</li>
      <li>Não escondas ações críticas atrás de <em>swipe</em> sem alternativa visível.</li>
      <li>Usa <code>dvh</code> em vez de <code>vh</code> — a barra do browser move-se e o <code>vh</code> mente.</li>
      <li><code>viewport</code> sem <code>maximum-scale=1</code>: bloquear zoom é uma falha de acessibilidade.</li>
    </ul>

    <h3>Teste rápido</h3>
    <ul>
      <li>Redimensiona a janela de 320px a 1600px continuamente — não pode haver scroll horizontal em nenhum ponto.</li>
      <li>Zoom a 200%: continua utilizável?</li>
      <li>Texto longo (nomes alemães, emails compridos) não parte o layout?</li>
    </ul>
  `
},

{
  id: 'microcopy',
  grupo: 'Práticas',
  icone: '✍️',
  titulo: 'Microcopy (escrita de interface)',
  resumo: 'O texto é interface — clareza acima de esperteza.',
  html: `
    <h3>Princípios</h3>
    <ul>
      <li><strong>Clareza &gt; brevidade &gt; esperteza.</strong> Uma palavra a mais que evita uma dúvida vale a pena.</li>
      <li><strong>Voz ativa e 2.ª pessoa:</strong> "Guarda as alterações antes de sair" &gt; "As alterações devem ser guardadas".</li>
      <li><strong>Vocabulário do utilizador</strong>, não o da base de dados. "Fatura", não "documento tipo FT".</li>
      <li><strong>Consistência</strong>: se é "Eliminar" num sítio, não é "Apagar" no outro.</li>
      <li>Sem culpar: "Não conseguimos ligar-nos" &gt; "Introduziste dados inválidos".</li>
    </ul>

    <div class="demo">
      <p class="demo__titulo">Antes → depois</p>
      <div class="tabela-wrap">
        <table class="tabela">
          <thead><tr><th>Contexto</th><th>❌ Antes</th><th>✅ Depois</th></tr></thead>
          <tbody>
            <tr><td>Botão</td><td>Submeter</td><td>Criar conta</td></tr>
            <tr><td>Erro</td><td>Campo inválido</td><td>O email precisa de um @</td></tr>
            <tr><td>Vazio</td><td>Sem dados</td><td>Ainda não há faturas. Cria a primeira.</td></tr>
            <tr><td>Confirmação</td><td>Tens a certeza?</td><td>Eliminar 3 projetos? Não é recuperável.</td></tr>
            <tr><td>Carregar</td><td>A processar…</td><td>A enviar 12 ficheiros (3 de 12)</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <h3>Detalhes que contam</h3>
    <ul>
      <li>Datas por extenso onde há ambiguidade ("14 set 2026", não "14/09/26" para público internacional).</li>
      <li>Números grandes formatados à moda local (1 250,50 €).</li>
      <li>Estados no <strong>presente</strong> ("Ativo", "Em pausa"), ações no <strong>infinitivo/imperativo</strong> ("Pausar").</li>
      <li>Evita "simplesmente", "basta", "é só" — se corre mal, a pessoa sente-se estúpida.</li>
    </ul>
  `
},

{
  id: 'heuristicas',
  grupo: 'Práticas',
  icone: '🧠',
  titulo: 'Heurísticas &amp; Leis de UX',
  resumo: 'Nielsen, Fitts, Hick, Miller — em versão prática.',
  html: `
    <h3>As 10 heurísticas de Nielsen (resumo utilizável)</h3>
    <ol>
      <li><strong>Visibilidade do estado</strong> — o sistema diz sempre o que está a acontecer.</li>
      <li><strong>Linguagem do mundo real</strong> — palavras do utilizador, ordem lógica para ele.</li>
      <li><strong>Controlo e liberdade</strong> — saída de emergência clara: cancelar, anular, voltar.</li>
      <li><strong>Consistência e normas</strong> — o mesmo elemento faz o mesmo em todo o lado.</li>
      <li><strong>Prevenção de erros</strong> — melhor impedir do que avisar depois.</li>
      <li><strong>Reconhecer &gt; recordar</strong> — mostra as opções, não obrigues a memorizar.</li>
      <li><strong>Flexibilidade</strong> — atalhos para experientes sem estorvar principiantes.</li>
      <li><strong>Design minimalista</strong> — cada elemento extra compete com o importante.</li>
      <li><strong>Erros compreensíveis</strong> — em linguagem humana, com solução.</li>
      <li><strong>Ajuda</strong> — documentação fácil de procurar, no contexto.</li>
    </ol>

    <h3>Leis com consequência prática</h3>
    <ul>
      <li><strong>Fitts:</strong> alvo maior e mais perto = mais rápido de acertar. Botões primários grandes; cantos e bordas do ecrã são infinitamente "grandes".</li>
      <li><strong>Hick:</strong> mais opções = mais tempo de decisão. Divide, agrupa, esconde o avançado.</li>
      <li><strong>Miller:</strong> a memória de trabalho aguenta ~4–7 itens. Agrupa (telefone: 912 345 678).</li>
      <li><strong>Jakob:</strong> as pessoas passam a maior parte do tempo <em>noutros</em> sites — segue as convenções, inova onde acrescenta valor.</li>
      <li><strong>Proximidade (Gestalt):</strong> o que está junto pertence junto. Ver <em>Espaçamento</em>.</li>
      <li><strong>Efeito de posição serial:</strong> lembramos o primeiro e o último item — põe o importante nos extremos.</li>
      <li><strong>Doherty:</strong> abaixo de 400ms de resposta a atenção mantém-se; acima disso, dispersa.</li>
    </ul>

    <div class="nota">
      <strong>Como usar isto numa revisão:</strong> percorre o ecrã e para em cada elemento perguntando
      "que heurística é que isto viola?". Cinco minutos por ecrã apanham a maioria dos problemas
      antes de qualquer teste com utilizadores.
    </div>

    <h3>Processo em 5 passos</h3>
    <ol>
      <li><strong>Perceber</strong> — quem é, o que precisa, em que contexto. Sem isto é decoração.</li>
      <li><strong>Definir</strong> — o problema numa frase e o critério de sucesso mensurável.</li>
      <li><strong>Explorar</strong> — 3 soluções diferentes antes de escolher. A primeira ideia raramente é a melhor.</li>
      <li><strong>Prototipar</strong> — o mais baixa fidelidade que responda à pergunta.</li>
      <li><strong>Testar</strong> — 5 pessoas encontram ~85% dos problemas de usabilidade. Observa, não expliques.</li>
    </ol>
  `
}

];
