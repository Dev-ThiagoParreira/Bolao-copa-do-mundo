import { z } from 'zod';

export const createMeioPagamentoSchema = z.object({
  body: z.object({
    descricao: z.string().min(2),
    status: z.enum(['ATIVO', 'INATIVO']).optional(),
    comprovanteObrigatorio: z.boolean().optional(),
  }),
});

export const updateMeioPagamentoSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({
    descricao: z.string().min(2).optional(),
    status: z.enum(['ATIVO', 'INATIVO']).optional(),
    comprovanteObrigatorio: z.boolean().optional(),
  }),
});

export const idParamSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
});
