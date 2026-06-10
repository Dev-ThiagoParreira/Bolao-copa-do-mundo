import { z } from 'zod';

export const createTipoCampanhaSchema = z.object({
  body: z.object({
    descricao: z.string().min(3),
    status: z.enum(['ATIVO', 'INATIVO']).optional(),
  }),
});

export const updateTipoCampanhaSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({
    descricao: z.string().min(3).optional(),
    status: z.enum(['ATIVO', 'INATIVO']).optional(),
  }),
});

export const idParamSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
});
