# Exemplos fictícios

Este arquivo **não é publicado na página**. O site só lê `noticias.json`, `agenda.json`, `links.json` e `temas.json`.

Tudo abaixo é inventado para mostrar o formato. Não é notícia, data, número, evento nem código de afiliado. Não copie para os JSON sem substituir por informação real. Se copiar um exemplo, deixe `"ativo": false` até ter o dado verdadeiro.

## Notícia

Uma notícia entra na lista de `data/noticias.json`.

```json
{
  "id": "exemplo-ficticio-noticia",
  "ativo": false,
  "tema": "mercado",
  "titulo": "EXEMPLO FICTÍCIO — este título não é uma notícia",
  "resumo": "Linha inventada só para mostrar onde fica o resumo.",
  "data": "2099-01-15",
  "url": "https://exemplo.invalid/materia-ficticia",
  "imagem": "https://exemplo.invalid/imagem-ficticia.jpg",
  "credito": "Imagem fictícia — não publicar",
  "afiliado": true
}
```

`"tema"` usa o `id` de um item de `temas.json` (`mercado`, `instituicoes`, `politica-economia`, `agro`, `mundo`, `bolso`, `um-minuto`, `sao-paulo`, `bussola`).

`"afiliado": true` só faz aparecer o texto "link de parceiro". Não existe código de afiliado neste projeto.

Imagem e crédito são opcionais. Sem imagem, omita `imagem` e `credito`.

## Data da agenda

Um compromisso entra na lista de `data/agenda.json`. `"tipo": "calendario"` vai para a lista principal.

```json
{
  "id": "exemplo-ficticio-calendario",
  "ativo": false,
  "tipo": "calendario",
  "tema": "mercado",
  "titulo": "EXEMPLO FICTÍCIO — compromisso que não existe",
  "data": "2099-03-18",
  "local": "",
  "preco": "",
  "url": "https://exemplo.invalid/compromisso-ficticio",
  "afiliado": false
}
```

## Evento de São Paulo

`"tipo": "evento-sp"` aparece no bloco "Eventos SP do fim de semana". Local e preço são opcionais.

```json
{
  "id": "exemplo-ficticio-evento-sp",
  "ativo": false,
  "tipo": "evento-sp",
  "tema": "sao-paulo",
  "titulo": "EXEMPLO FICTÍCIO — evento que não existe",
  "data": "2099-04-05",
  "local": "Lugar fictício",
  "preco": "valor fictício",
  "url": "https://exemplo.invalid/evento-ficticio",
  "afiliado": false
}
```

## Rede social

As redes ficam em `data/links.json`, dentro de `redes`. O Instagram real já está nesse arquivo. O objeto abaixo é só o formato de uma rede ainda desligada.

```json
{
  "id": "x",
  "nome": "X",
  "url": "",
  "ativo": false
}
```

Para ligar uma rede de verdade, o `url` precisa ser o endereço completo (`https://...`) e `"ativo"` precisa ser `true`.
