/*
  GALERIA DA RAP EVENTOS
  ----------------------
  Para adicionar uma foto ou vídeo novo:
    1. Coloque o arquivo na pasta assets/img (fotos) ou assets/video (vídeos).
       Dica: fotos com até ~1600px no lado maior carregam rápido.
    2. Copie um dos blocos abaixo, cole na lista e troque os dados.

  Campos:
    tipo:      'foto' ou 'video'
    src:       caminho do arquivo
    miniatura  (opcional, só fotos): versão menor para a grade; se não tiver, usa o src
    poster     (só vídeos): imagem mostrada antes de dar play
    alt:       descrição curta do que aparece (ajuda acessibilidade e Google)
    formato:   'destaque' (grande, 2x2), 'alto' (vertical), 'largo' (horizontal) ou 'quadrado'
    categoria: 'casamento', '15anos' ou 'festa' (é o que os botões de filtro usam)

  A ordem da lista é a ordem na página.
*/
window.RAP_GALERIA = [
  { tipo: 'foto', categoria: 'casamento', formato: 'destaque',
    src: 'assets/img/brinde-1280.webp', miniatura: 'assets/img/brinde-640.webp',
    alt: 'Noivos e convidados erguem taças em um brinde, com refletores brancos ao fundo' },
  { tipo: 'foto', categoria: '15anos', formato: 'alto',
    src: 'assets/img/quinze-8-1280.webp', miniatura: 'assets/img/quinze-8-640.webp',
    alt: 'Debutante de vestido azul-claro posa ao lado do pai em frente a um painel de folhagens com luzinhas' },
  { tipo: 'video', categoria: 'festa', formato: 'alto',
    src: 'assets/video/festa-dj.mp4', poster: 'assets/img/poster-festa.webp',
    alt: 'Pista cheia com bastões de luz, fumaça e o DJ na mesa de som' },
  { tipo: 'foto', categoria: '15anos', formato: 'largo',
    src: 'assets/img/quinze-7-1280.webp', miniatura: 'assets/img/quinze-7-640.webp',
    alt: 'Debutante de vestido azul sentada no centro da pista, com o DJ e a família ao fundo' },
  { tipo: 'foto', categoria: 'casamento', formato: 'alto',
    src: 'assets/img/noivos-1280.webp', miniatura: 'assets/img/noivos-640.webp',
    alt: 'Noivo servindo champanhe para a noiva na pista, iluminada por refletor e globo espelhado' },
  { tipo: 'foto', categoria: '15anos', formato: 'largo',
    src: 'assets/img/quinze-5-1280.webp', miniatura: 'assets/img/quinze-5-640.webp',
    alt: 'Convidados dançando na pista com monograma da debutante, telões e globos espelhados' },
  { tipo: 'foto', categoria: 'festa', formato: 'alto',
    src: 'assets/img/pista-feixes-1280.webp', miniatura: 'assets/img/pista-feixes-640.webp',
    alt: 'Convidados dançando sob feixes de luz amarela, vistos da cabine do DJ' },
  { tipo: 'foto', categoria: '15anos', formato: 'quadrado',
    src: 'assets/img/quinze-3-1280.webp', miniatura: 'assets/img/quinze-3-640.webp',
    alt: 'Jovens dançando sob luzes coloridas, com a foto da debutante nos telões' },
  { tipo: 'video', categoria: 'casamento', formato: 'alto',
    src: 'assets/video/pista-noivos.mp4', poster: 'assets/img/poster-hero.webp',
    alt: 'Noivos dançando na pista entre luzes coloridas e fumaça' },
  { tipo: 'foto', categoria: '15anos', formato: 'quadrado',
    src: 'assets/img/quinze-6-1280.webp', miniatura: 'assets/img/quinze-6-640.webp',
    alt: 'Debutante dançando com as amigas na pista, com laser vermelho e telões ao fundo' },
  { tipo: 'foto', categoria: '15anos', formato: 'largo',
    src: 'assets/img/quinze-1-1280.webp', miniatura: 'assets/img/quinze-1-640.webp',
    alt: 'Mãe da debutante e convidadas dançando na pista com plumas e óculos de festa' },
  { tipo: 'foto', categoria: 'festa', formato: 'alto',
    src: 'assets/img/pista-roxa-1280.webp', miniatura: 'assets/img/pista-roxa-640.webp',
    alt: 'Salão com luz roxa e azul, globos espelhados e a mesa do DJ em primeiro plano' },
  { tipo: 'foto', categoria: '15anos', formato: 'quadrado',
    src: 'assets/img/quinze-2-1280.webp', miniatura: 'assets/img/quinze-2-640.webp',
    alt: 'Convidado dançando com óculos de coração e colar de pluma lilás' },
  { tipo: 'foto', categoria: '15anos', formato: 'quadrado',
    src: 'assets/img/quinze-4-1280.webp', miniatura: 'assets/img/quinze-4-640.webp',
    alt: 'Amigos sorrindo sob luz azul e globo espelhado' }
];
