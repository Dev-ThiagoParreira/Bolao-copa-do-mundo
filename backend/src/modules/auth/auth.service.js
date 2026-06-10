import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma.js';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/response.js';

function sanitizeUser(user) {
  const { senha, ...rest } = user;
  return rest;
}

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      tipoUsuario: user.tipoUsuario,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

export async function register(data) {
  const existing = await prisma.usuario.findFirst({
    where: {
      OR: [{ email: data.email }, { cpf: data.cpf }],
    },
  });

  if (existing) {
    throw new AppError('CPF ou e-mail já cadastrado', 409);
  }

  const hashedPassword = await bcrypt.hash(data.senha, 10);

  const user = await prisma.usuario.create({
    data: {
      ...data,
      senha: hashedPassword,
    },
  });

  const token = generateToken(user);

  return {
    user: sanitizeUser(user),
    token,
  };
}

export async function login(email, senha) {
  const user = await prisma.usuario.findUnique({ where: { email } });

  if (!user) {
    throw new AppError('Credenciais inválidas', 401);
  }

  if (user.status !== 'ATIVO') {
    throw new AppError('Usuário inativo. Não é possível realizar login', 403);
  }

  const passwordMatch = await bcrypt.compare(senha, user.senha);

  if (!passwordMatch) {
    throw new AppError('Credenciais inválidas', 401);
  }

  const token = generateToken(user);

  return {
    user: sanitizeUser(user),
    token,
  };
}

export async function getProfile(userId) {
  const user = await prisma.usuario.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError('Usuário não encontrado', 404);
  }

  return sanitizeUser(user);
}
