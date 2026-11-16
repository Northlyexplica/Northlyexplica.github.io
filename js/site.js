const HOSTS_SOCIAIS = [
  'instagram.com',
  'x.com',
  'twitter.com',
  'tiktok.com',
  'threads.net',
  'youtube.com',
  'youtu.be',
  'linkedin.com',
];

const ICONES = {
  instagram:
    '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="0.9"/>',
  x: '<path d="M5 5l14 14"/><path d="M19 5L5 19"/>',
  tiktok:
    '<path d="M14 7.2c.7 1.8 2 3.2 4.2 3.6"/><path d="M14 7v8.2a3.6 3.6 0 1 1-2.6-3.46"/>',
  threads:
    '<circle cx="12" cy="12" r="8.2"/><path d="M9.2 10.2c.7-1.6 2.4-2.4 4-1.8 1.5.5 2.2 1.8 2 3.4-.3 2.4-2.2 3.8-4.4 3.6-2.2-.2-3.6-1.6-3.8-3.4.2-1.6 1.2-2.6 2.6-2.8 1.5-.2 2.6.6 2.8 1.8"/>',
  youtube:
    '<rect x="3" y="6.5" width="18" height="11" rx="3"/><path d="M11 10l4.2 2.2L11 14.4z"/>',
  linkedin:
    '<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M8 11v6"/><path d="M8 8h.01"/><path d="M12 17v-3.4a2 2 0 0 1 4 0V17"/>',
  pin: '<path d="M12 21s-6-5.2-6-10a6 6 0 0 1 12 0c0 4.8-6 10-6 10z"/><circle cx="12" cy="11" r="2"/>',
  externo: '<path d="M14 5h5v5"/><path d="M19 5l-8 8"/><path d="M16 13.5V19H5V8h5.5"/>',
};

const estado = {
  tema: 'tudo',
  noticias: [],
  agenda: [],
  redes: [],
};

export function dataIsoValida(valor) {
  return typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(valor);
}

export function hojeSP(agora = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(agora);
}

export function formatarData(iso) {
  if (!dataIsoValida(iso)) return '';
  const [ano, mes, dia] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(ano, mes - 1, dia)));
}

export function partesData(iso) {
  const [ano, mes, dia] = iso.split('-').map(Number);
  const nomeMes = new Intl.DateTimeFormat('pt-BR', {
    month: 'short',
    timeZone: 'UTC',
  })
    .format(new Date(Date.UTC(ano, mes - 1, dia)))
    .replace('.', '');
  return { dia: String(dia), mes: nomeMes, ano: String(ano) };
}

export function urlSegura(valor) {
  if (typeof valor !== 'string') return '';
  const textoUrl = valor.trim();
  if (!textoUrl || textoUrl.length > 4096 || textoUrl.startsWith('//')) return '';
  if (/[\s<>"']/.test(textoUrl)) return '';
  if (!textoUrl.includes('://')) {
    if (textoUrl.startsWith('/') || /^[\w./~-]+$/.test(textoUrl)) return textoUrl;
    return '';
  }
  try {
    const url = new URL(textoUrl);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
    if (url.username || url.password) return '';
    return url.toString();
  } catch {
    return '';
  }
}

export function hostEhSocial(hostname) {
  const host = String(hostname || '')
    .toLowerCase()
    .replace(/\.$/, '');
  return HOSTS_SOCIAIS.some((dominio) => host === dominio || host.endsWith(`.${dominio}`));
}

export function aplicarUtm(url, { data, pilar, secao } = {}) {
  const limpa = urlSegura(url);
  if (!limpa) return '';
  let absoluta;
  try {
    absoluta = new URL(limpa, 'https://northlyexplica.github.io');
  } catch {
    return '';
  }
  if (absoluta.hostname === 'northlyexplica.github.io' || hostEhSocial(absoluta.hostname)) return limpa;
  for (const chave of absoluta.searchParams.keys()) {
    if (chave.toLowerCase().startsWith('utm_')) return limpa;
  }
  if (!dataIsoValida(data)) return limpa;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pilar || '')) return limpa;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(secao || '')) return limpa;
  absoluta.searchParams.set('utm_source', 'northly_site');
  absoluta.searchParams.set('utm_medium', 'social');
  absoluta.searchParams.set('utm_campaign', `${data.replaceAll('-', '')}_${pilar}`);
  absoluta.searchParams.set('utm_content', secao);
  return absoluta.toString();
}

function texto(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

function corSegura(cor) {
  return /^#[0-9A-Fa-f]{6}$/.test(cor || '') ? cor : '';
}

export function tintaDoTema(cor, textoCor) {
  if ((cor || '').toLowerCase() === '#7a4fd6') return '#F4F7FB';
  if (textoCor === '#0B1F3A' || textoCor === '#1B2430') return textoCor;
  return '#0B1F3A';
}

export function indexarTemas(lista) {
  const todos = new Map();
  const ativos = [];
  if (!Array.isArray(lista)) return { todos, ativos };
  for (const tema of lista) {
    if (!tema || typeof tema.id !== 'string' || !tema.id.trim()) continue;
    const cor = corSegura(tema.cor);
    if (!cor) continue;
    const registro = {
      id: tema.id.trim(),
      nome: texto(tema.nome) || tema.id.trim(),
      pilar: texto(tema.pilar),
      cor,
      texto: tintaDoTema(cor, texto(tema.texto)),
      ativo: tema.ativo === true,
    };
    todos.set(registro.id, registro);
    if (registro.ativo) ativos.push(registro);
  }
  return { todos, ativos };
}

function temaDoItem(item, temas) {
  const id = texto(item.tema);
  const tema = temas.todos.get(id) || null;
  if (tema && !tema.ativo) return { oculto: true, tema: null, temaId: id };
  return { oculto: false, tema, temaId: id };
}

export function normalizarNoticia(item, temas) {
  if (!item || item.ativo !== true) return null;
  const titulo = texto(item.titulo);
  if (!titulo) return null;
  const relacao = temaDoItem(item, temas);
  if (relacao.oculto) return null;
  return {
    titulo,
    resumo: texto(item.resumo),
    data: dataIsoValida(item.data) ? item.data : '',
    url: urlSegura(item.url),
    imagem: urlSegura(item.imagem),
    credito: texto(item.credito),
    afiliado: item.afiliado === true,
    tema: relacao.tema,
    temaId: relacao.temaId,
    pilar: relacao.tema ? relacao.tema.pilar : '',
  };
}

export function normalizarAgenda(item, temas, hoje) {
  if (!item || item.ativo !== true) return null;
  const titulo = texto(item.titulo);
  if (!titulo || !dataIsoValida(item.data) || item.data < hoje) return null;
  const relacao = temaDoItem(item, temas);
  if (relacao.oculto) return null;
  return {
    titulo,
    data: item.data,
    local: texto(item.local),
    preco: texto(item.preco),
    url: urlSegura(item.url),
    afiliado: item.afiliado === true,
    tipo: item.tipo === 'evento-sp' ? 'evento-sp' : 'calendario',
    tema: relacao.tema,
    temaId: relacao.temaId,
    pilar: relacao.tema ? relacao.tema.pilar : '',
  };
}

function ordenarNoticias(lista) {
  return [...lista].sort((a, b) => {
    if (a.data && b.data && a.data !== b.data) return a.data < b.data ? 1 : -1;
    if (a.data && !b.data) return -1;
    if (!a.data && b.data) return 1;
    return 0;
  });
}

function ordenarAgenda(lista) {
  return [...lista].sort((a, b) => (a.data < b.data ? -1 : a.data > b.data ? 1 : 0));
}

function el(tag, props = {}, ...filhos) {
  const node = document.createElement(tag);
  for (const [chave, valor] of Object.entries(props)) {
    if (valor == null || valor === false) continue;
    if (chave === 'class') node.className = valor;
    else if (chave === 'text') node.textContent = valor;
    else node.setAttribute(chave, String(valor));
  }
  for (const filho of filhos) {
    if (filho == null || filho === false) continue;
    node.append(filho);
  }
  return node;
}

function limpar(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

function icone(nome, classeExtra) {
  const desenho = ICONES[nome];
  if (!desenho) return el('span');
  const modelo = document.createElement('template');
  const classe = classeExtra ? `icone ${classeExtra}` : 'icone';
  modelo.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="${classe}" aria-hidden="true" focusable="false">${desenho}</svg>`;
  return modelo.content.firstElementChild;
}

function aplicarTema(node, tema) {
  if (!tema) return;
  node.style.setProperty('--cor', tema.cor);
  node.style.setProperty('--tinta', tema.texto);
}

function etiqueta(tema) {
  if (!tema) return null;
  const tag = el('p', { class: 'etiqueta', text: tema.nome });
  aplicarTema(tag, tema);
  return tag;
}

function hostDe(url) {
  try {
    return new URL(url, 'https://northlyexplica.github.io').hostname;
  } catch {
    return '';
  }
}

function rotuloLink(url, secao) {
  if (secao === 'destaques' && /(^|\.)instagram\.com$/i.test(hostDe(url))) return 'Ver no Instagram';
  if (secao === 'destaques') return 'Ver fonte';
  return 'Ver detalhes';
}

function linkExterno(url, secao, item) {
  const href = aplicarUtm(url, { data: item.data, pilar: item.pilar, secao });
  if (!href) return null;
  const link = el(
    'a',
    {
      href,
      target: '_blank',
      rel: item.afiliado ? 'noopener noreferrer sponsored' : 'noopener noreferrer',
    },
    document.createTextNode(rotuloLink(url, secao)),
    icone('externo', 'icone-sm'),
    el('span', { class: 'sr-only', text: '(abre em uma nova aba)' }),
  );
  return link;
}

function blocoAcao(item, secao) {
  const link = item.url ? linkExterno(item.url, secao, item) : null;
  const parceiro = item.afiliado ? el('span', { class: 'parceiro', text: 'link de parceiro' }) : null;
  if (!link && !parceiro) return null;
  return el('p', { class: 'acao' }, link, parceiro);
}

function figura(item) {
  if (!item.imagem && !item.credito) return null;
  const frame = el('figure', { class: 'figura' });
  if (item.imagem) {
    const img = el('img', { src: item.imagem, alt: '' });
    img.addEventListener('error', () => {
      img.remove();
      if (!frame.querySelector('figcaption')) frame.remove();
    });
    frame.append(img);
  }
  if (item.credito) frame.append(el('figcaption', { class: 'credito', text: item.credito }));
  return frame;
}

function cartaoNoticia(item) {
  const artigo = el('article', { class: 'cartao' });
  aplicarTema(artigo, item.tema);
  const imagem = figura(item);
  if (imagem) artigo.append(imagem);
  const tag = etiqueta(item.tema);
  if (tag) artigo.append(tag);
  artigo.append(el('h3', { text: item.titulo }));
  if (item.resumo) artigo.append(el('p', { class: 'resumo', text: item.resumo }));
  if (item.data) {
    artigo.append(el('p', { class: 'meta' }, el('time', { datetime: item.data, text: formatarData(item.data) })));
  }
  const acao = blocoAcao(item, 'destaques');
  if (acao) artigo.append(acao);
  return artigo;
}

function cartaoAgenda(item) {
  const partes = partesData(item.data);
  const artigo = el('article', { class: 'cartao item-agenda' });
  aplicarTema(artigo, item.tema);
  const quando = el(
    'div',
    { class: 'quando' },
    el('span', { class: 'agulha', 'aria-hidden': 'true' }),
    el(
      'time',
      { datetime: item.data, 'aria-label': formatarData(item.data) },
      el('span', { class: 'dia', text: partes.dia, 'aria-hidden': 'true' }),
      el('span', { class: 'mes', text: partes.mes, 'aria-hidden': 'true' }),
      el('span', { class: 'ano', text: partes.ano, 'aria-hidden': 'true' }),
    ),
  );
  const corpo = el('div', { class: 'corpo' });
  const tag = etiqueta(item.tema);
  if (tag) corpo.append(tag);
  corpo.append(el('h3', { text: item.titulo }));
  if (item.local) {
    corpo.append(
      el(
        'p',
        { class: 'local' },
        icone('pin', 'icone-sm'),
        el('span', { class: 'sr-only', text: 'Local: ' }),
        document.createTextNode(item.local),
      ),
    );
  }
  if (item.preco) {
    corpo.append(
      el('p', { class: 'preco' }, el('span', { class: 'sr-only', text: 'Preço: ' }), document.createTextNode(item.preco)),
    );
  }
  const secao = item.tipo === 'evento-sp' ? 'eventos-sp' : 'agenda';
  const acao = blocoAcao(item, secao);
  if (acao) corpo.append(acao);
  artigo.append(quando, corpo);
  return artigo;
}

function filtrados(lista) {
  if (estado.tema === 'tudo') return lista;
  return lista.filter((item) => item.temaId === estado.tema);
}

function desenharListas() {
  const noticias = filtrados(estado.noticias);
  const agenda = filtrados(estado.agenda);
  const calendario = agenda.filter((item) => item.tipo !== 'evento-sp');
  const eventos = agenda.filter((item) => item.tipo === 'evento-sp');
  const listaDestaques = document.getElementById('lista-destaques');
  const listaAgenda = document.getElementById('lista-agenda');
  const listaEventos = document.getElementById('lista-eventos');
  limpar(listaDestaques);
  limpar(listaAgenda);
  limpar(listaEventos);
  for (const item of noticias) listaDestaques.append(cartaoNoticia(item));
  for (const item of calendario) listaAgenda.append(cartaoAgenda(item));
  for (const item of eventos) listaEventos.append(cartaoAgenda(item));
  document.getElementById('destaques').hidden = noticias.length === 0;
  document.getElementById('lista-agenda').hidden = calendario.length === 0;
  document.getElementById('bloco-eventos').hidden = eventos.length === 0;
  document.getElementById('agenda').hidden = calendario.length === 0 && eventos.length === 0;
  const vazio = document.getElementById('vazio-filtro');
  vazio.hidden = !(estado.tema !== 'tudo' && noticias.length === 0 && agenda.length === 0);
}

function desenharChips(temas) {
  const lista = document.getElementById('lista-temas');
  limpar(lista);
  const tudo = el('button', {
    type: 'button',
    class: 'chip chip-tudo',
    text: 'Tudo',
    'aria-pressed': 'true',
    'data-tema': 'tudo',
  });
  lista.append(tudo);
  for (const tema of temas) {
    const botao = el('button', {
      type: 'button',
      class: 'chip',
      text: tema.nome,
      'aria-pressed': 'false',
      'data-tema': tema.id,
    });
    aplicarTema(botao, tema);
    lista.append(botao);
  }
  document.getElementById('barra-temas').hidden = false;
}

function marcarChips() {
  for (const botao of document.querySelectorAll('#lista-temas button')) {
    botao.setAttribute('aria-pressed', botao.dataset.tema === estado.tema ? 'true' : 'false');
  }
}

function desenharRedes() {
  const lista = document.getElementById('lista-redes');
  limpar(lista);
  for (const rede of estado.redes) {
    const desenho = ICONES[rede.id] ? icone(rede.id) : icone('externo');
    if (rede.ativo && rede.url) {
      const link = el(
        'a',
        {
          class: 'rede rede-ativa',
          href: rede.url,
          target: '_blank',
          rel: 'me noopener noreferrer',
        },
        desenho,
        el('span', { class: 'rede-nome', text: rede.nome }),
        icone('externo', 'icone-sm'),
        el('span', { class: 'sr-only', text: '(abre em uma nova aba)' }),
      );
      lista.append(el('li', {}, link));
      continue;
    }
    const lugar = el(
      'span',
      { class: 'rede rede-inativa' },
      desenho,
      el('span', { class: 'rede-nome', text: rede.nome }),
      el('span', { class: 'rede-estado', text: 'Em breve' }),
    );
    lista.append(el('li', {}, lugar));
  }
  document.getElementById('redes').hidden = estado.redes.length === 0;
}

export function hidratar(dados, hoje = hojeSP()) {
  const temas = indexarTemas(dados && dados.temas);
  const brutosNoticias = dados && Array.isArray(dados.noticias) ? dados.noticias : [];
  const brutosAgenda = dados && Array.isArray(dados.agenda) ? dados.agenda : [];
  const redes = dados && dados.links && Array.isArray(dados.links.redes) ? dados.links.redes : [];
  estado.tema = 'tudo';
  estado.noticias = ordenarNoticias(brutosNoticias.map((item) => normalizarNoticia(item, temas)).filter(Boolean));
  estado.agenda = ordenarAgenda(brutosAgenda.map((item) => normalizarAgenda(item, temas, hoje)).filter(Boolean));
  estado.redes = redes
    .filter((rede) => rede && texto(rede.nome))
    .map((rede) => ({
      id: texto(rede.id).toLowerCase(),
      nome: texto(rede.nome),
      url: urlSegura(rede.url),
      ativo: rede.ativo === true,
    }));
  if (temas.ativos.length) desenharChips(temas.ativos);
  else document.getElementById('barra-temas').hidden = true;
  desenharRedes();
  marcarChips();
  desenharListas();
}

async function carregar(caminho) {
  const resposta = await fetch(caminho, { cache: 'no-cache' });
  if (!resposta.ok) throw new Error('falha');
  return resposta.json();
}

function mostrarAviso(mensagem) {
  const aviso = document.getElementById('aviso-dados');
  if (!aviso) return;
  aviso.textContent = mensagem;
  aviso.hidden = false;
}

async function iniciar() {
  const form = document.getElementById('form-newsletter');
  if (form) form.addEventListener('submit', (evento) => evento.preventDefault());

  document.getElementById('lista-temas').addEventListener('click', (evento) => {
    const botao = evento.target.closest('button');
    if (!botao) return;
    estado.tema = botao.dataset.tema || 'tudo';
    marcarChips();
    desenharListas();
  });

  const resultados = await Promise.allSettled([
    carregar('/data/noticias.json'),
    carregar('/data/agenda.json'),
    carregar('/data/links.json'),
    carregar('/data/temas.json'),
  ]);

  const falhas = resultados.filter((item) => item.status === 'rejected').length;
  hidratar({
    noticias: resultados[0].status === 'fulfilled' ? resultados[0].value : [],
    agenda: resultados[1].status === 'fulfilled' ? resultados[1].value : [],
    links: resultados[2].status === 'fulfilled' ? resultados[2].value : { redes: [] },
    temas: resultados[3].status === 'fulfilled' ? resultados[3].value : [],
  });
  if (falhas) mostrarAviso('Uma parte do conteúdo não carregou.');
}

if (typeof document !== 'undefined') {
  iniciar().catch(() => {
    mostrarAviso('Não foi possível carregar o conteúdo agora.');
  });
}
