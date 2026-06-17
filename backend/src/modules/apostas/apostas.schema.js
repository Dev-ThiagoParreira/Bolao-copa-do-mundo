import { z } from 'zod';

export const createApostaSchema = z.object({
  body: z.object({
    campanhaOpcaoId: z.coerce.number().int().positive(),
    meioPagamentoId: z.coerce.number().int().positive(),
    comprovante: z
      .string()
      .optional()
      .refine(
        (value) => !value || value.startsWith('data:image/'),
        'Comprovante deve ser uma imagem em base64 (data URL)'
      ),
    status: z.enum(['PENDENTE', 'CONFIRMADA', 'CANCELADA']).optional(),
  }),
});

export const updateApostaStatusSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({
    status: z.enum(['PENDENTE', 'CONFIRMADA', 'CANCELADA']),
  }),
});

export const idParamSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
});
