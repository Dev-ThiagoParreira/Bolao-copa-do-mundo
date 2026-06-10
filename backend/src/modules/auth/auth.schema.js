import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    nome: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
    cpf: z.string().min(11, 'CPF inválido'),
    email: z.string().email('E-mail inválido'),
    telefone: z.string().optional(),
    senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('E-mail inválido'),
    senha: z.string().min(1, 'Senha é obrigatória'),
  }),
});
