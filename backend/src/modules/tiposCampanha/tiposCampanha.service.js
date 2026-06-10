import prisma from '../../config/prisma.js';
import { AppError } from '../../utils/response.js';

export async function list() {
  return prisma.tipoCampanha.findMany({ orderBy: { id: 'asc' } });
}

export async function getById(id) {
  const tipo = await prisma.tipoCampanha.findUnique({ where: { id } });
  if (!tipo) throw new AppError('Tipo de campanha não encontrado', 404);
  return tipo;
}

export async function create(data) {
  return prisma.tipoCampanha.create({ data });
}

export async function update(id, data) {
  await getById(id);
  return prisma.tipoCampanha.update({ where: { id }, data });
}

export async function remove(id) {
  await getById(id);
  const campanhas = await prisma.campanha.count({ where: { tipoCampanhaId: id } });
  if (campanhas > 0) {
    throw new AppError('Não é possível remover tipo de campanha vinculado a campanhas', 409);
  }
  await prisma.tipoCampanha.delete({ where: { id } });
}
