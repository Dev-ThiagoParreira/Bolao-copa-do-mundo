import prisma from '../../config/prisma.js';
import { AppError } from '../../utils/response.js';

export async function list() {
  return prisma.meioPagamento.findMany({ orderBy: { id: 'asc' } });
}

export async function getById(id) {
  const meio = await prisma.meioPagamento.findUnique({ where: { id } });
  if (!meio) throw new AppError('Meio de pagamento não encontrado', 404);
  return meio;
}

export async function create(data) {
  return prisma.meioPagamento.create({ data });
}

export async function update(id, data) {
  await getById(id);
  return prisma.meioPagamento.update({ where: { id }, data });
}

export async function remove(id) {
  await getById(id);
  const apostas = await prisma.aposta.count({ where: { meioPagamentoId: id } });
  if (apostas > 0) {
    throw new AppError('Não é possível remover meio de pagamento com apostas vinculadas', 409);
  }
  await prisma.meioPagamento.delete({ where: { id } });
}
