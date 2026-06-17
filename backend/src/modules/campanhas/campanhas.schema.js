import { z } from 'zod';

export const createCampanhaSchema = z.object({
  body: z.object({
    nome: z.string().min(3).optional(),
    timeA: z.string().min(2, 'Informe o time mandante'),
    timeB: z.string().min(2, 'Informe o time visitante'),
    dtInicio: z.string(),
    dtFim: z.string(),
    taxaOperacional: z.coerce.number().nonnegative(),
    valorBolao: z.coerce.number().positive(),
    codigoCampanha: z.string().min(3),
    status: z.enum(['ABERTA', 'ENCERRADA', 'APURADA', 'INATIVA']).optional(),
    tipoCampanhaId: z.coerce.number().int().positive(),
  }),
});

export const updateCampanhaSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({
    nome: z.string().min(3).optional(),
    timeA: z.string().min(2).optional(),
    timeB: z.string().min(2).optional(),
    dtInicio: z.string().optional(),
    dtFim: z.string().optional(),
    taxaOperacional: z.coerce.number().nonnegative().optional(),
    valorBolao: z.coerce.number().positive().optional(),
    codigoCampanha: z.string().min(3).optional(),
    status: z.enum(['ABERTA', 'ENCERRADA', 'APURADA', 'INATIVA']).optional(),
    tipoCampanhaId: z.coerce.number().int().positive().optional(),
  }),
});

export const definirResultadoSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({ opcaoId: z.coerce.number().int().positive() }),
});

export const idParamSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
});
