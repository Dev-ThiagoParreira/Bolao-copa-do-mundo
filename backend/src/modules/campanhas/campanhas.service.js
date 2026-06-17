import prisma from '../../config/prisma.js';
import { AppError } from '../../utils/response.js';
import { buildNomeConfronto, buildOpcoesJogo } from '../../utils/campanhaJogo.js';

function validatePeriodo(dtInicio, dtFim) {
  const inicio = new Date(dtInicio);
  const fim = new Date(dtFim);
  if (fim < inicio) {
    throw new AppError('A data fim deve ser maior ou igual à data início', 400);
  }
}

export async function list() {
  return prisma.campanha.findMany({
    include: {
      tipoCampanha: true,
      opcoes: true,
    },
    orderBy: { id: 'asc' },
  });
}

export async function getById(id) {
  const campanha = await prisma.campanha.findUnique({
    where: { id },
    include: {
      tipoCampanha: true,
      opcoes: true,
    },
  });
  if (!campanha) throw new AppError('Campanha não encontrada', 404);
  return campanha;
}

export async function create(data) {
  validatePeriodo(data.dtInicio, data.dtFim);

  const tipo = await prisma.tipoCampanha.findUnique({ where: { id: data.tipoCampanhaId } });
  if (!tipo) throw new AppError('Tipo de campanha inválido', 400);

  const codigoExistente = await prisma.campanha.findUnique({
    where: { codigoCampanha: data.codigoCampanha },
  });
  if (codigoExistente) throw new AppError('Código de campanha já existe', 409);

  const timeA = data.timeA?.trim();
  const timeB = data.timeB?.trim();

  if (!timeA || !timeB) {
    throw new AppError('Informe os dois times do confronto', 400);
  }

  if (timeA.toLowerCase() === timeB.toLowerCase()) {
    throw new AppError('Os times do confronto devem ser diferentes', 400);
  }

  const nome = data.nome?.trim() || buildNomeConfronto(timeA, timeB);
  const opcoesJogo = buildOpcoesJogo(timeA, timeB);

  return prisma.campanha.create({
    data: {
      nome,
      timeA,
      timeB,
      codigoCampanha: data.codigoCampanha,
      taxaOperacional: data.taxaOperacional,
      valorBolao: data.valorBolao,
      status: data.status,
      tipoCampanhaId: data.tipoCampanhaId,
      dtInicio: new Date(data.dtInicio),
      dtFim: new Date(data.dtFim),
      opcoes: {
        create: opcoesJogo,
      },
    },
    include: { tipoCampanha: true, opcoes: true },
  });
}

export async function update(id, data) {
  const campanha = await getById(id);

  if (data.dtInicio || data.dtFim) {
    validatePeriodo(data.dtInicio || campanha.dtInicio, data.dtFim || campanha.dtFim);
  }

  if (data.codigoCampanha && data.codigoCampanha !== campanha.codigoCampanha) {
    const codigoExistente = await prisma.campanha.findUnique({
      where: { codigoCampanha: data.codigoCampanha },
    });
    if (codigoExistente) throw new AppError('Código de campanha já existe', 409);
  }

  if (data.tipoCampanhaId) {
    const tipo = await prisma.tipoCampanha.findUnique({ where: { id: data.tipoCampanhaId } });
    if (!tipo) throw new AppError('Tipo de campanha inválido', 400);
  }

  return prisma.campanha.update({
    where: { id },
    data: {
      ...data,
      dtInicio: data.dtInicio ? new Date(data.dtInicio) : undefined,
      dtFim: data.dtFim ? new Date(data.dtFim) : undefined,
    },
    include: { tipoCampanha: true, opcoes: true },
  });
}

export async function remove(id) {
  await getById(id);
  await prisma.campanha.delete({ where: { id } });
}

export async function definirResultadoFinal(campanhaId, opcaoId) {
  const campanha = await getById(campanhaId);

  if (!['ENCERRADA', 'APURADA'].includes(campanha.status)) {
    throw new AppError('Só é possível definir resultado final em campanha encerrada ou apurada', 400);
  }

  const opcao = await prisma.campanhaOpcao.findFirst({
    where: { id: opcaoId, campanhaId },
  });

  if (!opcao) {
    throw new AppError('Opção não pertence à campanha informada', 400);
  }

  await prisma.$transaction([
    prisma.campanhaOpcao.updateMany({
      where: { campanhaId },
      data: { ehResultadoFinal: false },
    }),
    prisma.campanhaOpcao.update({
      where: { id: opcaoId },
      data: { ehResultadoFinal: true },
    }),
    prisma.campanha.update({
      where: { id: campanhaId },
      data: { status: 'APURADA' },
    }),
  ]);

  return getById(campanhaId);
}

export function campanhaAbertaParaAposta(campanha) {
  if (campanha.status !== 'ABERTA') {
    throw new AppError('Campanha não está aberta para apostas', 400);
  }

  const agora = new Date();
  if (agora < new Date(campanha.dtInicio) || agora > new Date(campanha.dtFim)) {
    throw new AppError('Campanha fora do período de participação', 400);
  }
}
