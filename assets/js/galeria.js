/*
  GALERIA DA RAP EVENTOS
  ----------------------
  Para adicionar uma foto ou vídeo novo:
    1. Coloque o arquivo na pasta assets/img (fotos) ou assets/video (vídeos).
       Dica: fotos com até ~1600px no lado maior carregam rápido.
    2. Copie um dos blocos abaixo, cole no final da lista e troque os dados.

  Campos:
    tipo:    'foto' ou 'video'
    src:     caminho do arquivo
    miniatura (opcional, só fotos): versão menor para a grade; se não tiver, usa o src
    poster  (só vídeos): imagem mostrada antes de dar play
    alt:     descrição curta do que aparece (ajuda acessibilidade e Google)
    formato: 'destaque' (grande, 2x2), 'alto' (vertical), 'largo' (horizontal) ou 'quadrado'

  A ordem da lista é a ordem na página.
*/
window.RAP_GALERIA = [
  {
    tipo: 'foto',
    src: 'assets/img/brinde-1280.webp',
    miniatura: 'assets/img/brinde-640.webp',
    alt: 'Noivos e convidados erguem taças em um brinde, com refletores brancos ao fundo',
    formato: 'destaque'
  },
  {
    tipo: 'foto',
    src: 'assets/img/noivos-1280.webp',
    miniatura: 'assets/img/noivos-640.webp',
    alt: 'Noivo servindo champanhe para a noiva na pista, iluminada por refletor e globo espelhado',
    formato: 'alto'
  },
  {
    tipo: 'video',
    src: 'assets/video/festa-dj.mp4',
    poster: 'assets/img/poster-festa.webp',
    alt: 'Pista cheia com bastões de luz, fumaça e o DJ na mesa de som',
    formato: 'alto'
  },
  {
    tipo: 'foto',
    src: 'assets/img/pista-feixes-1280.webp',
    miniatura: 'assets/img/pista-feixes-640.webp',
    alt: 'Convidados dançando sob feixes de luz amarela, vistos da cabine do DJ',
    formato: 'alto'
  },
  {
    tipo: 'video',
    src: 'assets/video/pista-noivos.mp4',
    poster: 'assets/img/poster-hero.webp',
    alt: 'Noivos dançando na pista entre luzes coloridas e fumaça',
    formato: 'alto'
  },
  {
    tipo: 'foto',
    src: 'assets/img/pista-roxa-1280.webp',
    miniatura: 'assets/img/pista-roxa-640.webp',
    alt: 'Salão com luz roxa e azul, globos espelhados e a mesa do DJ em primeiro plano',
    formato: 'alto'
  }
];
