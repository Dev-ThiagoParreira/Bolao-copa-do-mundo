import prisma from '../../config/prisma.js';
import { AppError } from '../../utils/response.js';
import { getById as getCampanhaById } from '../campanhas/campanhas.service.js';

export async function listByCampanha(campanhaId) {
  await getCampanhaById(campanhaId);
  return prisma.campanhaOpcao.findMany({
    where: { campanhaId },
    orderBy: { id: 'asc' },
  });
}

export async function getById(id) {
  const opcao = await prisma.campanhaOpcao.findUnique({
    where: { id },
    include: { campanha: true },
  });
  if (!opcao) throw new AppError('Opção de campanha não encontrada', 404);
  return opcao;
}

export async function create(data) {
  await getCampanhaById(data.campanhaId);

  if (data.ehResultadoFinal) {
    throw new AppError('Use o endpoint de resultado final para marcar opção vencedora', 400);
  }

  return prisma.campanhaOpcao.create({ data });
}

export async function update(id, data) {
  const opcao = await getById(id);

  if (data.ehResultadoFinal === true) {
    throw new AppError('Use o endpoint de resultado final para marcar opção vencedora', 400);
  }

  if (data.descricao && data.descricao !== opcao.descricao) {
    const duplicada = await prisma.campanhaOpcao.findFirst({
      where: {
        campanhaId: opcao.campanhaId,
        descricao: data.descricao,
        id: { not: id },
      },
    });
    if (duplicada) {
      throw new AppError('Já existe opção com esta descrição nesta campanha', 409);
    }
  }

  return prisma.campanhaOpcao.update({ where: { id }, data });
}

export async function remove(id) {
  await getById(id);
  await prisma.campanhaOpcao.delete({ where: { id } });
}
