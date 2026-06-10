import prisma from '../../config/prisma.js';
import { AppError } from '../../utils/response.js';

function sanitizeUser(user) {
  const { senha, ...rest } = user;
  return rest;
}

export async function list() {
  const users = await prisma.usuario.findMany({
    orderBy: { id: 'asc' },
  });
  return users.map(sanitizeUser);
}

export async function getById(id) {
  const user = await prisma.usuario.findUnique({ where: { id } });
  if (!user) throw new AppError('Usuário não encontrado', 404);
  return sanitizeUser(user);
}

export async function update(id, data, requester) {
  const user = await prisma.usuario.findUnique({ where: { id } });
  if (!user) throw new AppError('Usuário não encontrado', 404);

  if (requester.tipoUsuario !== 'ADMIN' && requester.id !== id) {
    throw new AppError('Você só pode editar seu próprio perfil', 403);
  }

  if (data.email || data.cpf) {
    const conflict = await prisma.usuario.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [
              data.email ? { email: data.email } : undefined,
              data.cpf ? { cpf: data.cpf } : undefined,
            ].filter(Boolean),
          },
        ],
      },
    });

    if (conflict) {
      throw new AppError('CPF ou e-mail já cadastrado', 409);
    }
  }

  const updated = await prisma.usuario.update({
    where: { id },
    data,
  });

  return sanitizeUser(updated);
}

export async function remove(id) {
  const user = await prisma.usuario.findUnique({ where: { id } });
  if (!user) throw new AppError('Usuário não encontrado', 404);

  await prisma.usuario.delete({ where: { id } });
}
