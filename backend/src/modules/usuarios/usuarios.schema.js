import { z } from 'zod';

export const updateUsuarioSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    nome: z.string().min(3).optional(),
    cpf: z.string().min(11).optional(),
    email: z.string().email().optional(),
    telefone: z.string().optional(),
    status: z.enum(['ATIVO', 'INATIVO']).optional(),
    tipoUsuario: z.enum(['ADMIN', 'USUARIO']).optional(),
  }),
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});
