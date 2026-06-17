export function formatarMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function valoresPagamentoConferem(valorPago, valorBolao) {
  return Math.abs(Number(valorPago) - Number(valorBolao)) < 0.01;
}
