export function getConfrontoLabel(campanha) {
  if (campanha?.timeA && campanha?.timeB) {
    return `${campanha.timeA} x ${campanha.timeB}`;
  }
  return campanha?.nome || '';
}

export function getOpcaoLabel(opcao, campanha) {
  if (!campanha?.timeA || !campanha?.timeB) {
    return opcao.descricao;
  }

  switch (opcao.tipoResultado) {
    case 'VITORIA_TIME_A':
      return `Vitória ${campanha.timeA}`;
    case 'EMPATE':
      return 'Empate';
    case 'VITORIA_TIME_B':
      return `Vitória ${campanha.timeB}`;
    default:
      return opcao.descricao;
  }
}

export function getOpcaoResumo(opcao, campanha) {
  if (!campanha?.timeA || !campanha?.timeB) {
    return '';
  }

  switch (opcao.tipoResultado) {
    case 'VITORIA_TIME_A':
      return `${campanha.timeB} perde`;
    case 'EMPATE':
      return 'Placar igual';
    case 'VITORIA_TIME_B':
      return `${campanha.timeA} perde`;
    default:
      return '';
  }
}

export function ordenarOpcoesJogo(opcoes = []) {
  const ordem = {
    VITORIA_TIME_A: 1,
    EMPATE: 2,
    VITORIA_TIME_B: 3,
  };

  return [...opcoes].sort((a, b) => {
    const ordemA = ordem[a.tipoResultado] ?? 99;
    const ordemB = ordem[b.tipoResultado] ?? 99;
    return ordemA - ordemB;
  });
}
