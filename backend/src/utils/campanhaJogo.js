export function buildOpcoesJogo(timeA, timeB) {
  return [
    {
      descricao: `Vitória ${timeA}`,
      tipoResultado: 'VITORIA_TIME_A',
    },
    {
      descricao: 'Empate',
      tipoResultado: 'EMPATE',
    },
    {
      descricao: `Vitória ${timeB}`,
      tipoResultado: 'VITORIA_TIME_B',
    },
  ];
}

export function buildNomeConfronto(timeA, timeB) {
  return `${timeA} x ${timeB}`;
}
