# Northly

Site estático do Northly (@northlyexplica), em https://northlyexplica.github.io.

A página explica política, finanças, mercados e o mundo em linguagem simples. Não há etapa de build: o GitHub Pages publica os arquivos da branch `main` como estão. Sem framework, sem rastreador e sem CDN.

Quem atualiza o conteúdo mexe só nos arquivos de `data/`. O HTML, o CSS e o JavaScript montam a página a partir deles.

## O que entra no ar

O site só mostra item com `"ativo": true`.

- `ativo` é o valor `true`, sem aspas. `"true"` entre aspas não liga o item.
- Seção sem nenhum item ativo fica escondida.
- A agenda só mostra data de hoje ou futura, no fuso de São Paulo. Data passada some sozinha.
- Tema com `"ativo": false` esconde a etiqueta e o filtro, e também os itens daquele tema.
- Link vazio não vira botão.

Os textos de exemplo estão em `data/exemplos.md`. A página não lê esse arquivo.

## Notícias

Arquivo: `data/noticias.json`. É uma lista. Lista vazia é `[]`.

Para publicar:

1. Abra `data/noticias.json`.
2. Copie o formato de `data/exemplos.md` e troque pelos dados reais.
3. Use `"ativo": true`.
4. Grave o arquivo na branch `main`.

Para tirar do ar sem apagar o texto, mude para `"ativo": false`.

Campos:

| Campo | Obrigatório | Para que serve |
| --- | --- | --- |
| `id` | não | Nome interno para achar o item. O site não mostra. |
| `ativo` | sim | `true` publica, `false` esconde. |
| `tema` | sim | `id` do tema em `data/temas.json`. |
| `titulo` | sim | Título do card. |
| `resumo` | não | Uma linha de resumo. |
| `data` | sim | Dia no formato `AAAA-MM-DD`. Entra no link de UTM. |
| `url` | não | Link da publicação ou da fonte (`https://...`). |
| `imagem` | não | Endereço da imagem. |
| `credito` | não | Linha de crédito da imagem, visível embaixo dela. Escreva a frase completa, por exemplo `Foto: Nome`. |
| `afiliado` | não | `true` mostra a etiqueta "link de parceiro". |

Não coloque vírgula depois do último item. Isso quebra o arquivo e a seção deixa de aparecer.

## Agenda

Arquivo: `data/agenda.json`. Também é uma lista.

- `"tipo": "calendario"` entra na lista principal (reuniões, prazos e outras datas).
- `"tipo": "evento-sp"` entra no bloco "Eventos SP do fim de semana".

Campos extras, os dois opcionais: `local` e `preco`. Escreva o preço como quiser que ele apareça. O site não reformata número.

Para desligar um item, use `"ativo": false`.

## Redes

Arquivo: `data/links.json`, lista `redes`.

O Instagram já está ativo: https://www.instagram.com/northlyexplica/

X, TikTok, Threads, YouTube e LinkedIn estão no arquivo com `"url": ""` e `"ativo": false`. A página mostra o nome, sem link, com a marca "Em breve".

Para ativar uma rede:

1. Coloque a URL completa em `url`, começando com `https://`.
2. Mude `ativo` para `true`.
3. Grave na branch `main`.

Para desligar de novo, volte `ativo` para `false`. O perfil some do link e o nome continua como lugar vazio. Essas URLs não recebem UTM.

## Temas

Arquivo: `data/temas.json`. A lista já está preenchida. As cores são a paleta da marca. Não troque o `id` de um tema que já é usado nas notícias: o `tema` da notícia aponta para esse `id`.

O `pilar` entra na campanha de UTM. É um código curto, sem acento e sem espaço (`mercado`, `instituicoes`, `politica-economia`, `agro`, `mundo`, `bolso`, `um-minuto`, `sao-paulo`, `bussola`).

A cor Ameixa (`#7A4FD6`, Política e Instituições) usa texto claro (`#F4F7FB`). As outras cores de tema usam texto `#0B1F3A`. São Paulo e Bússola usam o âmbar `#F5A524`.

Para esconder um tema da página, mude `ativo` para `false`.

O botão "Tudo" não está no JSON. Ele só limpa o filtro.

## Regra de UTM

O JavaScript acrescenta a marcação em todo link de saída que não é rede social: fonte de notícia, evento e parceiro.

Formato:

```text
?utm_source=northly_site&utm_medium=social&utm_campaign=AAAAMMDD_pilar&utm_content=secao
```

- `AAAAMMDD` é a `data` do item, sem traços.
- `pilar` é o `pilar` do tema.
- `secao` é `destaques`, `agenda` ou `eventos-sp`.

Exemplo fictício, só para mostrar a conta. Um item de 15 de janeiro de 2099, pilar `mercado`, na seção de destaques:

```text
https://exemplo.invalid/materia-ficticia?utm_source=northly_site&utm_medium=social&utm_campaign=20990115_mercado&utm_content=destaques
```

O script não mexe no link quando:

- o destino é perfil ou página de rede social (Instagram, X, Twitter, TikTok, Threads, YouTube, LinkedIn);
- o link está na lista de redes;
- a URL já tem algum parâmetro que começa com `utm_`;
- faltam a data ou o pilar, porque o site não inventa campanha;
- o destino é o próprio site (`northlyexplica.github.io`).

## Link de parceiro

`"afiliado": true` mostra a frase "link de parceiro" perto do link. Não há código de afiliado no repositório. O UTM continua valendo se o destino não for rede social.

## O que não editar para publicar conteúdo

`index.html`, `404.html`, `css/estilos.css` e `js/site.js` são a página. O visual está fixo: azul-noite `#0B1F3A`, marfim `#F6F3EC`, texto `#F4F7FB` no azul e `#1B2430` no marfim, âmbar `#F5A524` na agulha, no estado ativo e no foco.

A fonte pedida é Yu Gothic Medium. A licença para web não está confirmada, então o site não traz arquivo de fonte. A pilha é `'Yu Gothic', 'YuGothic', 'Inter', system-ui, sans-serif`, peso 500.

## Como a publicação chega no ar

O GitHub Pages deste repositório usa a branch `main`, pasta raiz. Depois do commit, a atualização leva um instante. Recarregue https://northlyexplica.github.io se a página antiga ainda aparecer.

Para olhar no computador antes de enviar:

```bash
python3 -m http.server 8765
```

Abra http://127.0.0.1:8765/. Abrir o `index.html` direto do disco não carrega os JSON.
