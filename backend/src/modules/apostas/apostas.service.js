import prisma from '../../config/prisma.js';
import { AppError } from '../../utils/response.js';
import { campanhaAbertaParaAposta } from '../campanhas/campanhas.service.js';

export async function list(user) {
  const where = user.tipoUsuario === 'ADMIN' ? {} : { usuarioId: user.id };

  return prisma.aposta.findMany({
    where,
    include: {
      usuario: { select: { id: true, nome: true, email: true } },
      meioPagamento: true,
      campanhaOpcao: {
        include: {
          campanha: true,
        },
      },
    },
    orderBy: { dtCriacao: 'desc' },
  });
}

export async function getById(id, user) {
  const aposta = await prisma.aposta.findUnique({
    where: { id },
    include: {
      usuario: { select: { id: true, nome: true, email: true } },
      meioPagamento: true,
      campanhaOpcao: { include: { campanha: true } },
    },
  });

  if (!aposta) throw new AppError('Aposta não encontrada', 404);

  if (user.tipoUsuario !== 'ADMIN' && aposta.usuarioId !== user.id) {
    throw new AppError('Acesso negado a esta aposta', 403);
  }

  return aposta;
}

export async function create(data, userId) {
  const usuario = await prisma.usuario.findUnique({ where: { id: userId } });
  if (!usuario) throw new AppError('Usuário não encontrado', 404);
  if (usuario.status !== 'ATIVO') {
    throw new AppError('Usuário inativo não pode realizar apostas', 403);
  }

  const opcao = await prisma.campanhaOpcao.findUnique({
    where: { id: data.campanhaOpcaoId },
    include: { campanha: true },
  });

  if (!opcao) throw new AppError('Opção de campanha inválida', 400);
  if (opcao.status !== 'ATIVO') {
    throw new AppError('Não é possível apostar em opção inativa', 400);
  }

  campanhaAbertaParaAposta(opcao.campanha);

  const meioPagamento = await prisma.meioPagamento.findUnique({
    where: { id: data.meioPagamentoId },
  });

  if (!meioPagamento) throw new AppError('Meio de pagamento inválido', 400);
  if (meioPagamento.status !== 'ATIVO') {
    throw new AppError('Meio de pagamento inativo', 400);
  }

  if (meioPagamento.comprovanteObrigatorio && !data.comprovante) {
    throw new AppError('Comprovante é obrigatório para este meio de pagamento', 400);
  }

  return prisma.aposta.create({
    data: {
      usuarioId: userId,
      campanhaOpcaoId: data.campanhaOpcaoId,
      meioPagamentoId: data.meioPagamentoId,
      comprovante: data.comprovante,
      status: data.status || 'PENDENTE',
    },
    include: {
      usuario: { select: { id: true, nome: true, email: true } },
      meioPagamento: true,
      campanhaOpcao: { include: { campanha: true } },
    },
  });
}

export async function updateStatus(id, status, user) {
  const aposta = await getById(id, user);
  return prisma.aposta.update({
    where: { id: aposta.id },
    data: { status },
    include: {
      usuario: { select: { id: true, nome: true, email: true } },
      meioPagamento: true,
      campanhaOpcao: { include: { campanha: true } },
    },
  });
}

export async function remove(id, user) {
  const aposta = await getById(id, user);
  await prisma.aposta.delete({ where: { id: aposta.id } });
}
