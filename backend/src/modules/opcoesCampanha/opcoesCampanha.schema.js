import { z } from 'zod';

export const createOpcaoSchema = z.object({
  body: z.object({
    descricao: z.string().min(2),
    campanhaId: z.coerce.number().int().positive(),
    status: z.enum(['ATIVO', 'INATIVO']).optional(),
  }),
});

export const updateOpcaoSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({
    descricao: z.string().min(2).optional(),
    status: z.enum(['ATIVO', 'INATIVO']).optional(),
  }),
});

export const idParamSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
});

export const campanhaParamSchema = z.object({
  params: z.object({ campanhaId: z.coerce.number().int().positive() }),
});
