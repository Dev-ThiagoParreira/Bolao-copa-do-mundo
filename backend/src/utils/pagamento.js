import { AppError } from './response.js';

export function formatarMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function valoresPagamentoConferem(valorPago, valorBolao) {
  const pago = Number(valorPago);
  const esperado = Number(valorBolao);

  if (Number.isNaN(pago) || Number.isNaN(esperado)) {
    return false;
  }

  return Math.abs(pago - esperado) < 0.01;
}

export function validarValorPagoBolao(valorPago, valorBolao) {
  if (valorPago === undefined || valorPago === null || valorPago === '') {
    throw new AppError('Informe o valor pago no comprovante PIX', 400);
  }

  const pago = Number(valorPago);

  if (Number.isNaN(pago) || pago <= 0) {
    throw new AppError('Valor pago inválido', 400);
  }

  if (!valoresPagamentoConferem(pago, valorBolao)) {
    throw new AppError(
      `O valor do comprovante deve ser ${formatarMoeda(valorBolao)}. Valor informado: ${formatarMoeda(pago)}`,
      400
    );
  }

  return pago;
}
